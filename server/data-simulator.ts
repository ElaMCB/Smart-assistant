export class CoADataSimulator {
  private basePassRate = 97;
  private baseDeviation = 0.8;
  private baseProcessingTime = 2.3;
  private baseTimeRemaining = 24;
  private bottlenecks = ['quality_check', 'documentation', 'approval', 'shipping', null];

  private getRandomNormal(mean: number, stdDev: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + stdDev * z;
  }

  private calculateRiskLevel(timeRemaining: number, processingTime: number): 'low' | 'medium' | 'high' {
    const ratio = timeRemaining / processingTime;
    if (ratio > 3) return 'low';
    if (ratio > 1.5) return 'medium';
    return 'high';
  }

  private getRandomStatus(): 'pending' | 'processing' | 'completed' | 'delayed' {
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