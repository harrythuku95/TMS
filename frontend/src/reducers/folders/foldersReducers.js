import list from 'reducers/folders/foldersListReducers';
import form from 'reducers/folders/foldersFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
