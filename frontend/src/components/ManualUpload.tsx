import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';

const ManualUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [machineType, setMachineType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file || !machineType) {
      setError('Please select a file and machine type');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('manual', file);
    formData.append('machineType', machineType);

    try {
      const response = await axios.post('http://localhost:5050/api/upload/manual', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`Manual uploaded successfully! Extracted ${response.data.extractedItems} troubleshooting items.`);
      setFile(null);
      setMachineType('');
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Machine Manual
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Troubleshooting Knowledge
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload machine manuals (PDF or Word documents) to expand the troubleshooting database.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Machine Type</InputLabel>
              <Select
                value={machineType}
                onChange={(e) => setMachineType(e.target.value)}
                label="Machine Type"
              >
                <MenuItem value="cross-conveyor">Cross Conveyor Machine</MenuItem>
                <MenuItem value="sandwiching">Sandwiching Machine</MenuItem>
                <MenuItem value="auto-feeder">Auto Feeder Machine</MenuItem>
                <MenuItem value="slug-loader">Slug Loader Machine</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="manual-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="manual-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  {file ? file.name : 'Select Manual File (PDF, DOC, DOCX)'}
                </Button>
              </label>
            </Box>

            {uploading && <LinearProgress />}

            <Button
              variant="contained"
              size="large"
              onClick={handleUpload}
              disabled={!file || !machineType || uploading}
            >
              {uploading ? 'Processing...' : 'Upload Manual'}
            </Button>
          </Box>

          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManualUpload;
