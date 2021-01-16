import * as React from 'react';

type CounterProps = {
  counter: number;
  incrementOne: () => void;
  decrementOne: () => void;
  increment: (number: number) => void;
};

export const Counter = ({
  counter,
  decrementOne,
  increment,
  incrementOne,
}: CounterProps) => {
  return (
    <div>
      <div title="counter">{counter}</div>
      <button onClick={incrementOne}>Increment</button>
      <button onClick={decrementOne}>Decrement</button>
      <button onClick={() => increment(2)}>Add Two</button>
    </div>
  );
};
