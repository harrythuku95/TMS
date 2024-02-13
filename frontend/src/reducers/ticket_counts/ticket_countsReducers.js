import list from 'reducers/ticket_counts/ticket_countsListReducers';
import form from 'reducers/ticket_counts/ticket_countsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
