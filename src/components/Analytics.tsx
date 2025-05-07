import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';

// Mock data - replace with real data in production
const mockData = {
  totalCoas: 156,
  approvalRate: 92,
  averageProcessingTime: 2.4,
  pendingReviews: 8,
  recentActivity: [
    { id: 1, status: 'Approved', product: 'Product A', date: '2024-03-15' },
    { id: 2, status: 'Pending', product: 'Product B', date: '2024-03-14' },
    { id: 3, status: 'Approved', product: 'Product C', date: '2024-03-13' },
  ]
};

const Analytics: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total CoAs
            </Typography>
            <Typography variant="h3">
              {mockData.totalCoas}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Approval Rate
            </Typography>
            <Typography variant="h3">
              {mockData.approvalRate}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={mockData.approvalRate} 
              sx={{ mt: 2 }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Avg. Processing Time
            </Typography>
            <Typography variant="h3">
              {mockData.averageProcessingTime}h
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Pending Reviews
            </Typography>
            <Typography variant="h3">
              {mockData.pendingReviews}
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Grid container spacing={2}>
              {mockData.recentActivity.map((activity) => (
                <Grid item xs={12} md={4} key={activity.id}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        {activity.date}
                      </Typography>
                      <Typography variant="h6">
                        {activity.product}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: activity.status === 'Approved' ? 'success.main' : 'warning.main'
                        }}
                      >
                        {activity.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 