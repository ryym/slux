import { PropTypes as P } from 'react';

export default P.shape({
  dispatcher: P.shape({
    dispatch: P.func.isRequired,
    getStore: P.func.isRequired,
  }),
});

