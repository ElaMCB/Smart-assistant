import * as tf from '@tensorflow/tfjs';

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

export class MLService {
  private model: tf.Sequential | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  async initialize() {
    if (this.isInitialized) return;

    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [6], units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.isInitialized = true;
  }

  private preprocessData(data: CoAData): tf.Tensor {
    const features = [
      data.passRate / 100,
      data.avgDeviation / 10,
      data.processingTime / 5,
      data.deadlineData.timeRemaining / 24,
      data.deadlineData.historicalCompletionTime / 20,
      data.loadStatusData.resourceUtilization / 100
    ];

    return tf.tensor2d([features]);
  }

  async predict(data: CoAData): Promise<number> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const input = this.preprocessData(data);
    const prediction = this.model!.predict(input) as tf.Tensor;
    const result = await prediction.data();
    input.dispose();
    prediction.dispose();

    return result[0];
  }

  public async trainModel(data: CoAData[]): Promise<void> {
    if (!this.isInitialized || !this.model) {
      await this.initialize();
    }

    try {
      const features = data.map(d => this.preprocessData(d));
      const labels = data.map(d => d.passRate > 90 ? 1 : 0); // Simple binary classification

      const xs = tf.concat(features);
      const ys = tf.tensor1d(labels);

      await this.model!.fit(xs, ys, {
        epochs: 10,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch: number, logs: tf.Logs | undefined) => {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
          }
        }
      });

      // Clean up tensors
      tf.dispose([xs, ys]);
      features.forEach(t => t.dispose());
    } catch (error) {
      console.error('Error training model:', error);
    }
  }
} 