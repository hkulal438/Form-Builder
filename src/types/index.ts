export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: string | number;
  message: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'password'; // added password here
  label: string;
  required: boolean;
  defaultValue: any;
  validations: ValidationRule[];
  options?: string[]; // for select, radio, checkbox
  isDerived: boolean;
  derivedFrom?: string[];
  derivedFormula?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormData {
  [fieldId: string]: any;
}

export interface ValidationError {
  [fieldId: string]: string;
}

export interface AppState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
  formData: FormData;
  validationErrors: ValidationError;
}
