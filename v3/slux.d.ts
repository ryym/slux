declare module "*slux" {

  export function some<M1, M2>(
    map1: (m: M2) => M1,
    map2: () => M2
  ): M1;

    export type MutationFunc0<S> = (state: S) => S;
    export type MutationFunc1<S, P> = (state: S, payload: P) => S;


    export interface _Mutation0<FS, S> {
        type: string;
        exec(state: S): S;
        selectState: (fullState: FS) => S;
        mergeState: (fullState: FS, state: S) => FS;
    }
    export interface _Mutation1<FS, S, P> {
        type: string;
        exec(state: S, payload: P): S;
        selectState: (fullState: FS) => S;
        mergeState: (fullState: FS, state: S) => FS;
    }

    export type Mutation0<S> = _Mutation0<S, S>
    export type Mutation1<S, P> = _Mutation1<S, S, P>

    export interface MutationCreator<FS, S> {
        (type: string, mutationFunc: MutationFunc0<S>): _Mutation0<FS, S>;
        <P>(type: string, mutationFunc: MutationFunc1<S, P>): _Mutation1<FS, S, P>
    }

    export function mutation<S>(type: string, mutationFunc: MutationFunc0<S>): Mutation0<S>
    export function mutation<S, P>(type: string, mutationFunc: MutationFunc1<S, P>): Mutation1<S, P>

    export function createMutation<FS, S>(
        selectState: (fullState: FS) => S,
        mergeState: (fullState: FS, state: S) => FS
    ): MutationCreator<FS, S>

    // export interface Commit<S> {
    //     (mutation: _Mutation0<S, any>): void;
    //     <P>(mutation: _Mutation1<S, any, P>, payload: P): void;
    // }


    export type ActionFunc0<S, R> = (commit: Store<S, any>, state: S) => R;
    export type ActionFunc1<S, P, R> = (commit: Store<S, any>, state: S, payload: P) => R;

    export interface Action0<S, R> {
        type: string;
        exec: ActionFunc0<S, R>;
    }
    export interface Action1<S, P, R> {
        type: string;
        exec: ActionFunc1<S, P, R>;
    }

    export interface Run<S> {
        <R>(action: Action0<S, R>): R;
        <P, R>(action: Action1<S, P, R>, payload: P): R;
    }

    export function action<S, R>(type: string, actionFunc: ActionFunc0<S, R>): Action0<S, R>
    export function action<S, P, R>(type: string, actionFunc: ActionFunc1<S, P, R>): Action1<S, P, R>


    export interface StoreConfig<State, Snap> {
        getInitialState: () => State;
        takeSnapshot: (state: State) => Snap;
    }
    export class Store<State, Snap> {
        constructor(name: string, config: StoreConfig<State, Snap>);

        commit(mutation: _Mutation0<State, any>): void;
        commit<P>(mutation: _Mutation1<State, any, P>, payload: P): void;

        run<R>(action: Action0<State, R>): R;
        run<P, R>(action: Action1<State, P, R>, payload: P): R;

        onStateChange(handler: (data: {type: string, payload: any}) => void): void;

        getState(): void;
    }

    export function createStore<State, Snap>(name: string, config: StoreConfig<State, Snap>): Store<State, Snap>


    export type Command0 = () => { type: string }
    export type Command1<P> = (payload: P) => { type: string, payload: P }

    export interface DefineCommand<State> {
        (mutation: _Mutation0<State, any>): Command0;
        <P>(mutation: _Mutation1<State, any, P>): Command1<P>;

        (action: Action0<State, any>): Command0;
        <P>(action: Action1<State, P, any>): Command1<P>;
    }
    export class Dispatcher<State> {
        define: DefineCommand<State>;
        dispatch(command: Command0): void;
        dispatch<P>(command: Command1<P>, payload: P): void;
    }

    export function createDispatcherWithCommands<State, Commands>(
        store: Store<State, any>,
        defineCommands: (to: DefineCommand<State>) => Commands
    ): { dispatcher: Dispatcher<State>, commands: Commands }

}

// declare module 'slux' {
//     export type GetterFunc0<S, GX, R> = (s: S, c: GX) => R;
//     export type GetterFunc1<S, GX, T, R> = (s: S, c: GX, arg: T) => R;

//     export interface Getter0<S, GX, R> {
//         exec: (s: S, c: GX) => R;
//     }
//     export interface Getter1<S, GX, T, R> {
//         exec: (s: S, c: GX, arg: T) => R;
//     }

//     export type MutationFunc0<S, CX> = (s: S, c: CX) => S;
//     export type MutationFunc1<S, CX, T> = (s: S, c: CX, t: T) => S;

//     export interface Mutation0<S, CX> {
//         type: string;
//         exec: (s: S, c: CX) => S;
//     }
//     export interface Mutation1<S, CX, T> {
//         type: string;
//         exec: (s: S, c: CX, t: T) => S;
//     }

//     export type ActionFunc0<DX, R> = (c: DX) => R;
//     export type ActionFunc1<DX, T, R> = (c: DX, t: T) => R;

//     export interface Action0<DX, R> {
//         type: string;
//         exec: (c: DX) => R;
//     }
//     export interface Action1<DX, T, R> {
//         type: string;
//         exec: (c: DX, t: T) => R;
//     }


//     export interface Query<S, GX> {
//         <R>(getter: Getter0<S, GX, R>): R;
//         <T, R>(getter: Getter1<S, GX, T, R>, arg: T): R;
//     }
//     export interface Commit<S, CX> {
//         (mutation: Mutation0<S, CX>): S;
//         <T>(mutation: Mutation1<S, CX, T>, arg: T): S;
//     }
//     export interface Run<DX> {
//         <R>(action: Action0<DX, R>): R;
//         <T, R>(action: Action1<DX, T, R>, arg: T): R;
//     }

//     export type GetterContext<S> = {
//         query: SingleQuery<S>
//     };
//     export type MutationContext<S> = {
//         query: SingleQuery<S>,
//         commit: SingleCommit<S>
//     };
//     export type ActionContext<S> = {
//         query: SingleQuery<S>,
//         commit: SingleCommit<S>,
//         run: SingleRun<S>
//     };

//     type SingleQuery<S> = Query<S, GetterContext<S>>;
//     type SingleCommit<S> = Commit<S, MutationContext<S>>;
//     type SingleRun<S> = Run<ActionContext<S>>;

//     type MutationData = {
//         type: string;
//         payload: any;
//         includes: MutationData[];
//     };
//     export class Store<S, GX, CX, DX, Stores, Snap> {
//         query: Query<S, GX>;
//         commit: Commit<S, CX>;
//         run: Run<DX>;
//         getState(): S;
//         takeSnapshot(): Snap;
//         onMutation(handler: (data: MutationData, store: Store<S, GX, CX, DX, Stores, Snap>) => void): void;
//     }

//     export class SingleStore<S, Snap> extends Store<
//         S,
//         GetterContext<S>,
//         MutationContext<S>,
//         ActionContext<S>,
//         {},
//         Snap
//     > {}

//     export function createStore<S, Snap>(config: {
//         name: string,
//         getInitialState: () => S,
//         takeSnapshot?: (state: S) => Snap,
//     }): SingleStore<S, Snap>;

//     export interface CombinedQuery {
//         <S, G, R>(
//             store: StoreRef<S, G, any, any, any, any>,
//             getter: Getter0<S, G, R>
//         ): R;
//         <S, G, T, R>(
//             store: StoreRef<S, G, any, any, any, any>,
//             getter: Getter1<S, G, T, R>,
//             arg: T
//         ): R;
//     }
//     export interface CombinedCommit {
//         <S, C>(
//             store: StoreRef<S, any, C, any, any, any>,
//             mutation: Mutation0<S, C>
//         ): S;
//         <S, C, T>(
//             store: StoreRef<S, any, C, any, any, any>,
//             mutation: Mutation1<S, C, T>,
//             arg: T
//         ): S;
//     }
//     export interface CombinedRun {
//         <S, D, R>(
//             store: StoreRef<any, any, any, D, any, any>,
//             action: Action0<D, R>
//         ): R;
//         <S, D, T, R>(
//             store: StoreRef<any, any, any, D, any, any>,
//             action: Action1<D, T, R>,
//             arg: T
//         ): R;
//     }

//     export type CombinedGetterContext<S, Stores> = {
//         query: CombinedQuery,
//         stores: { self: CombinedStoreRef<S, Stores, any> } & Stores
//     };
//     export type CombinedMutationContext<S, Stores> = {
//         query: CombinedQuery,
//         commit: CombinedCommit,
//         stores: { self: CombinedStoreRef<S, Stores, any> } & Stores
//     };
//     export type CombinedActionContext<S, Stores> = {
//         query: CombinedQuery,
//         commit: CombinedCommit,
//         run: CombinedRun,
//         stores: { self: CombinedStoreRef<S, Stores, any> } & Stores
//     };

//     export class CombinedStore<S, Stores, Snap> extends Store<
//         S,
//         CombinedGetterContext<S, Stores>,
//         CombinedMutationContext<S, Stores>,
//         CombinedActionContext<S, Stores>,
//         Stores,
//         Snap
//     > {
//         withSubs(process: (
//             stores: Stores,
//             context: {
//                 query: CombinedQuery,
//                 commit: CombinedCommit,
//                 run: CombinedRun,
//             }
//         ) => void): void;
//     }

//     type StoreRefs = {
//         [key: string]: StoreRef<any, any, any, any, any, any>
//     };
//     export function combineStores<S, Stores extends StoreRefs, Snap>(
//         config: {
//             name: string,
//             getInitialState: () => S,
//             takeSnapshot?: (state: S, stores: Stores) => Snap,
//             stores: (getRef: GetRef) => Stores
//         }
//     ): CombinedStore<S, Stores, Snap>;

//     export class StoreRef<S, G, C, D, Stores, Snap> {
//         constructor(store: Store<S, G, C, D, Stores, Snap>);
//         takeSnapshot(): Snap;
//     }

//     type SingleStoreRef<S, Snap> = StoreRef<
//         S,
//         GetterContext<S>,
//         MutationContext<S>,
//         ActionContext<S>,
//         {},
//         Snap
//     >;

//     type CombinedStoreRef<S, Stores, Snap> = StoreRef<
//         S,
//         CombinedGetterContext<S, Stores>,
//         CombinedMutationContext<S, Stores>,
//         CombinedActionContext<S, Stores>,
//         Stores,
//         Snap
//     >;

//     type GetRef = <S, G, C, D, Stores, Snap>(
//         store: Store<S, G, C, D, Stores, Snap>
//     ) => StoreRef<S, G, C, D, Stores, Snap>;


//     export function getter<F extends GetterFunc0<any, any, any>>(f: F): { exec: F };
//     export function getter<F extends GetterFunc1<any, any, any, any>>(f: F): { exec: F };

//     export function getterWith<Dep, F extends GetterFunc0<any, any, any>>(
//         dep: Dep,
//         g: (dep: Dep) => F
//     ): { exec: F, with: (dep: Dep) => F };

//     interface GetterWithDep<Dep> {
//         <F extends GetterFunc0<any, any, any>>(type: string, a: (dep: Dep) => F): {
//             type: string,
//             exec: F,
//             with: (dep: Dep) => F
//         }
//         <F extends GetterFunc1<any, any, any, any>>(type: string, a: (dep: Dep) => F): {
//             type: string,
//             exec: F,
//             with: (dep: Dep) => F
//         }
//     }
//     export function getterWith<Dep>(dep: Dep): GetterWithDep<Dep>

//     export function mutation<F extends MutationFunc0<any, any>>(
//         type: string,
//         f: F
//     ): { type: string, exec: F };
//     export function mutation<F extends MutationFunc1<any, any, any>>(
//         type: string,
//         f: F
//     ): { type: string, exec: F };

//     interface MutationWithDep<Dep> {
//         <F extends MutationFunc0<any, any>>(type: string, a: (dep: Dep) => F): {
//             type: string,
//             exec: F,
//             with: (dep: Dep) => F
//         }
//         <F extends MutationFunc1<any, any, any>>(type: string, a: (dep: Dep) => F): {
//             type: string,
//             exec: F,
//             with: (dep: Dep) => F
//         }
//     }
//     export function mutationWith<Dep>(dep: Dep): MutationWithDep<Dep>

//     export function action<F extends ActionFunc0<any, any>>(
//         type: string,
//         a: F
//     ): { type: string, exec: F };
//     export function action<F extends ActionFunc1<any, any, any>>(
//         type: string,
//         a: F
//     ): { type: string, exec: F };

//     interface ActionWithDep<Dep> {
//         <F extends ActionFunc0<any, any>>(type: string, a: (dep: Dep) => F): {
//             type: string,
//             exec: F,
//             with: (dep: Dep) => F
//         }
//         <F extends ActionFunc1<any, any, any>>(type: string, a: (dep: Dep) => F): {
//             type: string,
//             exec: F,
//             with: (dep: Dep) => F
//         }
//     }
//     export function actionWith<Dep>(dep: Dep): ActionWithDep<Dep>


//     interface StateTracker<Snap, Methods> {
//         methods: Methods;
//         onStateChange(handler: (data: MutationData, self: StateTracker<Snap, Methods>) => void): void;
//         takeSnapshot(): Snap;
//     }

//     interface FacadeQuery {
//         <S, GX, R>(getter: Getter0<S, GX, R>): () => R;
//         <S, GX, P, R>(getter: Getter1<S, GX, P, R>): (payload: P) => R;
//     }
//     interface FacadeCommit {
//         <S, CX>(muation: Mutation0<S, CX>): () => S;
//         <S, CX, P>(muation: Mutation1<S, CX, P>): (payload: P) => S;
//     }
//     interface FacadeRun {
//         <DX, R>(action: Action0<DX, R>): () => R;
//         <DX, P, R>(action: Action1<DX, P, R>): (payload: P) => R;
//     }

//     export function createFacade<Snap, Methods>(
//         store: Store<any, any, any, any, any, Snap>,
//         defineMethods: (appliers: {
//             query: FacadeQuery,
//             commit: FacadeCommit,
//             run: FacadeRun
//         }) => Methods
//     ): StateTracker<Snap, Methods>

//     interface CombinedFacadeQuery {
//         <S, G, R>(
//             store: StoreRef<S, G, any, any, any, any>,
//             getter: Getter0<S, G, R>
//         ): () => R;
//         <S, G, P, R>(
//             store: StoreRef<S, G, any, any, any, any>,
//             getter: Getter1<S, G, P, R>,
//         ): (payload: P) => R;
//     }
//     interface CombinedFacadeCommit {
//         <S, C>(
//             store: StoreRef<S, any, C, any, any, any>,
//             mutation: Mutation0<S, C>
//         ): () => S;
//         <S, C, P>(
//             store: StoreRef<S, any, C, any, any, any>,
//             mutation: Mutation1<S, C, P>,
//         ): (payload: P) => S;
//     }
//     interface CombinedFacadeRun {
//         <S, D, R>(
//             store: StoreRef<any, any, any, D, any, any>,
//             action: Action0<D, R>
//         ): () => R;
//         <S, D, P, R>(
//             store: StoreRef<any, any, any, D, any, any>,
//             action: Action1<D, P, R>,
//         ): (payload: P) => R;
//     }

//     export function createCombinedFacade<State, Stores, Snap, Methods>(
//         store: Store<State, any, any, any, Stores, Snap>,
//         defineMethods: (appliers: {
//             query: CombinedFacadeQuery,
//             commit: CombinedFacadeCommit,
//             run: CombinedFacadeRun,
//             stores: { self: CombinedStoreRef<State, Stores, any> } & Stores,
//         }) => Methods
//     ): StateTracker<Snap, Methods>
// }

// declare module 'slux/getters' {
//     export let getInitialState: {
//         exec<S>(state: S, context: any): S;
//     };
//     export let getState: {
//         exec<S>(state: S, context: any): S;
//     };
// }

// declare module 'slux/react' {
//     import { StateTracker } from 'slux';
//     import { Component, ComponentClass, StatelessComponent } from 'react';

//     type ReactComponent<P> = ComponentClass<P> | StatelessComponent<P>;

//     export interface Connect<Methods> {
//         <Props, WrapperProps>(
//             mapToProps: (methods: Methods, props: WrapperProps) => Props
//         ): (component: ReactComponent<Props>) => ComponentClass<WrapperProps>;
//     }

//     export function createConnector<Methods, ST extends StateTracker<any, Methods>>(stateTracker: ST): Connect<Methods>
// }
