import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import type { FormField, ValidationRule } from '../types';

interface FieldEditorProps {
  field?: FormField;
  onSave: (field: FormField) => void;
  onCancel: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onSave, onCancel }) => {
  const [fieldData, setFieldData] = useState<FormField>({
    id: field?.id || Math.random().toString(36).substr(2, 9),
    type: field?.type || 'text',
    label: field?.label || '',
    required: field?.required || false,
    defaultValue: field?.defaultValue || '',
    validations: field?.validations || [],
    options: field?.options || [],
    isDerived: field?.isDerived || false,
    derivedFrom: field?.derivedFrom || [],
    derivedFormula: field?.derivedFormula || '',
  });

  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [newValidation, setNewValidation] = useState<ValidationRule>({
    type: 'required',
    message: '',
  });
  const [optionsText, setOptionsText] = useState(fieldData.options?.join('\n') || '');
  const [error, setError] = useState('');

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
  ];

  const validationTypes = [
    { value: 'required', label: 'Required' },
    { value: 'minLength', label: 'Minimum Length' },
    { value: 'maxLength', label: 'Maximum Length' },
    { value: 'email', label: 'Email Format' },
    { value: 'password', label: 'Password (8+ chars, 1 number)' },
  ];

  const handleSave = () => {
    if (!fieldData.label.trim()) {
      setError('Label is required');
      return;
    }

    if (['select', 'radio', 'checkbox'].includes(fieldData.type) && !optionsText.trim()) {
      setError('Options are required for this field type');
      return;
    }

    const updatedField: FormField = {
      ...fieldData,
      options: ['select', 'radio', 'checkbox'].includes(fieldData.type)
        ? optionsText.split('\n').filter(opt => opt.trim())
        : undefined,
    };

    onSave(updatedField);
  };

  const addValidation = () => {
    if (!newValidation.message.trim()) return;

    setFieldData(prev => ({
      ...prev,
      validations: [...prev.validations, { ...newValidation }],
    }));

    setNewValidation({ type: 'required', message: '' });
    setShowValidationDialog(false);
  };

  const removeValidation = (index: number) => {
    setFieldData(prev => ({
      ...prev,
      validations: prev.validations.filter((_, i) => i !== index),
    }));
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {field ? 'Edit Field' : 'Add New Field'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Field Type</InputLabel>
            <Select
              value={fieldData.type}
              label="Field Type"
              onChange={(e) =>
                setFieldData({ ...fieldData, type: e.target.value as any })
              }
            >
              {fieldTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Field Label"
            value={fieldData.label}
            onChange={(e) =>
              setFieldData({ ...fieldData, label: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={fieldData.required}
                onChange={(e) =>
                  setFieldData({ ...fieldData, required: e.target.checked })
                }
              />
            }
            label="Required Field"
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={fieldData.isDerived}
                onChange={(e) =>
                  setFieldData({ ...fieldData, isDerived: e.target.checked })
                }
              />
            }
            label="Derived Field"
          />
        </Grid>

        {!fieldData.isDerived && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Default Value"
              value={fieldData.defaultValue}
              onChange={(e) =>
                setFieldData({ ...fieldData, defaultValue: e.target.value })
              }
            />
          </Grid>
        )}

        {fieldData.isDerived && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Derived Formula (e.g., field1 + field2)"
              value={fieldData.derivedFormula}
              onChange={(e) =>
                setFieldData({ ...fieldData, derivedFormula: e.target.value })
              }
              helperText="Simple math operations supported: +, -, *, /"
            />
          </Grid>
        )}

        {['select', 'radio', 'checkbox'].includes(fieldData.type) && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Options (one per line)"
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              helperText="Enter each option on a new line"
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="secondary">
              Validations
            </Typography>
            <Button variant="outlined" onClick={() => setShowValidationDialog(true)}>
              Add Validation
            </Button>
          </Box>

          <Box mt={2}>
            {fieldData.validations.map((validation, index) => (
              <Chip
                key={index}
                label={`${validation.type}: ${validation.message}`}
                onDelete={() => removeValidation(index)}
                sx={{ mr: 1, mb: 1 }}
                color="info"
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Field
        </Button>
      </Box>

      {/* Add Validation Dialog */}
      <Dialog
        open={showValidationDialog}
        onClose={() => setShowValidationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Validation Rule</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Validation Type</InputLabel>
                <Select
                  value={newValidation.type}
                  label="Validation Type"
                  onChange={(e) =>
                    setNewValidation({
                      ...newValidation,
                      type: e.target.value as any,
                    })
                  }
                >
                  {validationTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {['minLength', 'maxLength'].includes(newValidation.type) && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Length Value"
                  value={newValidation.value || ''}
                  onChange={(e) =>
                    setNewValidation({
                      ...newValidation,
                      value: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Error Message"
                value={newValidation.message}
                onChange={(e) =>
                  setNewValidation({
                    ...newValidation,
                    message: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowValidationDialog(false)}>Cancel</Button>
          <Button onClick={addValidation} variant="contained">
            Add Validation
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FieldEditor;
