import { Formik } from 'formik';
import React, { Component, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions as permissionsActions } from 'actions/permissions/permissionsListActions';

import * as dataFormat from 'pages/CRUD/Roles/table/RolesDataFormatters';
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

import rolesFields from 'pages/CRUD/Roles/helpers/rolesFields';
import IniValues from 'components/FormItems/iniValues';
import PreparedValues from 'components/FormItems/preparedValues';
import FormValidations from 'components/FormItems/formValidations';
import Widget from 'components/Widget';

import PermissionsSelectItem from 'pages/CRUD/Permissions/helpers/PermissionsSelectItem';

const RolesForm = (props) => {
  const { findLoading, record, onCancel } = props;

  const iniValues = () => {
    return IniValues(rolesFields, record || {});
  };
  const dispatch = useDispatch();

  const permissionsRows = useSelector((store) => store.permissions.list.rows);

  useEffect(() => {
    dispatch(permissionsActions.doFetch());
  }, []);

  const renderForm = () => (
    <Widget title={'View roles'} collapse close>
      <Formik initialValues={iniValues()}>
        {(form) => (
          <form>
            <Grid container spacing={3} direction='column'>
              <Grid item>
                <Typography variant='h6' style={{ marginBottom: 10 }}>
                  {rolesFields['name'].label}
                </Typography>
                <Typography>{form.values.name}</Typography>
              </Grid>

              <Grid mr={3} item>
                <ItemsList
                  tableName={'permissions'}
                  items={form.values.permissions.map((item) => ({
                    name: item.name,
                    id: item.id,
                  }))}
                  name={'permissions'}
                  nameRow={'name'}
                />
              </Grid>

              <>
                <Box
                  ml={3}
                  mt={3}
                  mr={3}
                  sx={{ border: 1, borderRadius: 3, borderColor: '#D8D9DA' }}
                >
                  <Typography
                    variant='h5'
                    style={{
                      marginBottom: 10,
                      marginTop: 10,
                      marginLeft: 15,
                      fontWeight: 'bold',
                    }}
                  >
                    Users App Role
                  </Typography>
                  <Divider />
                  <div className='overflow-x-auto'>
                    <Table size='small' aria-label='a dense table'>
                      <TableHead>
                        <TableRow>
                          <TableCell align='left'>First Name</TableCell>

                          <TableCell align='left'>Last Name</TableCell>

                          <TableCell align='left'>Phone Number</TableCell>

                          <TableCell align='left'>E-Mail</TableCell>

                          <TableCell align='left'>Disabled</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {record.users_app_role &&
                          Array.isArray(record.users_app_role) &&
                          record.users_app_role?.map((item) => (
                            <TableRow
                              key={item.id}
                              component='a'
                              href={`#/admin/users/${item.id}/show`}
                              style={{ textDecoration: 'none' }}
                              sx={{ '&:last-child td': { borderBottom: 0 } }}
                            >
                              <TableCell
                                align='left'
                                sx={{
                                  '&:last-child': { borderRight: 0 },
                                  borderRight: 2,
                                  borderColor: '#D8D9DA',
                                  borderWidth: 1,
                                }}
                                data-label='firstName'
                              >
                                {item.firstName}
                              </TableCell>

                              <TableCell
                                align='left'
                                sx={{
                                  '&:last-child': { borderRight: 0 },
                                  borderRight: 2,
                                  borderColor: '#D8D9DA',
                                  borderWidth: 1,
                                }}
                                data-label='lastName'
                              >
                                {item.lastName}
                              </TableCell>

                              <TableCell
                                align='left'
                                sx={{
                                  '&:last-child': { borderRight: 0 },
                                  borderRight: 2,
                                  borderColor: '#D8D9DA',
                                  borderWidth: 1,
                                }}
                                data-label='phoneNumber'
                              >
                                {item.phoneNumber}
                              </TableCell>

                              <TableCell
                                align='left'
                                sx={{
                                  '&:last-child': { borderRight: 0 },
                                  borderRight: 2,
                                  borderColor: '#D8D9DA',
                                  borderWidth: 1,
                                }}
                                data-label='email'
                              >
                                {item.email}
                              </TableCell>

                              <TableCell
                                align='left'
                                sx={{
                                  '&:last-child': { borderRight: 0 },
                                  borderRight: 2,
                                  borderColor: '#D8D9DA',
                                  borderWidth: 1,
                                }}
                                data-label='disabled'
                              >
                                {item.disabled}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                  {!record?.users_app_role?.length && (
                    <Typography
                      style={{
                        marginBottom: 10,
                        marginTop: 10,
                        marginLeft: 15,
                      }}
                    >
                      Empty
                    </Typography>
                  )}
                </Box>
              </>

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
export default RolesForm;
