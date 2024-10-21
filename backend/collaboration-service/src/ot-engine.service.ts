import { CodeChangeEvent } from "./interfaces";

export class OTEngineService {
  transform(currentState: string, operation: CodeChangeEvent): CodeChangeEvent {
    // Apply transformation logic here if needed (conflict resolution, etc.)
    return operation; // For simplicity, return the operation directly
  }

  applyOperation(documentState: string, event: CodeChangeEvent): string {
    if (event.operationType === 'insert') {
      // Apply the insert operation
      return documentState.slice(0, event.position) + event.text + documentState.slice(event.position);
    } else if (event.operationType === 'delete') {
      // Apply the delete operation
      return documentState.slice(0, event.position) + documentState.slice(event.position + event.text.length);
    }
    return documentState;
  }
}
