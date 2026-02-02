import React from 'react';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const StatusBadge = ({ status }) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';

    if (statusLower.includes('pending')) {
      return {
        bg: theme.palette.custom.statusPending,
        text: '#ffffff',
      };
    }
    if (statusLower.includes('progress') || statusLower.includes('open')) {
      return {
        bg: theme.palette.custom.statusInProgress,
        text: '#ffffff',
      };
    }
    if (statusLower.includes('resolved') || statusLower.includes('completed')) {
      return {
        bg: theme.palette.custom.statusResolved,
        text: '#ffffff',
      };
    }
    if (statusLower.includes('closed')) {
      return {
        bg: theme.palette.custom.statusClosed,
        text: '#ffffff',
      };
    }

    return {
      bg: theme.palette.grey[500],
      text: '#ffffff',
    };
  };

  const colors = getStatusColor(status);

  return (
    <Chip
      label={status}
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

export default StatusBadge;
