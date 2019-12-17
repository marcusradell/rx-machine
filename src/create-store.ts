import { merge, Observable } from "rxjs";
import {
  map,
  startWith,
  scan,
  shareReplay,
  distinctUntilChanged
} from "rxjs/operators";
import { Action } from "./types";
export * from "./types";

// TODO: Chart keys and Store["state"] should strictly match.
export function createStore<
  Chart extends { [k: string]: Array<keyof Actions> },
  Store extends { state: keyof Chart },
  Actions extends { [k: string]: Action<Store, any, any> }
>(chart: Chart, initialStore: Store, actions: Actions) {
  const chartKeys = Object.keys(chart) as Array<keyof Chart>;
  const allUpdaters = chartKeys.reduce((acc, chartKey) => {
    chart[chartKey].forEach(actionKey => {
      const updater = actions[actionKey].stream.pipe(
        map(ctx => ({
          name: actionKey,
          fn: (store: Store) => actions[actionKey].reducer(store, ctx)
        }))
      );
      if (acc[actionKey] === undefined) {
        acc[actionKey] = updater;
      }
    });

    return acc;
  }, {} as { [k in keyof Actions]: Observable<{ name: keyof Actions; fn: (s: Store) => Store }> });

  const mergedUpdaters = merge(
    ...Object.keys(allUpdaters).map(k => allUpdaters[k])
  );

  const store: Observable<Store> = mergedUpdaters.pipe(
    startWith<any>(initialStore),
    scan<{ name: keyof Actions; fn: (s: Store) => Store }, Store>(
      (store, updater) =>
        chart[store.state].includes(updater.name) ? updater.fn(store) : store
    ),
    distinctUntilChanged((s1, s2) => s1 === s2),
    shareReplay(1)
  );

  return store;
}
