import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'WEBHOOKS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'WEBHOOKS_FORM_FIND_STARTED',
      });

      axios.get(`/webhooks/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'WEBHOOKS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'WEBHOOKS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/webhooks'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'WEBHOOKS_FORM_CREATE_STARTED',
      });

      axios.post('/webhooks', { data: values }).then((res) => {
        dispatch({
          type: 'WEBHOOKS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Webhooks created' });
        dispatch(push('/admin/webhooks'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'WEBHOOKS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'WEBHOOKS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/webhooks/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'WEBHOOKS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Webhooks updated' });
        dispatch(push('/admin/webhooks'));
      }
    } catch (error) {
      Errors.handle(error);
      showSnackbar({ type: 'error', message: 'Webhooks update error' });
      dispatch({
        type: 'WEBHOOKS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
