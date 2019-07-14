import { Observable } from "rxjs";

export type ReducerArgs<
  Reducer extends (store: any, context: any) => any
> = Reducer extends (store: infer Store) => typeof store
  ? [Store, void]
  : Reducer extends (store: infer Store, context: infer Context) => typeof store
  ? [Store, Context]
  : never;

export type Reducer<Store, Context> = (s: Store, a: Context) => Store;

export type Endpoint<Store, Context> = {
  trigger: (ctx: Context) => void;
  updater: Observable<(s: Store) => Store>;
};

export type Rxm<
  Store,
  Chart extends { [k: string]: { [k: string]: Reducer<Store, any> } }
> = {
  store: Observable<Store>;
  machine: {
    [k in keyof Chart]: {
      [kk in keyof Chart[k]]: Endpoint<
        ReducerArgs<Chart[k][kk]>[0],
        ReducerArgs<Chart[k][kk]>[1]
      >
    }
  };
};
