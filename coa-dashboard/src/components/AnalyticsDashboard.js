import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import * as tf from '@tensorflow/tfjs';
import { tfvis } from '@tensorflow/tfjs-vis';

const AnalyticsDashboard = () => {
  const [model, setModel] = useState(null);
  const [trainingData, setTrainingData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isTraining, setIsTraining] = useState(false);

  // Sample data for demonstration
  const generateSampleData = () => {
    const x = [];
    const y = [];
    for (let i = 0; i < 100; i++) {
      x.push(i);
      y.push(Math.sin(i * 0.1) + Math.random() * 0.2);
    }
    return { x, y };
  };

  // Create and train a simple neural network
  const createModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [1] }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    return model;
  };

  const trainModel = async () => {
    setIsTraining(true);
    const data = generateSampleData();
    setTrainingData(data);

    const model = createModel();
    setModel(model);

    // Convert data to tensors
    const xs = tf.tensor1d(data.x);
    const ys = tf.tensor1d(data.y);

    // Train the model
    await model.fit(xs, ys, {
      epochs: 50,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
        }
      }
    });

    // Generate predictions
    const predictions = model.predict(tf.tensor1d(data.x));
    setPredictions(Array.from(predictions.dataSync()));
    setIsTraining(false);
  };

  // Chart data for visualization
  const chartData = {
    labels: trainingData?.x || [],
    datasets: [
      {
        label: 'Actual Data',
        data: trainingData?.y || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Predictions',
        data: predictions,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Neural Network Predictions'
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Neural Network Analytics
            </Typography>
            <Button 
              variant="contained" 
              onClick={trainModel}
              disabled={isTraining}
              sx={{ mb: 2 }}
            >
              {isTraining ? 'Training...' : 'Train Model'}
            </Button>
            <Box sx={{ height: 400 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Model Architecture
            </Typography>
            <Typography variant="body2">
              {model ? 'Model trained successfully!' : 'No model trained yet.'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Training Metrics
            </Typography>
            <Typography variant="body2">
              {isTraining ? 'Training in progress...' : 'Training completed.'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard; 