import auth from 'reducers/auth';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import users from 'reducers/users/usersReducers';

import roles from 'reducers/roles/rolesReducers';

import permissions from 'reducers/permissions/permissionsReducers';

import users from 'reducers/users/usersReducers';

import agents from 'reducers/agents/agentsReducers';

import attachments from 'reducers/attachments/attachmentsReducers';

import customers from 'reducers/customers/customersReducers';

import folders from 'reducers/folders/foldersReducers';

import mailboxes from 'reducers/mailboxes/mailboxesReducers';

import messages from 'reducers/messages/messagesReducers';

import ticket_counts from 'reducers/ticket_counts/ticket_countsReducers';

import ticket_labels from 'reducers/ticket_labels/ticket_labelsReducers';

import tickets from 'reducers/tickets/ticketsReducers';

import webhooks from 'reducers/webhooks/webhooksReducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,

    users,

    roles,

    permissions,

    users,

    agents,

    attachments,

    customers,

    folders,

    mailboxes,

    messages,

    ticket_counts,

    ticket_labels,

    tickets,

    webhooks,
  });
