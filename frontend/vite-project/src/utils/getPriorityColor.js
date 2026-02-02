export const getPriorityColor = (priority, theme) => {
  const priorityLower = priority?.toLowerCase() || '';

  if (priorityLower === 'high' || priorityLower === 'urgent') {
    return theme.palette.custom.priorityHigh;
  }
  if (priorityLower === 'medium' || priorityLower === 'normal') {
    return theme.palette.custom.priorityMedium;
  }
  if (priorityLower === 'low') {
    return theme.palette.custom.priorityLow;
  }

  return theme.palette.grey[500];
};
