import { Reducer, ReducerAction } from 'react';

/**
 * Defines an action and optionally it's payload
 * @template T Name of the action
 * @template P (Optional) type for the payload
 */
export type Action<T extends string = string, P = never> = { type: T } & ([
  P
] extends [never]
  ? {}
  : { payload: P });

export type DispatchAction<T> = [T] extends [never]
  ? () => void
  : (payload: T) => void;

export type ActionArguments<T extends Action> = T extends Action<any, infer U>
  ? [U] extends [never]
    ? [T['type']]
    : T extends { payload: infer P }
    ? [T['type'], P]
    : [T['type']]
  : [T['type']];

export type DispatchFunction<
  R extends Reducer<any, any>,
  A = ActionArguments<ReducerAction<R>>
> = (args: A) => void;
