import { createAction, createStore, Action } from "./index";
import { skip, take } from "rxjs/operators";

test("createStore", async () => {
  type StartedStore = {
    state: "started";
    ctx: 0;
  };

  type CountingStore = {
    state: "counting";
    ctx: number;
  };

  type EndedStore = {
    state: "ended";
    ctx: number;
  };

  type Store = StartedStore | CountingStore | EndedStore;

  type Chart = {
    started: ["count"];
    counting: ["count", "end"];
    ended: ["restart"];
  };

  const chart: Chart = {
    started: ["count"],
    counting: ["count", "end"],
    ended: ["restart"]
  };

  type CountReducer = (s: Store, toAdd: number) => CountingStore;

  const CountReducer: CountReducer = (s, toAdd) => ({
    state: "counting",
    ctx: s.ctx + toAdd
  });

  type EndReducer = (s: Store) => EndedStore;

  const endReducer: EndReducer = s => ({
    ...s,
    state: "ended"
  });

  type RestartReducer = (s: Store) => StartedStore;

  const restartReducer: RestartReducer = _ => ({
    state: "started",
    ctx: 0
  });

  type Actions = {
    count: Action<Store, CountingStore, number>;
    end: Action<Store, EndedStore>;
    restart: Action<Store, StartedStore>;
  };

  const actions: Actions = {
    count: createAction(CountReducer),
    end: createAction(endReducer),
    restart: createAction(restartReducer)
  };

  const initialStore: CountingStore = {
    state: "counting",
    ctx: 0
  };

  const store = createStore<Chart, Store, Actions>(
    chart,
    initialStore,
    actions
  );

  const result = store
    .pipe(
      skip(2),
      take(1)
    )
    .toPromise();
  actions.count.act(5);
  actions.end.act();

  expect(await result).toEqual({ state: "ended", ctx: 5 });
});
