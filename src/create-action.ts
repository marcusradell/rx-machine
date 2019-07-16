import { Subject } from "rxjs";
import { Action, Reducer } from "./types";

export function createAction<Store, ReturnStore, Context = void>(
  reducer: Reducer<Store, ReturnStore, Context>
): Action<Store, ReturnStore, Context> {
  const subject = new Subject<Context>();
  const result: Action<Store, ReturnStore, Context> = {
    trigger: (ctx: Context) => subject.next(ctx),
    stream: subject.asObservable(),
    reducer
  };
  return result;
}
