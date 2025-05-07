import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from '@mui/material';
import { CoA } from '../types/coa';

// Mock data for demonstration
const mockCoA: CoA = {
  id: '1',
  productName: 'Product A',
  batchNumber: 'BATCH001',
  manufacturer: 'Manufacturer X',
  dateOfAnalysis: '2023-04-01',
  expiryDate: '2024-04-01',
  specifications: [
    {
      parameter: 'pH',
      method: 'USP <791>',
      result: '6.5',
      unit: 'pH units',
      limits: { min: 6.0, max: 7.0 },
      status: 'Pass',
    },
    {
      parameter: 'Assay',
      method: 'HPLC',
      result: '99.8',
      unit: '%',
      limits: { min: 98.0, max: 102.0 },
      status: 'Pass',
    },
  ],
  status: 'Approved',
};

const CoADetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real application, you would fetch the CoA data based on the id
  const coa = mockCoA;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Certificate of Analysis Details</Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Basic Information</Typography>
          <Chip
            label={coa.status}
            color={getStatusColor(coa.status) as any}
          />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Typography>
            <strong>Product Name:</strong> {coa.productName}
          </Typography>
          <Typography>
            <strong>Batch Number:</strong> {coa.batchNumber}
          </Typography>
          <Typography>
            <strong>Manufacturer:</strong> {coa.manufacturer}
          </Typography>
          <Typography>
            <strong>Date of Analysis:</strong> {coa.dateOfAnalysis}
          </Typography>
          <Typography>
            <strong>Expiry Date:</strong> {coa.expiryDate}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Specifications
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parameter</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Limits</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coa.specifications.map((spec, index) => (
                <TableRow key={index}>
                  <TableCell>{spec.parameter}</TableCell>
                  <TableCell>{spec.method}</TableCell>
                  <TableCell>{spec.result}</TableCell>
                  <TableCell>{spec.unit}</TableCell>
                  <TableCell>
                    {spec.limits.min !== undefined && spec.limits.max !== undefined
                      ? `${spec.limits.min} - ${spec.limits.max}`
                      : spec.limits.min !== undefined
                      ? `≥ ${spec.limits.min}`
                      : spec.limits.max !== undefined
                      ? `≤ ${spec.limits.max}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={spec.status}
                      color={spec.status === 'Pass' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CoADetails; 