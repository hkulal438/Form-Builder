import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormSchema, FormField, FormData, ValidationError } from '../types';


interface FormState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
  formData: FormData;
  validationErrors: ValidationError;
}

const initialState: FormState = {
  currentForm: null,
  savedForms: [],
  formData: {},
  validationErrors: {},
};


const loadSavedForms = (): FormSchema[] => {
  try {
    const saved = localStorage.getItem('savedForms');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};


const saveForms = (forms: FormSchema[]) => {
  try {
    console.log('Saving forms to localStorage:', forms);
    localStorage.setItem('savedForms', JSON.stringify(forms));
    console.log('Forms saved successfully');
  } catch (error) {
    console.error('Failed to save forms:', error);
  }
};

const formSlice = createSlice({
  name: 'form',
  initialState: {
    ...initialState,
    savedForms: loadSavedForms(),
  },
  reducers: {
    
    createNewForm: (state) => {
      state.currentForm = {
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        fields: [],
        createdAt: new Date().toISOString(),
      };
    },

   
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
      }
    },

   
    updateField: (state, action: PayloadAction<{ index: number; field: FormField }>) => {
      if (state.currentForm) {
        state.currentForm.fields[action.payload.index] = action.payload.field;
      }
    },


    deleteField: (state, action: PayloadAction<number>) => {
      if (state.currentForm) {
        state.currentForm.fields.splice(action.payload, 1);
      }
    },

    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (state.currentForm) {
        const { fromIndex, toIndex } = action.payload;
        const fields = state.currentForm.fields;
        const [removed] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, removed);
      }
    },


    saveForm: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.name = action.payload;
        state.currentForm.createdAt = new Date().toISOString();

        const existingIndex = state.savedForms.findIndex(
          form => form.id === state.currentForm!.id
        );

        if (existingIndex >= 0) {
          state.savedForms[existingIndex] = { ...state.currentForm };
        } else {
          state.savedForms.push({ ...state.currentForm });
        }

        
        const clonedForms = state.savedForms.map(f => ({
          ...f,
          fields: f.fields.map(field => ({ ...field }))
        }));

        saveForms(clonedForms);
      }
    },

    
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = { ...form };
      }
    },

    updateFormData: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      state.formData[action.payload.fieldId] = action.payload.value;
    },

   
    setValidationError: (state, action: PayloadAction<{ fieldId: string; error: string | null }>) => {
      if (action.payload.error) {
        state.validationErrors[action.payload.fieldId] = action.payload.error;
      } else {
        delete state.validationErrors[action.payload.fieldId];
      }
    },

   
    clearFormData: (state) => {
      state.formData = {};
      state.validationErrors = {};
    },

   
    initializeFormData: (state) => {
      if (state.currentForm) {
        const newFormData: FormData = {};
        state.currentForm.fields.forEach(field => {
          if (field.defaultValue !== undefined) {
            newFormData[field.id] = field.defaultValue;
          }
        });
        state.formData = newFormData;
        state.validationErrors = {};
      }
    },
  },
});


export const {
  createNewForm,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadForm,
  updateFormData,
  setValidationError,
  clearFormData,
  initializeFormData,
} = formSlice.actions;


export default formSlice.reducer;
