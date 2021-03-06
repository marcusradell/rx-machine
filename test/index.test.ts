import { createAction, createStore, CreateAction } from "../src/index";
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
    count: CreateAction<CountReducer>;
    end: CreateAction<EndReducer>;
    restart: CreateAction<RestartReducer>;
  };

  const actions: Actions = {
    count: createAction(CountReducer),
    end: createAction(endReducer),
    restart: createAction(restartReducer)
  };

  const initialStore: StartedStore = {
    state: "started",
    ctx: 0
  };

  const store = createStore<Chart, Store, Actions>(
    chart,
    initialStore,
    actions
  );

  const result = store.pipe(skip(2), take(1)).toPromise();
  actions.count.act(5);
  // Should not trigger a state change when in 'counting' state.
  actions.restart.act();
  actions.end.act();

  expect(await result).toEqual({ state: "ended", ctx: 5 });
});
