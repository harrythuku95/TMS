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

  const [currentUser, setCurrentUser] = useState(null);

  async function loadData() {
    const fns = [setUsers, setRoles, setPermissions];

    const responseUsers = axios.get(`/users/count`);
    const responseRoles = axios.get(`/roles/count`);
    const responsePermissions = axios.get(`/permissions/count`);
    Promise.allSettled([
      responseUsers,
      responseRoles,
      responsePermissions,
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
      </Grid>
    </div>
  );
};

export default Dashboard;
