import list from 'reducers/attachments/attachmentsListReducers';
import form from 'reducers/attachments/attachmentsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
