export const getStatusColor = (status, theme) => {
  const statusLower = status?.toLowerCase() || '';

  if (statusLower.includes('pending')) {
    return theme.palette.custom.statusPending;
  }
  if (statusLower.includes('progress') || statusLower.includes('open')) {
    return theme.palette.custom.statusInProgress;
  }
  if (statusLower.includes('resolved') || statusLower.includes('completed')) {
    return theme.palette.custom.statusResolved;
  }
  if (statusLower.includes('closed')) {
    return theme.palette.custom.statusClosed;
  }

  return theme.palette.grey[500];
};
