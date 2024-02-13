import list from 'reducers/tickets/ticketsListReducers';
import form from 'reducers/tickets/ticketsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
