import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'TICKET_LABELS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'TICKET_LABELS_FORM_FIND_STARTED',
      });

      axios.get(`/ticket_labels/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'TICKET_LABELS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'TICKET_LABELS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/ticket_labels'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'TICKET_LABELS_FORM_CREATE_STARTED',
      });

      axios.post('/ticket_labels', { data: values }).then((res) => {
        dispatch({
          type: 'TICKET_LABELS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Ticket_labels created' });
        dispatch(push('/admin/ticket_labels'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'TICKET_LABELS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'TICKET_LABELS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/ticket_labels/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'TICKET_LABELS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Ticket_labels updated' });
        dispatch(push('/admin/ticket_labels'));
      }
    } catch (error) {
      Errors.handle(error);
      showSnackbar({ type: 'error', message: 'Ticket_labels update error' });
      dispatch({
        type: 'TICKET_LABELS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
