import { FormStructure } from '../types/form';

export const formData: FormStructure = {
  formTitle: 'Student Information Form',
  formId: 'student-form-001',
  version: '1.0',
  sections: [
    {
      sectionId: 1,
      title: 'Personal Information',
      description: 'Please provide your personal details',
      fields: [
        {
          fieldId: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true
        },
        {
          fieldId: 'gender',
          type: 'dropdown',
          label: 'Gender',
          required: true,
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
          ]
        },
        {
          fieldId: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email address',
          required: true
        },
        {
          fieldId: 'phone',
          type: 'tel',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: true
        }
      ]
    }
  ]
}; 