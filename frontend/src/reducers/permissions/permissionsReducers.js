import list from 'reducers/permissions/permissionsListReducers';
import form from 'reducers/permissions/permissionsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
