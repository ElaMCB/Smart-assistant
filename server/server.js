const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, '../build')));

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

class CoADataSimulator {
  constructor() {
    this.basePassRate = 97;
    this.baseDeviation = 0.8;
    this.baseProcessingTime = 2.3;
    this.baseTimeRemaining = 24;
    this.bottlenecks = ['quality_check', 'documentation', 'approval', 'shipping', null];
  }

  getRandomNormal(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + stdDev * z;
  }

  calculateRiskLevel(timeRemaining, processingTime) {
    const ratio = timeRemaining / processingTime;
    if (ratio > 3) return 'low';
    if (ratio > 1.5) return 'medium';
    return 'high';
  }

  getRandomStatus() {
    const rand = Math.random();
    if (rand < 0.1) return 'delayed';
    if (rand < 0.3) return 'pending';
    if (rand < 0.8) return 'processing';
    return 'completed';
  }

  generateData() {
    const passRateVariation = this.getRandomNormal(0, 0.5);
    const deviationVariation = Math.abs(this.getRandomNormal(0, 0.1));
    const processingTimeVariation = Math.random() * 0.5;
    const timeRemainingVariation = Math.random() * 4 - 2;

    const passRate = Math.min(100, Math.max(90, this.basePassRate + passRateVariation));
    const avgDeviation = Math.max(0, this.baseDeviation + deviationVariation);
    const processingTime = Math.max(1, this.baseProcessingTime + processingTimeVariation);
    const timeRemaining = Math.max(0, this.baseTimeRemaining + timeRemainingVariation);

    const status = this.getRandomStatus();
    const bottleneck = this.bottlenecks[Math.floor(Math.random() * this.bottlenecks.length)];
    const resourceUtilization = Math.min(100, Math.max(0, 70 + Math.random() * 30));

    return {
      passRate,
      avgDeviation,
      processingTime,
      timestamp: new Date().toISOString(),
      deadlineData: {
        timeRemaining,
        riskLevel: this.calculateRiskLevel(timeRemaining, processingTime),
        historicalCompletionTime: this.baseProcessingTime,
      },
      loadStatusData: {
        status,
        bottleneck: status === 'processing' ? bottleneck : null,
        resourceUtilization,
      },
    };
  }
}

const simulator = new CoADataSimulator();

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send initial data
  const initialData = simulator.generateData();
  ws.send(JSON.stringify(initialData));

  // Set up interval for sending data
  const interval = setInterval(() => {
    try {
      const data = simulator.generateData();
      ws.send(JSON.stringify(data));
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 