# RxMachine

_Water meets metal_

RxMachine was created to get the stable setup of a `state machine` coupled with the reactiveness from `RxJS`. We also get the benefits of `TypeScript` to make sure that nothing falls outside the state chart.

## Example usage

```ts
import { createMachine, Reducer } from "./index";

const chart = {
  initial: {
    end: (s: Store, ctx: string): Store => ({
      state: "ended",
      ctx
    })
  },
  ended: {
    restart: (s: Store, ctx: number): Store => ({
      state: "initial",
      ctx
    })
  }
};

type Store =
  | {
      state: "initial";
      ctx: number;
    }
  | {
      state: "ended";
      ctx: string;
    };

const initialStore = {
  state: "initial",
  ctx: 123
} as Store;

const { machine, store } = createMachine(chart, initialStore);

store
  .forEach(s => {
    if (s.state !== "initial") return;

    machine[s.state].end.trigger("foo");
  })
  .catch(e => console.error(e));
```
