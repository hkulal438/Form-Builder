import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormGroup,
  Checkbox,
  Typography,
  Grid,
  Button,
  Alert,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { RootState } from "../store/store";
import { updateFormData, setValidationError } from "../store/formSlice";
import type { FormField } from "../types";

const DynamicForm: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // small screens/mobile

  const { currentForm, formData, validationErrors } = useSelector(
    (state: RootState) => state.form as {
      currentForm: any;
      formData: any;
      validationErrors: any;
    }
  );

  const validateField = (field: FormField, value: any): string | null => {
    for (const validation of field.validations) {
      switch (validation.type) {
        case "required":
          if (
            value === undefined ||
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
          ) {
            return validation.message;
          }
          break;
        case "minLength":
          if (value && value.toString().length < (validation.value as number)) {
            return validation.message;
          }
          break;
        case "maxLength":
          if (value && value.toString().length > (validation.value as number)) {
            return validation.message;
          }
          break;
        case "email":
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return validation.message;
          }
          break;
        case "password":
          if (value && !/^(?=.*\d).{8,}$/.test(value)) {
            return validation.message;
          }
          break;
        default:
          break;
      }
    }
    return null;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updateFormData({ fieldId, value }));

    const field = currentForm?.fields.find((f: FormField) => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      dispatch(setValidationError({ fieldId, error }));
    }
  };

  useEffect(() => {
    if (!currentForm) return;

    const derivedFields = currentForm.fields.filter(
      (field: FormField) => field.isDerived
    );
    derivedFields.forEach((field: FormField) => {
      if (field.derivedFormula) {
        const newValue = calculateDerivedValue(field.derivedFormula, formData);
        if (formData[field.id] !== newValue) {
          dispatch(updateFormData({ fieldId: field.id, value: newValue }));
        }
      }
    });
  }, [currentForm, formData, dispatch]);

  function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] ?? field.defaultValue ?? "";
    const error = validationErrors[field.id];
    const isError = Boolean(error);

    const commonProps = {
      key: field.id,
      fullWidth: true,
      error: isError,
      helperText: error || "",
      disabled: field.isDerived,
      required: field.required,
    };

    switch (field.type) {
      case "text":
      case "number":
      case "textarea":
      case "date":
      case "password":
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type={
              field.type === "number"
                ? "number"
                : field.type === "date"
                ? "date"
                : field.type === "password"
                ? "password"
                : "text"
            }
            multiline={field.type === "textarea"}
            rows={field.type === "textarea" ? 4 : undefined}
            InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case "select":
        return (
          <FormControl fullWidth required={field.required} error={isError} key={field.id}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={field.isDerived}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error" mt={0.5}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case "radio":
        return (
          <FormControl fullWidth error={isError} disabled={field.isDerived} key={field.id}>
            <Typography variant="subtitle2" gutterBottom>
              {field.label} {field.required && "*"}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControl fullWidth error={isError} disabled={field.isDerived} key={field.id}>
            <Typography variant="subtitle2" gutterBottom>
              {field.label} {field.required && "*"}
            </Typography>
            <FormGroup>
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={(value || []).includes(option)}
                      onChange={(e) => {
                        const currentValues = value || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter((v: string) => v !== option);
                        handleFieldChange(field.id, newValues);
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentForm) return;

    let hasErrors = false;
    currentForm.fields.forEach((field: FormField) => {
      if (!field.isDerived) {
        const value = formData[field.id];
        const error = validateField(field, value);
        if (error) {
          hasErrors = true;
          dispatch(setValidationError({ fieldId: field.id, error }));
        }
      }
    });

    if (!hasErrors) {
      // Prepare display data with labels and hash passwords
      const displayData: Record<string, any> = {};
      currentForm.fields.forEach((field: FormField) => {
        let value = formData[field.id];
        if (field.type === "password" && value) {
          value = simpleHash(value);
        }
        displayData[field.label] = value;
      });

      alert("Form submitted successfully!\n\n" + JSON.stringify(displayData, null, 2));
    }
  };

  if (!currentForm?.fields?.length) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        No fields to display. Please add some fields to the form.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mt: 3 }}>
      <Typography variant={isXs ? "h6" : "h5"} fontWeight="bold" gutterBottom>
        {currentForm?.name || "Dynamic Form"}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {currentForm.fields.map((field: FormField) => (
            <Grid item xs={12} sm={12} md={6} key={field.id}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" size={isXs ? "medium" : "large"}>
            Submit Form
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

function calculateDerivedValue(derivedFormula: string, formData: any) {
  let formula = derivedFormula;
  const matches = derivedFormula.match(/{[^}]+}/g) || [];
  matches.forEach((match) => {
    const fieldId = match.replace(/[{}]/g, "");
    const value = Number(formData[fieldId]) || 0;
    formula = formula.replace(match, value.toString());
  });

  try {
    // eslint-disable-next-line no-eval
    return eval(formula);
  } catch {
    return "";
  }
}

export default DynamicForm;
