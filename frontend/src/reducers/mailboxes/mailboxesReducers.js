import list from 'reducers/mailboxes/mailboxesListReducers';
import form from 'reducers/mailboxes/mailboxesFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
