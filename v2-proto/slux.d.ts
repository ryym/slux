declare module "*slux" {

  export type Getter0<S, GX, R> = (s: S, c: GX) => R
  export type Getter1<S, GX, T, R> = (s: S, c: GX, arg: T) => R

  export type Mutation0<S, CX> = (s: S, c: CX) => S
  export type Mutation1<S, CX, T> = (s: S, c: CX, t: T) => S

  export type Action0<DX, R> = (c: DX) => R
  export type Action1<DX, T, R> = (c: DX, t: T) => R

  export interface Query<S, GX> {
    <R>(getter: Getter0<S, GX, R>): R;
    <T, R>(getter: Getter1<S, GX, T, R>, arg: T): R;
  }
  export interface Commit<S, CX> {
    (mutation: Mutation0<S, CX>): S;
    <T>(mutation: Mutation1<S, CX, T>, arg: T): S;
  }
  export interface Run<DX> {
    <R>(action: Action0<DX, R>): R;
    <T, R>(action: Action1<DX, T, R>, arg: T): R;
  }

  export type GetterContext<S> = {
    query: SingleQuery<S>
  }
  export type MutationContext<S> = {
    query: SingleQuery<S>,
    commit: SingleCommit<S>
  }
  export type ActionContext<S> = {
    query: SingleQuery<S>,
    commit: SingleCommit<S>,
    run: SingleDispatch<S>
  }

  type SingleQuery<S> = Query<S, GetterContext<S>>
  type SingleCommit<S> = Commit<S, MutationContext<S>>
  type SingleDispatch<S> = Run<ActionContext<S>>

  export class Store<S, GX, CX, DX, Stores, Snap> {
    query: Query<S, GX>;
    commit: Commit<S, CX>;
    run: Run<DX>;
    getState(): S;
    takeSnapshot(): Snap;
  }

  export class SingleStore<S, Snap> extends Store<
    S,
    GetterContext<S>,
    MutationContext<S>,
    ActionContext<S>,
    {},
    Snap
  > {}

  export function createStore<S, Snap>(config: {
    getInitialState: () => S,
    takeSnapshot?: () => Snap
  }): SingleStore<S, Snap>

  class SealedStore<S, G, C, D, Stores, Snap> {
    constructor(store: Store<S, G, C, D, Stores, Snap>);
    takeSnapshot(): Snap;
  }

  export type SingleSealedStore<S, Snap> = SealedStore<
    S,
    GetterContext<S>,
    MutationContext<S>,
    ActionContext<S>,
    {},
    Snap
  >

  export interface CombinedQuery {
    <S, G, R>(
      store: SealedStore<S, G, any, any, any, any>,
      getter: Getter0<S, G, R>
    ): R;
    <S, G, T, R>(
      store: SealedStore<S, G, any, any, any, any>,
      getter: Getter1<S, G, T, R>,
      arg: T
    ): R;
  }
  export interface CombinedCommit {
    <S, C>(
      store: SealedStore<S, any, C, any, any, any>,
      mutation: Mutation0<S, C>
    ): S;
    <S, C, T>(
      store: SealedStore<S, any, C, any, any, any>,
      mutation: Mutation1<S, C, T>,
      arg: T
    ): S
  }
  export interface CombinedDispatch {
    <S, D, R>(
      store: SealedStore<any, any, any, D, any, any>,
      action: Action0<D, R>
    ): R;
    <S, D, T, R>(
      store: SealedStore<any, any, any, D, any, any>,
      action: Action1<D, T, R>,
      arg: T
    ): R
  }

  export type CombinedSealedStore<S, Stores, Snap> = SealedStore<
    S,
    CombinedGetterContext<S, Stores>,
    CombinedMutationContext<S, Stores>,
    CombinedActionContext<S, Stores>,
    Stores,
    Snap
  >

  export type CombinedGetterContext<S, Stores> = {
    query: CombinedQuery,
    stores: { self: CombinedSealedStore<S, Stores, any> } & Stores
  }
  export type CombinedMutationContext<S, Stores> = {
    query: CombinedQuery,
    commit: CombinedCommit,
    stores: { self: CombinedSealedStore<S, Stores, any> } & Stores
  }
  export type CombinedActionContext<S, Stores> = {
    query: CombinedQuery,
    commit: CombinedCommit,
    run: CombinedDispatch,
    stores: { self: CombinedSealedStore<S, Stores, any> } & Stores
  }

  export class CombinedStore<S, Stores, Snap> extends Store<
    S,
    CombinedGetterContext<S, Stores>,
    CombinedMutationContext<S, Stores>,
    CombinedActionContext<S, Stores>,
    Stores,
    Snap
  > {
    withSubs(process: (context: CombinedActionContext<S, Stores>) => void): void;
  }

  export type Sealer = <S, G, C, D, Stores, Snap>(
    store: Store<S, G, C, D, Stores, Snap>
  ) => SealedStore<S, G, C, D, Stores, Snap>

  export function combineStores<S, Stores extends {
    [key: string]: SealedStore<any, any, any, any, any, any>
  }, Snap>(config: {
    getInitialState: () => S,
    takeSnapshot?: (state: S, stores: Stores) => Snap,
    stores: (sub: Sealer) => Stores
  }): CombinedStore<S, Stores, Snap>

  export function getter<S, GX, F extends Getter0<S, GX, any>>(f: F): F
  export function getter<S, GX, F extends Getter1<S, GX, any, any>>(f: F): F

  type Accessor = {
      type: string;
  }

  type DefinedMutation<F> = F & Accessor
  export function mutation<S, CX, F extends Mutation0<S, CX>>(
      type: string,
      f: F
  ): DefinedMutation<F>
  export function mutation<S, CX, F extends Mutation1<S, CX, any>>(
      type: string,
      f: F
  ): DefinedMutation<F>

  type DefinedAction<LIB, F> = F & Accessor & {
    with(lib: LIB): F;
  }
  export function action<LIB, F extends Action0<any, any>>(
      type: string,
      a: (lib: LIB) => F,
      lib?: LIB
  ): DefinedAction<LIB, F>
  export function action<LIB, F extends Action1<any, any, any>>(
      type: string,
      a: (lib: LIB) => F,
      lib?: LIB
  ): DefinedAction<LIB, F>

  export type Command = {
    type: string,
    payload: any
  }
  export type Commands = {
    [key: string]: (payload: any) => Command
  }

  export interface CommitMaker<S, CX> {
      (key: string, mutation: Mutation0<S, CX>): () => Command;
      <T>(key: string, mutation: Mutation1<S, CX, T>): (t: T) => Command;
  }

  export interface DispatchMaker<S, DX> {
      (key: string, action: Action0<DX, any>): () => Command;
      <T>(key: string, action: Action1<DX, T, any>): (t: T) => Command;
  }

  type Dispatch = (command: Command) => void
  export class Dispatcher {
    dispatch: Dispatch;
  }

  export function createDispatcher<S, G, C, D, CM>(
    store: Store<S, G, C, D, any, any>,
    defineCommands: (
      commit: CommitMaker<S, C>,
      run: DispatchMaker<S, D>
    ) => CM
  ): {
    dispatcher: Dispatcher,
    commands: CM
  }

  export type MapStateToProps<Stores> = (query: CombinedQuery, stores: Stores, props: any) => {}
  export type MapDispatchToProps = (dispatch: Dispatch) => {}
  export interface Connect<Stores> {
    (
      mapStateToProps: MapStateToProps<Stores>,
      mapDispatchToProps?: MapDispatchToProps
    ): (component: any) => number // TODO: Return wrapper component creator
  }
  export function createConnector<Stores>(defineStores: (seal: Sealer) => Stores): Connect<Stores>

}

