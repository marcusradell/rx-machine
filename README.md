# RxMachine

_Water meets metal_

RxMachine was created to get the stable setup of a `state machine` coupled with the reactiveness from `RxJS`. We also get the benefits of `TypeScript` to make sure that nothing falls outside the state chart.

## Example usage

```ts
import { createRxm } from "./index";
import { skip, take } from "rxjs/operators";
import { createAction } from "./create-action";

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

  const { store } = createRxm(chart, initialStore, actions);

  const result = store
    .pipe(
      skip(1),
      take(1)
    )
    .toPromise();

  actions.end.trigger(1);

  expect(await result).toEqual({ state: "ended", ctx: 1 });
});
```
