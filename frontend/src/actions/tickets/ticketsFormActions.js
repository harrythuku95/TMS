import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'TICKETS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'TICKETS_FORM_FIND_STARTED',
      });

      axios.get(`/tickets/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'TICKETS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'TICKETS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/tickets'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'TICKETS_FORM_CREATE_STARTED',
      });

      axios.post('/tickets', { data: values }).then((res) => {
        dispatch({
          type: 'TICKETS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Tickets created' });
        dispatch(push('/admin/tickets'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'TICKETS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'TICKETS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/tickets/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'TICKETS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Tickets updated' });
        dispatch(push('/admin/tickets'));
      }
    } catch (error) {
      Errors.handle(error);
      showSnackbar({ type: 'error', message: 'Tickets update error' });
      dispatch({
        type: 'TICKETS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
