import list from 'reducers/agents/agentsListReducers';
import form from 'reducers/agents/agentsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
