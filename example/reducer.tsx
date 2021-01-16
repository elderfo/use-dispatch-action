type Actions =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'addValue'; payload: number };

type State = { counter: number };

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'increment':
      return { ...state, counter: state.counter + 1 };
    case 'decrement':
      return { ...state, counter: state.counter - 1 };
    case 'addValue':
      return { ...state, counter: state.counter + action.payload };
    default:
      return state;
  }
};
