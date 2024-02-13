import React, { useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import classnames from 'classnames';

import SettingsIcon from '@mui/icons-material/Settings';
import GithubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

import { Fab, IconButton } from '@mui/material';
import { connect } from 'react-redux';
// styles
import useStyles from './styles';

// components
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link } from '../Wrappers';
import ColorChangeThemePopper from './components/ColorChangeThemePopper';

import EditUser from '../../pages/user/EditUser';

// pages
import Dashboard from '../../pages/dashboard';
import BreadCrumbs from '../../components/BreadCrumbs';

// context
import { useLayoutState } from '../../context/LayoutContext';

import UsersFormPage from 'pages/CRUD/Users/form/UsersFormPage';
import UsersFormPageView from 'pages/CRUD/Users/form/UsersFormPageView';
import UsersTablePage from 'pages/CRUD/Users/table/UsersTablePage';

import RolesFormPage from 'pages/CRUD/Roles/form/RolesFormPage';
import RolesFormPageView from 'pages/CRUD/Roles/form/RolesFormPageView';
import RolesTablePage from 'pages/CRUD/Roles/table/RolesTablePage';

import PermissionsFormPage from 'pages/CRUD/Permissions/form/PermissionsFormPage';
import PermissionsFormPageView from 'pages/CRUD/Permissions/form/PermissionsFormPageView';
import PermissionsTablePage from 'pages/CRUD/Permissions/table/PermissionsTablePage';

import UsersFormPage from 'pages/CRUD/Users/form/UsersFormPage';
import UsersFormPageView from 'pages/CRUD/Users/form/UsersFormPageView';
import UsersTablePage from 'pages/CRUD/Users/table/UsersTablePage';

import AgentsFormPage from 'pages/CRUD/Agents/form/AgentsFormPage';
import AgentsFormPageView from 'pages/CRUD/Agents/form/AgentsFormPageView';
import AgentsTablePage from 'pages/CRUD/Agents/table/AgentsTablePage';

import AttachmentsFormPage from 'pages/CRUD/Attachments/form/AttachmentsFormPage';
import AttachmentsFormPageView from 'pages/CRUD/Attachments/form/AttachmentsFormPageView';
import AttachmentsTablePage from 'pages/CRUD/Attachments/table/AttachmentsTablePage';

import CustomersFormPage from 'pages/CRUD/Customers/form/CustomersFormPage';
import CustomersFormPageView from 'pages/CRUD/Customers/form/CustomersFormPageView';
import CustomersTablePage from 'pages/CRUD/Customers/table/CustomersTablePage';

import FoldersFormPage from 'pages/CRUD/Folders/form/FoldersFormPage';
import FoldersFormPageView from 'pages/CRUD/Folders/form/FoldersFormPageView';
import FoldersTablePage from 'pages/CRUD/Folders/table/FoldersTablePage';

import MailboxesFormPage from 'pages/CRUD/Mailboxes/form/MailboxesFormPage';
import MailboxesFormPageView from 'pages/CRUD/Mailboxes/form/MailboxesFormPageView';
import MailboxesTablePage from 'pages/CRUD/Mailboxes/table/MailboxesTablePage';

import MessagesFormPage from 'pages/CRUD/Messages/form/MessagesFormPage';
import MessagesFormPageView from 'pages/CRUD/Messages/form/MessagesFormPageView';
import MessagesTablePage from 'pages/CRUD/Messages/table/MessagesTablePage';

import Ticket_countsFormPage from 'pages/CRUD/Ticket_counts/form/Ticket_countsFormPage';
import Ticket_countsFormPageView from 'pages/CRUD/Ticket_counts/form/Ticket_countsFormPageView';
import Ticket_countsTablePage from 'pages/CRUD/Ticket_counts/table/Ticket_countsTablePage';

import Ticket_labelsFormPage from 'pages/CRUD/Ticket_labels/form/Ticket_labelsFormPage';
import Ticket_labelsFormPageView from 'pages/CRUD/Ticket_labels/form/Ticket_labelsFormPageView';
import Ticket_labelsTablePage from 'pages/CRUD/Ticket_labels/table/Ticket_labelsTablePage';

import TicketsFormPage from 'pages/CRUD/Tickets/form/TicketsFormPage';
import TicketsFormPageView from 'pages/CRUD/Tickets/form/TicketsFormPageView';
import TicketsTablePage from 'pages/CRUD/Tickets/table/TicketsTablePage';

import WebhooksFormPage from 'pages/CRUD/Webhooks/form/WebhooksFormPage';
import WebhooksFormPageView from 'pages/CRUD/Webhooks/form/WebhooksFormPageView';
import WebhooksTablePage from 'pages/CRUD/Webhooks/table/WebhooksTablePage';

const Redirect = (props) => {
  useEffect(() => window.location.replace(props.url));
  return <span>Redirecting...</span>;
};

function Layout(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'add-section-popover' : undefined;
  const handleClick = (event) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  // global
  let layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <Header history={props.history} />
      <Sidebar />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <div className={classes.fakeToolbar} />
        <BreadCrumbs />
        <Switch>
          <Route path='/admin/dashboard' component={Dashboard} />
          <Route path='/admin/user/edit' component={EditUser} />
          <Route
            path={'/admin/api-docs'}
            exact
            component={(props) => (
              <Redirect
                url={
                  process.env.NODE_ENV === 'production'
                    ? window.location.origin + '/api-docs'
                    : 'http://localhost:8080/api-docs'
                }
                {...props}
              />
            )}
          />

          <Route path={'/admin/users'} exact component={UsersTablePage} />
          <Route path={'/admin/users/new'} exact component={UsersFormPage} />
          <Route
            path={'/admin/users/:id/edit'}
            exact
            component={UsersFormPage}
          />
          <Route
            path={'/admin/users/:id/show'}
            exact
            component={UsersFormPageView}
          />

          <Route path={'/admin/roles'} exact component={RolesTablePage} />
          <Route path={'/admin/roles/new'} exact component={RolesFormPage} />
          <Route
            path={'/admin/roles/:id/edit'}
            exact
            component={RolesFormPage}
          />
          <Route
            path={'/admin/roles/:id/show'}
            exact
            component={RolesFormPageView}
          />

          <Route
            path={'/admin/permissions'}
            exact
            component={PermissionsTablePage}
          />
          <Route
            path={'/admin/permissions/new'}
            exact
            component={PermissionsFormPage}
          />
          <Route
            path={'/admin/permissions/:id/edit'}
            exact
            component={PermissionsFormPage}
          />
          <Route
            path={'/admin/permissions/:id/show'}
            exact
            component={PermissionsFormPageView}
          />

          <Route path={'/admin/users'} exact component={UsersTablePage} />
          <Route path={'/admin/users/new'} exact component={UsersFormPage} />
          <Route
            path={'/admin/users/:id/edit'}
            exact
            component={UsersFormPage}
          />
          <Route
            path={'/admin/users/:id/show'}
            exact
            component={UsersFormPageView}
          />

          <Route path={'/admin/agents'} exact component={AgentsTablePage} />
          <Route path={'/admin/agents/new'} exact component={AgentsFormPage} />
          <Route
            path={'/admin/agents/:id/edit'}
            exact
            component={AgentsFormPage}
          />
          <Route
            path={'/admin/agents/:id/show'}
            exact
            component={AgentsFormPageView}
          />

          <Route
            path={'/admin/attachments'}
            exact
            component={AttachmentsTablePage}
          />
          <Route
            path={'/admin/attachments/new'}
            exact
            component={AttachmentsFormPage}
          />
          <Route
            path={'/admin/attachments/:id/edit'}
            exact
            component={AttachmentsFormPage}
          />
          <Route
            path={'/admin/attachments/:id/show'}
            exact
            component={AttachmentsFormPageView}
          />

          <Route
            path={'/admin/customers'}
            exact
            component={CustomersTablePage}
          />
          <Route
            path={'/admin/customers/new'}
            exact
            component={CustomersFormPage}
          />
          <Route
            path={'/admin/customers/:id/edit'}
            exact
            component={CustomersFormPage}
          />
          <Route
            path={'/admin/customers/:id/show'}
            exact
            component={CustomersFormPageView}
          />

          <Route path={'/admin/folders'} exact component={FoldersTablePage} />
          <Route
            path={'/admin/folders/new'}
            exact
            component={FoldersFormPage}
          />
          <Route
            path={'/admin/folders/:id/edit'}
            exact
            component={FoldersFormPage}
          />
          <Route
            path={'/admin/folders/:id/show'}
            exact
            component={FoldersFormPageView}
          />

          <Route
            path={'/admin/mailboxes'}
            exact
            component={MailboxesTablePage}
          />
          <Route
            path={'/admin/mailboxes/new'}
            exact
            component={MailboxesFormPage}
          />
          <Route
            path={'/admin/mailboxes/:id/edit'}
            exact
            component={MailboxesFormPage}
          />
          <Route
            path={'/admin/mailboxes/:id/show'}
            exact
            component={MailboxesFormPageView}
          />

          <Route path={'/admin/messages'} exact component={MessagesTablePage} />
          <Route
            path={'/admin/messages/new'}
            exact
            component={MessagesFormPage}
          />
          <Route
            path={'/admin/messages/:id/edit'}
            exact
            component={MessagesFormPage}
          />
          <Route
            path={'/admin/messages/:id/show'}
            exact
            component={MessagesFormPageView}
          />

          <Route
            path={'/admin/ticket_counts'}
            exact
            component={Ticket_countsTablePage}
          />
          <Route
            path={'/admin/ticket_counts/new'}
            exact
            component={Ticket_countsFormPage}
          />
          <Route
            path={'/admin/ticket_counts/:id/edit'}
            exact
            component={Ticket_countsFormPage}
          />
          <Route
            path={'/admin/ticket_counts/:id/show'}
            exact
            component={Ticket_countsFormPageView}
          />

          <Route
            path={'/admin/ticket_labels'}
            exact
            component={Ticket_labelsTablePage}
          />
          <Route
            path={'/admin/ticket_labels/new'}
            exact
            component={Ticket_labelsFormPage}
          />
          <Route
            path={'/admin/ticket_labels/:id/edit'}
            exact
            component={Ticket_labelsFormPage}
          />
          <Route
            path={'/admin/ticket_labels/:id/show'}
            exact
            component={Ticket_labelsFormPageView}
          />

          <Route path={'/admin/tickets'} exact component={TicketsTablePage} />
          <Route
            path={'/admin/tickets/new'}
            exact
            component={TicketsFormPage}
          />
          <Route
            path={'/admin/tickets/:id/edit'}
            exact
            component={TicketsFormPage}
          />
          <Route
            path={'/admin/tickets/:id/show'}
            exact
            component={TicketsFormPageView}
          />

          <Route path={'/admin/webhooks'} exact component={WebhooksTablePage} />
          <Route
            path={'/admin/webhooks/new'}
            exact
            component={WebhooksFormPage}
          />
          <Route
            path={'/admin/webhooks/:id/edit'}
            exact
            component={WebhooksFormPage}
          />
          <Route
            path={'/admin/webhooks/:id/show'}
            exact
            component={WebhooksFormPageView}
          />
        </Switch>
        <Fab
          color='primary'
          aria-label='settings'
          onClick={(e) => handleClick(e)}
          className={classes.changeThemeFab}
          style={{ zIndex: 100 }}
        >
          <SettingsIcon style={{ color: '#fff' }} />
        </Fab>
        <ColorChangeThemePopper id={id} open={open} anchorEl={anchorEl} />
        <Footer>
          <div>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/'}
              target={'_blank'}
              className={classes.link}
            >
              Flatlogic
            </Link>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/about'}
              target={'_blank'}
              className={classes.link}
            >
              About Us
            </Link>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/blog'}
              target={'_blank'}
              className={classes.link}
            >
              Blog
            </Link>
          </div>
          <div>
            <Link href={'https://www.facebook.com/flatlogic'} target={'_blank'}>
              <IconButton aria-label='facebook'>
                <FacebookIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
            <Link href={'https://twitter.com/flatlogic'} target={'_blank'}>
              <IconButton aria-label='twitter'>
                <TwitterIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
            <Link href={'https://github.com/flatlogic'} target={'_blank'}>
              <IconButton
                aria-label='github'
                style={{ padding: '12px 0 12px 12px' }}
              >
                <GithubIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
          </div>
        </Footer>
      </div>
    </div>
  );
}

export default withRouter(connect()(Layout));
