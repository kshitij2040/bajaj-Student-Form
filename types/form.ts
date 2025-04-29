export interface FormResponse {
  message: string;
  form: FormStructure;
}

export interface FormStructure {
  formTitle: string;
  formId: string;
  version: string;
  sections: FormSection[];
}

export interface FormSection {
  sectionId: number;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormField {
  fieldId: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'dropdown' | 'radio' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    message: string;
  };
  maxLength?: number;
  minLength?: number;
  dataTestId?: string;
}

export interface UserData {
  rollNumber: string;
  name: string;
}

export interface FormData {
  [key: string]: string;
} 