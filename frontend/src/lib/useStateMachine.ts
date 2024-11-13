import { useState, useCallback } from "react";

// Define possible states and transitions
const states = {
  IDLE: "IDLE",
  FINDING: "FINDING",
  FOUND: "FOUND",
};

const stateTransitions = {
  [states.IDLE]: [states.FINDING, states.FOUND],
  [states.FINDING]: [states.IDLE],
  [states.FOUND]: [states.IDLE],
};

function useStateMachine() {
  const [state, setState] = useState(states.IDLE);

  const transition = useCallback(
    (newState: string) => {
      if (stateTransitions[state].includes(newState)) {
        setState(newState);
      } else {
        console.warn(`Invalid transition from ${state} to ${newState}`);
      }
    },
    [state]
  );

  return [state, transition];
}

export default useStateMachine;
