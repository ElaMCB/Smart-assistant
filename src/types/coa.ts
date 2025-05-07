export interface CoA {
  id: string;
  productName: string;
  batchNumber: string;
  manufacturer: string;
  dateOfAnalysis: string;
  expiryDate: string;
  specifications: Specification[];
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Specification {
  parameter: string;
  method: string;
  result: string;
  unit: string;
  limits: {
    min?: number;
    max?: number;
  };
  status: 'Pass' | 'Fail' | 'N/A';
}

export interface CoAData {
  passRate: number;
  avgDeviation: number;
  processingTime: number;
  deadlineData: {
    timeRemaining: number;
    riskLevel: 'high' | 'medium' | 'low';
  };
  loadStatusData: {
    status: 'completed' | 'processing' | 'delayed';
    bottleneck: string | null;
    resourceUtilization: number;
  };
} 