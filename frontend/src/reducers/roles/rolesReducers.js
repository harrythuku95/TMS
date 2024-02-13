import list from 'reducers/roles/rolesListReducers';
import form from 'reducers/roles/rolesFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
