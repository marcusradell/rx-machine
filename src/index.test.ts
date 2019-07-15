import { createAction, createStore } from "./index";
import { skip, take } from "rxjs/operators";

test("createRxm", async () => {
  type Chart = {
    started: ["end"];
    ended: ["restart"];
  };

  type StartedStore = {
    state: "started";
    ctx: number;
  };

  type EndedStore = {
    state: "ended";
    ctx: number;
  };

  type Store = StartedStore | EndedStore;

  const chart: Chart = {
    started: ["end"],
    ended: ["restart"]
  };

  const actions = {
    end: createAction(
      (s: Store, ctx: number): Store => ({
        state: "ended",
        ctx
      })
    ),
    restart: createAction(
      (s: Store, ctx: number): Store => ({
        state: "started",
        ctx
      })
    )
  };

  const initialStore: Store = {
    state: "started",
    ctx: 123
  } as Store;

  const store = createStore(chart, initialStore, actions);

  const result = store
    .pipe(
      skip(1),
      take(1)
    )
    .toPromise();

  actions.end.trigger(1);

  expect(await result).toEqual({ state: "ended", ctx: 1 });
});
