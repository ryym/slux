declare module "./slux" {

  declare type Getter<S, GX, T, R> = (s: S, c: GX, arg: T) => R
  declare type Mutation<S, CX, T> = (s: S, c: CX, t: T) => S
  declare type Action<DX, T, R> = (c: DX, t: T) => R

  declare interface Query<S, GX> {
    <T, R>(getter: Getter<S, GX, T, R>, arg: T): R;
  }
  declare interface Commit<S, CX> {
    <T>(mutation: Mutation<S, CX, T>, arg: T): S;
  }
  declare interface Run<DX> {
    <T, R>(action: Action<DX, T, R>, arg: T): R;
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

  declare class Store<S, GX, CX, DX, Stores, Snap> {
    query: Query<S, GX>;
    commit: Commit<S, CX>;
    run: Run<DX>;
    getState(): S;
    takeSnapshot(): Snap;
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
    getInitialState: () => S,
    takeSnapshot?: (state: S) => Snap
  }): SingleStore<S, Snap>

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

  declare interface CombinedQuery {
    <S, G, T, R>(
      store: SealedStore<S, G, any, any, any, any>,
      getter: Getter<S, G, T, R>,
      arg: T
    ): R
  }
  declare interface CombinedCommit {
    <S, C, T>(
      store: SealedStore<S, any, C, any, any, any>,
      mutation: Mutation<S, C, T>,
      arg: T
    ): S
  }
  declare interface CombinedRun {
    <S, D, T, R>(
      store: SealedStore<any, any, any, D, any, any>,
      action: Action<D, T, R>,
      arg: T
    ): R
  }

  declare type CombinedSealedStore<S, Stores, Snap> = SealedStore<
    S,
    CombinedGetterContext<S, Stores>,
    CombinedMutationContext<S, Stores>,
    CombinedActionContext<S, Stores>,
    Stores,
    Snap
  >

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

  declare type Sealer = <S, G, C, D, Stores, Snap>(
    store: Store<S, G, C, D, Stores, Snap>
  ) => SealedStore<S, G, C, D, Stores, Snap>

  declare function combineStores<S, Stores: {
    [key: string]: SealedStore<any, any, any, any, any, any>
  }, Snap>({
    getInitialState: () => S,
    stores: (sub: Sealer) => Stores,
    takeSnapshot?: (state: S, stores: Stores) => Snap,
  }): CombinedStore<S, Stores, Snap>

  declare interface DefinedGetterWithDep<S, GX, T, R, Dep> {
    (s: S, c: GX, arg: T): R;
    with(dep: Dep): (s: S, c: GX, arg: T) => R;
  }

  declare function getter<S, GX, F: Getter<S, GX, any, any>>(
    f: F
  ): F
  declare function getterWith<S, GX, T, R, Dep, F: Getter<S, GX, T, R>>(
    dep: Dep,
    (dep: Dep) => F
  ): DefinedGetterWithDep<S, GX, T, R, Dep>

  declare interface Accessor {
      type: string;
      // accessorType: string;
  }

  declare interface DefinedMutation<S, CX, T> extends Accessor {
    (s: S, c: CX, arg: T): S;
  }
  declare interface DefinedMutationWithDep<S, CX, T, Dep> extends Accessor {
    (s: S, c: CX, arg: T): S;
    with(dep: Dep): (s: S, c: CX, arg: T) => S;
  }
  declare function mutation<S, CX, T, F: Mutation<S, CX, T>>(
    type: string,
    f: F
  ): DefinedMutation<S, CX, T>
  declare function mutationWith<S, CX, T, Dep, F: Mutation<S, CX, T>>(
    dep: Dep,
    type: string,
    (dep: Dep) => F
  ): DefinedMutationWithDep<S, CX, T, Dep>

  declare interface DefinedAction<T, R, CX> extends Accessor {
    (c: CX, arg: T): R;
  }
  declare interface DefinedActionWithDep<T, R, CX, Dep> extends Accessor {
    (c: CX, arg: T): R;
    with(dep: Dep): (c: CX, arg: T) => R;
  }
  declare function action<T, R, DX, F: Action<DX, T, R>>(
    type: string,
    a: F
  ): DefinedAction<T, R, DX>
  declare function actionWith<T, R, DX, Dep, F: Action<DX, T, R>>(
    dep: Dep,
    type: string,
    (dep: Dep) => F
  ): DefinedActionWithDep<T, R, DX, Dep>

  declare type Command = {
    type: string,
    payload: any
  }
  declare type Commands = {
    [key: string]: (payload: any) => Command
  }

  declare type CommitMaker<S, CX> = <T>(mutation: Mutation<S, CX, T>) => (t: T) => Command

  declare type DispatchMaker<S, DX> = <T>(action: Action<DX, T, any>) => (t: T) => Command

  declare type Dispatch = (command: Command) => void
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

  // TODO: Define alias of CombinedQuery
  declare type MapStateToProps<Stores> = (query: CombinedQuery, stores: Stores, props: any) => {}
  declare type MapDispatchToProps = (dispatch: Dispatch) => {}
  declare interface Connect<Stores> {
    (
      mapStateToProps: MapStateToProps<Stores>,
      mapDispatchToProps?: MapDispatchToProps
    ): (component: any) => number // TODO: Return wrapper component creator
  }
  declare function createConnector<Stores>(defineStores: (seal: Sealer) => Stores): Connect<Stores>

}
