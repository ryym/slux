import { PropTypes as P } from 'react';

export default P.shape({
  dispatch: P.func.isRequired,
  getState: P.func.isRequired
});
