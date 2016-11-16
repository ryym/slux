import { PropTypes as P } from 'react';

export default P.shape({
  // dispatch: P.func.isRequired,
  // store: P.shape({
  //   getState: P.func.isRequired,
  //   subscribe: P.func.isRequired,
  // })
  dispatcher: P.shape({
    dispatch: P.func.isRequired,
    getStore: P.func.isRequired,
  }),

  hasConnectedParent: P.bool.isRequired,

  // dispatcher: P.shape({
  //   dispatch: P.func.isRequired,
  //   subscribe: P.func.isRequired,
  // })
});

