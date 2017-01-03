declare module 'slux' {
  declare type GetterFunc<S, GX, P, R> = (state: S, context: GX, payload: P) => R
  declare type MutationFunc<S, CX, P> = (state: S, context: CX, payload: P) => S
  declare type ActionFunc<DX, P, R> = (context: DX, payload: P) => R

  declare interface Getter<S, GX, P, R> {
    +exec: (state: S, context: GX, payload: P) => R;
  }

  declare interface Mutation<S, CX, P> {
    +type: string;
    +exec: (state: S, context: CX, payload: P) => S;
  }

  declare interface Action<DX, P, R> {
    +type: string;
    +exec: (context: DX, payload: P) => R;
  }

  declare interface Query<S, GX> {
    <P, R>(getter: Getter<S, GX, P, R>, payload: P): R;
  }

  declare interface Commit<S, CX> {
    <P>(mutation: Mutation<S, CX, P>, payload: P): S;
  }

  declare interface Run<DX> {
    <P, R>(action: Action<DX, P, R>, payload: P): R;
  }

  declare type GetterContext<S> = {
    query: SingleQuery<S>
  }

  declare type MutationContext<S> = {
    query: SingleQuery<S>,
    commit: SingleCommit<S>
  }

  declare type ActionContext<S> = {
    query: SingleQuery<S>,
    commit: SingleCommit<S>,
    run: SingleDispatch<S>
  }

  declare type SingleQuery<S> = Query<S, GetterContext<S>>
  declare type SingleCommit<S> = Commit<S, MutationContext<S>>
  declare type SingleDispatch<S> = Run<ActionContext<S>>

  declare class SealedStore<S, G, C, D, Stores, Snap> {
    constructor(store: Store<S, G, C, D, Stores, Snap>): void;
    takeSnapshot(): Snap;
  }

  declare type SingleSealedStore<S, Snap> = SealedStore<
    S,
    GetterContext<S>,
    MutationContext<S>,
    ActionContext<S>,
    {},
    Snap
  >

  declare type CombinedSealedStore<S, Stores, Snap> = SealedStore<
    S,
    CombinedGetterContext<S, Stores>,
    CombinedMutationContext<S, Stores>,
    CombinedActionContext<S, Stores>,
    Stores,
    Snap
  >

  declare type Sealer = <S, G, C, D, Stores, Snap>(
    store: Store<S, G, C, D, Stores, Snap>
  ) => SealedStore<S, G, C, D, Stores, Snap>

  // Store

  declare type MutationData = {
    type: string;
    payload: any;
    includes: MutationData[];
  }
  declare class Store<S, GX, CX, DX, Stores, Snap> {
    query: Query<S, GX>;
    commit: Commit<S, CX>;
    run: Run<DX>;
    getState(): S;
    takeSnapshot(): Snap;
    onMutation(handler: (data: MutationData, store: Store<S, GX, CX, DX, Stores, Snap>) => void): void;
  }

  declare class SingleStore<S, Snap> extends Store<
    S,
    GetterContext<S>,
    MutationContext<S>,
    ActionContext<S>,
    {},
    Snap
  > {}

  declare function createStore<S, Snap>({
    name: string,
    getInitialState: () => S,
    takeSnapshot?: (state: S) => Snap
  }): SingleStore<S, Snap>

  declare interface CombinedQuery {
    <S, G, P, R>(
      store: SealedStore<S, G, any, any, any, any>,
      getter: Getter<S, G, P, R>,
      payload: P
    ): R
  }

  declare interface CombinedCommit {
    <S, C, P>(
      store: SealedStore<S, any, C, any, any, any>,
      mutation: Mutation<S, C, P>,
      payload: P
    ): S
  }

  declare interface CombinedRun {
    <S, D, P, R>(
      store: SealedStore<any, any, any, D, any, any>,
      action: Action<D, P, R>,
      payload: P
    ): R
  }

  declare type CombinedGetterContext<S, Stores> = {
    query: CombinedQuery,
    stores: { self: CombinedSealedStore<S, Stores, any> } & Stores
  }

  declare type CombinedMutationContext<S, Stores> = {
    query: CombinedQuery,
    commit: CombinedCommit,
    stores: { self: CombinedSealedStore<S, Stores, any> } & Stores
  }

  declare type CombinedActionContext<S, Stores> = {
    query: CombinedQuery,
    commit: CombinedCommit,
    run: CombinedRun,
    stores: { self: CombinedSealedStore<S, Stores, any> } & Stores
  }

  declare class CombinedStore<S, Stores, Snap> extends Store<
    S,
    CombinedGetterContext<S, Stores>,
    CombinedMutationContext<S, Stores>,
    CombinedActionContext<S, Stores>,
    Stores,
    Snap
  > {
    withSubs(process: (
      stores: Stores,
      context: {
        query: CombinedQuery,
        commit: CombinedCommit,
        run: CombinedRun,
      }
    ) => void): void;
  }

  declare function combineStores<S, Stores: {
    [key: string]: SealedStore<any, any, any, any, any, any>
  }, Snap>({
    name: string,
    getInitialState: () => S,
    stores: (sub: Sealer) => Stores,
    takeSnapshot?: (state: S, stores: Stores) => Snap,
  }): CombinedStore<S, Stores, Snap>

  declare type SingleGetter<S, P, R> = Getter<S, GetterContext<S>, P, R>
  declare type SingleMutation<S, P> = Mutation<S, MutationContext<S>, P>
  declare type SingleAction<S, P, R> = Action<ActionContext<S>, P, R>

  declare type CombinedGetter<S, Stores, P, R> = Getter<S, CombinedGetterContext<S, Stores>, P, R>
  declare type CombinedMutation<S, Stores, P> = Mutation<S, CombinedMutationContext<S, Stores>, P>
  declare type CombinedAction<S, Stores, P, R> = Action<CombinedActionContext<S, Stores>, P, R>

  declare function getter<G: GetterFunc<any, any, any, any>>(func: G): { exec: G }
  declare function getterWith<Dep, G: GetterFunc<any, any, any, any>>(
    dep: Dep,
    func: (dep: Dep) => G
  ): { exec: G, with: (dep: Dep) => G }

  declare function mutation<M: MutationFunc<any, any, any>>(
    type: string,
    func: M
  ): { type: string, exec: M }

  declare function mutationWith<Dep, M: MutationFunc<any, any, any>>(
    dep: Dep,
    type: string,
    func: (dep: Dep) => M
  ): { type: string, exec: M, with: (dep: Dep) => M }

  declare function action<A: ActionFunc<any, any, any>>(
    type: string,
    a: A
  ): { type: string, exec: A }

  declare function actionWith<Dep, A: ActionFunc<any, any, any>>(
    dep: Dep,
    type: string,
    func: (dep: Dep) => A
  ): {
    type: string,
    exec: A,
    with: (dep: Dep) => A
  }


  declare type Command<P> = {
    type: string,
    payload: P
  }

  declare type CommitMaker<S, CX> = <P>(
    mutation: Mutation<S, CX, P>
  ) => (payload: P) => Command<P>

  declare type DispatchMaker<S, DX> = <P>(
    action: Action<DX, P, any>
  ) => (payload: P) => Command<P>

  declare type Dispatch = <P>((payload: P) => Command<P>, payload: P) => void

  declare class Dispatcher {
    dispatch: Dispatch;
  }

  declare function createDispatcher<S, G, C, D, CM>(
    store: Store<S, G, C, D, any, any>,
    defineCommands: (
      commit: CommitMaker<S, C>,
      run: DispatchMaker<S, D>
    ) => CM
  ): {
    dispatcher: Dispatcher,
    commands: CM
  }

  declare interface CommitMakerWithStore {
    <S, CX, T>(store: Store<S, any, CX, any, any, any>, mutation: Mutation<S, CX, T>): (t: T) => Command<T>;
  }

  declare interface DispatchMakerWithStore {
    <S, DX, T>(store: Store<S, any, any, DX, any, any>, action: Action<DX, T, any>): (t: T) => Command<T>;
  }

  declare function createCombinedDispatcher<S, G, C, D, CM>(
    store: Store<S, G, C, D, any, any>,
    defineCommands: (
      commit: CommitMakerWithStore,
      run: DispatchMakerWithStore
    ) => CM
  ): {
    dispatcher: Dispatcher,
    commands: CM
  };
}

declare module 'slux/getters' {
  declare var getInitialState: {
    exec<S>(state: S, context: any, payload?: any): S;
  };
  declare var getState: {
    exec<S>(state: S, context: any): S;
  };
}

declare module 'slux/react' {
  import type { Query, Dispatch, Dispatcher, CombinedQuery, Sealer } from 'slux';
  import type { Component } from 'react';

  declare type ComponentClass<P> = Class<Component<any, P, any>>
  declare type StatelessComponent<P> = (props: P) => ?React$Element<any>;
  declare type ReactComponent<P> = ComponentClass<P> | StatelessComponent<P>;
  declare type ConnectedComponentClass<P> = Class<React$Component<void, P, void>>

  declare function connect<WP>(
    mapStateToProps: (query: Query<any, any>, props: WP) => {},
    mapDispatchToProps?: (dispatch: Dispatch) => {}
  ): (component: ReactComponent<any>) => ConnectedComponentClass<WP>;

  declare interface ProviderProps {
    dispatcher: Dispatcher;
  }
  declare class Provider extends React$Component<void, ProviderProps, void> {}

  declare type CustomQuery = CombinedQuery;

  declare interface CustomConnect<Stores> {
    <WP>(
      mapStateToProps: (query: CustomQuery, stores: Stores, props: WP) => {},
      mapDispatchToProps?: (dispatch: Dispatch) => {}
    ): (component: ReactComponent<any>) => ConnectedComponentClass<WP>;
  }

  declare function createConnector<Stores>(defineStores: (seal: Sealer) => Stores): CustomConnect<Stores>;
}
