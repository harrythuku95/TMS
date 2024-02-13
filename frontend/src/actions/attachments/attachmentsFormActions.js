import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'ATTACHMENTS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'ATTACHMENTS_FORM_FIND_STARTED',
      });

      axios.get(`/attachments/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'ATTACHMENTS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ATTACHMENTS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/attachments'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'ATTACHMENTS_FORM_CREATE_STARTED',
      });

      axios.post('/attachments', { data: values }).then((res) => {
        dispatch({
          type: 'ATTACHMENTS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Attachments created' });
        dispatch(push('/admin/attachments'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ATTACHMENTS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'ATTACHMENTS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/attachments/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'ATTACHMENTS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Attachments updated' });
        dispatch(push('/admin/attachments'));
      }
    } catch (error) {
      Errors.handle(error);
      showSnackbar({ type: 'error', message: 'Attachments update error' });
      dispatch({
        type: 'ATTACHMENTS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
