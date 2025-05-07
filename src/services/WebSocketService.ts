import { EventEmitter } from 'events';
import { WebSocket } from 'ws';

interface CoAData {
  passRate: number;
  avgDeviation: number;
  processingTime: number;
  timestamp: string;
  deadlineData: {
    timeRemaining: number;
    riskLevel: string;
    historicalCompletionTime: number;
  };
  loadStatusData: {
    status: string;
    bottleneck: string | null;
    resourceUtilization: number;
  };
}

export class WebSocketService extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected to WebSocket server');
      this.emit('open');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as CoAData;
        this.emit('data', data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        this.emit('error', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.emit('close');
    };
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
} 