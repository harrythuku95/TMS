import list from 'reducers/webhooks/webhooksListReducers';
import form from 'reducers/webhooks/webhooksFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
