import { Subject, merge, Observable } from "rxjs";
import {
  map,
  startWith,
  switchMap,
  scan,
  tap,
  shareReplay
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
  const updaters = chartKeys.reduce(
    (acc, chartKey) => {
      const updater = merge(
        ...chart[chartKey].map(actionKey =>
          actions[actionKey].stream.pipe(
            map(ctx => (store: Store) => actions[actionKey].reducer(store, ctx))
          )
        )
      );
      acc[chartKey] = updater;
      return acc;
    },
    {} as { [k in keyof Chart]: Observable<(s: Store) => Store> }
  );

  // Will be triggered each time the state changes.
  // TODO: should add distinctUntilChanged).
  const doTransitionSubject = new Subject<any>();

  // Start listen to all the state updaters in the machine's initial state.
  // Each time the machine state changes, we will switch to the current updater stream.
  const currentTransitionsStream = doTransitionSubject.pipe(
    startWith<Observable<(s: Store) => Store>>(updaters[initialStore.state]),
    switchMap(stream => stream)
  );

  const store: Observable<Store> = currentTransitionsStream.pipe(
    startWith<any>(initialStore),
    scan<(s: Store) => Store, Store>((store, updater) => updater(store)),
    tap(store => {
      const currentState = store.state;
      doTransitionSubject.next(updaters[currentState]);
    }),
    shareReplay(1)
  );

  return store;
}
