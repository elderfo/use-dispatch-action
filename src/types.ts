export type ActionLike = { type: string };

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
