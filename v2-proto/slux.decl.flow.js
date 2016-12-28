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
    query: SingleGet<S>
  }
  declare type MutationContext<S> = {
    query: SingleGet<S>,
    commit: SingleCommit<S>
  }
  declare type ActionContext<S> = {
    query: SingleGet<S>,
    commit: SingleCommit<S>,
    run: SingleDispatch<S>
  }

  declare type SingleGet<S> = Query<S, GetterContext<S>>
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

  declare interface CombinedGet {
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
  declare interface CombinedDispatch {
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
    query: CombinedGet,
    stores: { self: CombinedSealedStore<S, Stores, any> } & Stores
  }
  declare type CombinedMutationContext<S, Stores> = {
    query: CombinedGet,
    commit: CombinedCommit,
    stores: { self: CombinedSealedStore<S, Stores, any> } & Stores
  }
  declare type CombinedActionContext<S, Stores> = {
    query: CombinedGet,
    commit: CombinedCommit,
    run: CombinedDispatch,
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
    withSubs(process: (context: CombinedActionContext<S, Stores>) => void): void;
  }

  declare type AsSubStore = <S, G, C, D, Stores, Snap>(
    store: Store<S, G, C, D, Stores, Snap>
  ) => SealedStore<S, G, C, D, Stores, Snap>

  declare function combineStores<S, Stores: {
    [key: string]: SealedStore<any, any, any, any, any, any>
  }, Snap>({
    getInitialState: () => S,
    stores: (sub: AsSubStore) => Stores,
    takeSnapshot?: (state: S, stores: Stores) => Snap,
  }): CombinedStore<S, Stores, Snap>

  declare type SubStore<S, Snap> = SingleSealedStore<S, Snap>
  declare type CombinedSubStore<S, Stores, Snap> = CombinedSealedStore<S, Stores, Snap>

  declare interface DefinedAction<T, R, CX, LIB> {
    (c: CX, arg: T): R;
    with(lib: LIB): (c: CX, arg: T) => R;
  }
  declare function getter<S, GX, F: Getter<S, GX, any, any>>(f: F): F
  declare function mutation<S, CX, F: Mutation<S, CX, any>>(f: F): F
  declare function action<T, R, DX, LIB, F: Action<DX, T, R>>(
    lib: LIB => F,
    lib: LIB
  ): DefinedAction<T, R, DX, LIB>

  declare type Command = {
    type: string,
    payload: any
  }
  declare type Commands = {
    [key: string]: (payload: any) => Command
  }

  declare type CommitMaker<S, CX> = <T>(
    key: string,
    mutation: Mutation<S, CX, T>
  ) => (t: T) => Command

  declare type DispatchMaker<S, DX> = <T>(
    key: string,
    action: Action<DX, T, any>
  ) => (t: T) => Command

  declare class Dispatcher {
    dispatch: (command: Command) => void;
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

  declare type PropsMapper<Stores> = (query: CombinedGet, stores: Stores, props: any) => ?{}
  declare interface Connect<Stores> {
    (mapper: PropsMapper<Stores>): (component: any) => number // XXX
  }
  declare function createConnector<Stores>((seal: AsSubStore) => Stores): Connect<Stores>
}

