import Errors from 'components/FormItems/error/errors';
import axios from 'axios';
import queryString from 'query-string';

async function list(filter) {
  const response = await axios.get(
    filter
      ? `/ticket_counts?page=${filter.page}&limit=${filter.limit}

    &ticket_counts=${filter.ticket_counts ? filter.ticket_counts : ''}
    &${queryString.stringify(filter.orderBy)}${filter.request}`
      : `/ticket_counts`,
  );
  return response.data;
}

async function filterTicket_counts(request, filter) {
  const response = await axios.get(
    `/ticket_counts?page=${filter.page}&limit=${filter.limit}${request}`,
  );
  return response.data;
}

export const actions = {
  doFilter: (request, filter) => async (dispatch, getState) => {
    try {
      const response = await filterTicket_counts(request, filter);

      dispatch({
        type: 'TICKET_COUNTS_LIST_FILTERED',
        payload: {
          rows: response.rows,
          count: response.count,
        },
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: 'TICKET_COUNTS_LIST_FETCH_ERROR',
      });
    }
  },

  doFetch:
    (filter, keepPagination = false) =>
    async (dispatch, getState) => {
      try {
        dispatch({
          type: 'TICKET_COUNTS_LIST_FETCH_STARTED',
          payload: { filter, keepPagination },
        });

        const response = await list(filter);

        dispatch({
          type: 'TICKET_COUNTS_LIST_FETCH_SUCCESS',
          payload: {
            rows: response.rows,
            count: response.count,
          },
        });
      } catch (error) {
        Errors.handle(error);

        dispatch({
          type: 'TICKET_COUNTS_LIST_FETCH_ERROR',
        });
      }
    },

  doDelete: (filter, id) => async (dispatch) => {
    try {
      dispatch({
        type: 'TICKET_COUNTS_LIST_DELETE_STARTED',
      });

      await axios.delete(`/ticket_counts/${id}`);

      dispatch({
        type: 'TICKET_COUNTS_LIST_DELETE_SUCCESS',
      });

      const response = await list(filter);
      dispatch({
        type: 'TICKET_COUNTS_LIST_FETCH_SUCCESS',
        payload: {
          rows: response.rows,
          count: response.count,
        },
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'TICKET_COUNTS_LIST_DELETE_ERROR',
      });
    }
  },
  doOpenConfirm: (id) => async (dispatch) => {
    dispatch({
      type: 'TICKET_COUNTS_LIST_OPEN_CONFIRM',
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => async (dispatch) => {
    dispatch({
      type: 'TICKET_COUNTS_LIST_CLOSE_CONFIRM',
    });
  },
};

export default actions;
