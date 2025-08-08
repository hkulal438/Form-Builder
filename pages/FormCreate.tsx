import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';

import type { RootState } from '../store/store';
import { createNewForm, addField, saveForm } from '../store/formSlice';
import type { FormField } from '../types';
import FieldEditor from '../components/FieldEditor';
import FieldsList from '../components/FieldsList';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const FormCreate: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm } = useSelector((state: RootState) => state.form);

  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [formName, setFormName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentForm) {
      dispatch(createNewForm());
    }
  }, [dispatch, currentForm]);

  const handleAddField = (field: FormField) => {
    dispatch(addField(field));
    setShowFieldDialog(false);
  };

  const handleSaveForm = () => {
    if (!formName.trim()) {
      setError('Form name is required');
      return;
    }
    if (!currentForm?.fields.length) {
      setError('Form must have at least one field');
      return;
    }

    dispatch(saveForm(formName));
    setShowSaveDialog(false);
    setFormName('');
    setError('');
    navigate('/myforms');
  };

  const handlePreview = () => {
    if (!currentForm?.fields.length) {
      setError('Form must have at least one field');
      return;
    }
    navigate('/preview');
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
      transition={{ duration: 0.4 }}
      style={{ padding: '2rem', maxWidth: 900, margin: 'auto' }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDirection={{ xs: 'column', sm: 'row' }} // Stack vertically on xs
        gap={2} // spacing between rows or columns
      >
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Form Builder
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/myforms')}
            color="secondary"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Back to My Forms
          </Button>

          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
            disabled={!currentForm?.fields.length}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Preview
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => setShowSaveDialog(true)}
            disabled={!currentForm?.fields.length}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Save Form
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.primary" fontWeight={600}>
                Form Fields ({currentForm?.fields.length || 0})
              </Typography>

              {!currentForm?.fields.length ? (
                <Box textAlign="center" py={5}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    No fields added yet. Click the + button to add your first field.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowFieldDialog(true)}
                  >
                    Add First Field
                  </Button>
                </Box>
              ) : (
                <FieldsList />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Fab
        color="primary"
        aria-label="add field"
        sx={{ position: 'fixed', bottom: 32, right: 32, boxShadow: 4 }}
        onClick={() => setShowFieldDialog(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={showFieldDialog}
        onClose={() => setShowFieldDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Field</DialogTitle>
        <DialogContent>
          <FieldEditor onSave={handleAddField} onCancel={() => setShowFieldDialog(false)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            error={!!error && !formName.trim()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default FormCreate;
