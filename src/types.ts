import { Observable } from "rxjs";

export type Reducer<Store, ReturnStore, Context = void> =
  | ((s: Store) => ReturnStore)
  | ((s: Store, a: Context) => ReturnStore);

export type Action<Store, ReturnStore, Context = void> = {
  act: (() => void) | ((ctx: Context) => void);
  stream: Observable<Context>;
  reducer: Reducer<Store, ReturnStore, Context>;
};
