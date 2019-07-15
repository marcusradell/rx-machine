import { Observable } from "rxjs";

export type Reducer<Store, Context> = (s: Store, a: Context) => Store;

export type Action<Store, Context> = {
  trigger: (c: Context) => void;
  stream: Observable<Context>;
  reducer: Reducer<Store, Context>;
};
