import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { RootState } from '../store/store';
import { loadForm, createNewForm } from '../store/formSlice';

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedForms } = useSelector((state: RootState) => state.form as { savedForms: any[] });

  const handleCreateNew = () => {
    dispatch(createNewForm());
    navigate('/create');
  };

  const handleOpenForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/preview');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Forms
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          Create New Form
        </Button>
      </Box>

      {savedForms.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" gutterBottom>
              No forms created yet
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Start building your first form by clicking the "Create New Form" button above.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              sx={{ mt: 2 }}
            >
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Saved Forms ({savedForms.length})
                </Typography>
                <List>
                  {savedForms.map((form, index) => (
                    <React.Fragment key={form.id}>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => handleOpenForm(form.id)}>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="subtitle1">
                                  {form.name}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={`${form.fields.length} fields`}
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                Created: {formatDate(form.createdAt)}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      {index < savedForms.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MyForms;