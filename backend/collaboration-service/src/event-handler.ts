// event-handlers.ts
import { client } from './event-store';
import { jsonEvent, START } from '@eventstore/db-client';
import { CodeChangeEvent } from './interfaces';

// Append a code change event to a stream
export async function appendCodeChangeEvent(event: CodeChangeEvent): Promise<void> {
  try {
    // Create a JSON event to store in EventStoreDB
    const eventData = jsonEvent({
      type: 'codeChange',
      data: JSON.stringify(event),
    });

    // Append the event to the stream named after the room
    await client.appendToStream(`room-${event.roomId}`, [eventData]);

    console.log(`Appended code change event for room ${event.roomId}`);
  } catch (error) {
    console.error('Failed to append code change event to stream:', error);
    throw error;  // Re-throw the error so it can be handled elsewhere if needed
  }
}

export async function initialiseRoom(roomId: string): Promise<void> {
  try {
    // Create a JSON event to store in EventStoreDB
    const eventData = jsonEvent({
      type: 'roomInitialised',
      data: JSON.stringify({ roomId, timestamp: new Date() }),
    });
    // Append the event to the stream named after the room
    await client.appendToStream(`room-${roomId}`, [eventData]);

    console.log(`Initialised room ${roomId}`);
  } catch (error) {
    console.error('Failed to initialise room:', error);
    throw error;
  }
}

export async function checkRoomExists(roomId: string): Promise<boolean> {
  try {
    // Attempt to read the stream for the room
    const events = client.readStream(`room-${roomId}`, {
      fromRevision: START,
      maxCount: 1,  // We only need to read the first event to check if the stream exists
    });
    
    // If the stream exists, the for-await loop will run once (this ensures that the stream is consumed)
    for await (const event of events) {
      return true;
    }

    return true;
  } catch (error) {
    if (error.type === 'stream-not-found') {
      return false;  // Stream does not exist
    }

    console.error('Failed to check if room exists:', error);
    throw error;
  }
}




// Read events from a stream and return a list of CodeChangeEvents
export async function readEventsForRoom(roomId: string): Promise<CodeChangeEvent[]> {
  const codeChangeEvents: CodeChangeEvent[] = [];
  try {
    // Read the event stream from the start
    const events = client.readStream(`room-${roomId}`, {
      fromRevision: START,
    });

    // Iterate over the resolved events
    for await (const resolvedEvent of events) {
      if (!resolvedEvent.event) continue;

      const { type, data } = resolvedEvent.event;

      // Process only 'codeChange' events
      if (type === 'codeChange') {
        try {
          let parsedData: CodeChangeEvent;

          // Check if data is a Uint8Array (binary) or a string
          if (data instanceof Uint8Array) {
            // Convert Uint8Array to string
            const decodedData = Buffer.from(data).toString('utf-8');
            parsedData = JSON.parse(decodedData) as CodeChangeEvent;
          } else if (typeof data === 'string') {
            // Directly parse string data
            parsedData = JSON.parse(data) as CodeChangeEvent;
          } else {
            console.warn('Event data is not in a recognized format:', data);
            continue;
          }

          // Cast the parsed data to CodeChangeEvent and push to the array
          codeChangeEvents.push(parsedData);
        } catch (error) {
          console.error('Failed to parse event data:', error);
        }
      } else {
        console.warn(`Skipping unknown event type: ${type}`);
      }
    }

    console.log(`Read ${codeChangeEvents.length} code change events for room ${roomId}`);
  } catch (error) {
    console.error(`Failed to read events for room ${roomId}:`, error);
    throw error;  // Re-throw the error for higher-level handling
  }

  return codeChangeEvents;
}
