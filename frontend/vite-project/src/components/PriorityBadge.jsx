import React from 'react';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const PriorityBadge = ({ priority }) => {
  const theme = useTheme();

  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase() || '';

    if (priorityLower === 'high' || priorityLower === 'urgent') {
      return {
        bg: theme.palette.custom.priorityHigh,
        text: '#ffffff',
      };
    }
    if (priorityLower === 'medium' || priorityLower === 'normal') {
      return {
        bg: theme.palette.custom.priorityMedium,
        text: '#ffffff',
      };
    }
    if (priorityLower === 'low') {
      return {
        bg: theme.palette.custom.priorityLow,
        text: '#ffffff',
      };
    }

    return {
      bg: theme.palette.grey[500],
      text: '#ffffff',
    };
  };

  const colors = getPriorityColor(priority);

  return (
    <Chip
      label={priority}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    />
  );
};

export default PriorityBadge;
