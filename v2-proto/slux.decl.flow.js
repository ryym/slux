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

  declare class Store<S, GX, CX, DX, Stores> {
    query: Query<S, GX>;
    commit: Commit<S, CX>;
    run: Run<DX>;
    getState(): S;
  }

  declare class SingleStore<S> extends Store<
    S,
    GetterContext<S>,
    MutationContext<S>,
    ActionContext<S>,
    {}
  > {}

  declare function createStore<S>({
    getInitialState: () => S,
    takeSnapshot?: () => any
  }): SingleStore<S>

  declare class SealedStore<S, G, C, D, Stores> {
    constructor(store: Store<S, G, C, D, Stores>): void;
  }

  declare type SingleSealedStore<S> = SealedStore<
    S,
    GetterContext<S>,
    MutationContext<S>,
    ActionContext<S>,
    {}
  >

  declare interface CombinedGet {
    <S, G, T, R>(
      store: SealedStore<S, G, any, any, any>,
      getter: Getter<S, G, T, R>,
      arg: T
    ): R
  }
  declare interface CombinedCommit {
    <S, C, T>(
      store: SealedStore<S, any, C, any, any>,
      mutation: Mutation<S, C, T>,
      arg: T
    ): S
  }
  declare interface CombinedDispatch {
    <S, D, T, R>(
      store: SealedStore<any, any, any, D, any>,
      action: Action<D, T, R>,
      arg: T
    ): R
  }

  declare type CombinedSealedStore<S, Stores> = SealedStore<
    S,
    CombinedGetterContext<S, Stores>,
    CombinedMutationContext<S, Stores>,
    CombinedActionContext<S, Stores>,
    Stores
  >

  declare type CombinedGetterContext<S, Stores> = {
    query: CombinedGet,
    stores: { self: CombinedSealedStore<S, Stores> } & Stores
  }
  declare type CombinedMutationContext<S, Stores> = {
    query: CombinedGet,
    commit: CombinedCommit,
    stores: { self: CombinedSealedStore<S, Stores> } & Stores
  }
  declare type CombinedActionContext<S, Stores> = {
    query: CombinedGet,
    commit: CombinedCommit,
    run: CombinedDispatch,
    stores: { self: CombinedSealedStore<S, Stores> } & Stores
  }

  declare class CombinedStore<S, Stores> extends Store<
    S,
    CombinedGetterContext<S, Stores>,
    CombinedMutationContext<S, Stores>,
    CombinedActionContext<S, Stores>,
    Stores
  > {
    withSubs(process: (context: CombinedActionContext<S, Stores>) => void): void;
  }

  declare type AsSubStore = <S, G, C, D, Stores>(
    store: Store<S, G, C, D, Stores>
  ) => SealedStore<S, G, C, D, Stores>

  declare function combineStores<S, Stores: {
    [key: string]: SealedStore<any, any, any, any, any>
  }>({
    getInitialState: () => S,
    takeSnapshot?: () => any,
    stores: (sub: AsSubStore) => Stores
  }): CombinedStore<S, Stores>

  declare type SubStore<S> = SingleSealedStore<S>
  declare type CombinedSubStore<S, Stores> = CombinedSealedStore<S, Stores>

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
    store: Store<S, G, C, D, any>,
    defineCommands: (
      commit: CommitMaker<S, C>,
      run: DispatchMaker<S, D>
    ) => CM
  ): {
    dispatcher: Dispatcher,
    commands: CM
  }
}

