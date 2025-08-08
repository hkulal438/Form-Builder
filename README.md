Form Builder - upliance.ai Assignment

A dynamic form builder application built with React, TypeScript, Redux Toolkit, and Material-UI (MUI). This application allows users to create custom forms with various field types, validations, and derived fields.

 !!Features
- **Dynamic Form Creation** - Add, edit, and delete form fields
- **Multiple Field Types** - Text, Number, Textarea, Select, Radio, Checkbox, Date
- **Field Configuration** - Label, required toggle, default values
- **Validation Rules** - Required, min/max length, email format, password rules
- **Derived Fields** - Fields that compute values based on other fields
- **Form Preview** - See how forms appear to end users
- **Form Management** - Save, load, and manage multiple forms
- **Local Storage** - All forms persist in browser storage

!!Routes

- `/myforms` - View all saved forms
- `/create` - Build new forms with field editor
- `/preview` - Interactive form preview
Technical Features

- **TypeScript** - Strong typing throughout the application
- **Redux Toolkit** - Predictable state management
- **Material-UI** - Professional UI components
- **Form Validation** - Real-time field validation
- **Responsive Design** - Works on desktop and mobile

!!How to Use

### 1. Creating a Form (`/create`)

1. **Add Fields** - Click the floating + button to add new fields
2. **Configure Fields** - Set field type, label, validations, and options
3. **Derived Fields** - Create fields that calculate values from other fields
4. **Reorder/Delete** - Manage your form structure
5. **Save Form** - Give your form a name and save it

### 2. Field Types Available

- **Text** - Single line text input
- **Number** - Numeric input
- **Textarea** - Multi-line text input  
- **Select** - Dropdown selection
- **Radio** - Single choice from options
- **Checkbox** - Multiple choice selection
- **Date** - Date picker

### 3. Validation Options

- **Required** - Field must have a value
- **Min/Max Length** - Text length constraints
- **Email Format** - Valid email validation
- **Password** - Must be 8+ chars with at least 1 number

### 4. Derived Fields

- Create fields that calculate values from other fields
- Simple math operations supported: `+`, `-`, `*`, `/`
- Example: `age` derived from `birthDate`

### 5. Previewing Forms (`/preview`)

- See exactly how your form appears to end users
- All validations and derived fields work in real-time
- Test form submission

### 6. Managing Forms (`/myforms`)

- View all saved forms
- See form creation dates and field counts
- Click any form to preview it

## 🔧 Key Features Implementation

### State Management (Redux)
- Centralized form state with Redux Toolkit
- Automatic localStorage synchronization
- Type-safe actions and selectors

### Validation System
- Real-time field validation
- Custom validation rules
- Error message display

### Derived Fields
- Automatic calculation based on formula
- Real-time updates when dependencies change
- Simple expression evaluation

### TypeScript Integration
- Strong typing for all components
- Interface definitions for forms and fields
- Type-safe Redux integration

## 📱 Responsive Design

The application is fully responsive and works well on:
- Desktop computers
- Tablets
- Mobile phones
