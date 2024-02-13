import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'AGENTS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'AGENTS_FORM_FIND_STARTED',
      });

      axios.get(`/agents/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'AGENTS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'AGENTS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/agents'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'AGENTS_FORM_CREATE_STARTED',
      });

      axios.post('/agents', { data: values }).then((res) => {
        dispatch({
          type: 'AGENTS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Agents created' });
        dispatch(push('/admin/agents'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'AGENTS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'AGENTS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/agents/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'AGENTS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Agents updated' });
        dispatch(push('/admin/agents'));
      }
    } catch (error) {
      Errors.handle(error);
      showSnackbar({ type: 'error', message: 'Agents update error' });
      dispatch({
        type: 'AGENTS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
