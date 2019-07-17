import { Observable } from "rxjs";

export type Reducer<Store, ReturnStore, Context = void> =
  | ((s: Store) => ReturnStore)
  | ((s: Store, a: Context) => ReturnStore);

export type Action<Store, ReturnStore, Context = void> = {
  act: (() => void) | ((ctx: Context) => void);
  stream: Observable<Context>;
  reducer: Reducer<Store, ReturnStore, Context>;
};

export type CreateAction<T extends (s: any, ctx?: any) => any> = T extends (
  s: infer TStore
) => infer TReturnStore
  ? Action<TStore, TReturnStore>
  : T extends (s: infer TStore, ctx: infer TContext) => infer TReturnStore
  ? Action<TStore, TReturnStore, TContext>
  : never;
