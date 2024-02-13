import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'PERMISSIONS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'PERMISSIONS_FORM_FIND_STARTED',
      });

      axios.get(`/permissions/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'PERMISSIONS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'PERMISSIONS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/permissions'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'PERMISSIONS_FORM_CREATE_STARTED',
      });

      axios.post('/permissions', { data: values }).then((res) => {
        dispatch({
          type: 'PERMISSIONS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Permissions created' });
        dispatch(push('/admin/permissions'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'PERMISSIONS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'PERMISSIONS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/permissions/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'PERMISSIONS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Permissions updated' });
        dispatch(push('/admin/permissions'));
      }
    } catch (error) {
      Errors.handle(error);
      showSnackbar({ type: 'error', message: 'Permissions update error' });
      dispatch({
        type: 'PERMISSIONS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
