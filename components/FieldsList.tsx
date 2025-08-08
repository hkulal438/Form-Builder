import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import type { RootState } from '../store/store';
import { updateField, deleteField } from '../store/formSlice';
import type { FormField } from '../types';
import FieldEditor from './FieldEditor';

const FieldsList: React.FC = () => {
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state: RootState) => state.form);
  const [editingField, setEditingField] = useState<{ field: FormField; index: number } | null>(null);

  const handleEditField = (field: FormField, index: number) => {
    setEditingField({ field, index });
  };

  const handleUpdateField = (updatedField: FormField) => {
    if (editingField) {
      dispatch(updateField({ index: editingField.index, field: updatedField }));
      setEditingField(null);
    }
  };

  const handleDeleteField = (index: number) => {
    dispatch(deleteField(index));
  };

  const getFieldTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      text: 'primary',
      number: 'secondary',
      textarea: 'info',
      select: 'success',
      radio: 'warning',
      checkbox: 'error',
      date: 'default',
    };
    return colors[type] || 'default';
  };

  if (!currentForm?.fields.length) {
    return null;
  }

  return (
    <Box sx={{ mt: 3, px: 2 }}>
      <Grid container spacing={2}>
        {currentForm.fields.map((field, index) => (
          <Grid item xs={12} key={field.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                boxShadow: 1,
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                  {/* Field Left */}
                  <Box display="flex" gap={2} flex={1}>
                    <IconButton size="small" disabled sx={{ mt: 0.5 }}>
                      <DragIcon />
                    </IconButton>

                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {field.label}
                      </Typography>

                      <Box
                        display="flex"
                        flexWrap="wrap"
                        gap={1}
                        mt={1}
                        alignItems="center"
                      >
                        <Chip
                          size="small"
                          label={field.type}
                          color={getFieldTypeColor(field.type) as any}
                          variant="outlined"
                        />
                        {field.required && (
                          <Chip size="small" label="Required" color="error" variant="outlined" />
                        )}
                        {field.isDerived && (
                          <Chip size="small" label="Derived" color="info" variant="outlined" />
                        )}
                        {field.validations.length > 0 && (
                          <Chip
                            size="small"
                            label={`${field.validations.length} validation${field.validations.length > 1 ? 's' : ''}`}
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {/* Field Options */}
                      {field.options && field.options.length > 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Options: {field.options.slice(0, 3).join(', ')}
                          {field.options.length > 3 && '...'}
                        </Typography>
                      )}

                      {/* Derived Formula */}
                      {field.isDerived && field.derivedFormula && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Formula: <strong>{field.derivedFormula}</strong>
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditField(field, index)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteField(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Field Dialog */}
      <Dialog
        open={!!editingField}
        onClose={() => setEditingField(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Field</DialogTitle>
        <DialogContent>
          {editingField && (
            <FieldEditor
              field={editingField.field}
              onSave={handleUpdateField}
              onCancel={() => setEditingField(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FieldsList;
