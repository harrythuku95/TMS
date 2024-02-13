import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hasPermission } from '../../helpers/userPermissions';
import { CircularProgress, Box, Grid } from '@mui/material';
import {
  useManagementDispatch,
  useManagementState,
} from '../../context/ManagementContext';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
// styles
import useStyles from './styles';
// components
import Widget from '../../components/Widget/Widget';

const Dashboard = () => {
  let classes = useStyles();
  const managementDispatch = useManagementDispatch();
  const managementValue = useManagementState();

  const [users, setUsers] = useState(0);
  const [roles, setRoles] = useState(0);
  const [permissions, setPermissions] = useState(0);
  const [users, setUsers] = useState(0);
  const [agents, setAgents] = useState(0);
  const [attachments, setAttachments] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [folders, setFolders] = useState(0);
  const [mailboxes, setMailboxes] = useState(0);
  const [messages, setMessages] = useState(0);
  const [ticket_counts, setTicket_counts] = useState(0);
  const [ticket_labels, setTicket_labels] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [webhooks, setWebhooks] = useState(0);

  const [currentUser, setCurrentUser] = useState(null);

  async function loadData() {
    const fns = [
      setUsers,
      setRoles,
      setPermissions,
      setUsers,
      setAgents,
      setAttachments,
      setCustomers,
      setFolders,
      setMailboxes,
      setMessages,
      setTicket_counts,
      setTicket_labels,
      setTickets,
      setWebhooks,
    ];

    const responseUsers = axios.get(`/users/count`);
    const responseRoles = axios.get(`/roles/count`);
    const responsePermissions = axios.get(`/permissions/count`);
    const responseUsers = axios.get(`/users/count`);
    const responseAgents = axios.get(`/agents/count`);
    const responseAttachments = axios.get(`/attachments/count`);
    const responseCustomers = axios.get(`/customers/count`);
    const responseFolders = axios.get(`/folders/count`);
    const responseMailboxes = axios.get(`/mailboxes/count`);
    const responseMessages = axios.get(`/messages/count`);
    const responseTicket_counts = axios.get(`/ticket_counts/count`);
    const responseTicket_labels = axios.get(`/ticket_labels/count`);
    const responseTickets = axios.get(`/tickets/count`);
    const responseWebhooks = axios.get(`/webhooks/count`);
    Promise.allSettled([
      responseUsers,
      responseRoles,
      responsePermissions,
      responseUsers,
      responseAgents,
      responseAttachments,
      responseCustomers,
      responseFolders,
      responseMailboxes,
      responseMessages,
      responseTicket_counts,
      responseTicket_labels,
      responseTickets,
      responseWebhooks,
    ]).then((res) =>
      res.forEach((el, i) => {
        if (el.status === 'fulfilled') {
          fns[i](el.value.data.count);
        }
      }),
    );
  }
  useEffect(() => {
    setCurrentUser(managementValue.currentUser);
    loadData();
  }, [managementDispatch, managementValue]);

  if (!currentUser) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <h1 className='page-title'>
        Welcome, {currentUser.firstName}! <br />
        <small>
          <small>Your role is {currentUser.role}</small>
        </small>
      </h1>
      <Grid container alignItems='center' columns={12} spacing={3}>
        {hasPermission(currentUser, 'READ_USERS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/users'} style={{ textDecoration: 'none' }}>
              <Widget title={'Users'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Users:{' '}
                    <span className={classes.widgetTextCount}>{users}</span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_ROLES') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/roles'} style={{ textDecoration: 'none' }}>
              <Widget title={'Roles'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Roles:{' '}
                    <span className={classes.widgetTextCount}>{roles}</span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_PERMISSIONS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/permissions'} style={{ textDecoration: 'none' }}>
              <Widget title={'Permissions'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Permissions:{' '}
                    <span className={classes.widgetTextCount}>
                      {permissions}
                    </span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_USERS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/users'} style={{ textDecoration: 'none' }}>
              <Widget title={'Users'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Users:{' '}
                    <span className={classes.widgetTextCount}>{users}</span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_AGENTS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/agents'} style={{ textDecoration: 'none' }}>
              <Widget title={'Agents'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Agents:{' '}
                    <span className={classes.widgetTextCount}>{agents}</span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_ATTACHMENTS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/attachments'} style={{ textDecoration: 'none' }}>
              <Widget title={'Attachments'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Attachments:{' '}
                    <span className={classes.widgetTextCount}>
                      {attachments}
                    </span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_CUSTOMERS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/customers'} style={{ textDecoration: 'none' }}>
              <Widget title={'Customers'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Customers:{' '}
                    <span className={classes.widgetTextCount}>{customers}</span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_FOLDERS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/folders'} style={{ textDecoration: 'none' }}>
              <Widget title={'Folders'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Folders:{' '}
                    <span className={classes.widgetTextCount}>{folders}</span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_MAILBOXES') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/mailboxes'} style={{ textDecoration: 'none' }}>
              <Widget title={'Mailboxes'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Mailboxes:{' '}
                    <span className={classes.widgetTextCount}>{mailboxes}</span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_MESSAGES') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/messages'} style={{ textDecoration: 'none' }}>
              <Widget title={'Messages'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Messages:{' '}
                    <span className={classes.widgetTextCount}>{messages}</span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_TICKET_COUNTS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link
              to={'/admin/ticket_counts'}
              style={{ textDecoration: 'none' }}
            >
              <Widget title={'Ticket_counts'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Ticket_counts:{' '}
                    <span className={classes.widgetTextCount}>
                      {ticket_counts}
                    </span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_TICKET_LABELS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link
              to={'/admin/ticket_labels'}
              style={{ textDecoration: 'none' }}
            >
              <Widget title={'Ticket_labels'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Ticket_labels:{' '}
                    <span className={classes.widgetTextCount}>
                      {ticket_labels}
                    </span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_TICKETS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/tickets'} style={{ textDecoration: 'none' }}>
              <Widget title={'Tickets'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Tickets:{' '}
                    <span className={classes.widgetTextCount}>{tickets}</span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}

        {hasPermission(currentUser, 'READ_WEBHOOKS') && (
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <Link to={'/admin/webhooks'} style={{ textDecoration: 'none' }}>
              <Widget title={'Webhooks'}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon color='primary' sx={{ mr: 1 }} />
                  <p className={classes.widgetText}>
                    Webhooks:{' '}
                    <span className={classes.widgetTextCount}>{webhooks}</span>
                  </p>
                </div>
              </Widget>
            </Link>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Dashboard;
