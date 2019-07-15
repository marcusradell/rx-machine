import { createAction } from "./create-action";
import { take } from "rxjs/operators";

test("createAction", async () => {
  type Store = {
    state: "enabled";
    ctx: string;
  };

  const reducer = (s: Store, ctx: string) => ({ ...s, ctx });
  const setValue = createAction(reducer);
  const resultP = setValue.stream.pipe(take(1)).toPromise();
  setValue.trigger("Hello!");

  expect(await resultP).toEqual("Hello!");
});
