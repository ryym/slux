declare module 'slux' {
    export type GetterFunc0<S, GX, R> = (s: S, c: GX) => R;
    export type GetterFunc1<S, GX, T, R> = (s: S, c: GX, arg: T) => R;

    export interface Getter0<S, GX, R> {
        exec: (s: S, c: GX) => R;
    }
    export interface Getter1<S, GX, T, R> {
        exec: (s: S, c: GX, arg: T) => R;
    }

    export type MutationFunc0<S, CX> = (s: S, c: CX) => S;
    export type MutationFunc1<S, CX, T> = (s: S, c: CX, t: T) => S;

    export interface Mutation0<S, CX> {
        type: string;
        exec: (s: S, c: CX) => S;
    }
    export interface Mutation1<S, CX, T> {
        type: string;
        exec: (s: S, c: CX, t: T) => S;
    }

    export type ActionFunc0<DX, R> = (c: DX) => R;
    export type ActionFunc1<DX, T, R> = (c: DX, t: T) => R;

    export interface Action0<DX, R> {
        type: string;
        exec: (c: DX) => R;
    }
    export interface Action1<DX, T, R> {
        type: string;
        exec: (c: DX, t: T) => R;
    }


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
    };
    export type MutationContext<S> = {
        query: SingleQuery<S>,
        commit: SingleCommit<S>
    };
    export type ActionContext<S> = {
        query: SingleQuery<S>,
        commit: SingleCommit<S>,
        run: SingleRun<S>
    };

    type SingleQuery<S> = Query<S, GetterContext<S>>;
    type SingleCommit<S> = Commit<S, MutationContext<S>>;
    type SingleRun<S> = Run<ActionContext<S>>;

    type MutationData = {
        type: string;
        payload: any;
        includes: MutationData[];
    };
    export class Store<S, GX, CX, DX, Stores, Snap> {
        query: Query<S, GX>;
        commit: Commit<S, CX>;
        run: Run<DX>;
        getState(): S;
        takeSnapshot(): Snap;
        onMutation(handler: (data: MutationData, store: Store<S, GX, CX, DX, Stores, Snap>) => void): void;
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
        name: string,
        getInitialState: () => S,
        takeSnapshot?: (state: S) => Snap,
    }): SingleStore<S, Snap>;

    export interface CombinedQuery {
        <S, G, R>(
            store: StoreRef<S, G, any, any, any, any>,
            getter: Getter0<S, G, R>
        ): R;
        <S, G, T, R>(
            store: StoreRef<S, G, any, any, any, any>,
            getter: Getter1<S, G, T, R>,
            arg: T
        ): R;
    }
    export interface CombinedCommit {
        <S, C>(
            store: StoreRef<S, any, C, any, any, any>,
            mutation: Mutation0<S, C>
        ): S;
        <S, C, T>(
            store: StoreRef<S, any, C, any, any, any>,
            mutation: Mutation1<S, C, T>,
            arg: T
        ): S;
    }
    export interface CombinedRun {
        <S, D, R>(
            store: StoreRef<any, any, any, D, any, any>,
            action: Action0<D, R>
        ): R;
        <S, D, T, R>(
            store: StoreRef<any, any, any, D, any, any>,
            action: Action1<D, T, R>,
            arg: T
        ): R;
    }

    export type CombinedGetterContext<S, Stores> = {
        query: CombinedQuery,
        stores: { self: CombinedStoreRef<S, Stores, any> } & Stores
    };
    export type CombinedMutationContext<S, Stores> = {
        query: CombinedQuery,
        commit: CombinedCommit,
        stores: { self: CombinedStoreRef<S, Stores, any> } & Stores
    };
    export type CombinedActionContext<S, Stores> = {
        query: CombinedQuery,
        commit: CombinedCommit,
        run: CombinedRun,
        stores: { self: CombinedStoreRef<S, Stores, any> } & Stores
    };

    export class CombinedStore<S, Stores, Snap> extends Store<
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

    type StoreRefs = {
        [key: string]: StoreRef<any, any, any, any, any, any>
    };
    export function combineStores<S, Stores extends StoreRefs, Snap>(
        config: {
            name: string,
            getInitialState: () => S,
            takeSnapshot?: (state: S, stores: Stores) => Snap,
            stores: (getRef: GetRef) => Stores
        }
    ): CombinedStore<S, Stores, Snap>;

    export class StoreRef<S, G, C, D, Stores, Snap> {
        constructor(store: Store<S, G, C, D, Stores, Snap>);
        takeSnapshot(): Snap;
    }

    type SingleStoreRef<S, Snap> = StoreRef<
        S,
        GetterContext<S>,
        MutationContext<S>,
        ActionContext<S>,
        {},
        Snap
    >;

    type CombinedStoreRef<S, Stores, Snap> = StoreRef<
        S,
        CombinedGetterContext<S, Stores>,
        CombinedMutationContext<S, Stores>,
        CombinedActionContext<S, Stores>,
        Stores,
        Snap
    >;

    type GetRef = <S, G, C, D, Stores, Snap>(
        store: Store<S, G, C, D, Stores, Snap>
    ) => StoreRef<S, G, C, D, Stores, Snap>;


    export function getter<F extends GetterFunc0<any, any, any>>(f: F): { exec: F };
    export function getter<F extends GetterFunc1<any, any, any, any>>(f: F): { exec: F };

    export function getterWith<Dep, F extends GetterFunc0<any, any, any>>(
        dep: Dep,
        g: (dep: Dep) => F
    ): { exec: F, with: (dep: Dep) => F };
    export function getterWith<Dep, F extends GetterFunc1<any, any, any, any>>(
        dep: Dep,
        g: (dep: Dep) => F
    ): { exec: F, with: (dep: Dep) => F };

    export function mutation<F extends MutationFunc0<any, any>>(
        type: string,
        f: F
    ): { type: string, exec: F };
    export function mutation<F extends MutationFunc1<any, any, any>>(
        type: string,
        f: F
    ): { type: string, exec: F };

    export function mutationWith<Dep, F extends MutationFunc0<any, any>>(
        dep: Dep,
        type: string,
        m: (dep: Dep) => F
    ): { type: string, exec: F, with: (dep: Dep) => F };
    export function mutationWith<Dep, F extends MutationFunc1<any, any, any>>(
        dep: Dep,
        type: string,
        m: (dep: Dep) => F
    ): { type: string, exec: F, with: (dep: Dep) => F };

    export function action<F extends ActionFunc0<any, any>>(
        type: string,
        a: F
    ): { type: string, exec: F };
    export function action<F extends ActionFunc1<any, any, any>>(
        type: string,
        a: F
    ): { type: string, exec: F };

    export function actionWith<Dep, F extends ActionFunc0<any, any>>(
        dep: Dep,
        type: string,
        a: (dep: Dep) => F
    ): { type: string, exec: F, with: (dep: Dep) => F };
    export function actionWith<Dep, F extends ActionFunc1<any, any, any>>(
        dep: Dep,
        type: string,
        a: (dep: Dep) => F
    ): { type: string, exec: F, with: (dep: Dep) => F };


    export type Command0 = {
        type: string
    };
    export type Command1<T> = {
        type: string,
        payload: T
    };

    interface CommitMaker<S, CX> {
        (mutation: Mutation0<S, CX>): () => Command0;
        <T>(mutation: Mutation1<S, CX, T>): (t: T) => Command1<T>;
    }

    interface DispatchMaker<S, DX> {
        (action: Action0<DX, any>): () => Command0;
        <T>(action: Action1<DX, T, any>): (t: T) => Command1<T>;
    }

    export interface Dispatch {
        (c: () => Command0): void;
        <T>(c: (t: T) => Command1<T>, arg: T): void;
    }
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
    };

    interface CommitMakerWithStore {
        <S, CX>(store: Store<S, any, CX, any, any, any>, mutation: Mutation0<S, CX>): () => Command0;
        <S, CX, T>(store: Store<S, any, CX, any, any, any>, mutation: Mutation1<S, CX, T>): (t: T) => Command1<T>;
    }

    interface DispatchMakerWithStore {
        <S, DX>(store: Store<S, any, any, DX, any, any>, action: Action0<DX, any>): () => Command0;
        <S, DX, T>(store: Store<S, any, any, DX, any, any>, action: Action1<DX, T, any>): (t: T) => Command1<T>;
    }

    export function createCombinedDispatcher<S, G, C, D, CM>(
        store: Store<S, G, C, D, any, any>,
        defineCommands: (
            commit: CommitMakerWithStore,
            run: DispatchMakerWithStore
        ) => CM
    ): {
        dispatcher: Dispatcher,
        commands: CM
    };

    interface StateTracker<Snap, Methods> {
        methods: Methods;
        onStateChange(handler: (data: MutationData, self: StateTracker<Snap, Methods>) => void): void;
        takeSnapshot(): Snap;
    }

    interface FacadeQuery {
        <S, GX, R>(getter: Getter0<S, GX, R>): () => R;
        <S, GX, P, R>(getter: Getter1<S, GX, P, R>): (payload: P) => R;
    }
    interface FacadeCommit {
        <S, CX>(muation: Mutation0<S, CX>): () => S;
        <S, CX, P>(muation: Mutation1<S, CX, P>): (payload: P) => S;
    }
    interface FacadeRun {
        <DX, R>(action: Action0<DX, R>): () => R;
        <DX, P, R>(action: Action1<DX, P, R>): (payload: P) => R;
    }

    export function createFacade<Snap, Methods>(
        store: Store<any, any, any, any, any, Snap>,
        defineMethods: (appliers: {
            query: FacadeQuery,
            commit: FacadeCommit,
            run: FacadeRun
        }) => Methods
    ): StateTracker<Snap, Methods>

    interface CombinedFacadeQuery {
        <S, G, R>(
            store: StoreRef<S, G, any, any, any, any>,
            getter: Getter0<S, G, R>
        ): () => R;
        <S, G, P, R>(
            store: StoreRef<S, G, any, any, any, any>,
            getter: Getter1<S, G, P, R>,
        ): (payload: P) => R;
    }
    interface CombinedFacadeCommit {
        <S, C>(
            store: StoreRef<S, any, C, any, any, any>,
            mutation: Mutation0<S, C>
        ): () => S;
        <S, C, P>(
            store: StoreRef<S, any, C, any, any, any>,
            mutation: Mutation1<S, C, P>,
        ): (payload: P) => S;
    }
    interface CombinedFacadeRun {
        <S, D, R>(
            store: StoreRef<any, any, any, D, any, any>,
            action: Action0<D, R>
        ): () => R;
        <S, D, P, R>(
            store: StoreRef<any, any, any, D, any, any>,
            action: Action1<D, P, R>,
        ): (payload: P) => R;
    }

    export function createCombinedFacade<State, Stores, Snap, Methods>(
        store: Store<State, any, any, any, Stores, Snap>,
        defineMethods: (appliers: {
            query: CombinedFacadeQuery,
            commit: CombinedFacadeCommit,
            run: CombinedFacadeRun,
            stores: { self: CombinedStoreRef<State, Stores, any> } & Stores,
        }) => Methods
    ): StateTracker<Snap, Methods>
}

declare module 'slux/getters' {
    export let getInitialState: {
        exec<S>(state: S, context: any): S;
    };
    export let getState: {
        exec<S>(state: S, context: any): S;
    };
}

declare module 'slux/react' {
    import { Query, Dispatch, Dispatcher, CombinedQuery, GetRef, StateTracker } from 'slux';
    import { Component, ComponentClass, StatelessComponent } from 'react';

    type ReactComponent<P> = ComponentClass<P> | StatelessComponent<P>;

    export function connect<P1, P2, WP>(
        mapStateToProps: (query: Query<any, any>, props: WP) => P1,
        mapDispatchToProps?: (dispatch: Dispatch) => P2
    ): (component: ReactComponent<P1 & P2>) => ComponentClass<WP>;

    interface ProviderProps {
        dispatcher: Dispatcher;
    }
    export class Provider extends Component<ProviderProps, {}> {}

    export interface Connect<Methods> {
        <Props, WrapperProps>(
            mapToProps: (methods: Methods, props: WrapperProps) => Props
        ): (component: ReactComponent<Props>) => ComponentClass<WrapperProps>;
    }

    export function createConnector<Methods, ST extends StateTracker<any, Methods>>(stateTracker: ST): Connect<Methods>
}
