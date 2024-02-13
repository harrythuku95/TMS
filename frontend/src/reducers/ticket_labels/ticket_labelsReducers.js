import list from 'reducers/ticket_labels/ticket_labelsListReducers';
import form from 'reducers/ticket_labels/ticket_labelsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
