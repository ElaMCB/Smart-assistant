import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import WebSocketService from '../services/WebSocketService';
import { MLService } from '../services/MLService';
import { CoAData } from '../types/coa';

const MLAnalytics: React.FC = () => {
  const [latestData, setLatestData] = useState<CoAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const wsService = new WebSocketService('ws://localhost:9000');
    const mlService = new MLService(wsService);

    const handleData = (data: CoAData) => {
      console.log('Received data:', data);
      setLatestData(data);
      setLoading(false);
      setError(null);
    };

    const handleError = (err: Error) => {
      console.error('WebSocket error:', err);
      setError(err.message);
      setLoading(false);
    };

    const handleOpen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setError(null);
    };

    const handleClose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      setError('Connection lost. Attempting to reconnect...');
      setTimeout(() => {
        wsService.close();
      }, 5000);
    };

    wsService.on('open', handleOpen);
    wsService.on('data', handleData);
    wsService.on('error', handleError);
    wsService.on('close', handleClose);

    return () => {
      wsService.off('open', handleOpen);
      wsService.off('data', handleData);
      wsService.off('error', handleError);
      wsService.off('close', handleClose);
      wsService.close();
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Connecting to server...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        {!connected && (
          <Typography color="text.secondary">
            Attempting to reconnect...
          </Typography>
        )}
      </Box>
    );
  }

  if (!latestData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Waiting for data...
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {!connected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Connection lost. Attempting to reconnect...
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ML Analysis Results
            </Typography>
            <Typography variant="body1" gutterBottom>
              Pass Rate Prediction: {latestData.passRate.toFixed(1)}%
            </Typography>
            <Typography variant="body1" gutterBottom>
              Average Deviation: {latestData.avgDeviation.toFixed(2)}%
            </Typography>
            <Typography variant="body1" gutterBottom>
              Processing Time: {latestData.processingTime.toFixed(1)}s
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Deadline Analysis
            </Typography>
            <Typography variant="body1" gutterBottom>
              Time Remaining: {latestData.deadlineData.timeRemaining.toFixed(1)}h
            </Typography>
            <Typography 
              color={
                latestData.deadlineData.riskLevel === 'high' 
                  ? 'error' 
                  : latestData.deadlineData.riskLevel === 'medium' 
                    ? 'warning.main' 
                    : 'success.main'
              }
            >
              Risk Level: {latestData.deadlineData.riskLevel}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Load Status Analysis
            </Typography>
            <Typography variant="body1" gutterBottom>
              Status: {latestData.loadStatusData.status}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Bottleneck: {latestData.loadStatusData.bottleneck || 'None'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Resource Utilization: {latestData.loadStatusData.resourceUtilization.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MLAnalytics; 