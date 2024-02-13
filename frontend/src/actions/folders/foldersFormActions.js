import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'FOLDERS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'FOLDERS_FORM_FIND_STARTED',
      });

      axios.get(`/folders/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'FOLDERS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'FOLDERS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/folders'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'FOLDERS_FORM_CREATE_STARTED',
      });

      axios.post('/folders', { data: values }).then((res) => {
        dispatch({
          type: 'FOLDERS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Folders created' });
        dispatch(push('/admin/folders'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'FOLDERS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'FOLDERS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/folders/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'FOLDERS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Folders updated' });
        dispatch(push('/admin/folders'));
      }
    } catch (error) {
      Errors.handle(error);
      showSnackbar({ type: 'error', message: 'Folders update error' });
      dispatch({
        type: 'FOLDERS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
