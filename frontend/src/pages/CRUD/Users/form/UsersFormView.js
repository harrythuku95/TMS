import { Formik } from 'formik';
import React, { Component, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions as rolesActions } from 'actions/roles/rolesListActions';

import { actions as permissionsActions } from 'actions/permissions/permissionsListActions';

import * as dataFormat from 'pages/CRUD/Users/table/UsersDataFormatters';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Loader from 'components/Loader';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// eslint-disable-next-line no-unused-vars
import SwitchFormItem from 'components/FormItems/items/SwitchFormItem';
// eslint-disable-next-line no-unused-vars
import RadioFormItem from 'components/FormItems/items/RadioFormItem';
// eslint-disable-next-line no-unused-vars
import SelectFormItem from 'components/FormItems/items/SelectFormItem';
// eslint-disable-next-line no-unused-vars
import DatePickerFormItem from 'components/FormItems/items/DatePickerFormItem';
// eslint-disable-next-line no-unused-vars
import ImagesFormItem from 'components/FormItems/items/ImagesFormItem';
// eslint-disable-next-line no-unused-vars
import FilesFormItem from 'components/FormItems/items/FilesFormItem';
// eslint-disable-next-line no-unused-vars
import ItemsList from 'components/FormItems/items/ItemsList';

import usersFields from 'pages/CRUD/Users/helpers/usersFields';
import IniValues from 'components/FormItems/iniValues';
import PreparedValues from 'components/FormItems/preparedValues';
import FormValidations from 'components/FormItems/formValidations';
import Widget from 'components/Widget';

import RolesSelectItem from 'pages/CRUD/Roles/helpers/RolesSelectItem';

import PermissionsSelectItem from 'pages/CRUD/Permissions/helpers/PermissionsSelectItem';

const UsersForm = (props) => {
  const { findLoading, record, onCancel } = props;

  const iniValues = () => {
    return IniValues(usersFields, record || {});
  };
  const dispatch = useDispatch();

  const rolesRows = useSelector((store) => store.roles.list.rows);

  const permissionsRows = useSelector((store) => store.permissions.list.rows);

  useEffect(() => {
    dispatch(rolesActions.doFetch());

    dispatch(permissionsActions.doFetch());
  }, []);

  const renderForm = () => (
    <Widget title={'View users'} collapse close>
      <Formik initialValues={iniValues()}>
        {(form) => (
          <form>
            <Grid container spacing={3} direction='column'>
              <Grid item>
                <Typography variant='h6' style={{ marginBottom: 10 }}>
                  {usersFields['firstName'].label}
                </Typography>
                <Typography>{form.values.firstName}</Typography>
              </Grid>

              <Grid item>
                <Typography variant='h6' style={{ marginBottom: 10 }}>
                  {usersFields['lastName'].label}
                </Typography>
                <Typography>{form.values.lastName}</Typography>
              </Grid>

              <Grid item>
                <Typography variant='h6' style={{ marginBottom: 10 }}>
                  {usersFields['phoneNumber'].label}
                </Typography>
                <Typography>{form.values.phoneNumber}</Typography>
              </Grid>

              <Grid item>
                <Typography variant='h6' style={{ marginBottom: 10 }}>
                  {usersFields['email'].label}
                </Typography>
                <Typography>{form.values.email}</Typography>
              </Grid>

              <Grid item>
                <ImagesFormItem
                  name={'avatar'}
                  schema={usersFields}
                  path={'users/avatar'}
                  fileProps={{
                    size: undefined,
                    formats: undefined,
                  }}
                  max={undefined}
                  readonly={true}
                />
              </Grid>

              <Grid item>
                <Typography variant='h6' style={{ marginBottom: 10 }}>
                  {usersFields['app_role'].label}
                </Typography>
                <Typography>{form.values.app_role.name}</Typography>
              </Grid>

              <Grid mr={3} item>
                <ItemsList
                  tableName={'custom_permissions'}
                  items={form.values.custom_permissions.map((item) => ({
                    name: item.name,
                    id: item.id,
                  }))}
                  name={'permissions'}
                  nameRow={'name'}
                />
              </Grid>

              <Grid container ml={3} mt={3}>
                <Grid item>
                  <Button
                    color='primary'
                    variant='outlined'
                    onClick={() => onCancel()}
                  >
                    Back
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Widget>
  );
  if (findLoading) {
    return <Loader />;
  }
  return renderForm();
};
export default UsersForm;
