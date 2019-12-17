import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, createAction, CreateAction, useStore } from '../.';

type StartedStore = {
  state: 'started';
  ctx: 0;
};

type CountingStore = {
  state: 'counting';
  ctx: number;
};

type EndedStore = {
  state: 'ended';
  ctx: number;
};

type Store = StartedStore | CountingStore | EndedStore;

type Chart = {
  started: ['count'];
  counting: ['count', 'end', 'reset'];
  ended: ['reset'];
};

const chart: Chart = {
  started: ['count'],
  counting: ['count', 'end', 'reset'],
  ended: ['reset'],
};

type CountReducer = (s: Store, toAdd: number) => CountingStore;

const CountReducer: CountReducer = (s, toAdd) => ({
  state: 'counting',
  ctx: s.ctx + toAdd,
});

type EndReducer = (s: Store) => EndedStore;

const endReducer: EndReducer = s => ({
  ...s,
  state: 'ended',
});

type ResetReducer = () => StartedStore;

const resetReducer: ResetReducer = () => ({
  state: 'started',
  ctx: 0,
});

type Actions = {
  count: CreateAction<CountReducer>;
  end: CreateAction<EndReducer>;
  reset: CreateAction<ResetReducer>;
};

const actions: Actions = {
  count: createAction(CountReducer),
  end: createAction(endReducer),
  reset: createAction(resetReducer),
};

const initialStore: CountingStore = {
  state: 'counting',
  ctx: 0,
};

const store = createStore<Chart, Store, Actions>(chart, initialStore, actions);

(window as any).actions = actions;

const App = () => {
  const data = useStore(initialStore, store);

  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div
        style={{
          display: 'flex',
          maxWidth: 500,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <button
          disabled={!chart[data.state].find(action => action === 'count')}
          onClick={() => actions.count.act(1)}
        >
          +1
        </button>
        <button
          disabled={!chart[data.state].find(action => action === 'count')}
          onClick={() => actions.count.act(100)}
        >
          +100
        </button>
        <button onClick={() => actions.end.act()}>End</button>
        <button onClick={() => actions.reset.act()}>Reset</button>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
