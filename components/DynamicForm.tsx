import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormResponse, FormSection, FormField } from '../types/form';

interface DynamicFormProps {
  formData: FormResponse;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const { register, handleSubmit, formState: { errors }, trigger } = useForm();
  const sections = formData.form.sections;

  const renderField = (field: FormField) => {
    const commonProps = {
      ...register(field.fieldId, {
        required: field.required,
        minLength: field.minLength,
        maxLength: field.maxLength,
      }),
      'data-testid': field.dataTestId,
      className: 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    };

    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'date':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            {...commonProps}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            {...commonProps}
          />
        );
      case 'dropdown':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  value={option.value}
                  {...commonProps}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  value={option.value}
                  {...commonProps}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const validateCurrentSection = async () => {
    const currentFields = sections[currentSection].fields.map(field => field.fieldId);
    const isValid = await trigger(currentFields);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentSection();
    if (isValid && currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{formData.form.formTitle}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{sections[currentSection].title}</h3>
          <p className="text-gray-600 mb-4">{sections[currentSection].description}</p>
          
          <div className="space-y-4">
            {sections[currentSection].fields.map(field => (
              <div key={field.fieldId} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.fieldId] && (
                  <p className="text-red-500 text-sm mt-1">
                    {field.validation?.message || 'This field is required'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          {currentSection > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Previous
            </button>
          )}
          
          {currentSection < sections.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DynamicForm; 