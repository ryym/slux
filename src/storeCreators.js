import Store from './Store';

export const createStore = (name, config) => new Store(name, config);
