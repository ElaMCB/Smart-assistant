import React from 'react';
import { Box, Typography } from '@mui/material';

const CompanyLogo: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: '#1976d2',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Co. logo
      </Typography>
    </Box>
  );
};

export default CompanyLogo; 