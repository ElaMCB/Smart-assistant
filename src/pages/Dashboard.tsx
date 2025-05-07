import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import Analytics from '../components/Analytics';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Certificate of Analysis Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and analyze your CoA processing metrics
        </Typography>
      </Paper>
      
      <Analytics />
    </Container>
  );
};

export default Dashboard; 