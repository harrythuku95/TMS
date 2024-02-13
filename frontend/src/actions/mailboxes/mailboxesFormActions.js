import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'MAILBOXES_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'MAILBOXES_FORM_FIND_STARTED',
      });

      axios.get(`/mailboxes/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'MAILBOXES_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'MAILBOXES_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/mailboxes'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'MAILBOXES_FORM_CREATE_STARTED',
      });

      axios.post('/mailboxes', { data: values }).then((res) => {
        dispatch({
          type: 'MAILBOXES_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Mailboxes created' });
        dispatch(push('/admin/mailboxes'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'MAILBOXES_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'MAILBOXES_FORM_UPDATE_STARTED',
      });

      await axios.put(`/mailboxes/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'MAILBOXES_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Mailboxes updated' });
        dispatch(push('/admin/mailboxes'));
      }
    } catch (error) {
      Errors.handle(error);
      showSnackbar({ type: 'error', message: 'Mailboxes update error' });
      dispatch({
        type: 'MAILBOXES_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
