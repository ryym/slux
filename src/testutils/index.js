import * as singleStoreUtils from './singleStore';
import * as combinedStoreUtils from './combinedStore';

module.exports = {
  ...singleStoreUtils,
  ...combinedStoreUtils,
};
