import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { EventEmitter } from 'events';

interface CoAData {
  passRate: number;
  avgDeviation: number;
  processingTime: number;
  timestamp: string;
  deadlineData: {
    timeRemaining: number;
    riskLevel: 'low' | 'medium' | 'high';
    historicalCompletionTime: number;
  };
  loadStatusData: {
    status: 'pending' | 'processing' | 'completed' | 'delayed';
    bottleneck: string | null;
    resourceUtilization: number;
  };
}

const app = express();
const server = createServer(app);
const PORT = 3007;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, '../../build')));

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/index.html'));
});

console.log(`WebSocket server is running on port ${PORT}`);

const wss = new WebSocketServer({ port: PORT });
const eventEmitter = new EventEmitter();

wss.on('connection', (ws) => {
  console.log('New client connected');

  const interval = setInterval(() => {
    const data = {
      passRate: Math.random() * 100,
      avgDeviation: Math.random() * 10,
      processingTime: Math.random() * 5,
      timestamp: new Date().toISOString(),
      deadlineData: {
        timeRemaining: Math.random() * 24,
        riskLevel: Math.random() > 0.5 ? 'high' : 'low',
        historicalCompletionTime: Math.random() * 20
      },
      loadStatusData: {
        status: Math.random() > 0.5 ? 'processing' : 'pending',
        bottleneck: Math.random() > 0.5 ? 'CPU' : null,
        resourceUtilization: Math.random() * 100
      }
    };
    ws.send(JSON.stringify(data));
  }, 2000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 