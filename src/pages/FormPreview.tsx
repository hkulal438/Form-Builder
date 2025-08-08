import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import type { RootState } from '../store/store';
import { initializeFormData } from '../store/formSlice';
import DynamicForm from '../components/DynamicForm';

const FormPreview: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm } = useSelector((state: RootState) => state.form);

  useEffect(() => {
    if (currentForm) {
      dispatch(initializeFormData());
    }
  }, [dispatch, currentForm]);

  if (!currentForm) {
    return (
      <Box>
        <Alert severity="warning">
          No form to preview. Please create a form first.
        </Alert>
        <Button
          onClick={() => navigate('/create')}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Create Form
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Form Preview
        </Typography>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/create')}
        >
          Back to Builder
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {currentForm.name || 'Untitled Form'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This is how your form will appear to end users
          </Typography>
          
          <Box mt={3}>
            <DynamicForm />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FormPreview;