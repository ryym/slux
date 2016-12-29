import SingleStore from './SingleStore';
import CombinedStore from './CombinedStore';

export const createStore = config => new SingleStore(config);

export const combineStores = config => new CombinedStore(config);

