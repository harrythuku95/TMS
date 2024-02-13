const initialData = {
  findLoading: false,
  saveLoading: false,
  record: null,
};

export default (state = initialData, { type, payload }) => {
  if (type === 'TICKET_COUNTS_FORM_RESET') {
    return {
      ...initialData,
    };
  }

  if (type === 'TICKET_COUNTS_FORM_FIND_STARTED') {
    return {
      ...state,
      record: null,
      findLoading: true,
    };
  }

  if (type === 'TICKET_COUNTS_FORM_FIND_SUCCESS') {
    return {
      ...state,
      record: payload,
      findLoading: false,
    };
  }

  if (type === 'TICKET_COUNTS_FORM_FIND_ERROR') {
    return {
      ...state,
      record: null,
      findLoading: false,
    };
  }

  if (type === 'TICKET_COUNTS_FORM_CREATE_STARTED') {
    return {
      ...state,
      saveLoading: true,
    };
  }

  if (type === 'TICKET_COUNTS_FORM_CREATE_SUCCESS') {
    return {
      ...state,
      saveLoading: false,
    };
  }

  if (type === 'TICKET_COUNTS_FORM_CREATE_ERROR') {
    return {
      ...state,
      saveLoading: false,
    };
  }

  if (type === 'TICKET_COUNTS_FORM_UPDATE_STARTED') {
    return {
      ...state,
      saveLoading: true,
    };
  }

  if (type === 'TICKET_COUNTS_FORM_UPDATE_SUCCESS') {
    return {
      ...state,
      saveLoading: false,
    };
  }

  if (type === 'TICKET_COUNTS_FORM_UPDATE_ERROR') {
    return {
      ...state,
      saveLoading: false,
    };
  }

  return state;
};
