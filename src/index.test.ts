import { createRxm } from "./index";
import { skip, take } from "rxjs/operators";

test("createMachine", async () => {
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

  const { machine, store } = createRxm(chart, initialStore);

  const result = store
    .pipe(
      skip(1),
      take(1)
    )
    .toPromise();

  machine.initial.end.trigger("foo");

  expect(await result).toEqual({ state: "ended", ctx: "foo" });
});
