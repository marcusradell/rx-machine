import { Subject } from "rxjs";

export function createAction<Store, Ctx>(
  reducer: (s: Store, ctx: Ctx) => Store
) {
  const subject = new Subject<Ctx>();

  return {
    trigger: (ctx: Ctx) => subject.next(ctx),
    actionStream: subject.asObservable(),
    reducer
  };
}
