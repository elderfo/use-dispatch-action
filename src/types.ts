import { Dispatch, Reducer, ReducerAction, ReducerState } from 'react';

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

export type NewAction<T extends string = string, P = never> =
  | ActionWithPayload<T, P>
  | ActionWithoutPayload<T>;

export type ActionWithPayload<T extends string = any, P = any> = {
  type: T;
  payload: P;
};

export type ActionWithoutPayload<T extends string = any> = {
  type: T;
};

export type DispatchAction<T> = [T] extends [never]
  ? () => void
  : (payload: T) => void;

export type DispatchActionArgs<
  R extends Reducer<any, any>,
  T extends Action<any, any> = ReducerAction<R>
> = T extends Action<any, infer U>
  ? [U] extends [never]
    ? [T['type']]
    : T extends { payload: infer P }
    ? [T['type'], P]
    : [T['type']]
  : [T['type']];

export type ActionDispatcher<
  R extends Reducer<any, any>,
  A = DispatchActionArgs<R>
> = (args: A) => void;

export type DispatchProps<
  TStateOrReducer,
  TAction extends Action = ActionOrReducerAction<TStateOrReducer>,
  TState = StateOrReducerState<TStateOrReducer>,
  TReducer extends Reducer<any, any> = Reducer<TState, TAction>
> = {
  dispatch: ActionDispatcher<TReducer>;
  state: TState;
};

export type DispatchContextProps<
  TStateOrReducer,
  TAction extends Action = ActionOrReducerAction<TStateOrReducer>,
  TState = StateOrReducerState<TStateOrReducer>,
  TReducer extends Reducer<any, any> = Reducer<TState, TAction>
> = {
  initialState: TState;
  reducer: TReducer;
} & Pick<React.ProviderProps<any>, 'children'>;

export type StateOrReducerState<TState> = TState extends Reducer<any, any>
  ? ReducerState<TState>
  : TState;

export type ActionOrReducerAction<
  TMaybeReducer,
  TAction extends Action = { type: any; payload: any }
> = TMaybeReducer extends Reducer<any, any>
  ? ReducerAction<TMaybeReducer> extends Action
    ? ReducerAction<TMaybeReducer>
    : TAction
  : TAction;

export type PickReducer<T, R extends Reducer<any, any>> = T extends Reducer<
  any,
  any
>
  ? T
  : R;

export type ActionOrDispatchAction<
  TActionOrDispatch
> = TActionOrDispatch extends Action
  ? TActionOrDispatch
  : TActionOrDispatch extends Dispatch<infer A>
  ? A extends Action
    ? A
    : never
  : never;

export type PickDispatch<
  TFirst,
  TDispatch extends Dispatch<any>
> = TFirst extends Dispatch<any> ? TFirst : TDispatch;
