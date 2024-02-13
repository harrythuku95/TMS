import auth from 'reducers/auth';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import users from 'reducers/users/usersReducers';

import roles from 'reducers/roles/rolesReducers';

import permissions from 'reducers/permissions/permissionsReducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,

    users,

    roles,

    permissions,
  });
