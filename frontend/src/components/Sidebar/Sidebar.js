import React, { useState, useEffect, useMemo } from 'react';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Drawer, IconButton, List } from '@mui/material';
import { useTheme } from '@mui/material';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  useManagementDispatch,
  useManagementState,
} from '../../context/ManagementContext';
import { hasPermission } from '../../helpers/userPermissions';

import {
  Home as HomeIcon,
  Apps as CoreIcon,
  Description as DocumentationIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';

// styles
import useStyles from './styles';
import useStyles2 from './components/SidebarLink/styles';

// components
import SidebarLink from './components/SidebarLink/SidebarLink';

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from '../../context/LayoutContext';

function Sidebar({ location, structure }) {
  let classes = useStyles();
  let classes2 = useStyles2();
  let theme = useTheme();
  const managementDispatch = useManagementDispatch();
  const managementValue = useManagementState();

  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    setCurrentUser(managementValue.currentUser);
  }, [managementDispatch, managementValue]);

  const toggleDrawer = (value) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    if (value && !isPermanent) toggleSidebar(layoutDispatch);
  };

  // global
  let { isSidebarOpened } = useLayoutState();
  let layoutDispatch = useLayoutDispatch();

  // local
  let [isPermanent, setPermanent] = useState(true);

  const isSidebarOpenedWrapper = useMemo(
    () => (!isPermanent ? !isSidebarOpened : isSidebarOpened),
    [isPermanent, isSidebarOpened],
  );

  useEffect(function () {
    window.addEventListener('resize', handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener('resize', handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? 'permanent' : 'temporary'}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpenedWrapper,
        [classes.drawerClose]: !isSidebarOpenedWrapper,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpenedWrapper,
          [classes.drawerClose]: !isSidebarOpenedWrapper,
        }),
      }}
      open={isSidebarOpenedWrapper}
      onClose={toggleDrawer(true)}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List
        className={classes.sidebarList}
        classes={{ padding: classes.padding }}
      >
        <SidebarLink
          label='Dashboard'
          link='/admin/dashboard'
          location={location}
          isSidebarOpened={isSidebarOpenedWrapper}
          icon={<HomeIcon />}
          toggleDrawer={toggleDrawer(true)}
        />

        <SidebarLink
          label='Edit User'
          link='/admin/user/edit'
          location={location}
          isSidebarOpened={isSidebarOpenedWrapper}
          icon={<ProfileIcon />}
          toggleDrawer={toggleDrawer(true)}
        />

        {hasPermission(currentUser, 'READ_USERS') && (
          <SidebarLink
            label='Users'
            link='/admin/users'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_ROLES') && (
          <SidebarLink
            label='Roles'
            link='/admin/roles'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_PERMISSIONS') && (
          <SidebarLink
            label='Permissions'
            link='/admin/permissions'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_USERS') && (
          <SidebarLink
            label='Users'
            link='/admin/users'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_AGENTS') && (
          <SidebarLink
            label='Agents'
            link='/admin/agents'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_ATTACHMENTS') && (
          <SidebarLink
            label='Attachments'
            link='/admin/attachments'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_CUSTOMERS') && (
          <SidebarLink
            label='Customers'
            link='/admin/customers'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_FOLDERS') && (
          <SidebarLink
            label='Folders'
            link='/admin/folders'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_MAILBOXES') && (
          <SidebarLink
            label='Mailboxes'
            link='/admin/mailboxes'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_MESSAGES') && (
          <SidebarLink
            label='Messages'
            link='/admin/messages'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_TICKET_COUNTS') && (
          <SidebarLink
            label='Ticket counts'
            link='/admin/ticket_counts'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_TICKET_LABELS') && (
          <SidebarLink
            label='Ticket labels'
            link='/admin/ticket_labels'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_TICKETS') && (
          <SidebarLink
            label='Tickets'
            link='/admin/tickets'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_WEBHOOKS') && (
          <SidebarLink
            label='Webhooks'
            link='/admin/webhooks'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<CoreIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}

        {hasPermission(currentUser, 'READ_API_DOCS') && (
          <SidebarLink
            label='API docs'
            link='/admin/api-docs'
            location={location}
            isSidebarOpened={isSidebarOpenedWrapper}
            icon={<DocumentationIcon />}
            toggleDrawer={toggleDrawer(true)}
          />
        )}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    let windowWidth = window.innerWidth;
    let breakpointWidth = theme.breakpoints.values.md;
    let isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
