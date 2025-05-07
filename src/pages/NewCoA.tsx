import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CoA, Specification } from '../types/coa';

const NewCoA: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<CoA>>({
    productName: '',
    batchNumber: '',
    manufacturer: '',
    dateOfAnalysis: '',
    expiryDate: '',
    specifications: [],
  });

  const [newSpec, setNewSpec] = useState<Partial<Specification>>({
    parameter: '',
    method: '',
    result: '',
    unit: '',
    limits: { min: undefined, max: undefined },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'min' || name === 'max') {
      setNewSpec((prev) => ({
        ...prev,
        limits: { ...prev.limits, [name]: value ? parseFloat(value) : undefined },
      }));
    } else {
      setNewSpec((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSpec = () => {
    if (
      newSpec.parameter &&
      newSpec.method &&
      newSpec.result &&
      newSpec.unit
    ) {
      const spec: Specification = {
        ...newSpec,
        status: 'Pass', // Default status
      } as Specification;

      setFormData((prev) => ({
        ...prev,
        specifications: [...(prev.specifications || []), spec],
      }));

      setNewSpec({
        parameter: '',
        method: '',
        result: '',
        unit: '',
        limits: { min: undefined, max: undefined },
      });
    }
  };

  const handleRemoveSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send the data to your backend
    console.log('Submitting CoA:', formData);
    navigate('/');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">New Certificate of Analysis</Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Batch Number"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Analysis"
                name="dateOfAnalysis"
                type="date"
                value={formData.dateOfAnalysis}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Specifications
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Parameter"
                name="parameter"
                value={newSpec.parameter}
                onChange={handleSpecChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Method"
                name="method"
                value={newSpec.method}
                onChange={handleSpecChange}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Result"
                name="result"
                value={newSpec.result}
                onChange={handleSpecChange}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Unit"
                name="unit"
                value={newSpec.unit}
                onChange={handleSpecChange}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                onClick={handleAddSpec}
                disabled={
                  !newSpec.parameter ||
                  !newSpec.method ||
                  !newSpec.result ||
                  !newSpec.unit
                }
              >
                Add
              </Button>
            </Grid>
          </Grid>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Parameter</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.specifications?.map((spec, index) => (
                  <TableRow key={index}>
                    <TableCell>{spec.parameter}</TableCell>
                    <TableCell>{spec.method}</TableCell>
                    <TableCell>{spec.result}</TableCell>
                    <TableCell>{spec.unit}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveSpec(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formData.specifications?.length}
            >
              Create CoA
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default NewCoA; 