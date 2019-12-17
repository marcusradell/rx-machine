import { useState, useEffect } from "react";
import { Observable } from "rxjs";

export function useStore<Store>(
  initialStore: Store,
  storeStream: Observable<Store>
) {
  const [store, setStore] = useState(initialStore);

  useEffect(() => {
    const subscription = storeStream.subscribe(store => setStore(store));
    return () => subscription.unsubscribe();
  }, []);

  return store;
}
