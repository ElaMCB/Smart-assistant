import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AIAssistant from '../components/AIAssistant';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              CoA Dashboard
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <AnalyticsDashboard />
        </Grid>

        <Grid item xs={12}>
          <AIAssistant />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 