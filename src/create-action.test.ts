import { createAction } from "./create-action";
import { take } from "rxjs/operators";

test("createAction", async () => {
  type Store = {
    state: "enabled";
    ctx: string;
  };

  const setValue = createAction((s: Store, ctx: string) => ({ ...s, ctx }));
  const resultP = setValue.actionStream.pipe(take(1)).toPromise();
  setValue.trigger("Hello!");

  expect(await resultP).toEqual("Hello!!");
});
