import React, { useState } from 'react';
import { FormStructure, FormData, FormField, FormSection } from '../types/form';

interface DynamicFormProps {
  formStructure: FormStructure;
  onSubmit: (data: FormData) => void;
  rollNumber: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formStructure, onSubmit }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!formStructure) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  const validateSection = (section: FormSection) => {
    const newErrors: Record<string, string> = {};
    section.fields.forEach((field: FormField) => {
      const value = formData[field.fieldId];
      if (field.required && !value) {
        newErrors[field.fieldId] = `${field.label} is required`;
      } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field.fieldId] = 'Please enter a valid email address';
      } else if (field.type === 'tel' && value && !/^\+?[\d\s-]{10,}$/.test(value)) {
        newErrors[field.fieldId] = 'Please enter a valid phone number';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (fieldId: string, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateSection(formStructure.sections[currentSection])) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentSection(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSection(formStructure.sections[currentSection])) {
      onSubmit(formData);
    }
  };

  const currentSectionData = formStructure.sections[currentSection];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{formStructure.formTitle}</h2>
              <span className="text-sm text-gray-500">
                Section {currentSection + 1} of {formStructure.sections.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentSection + 1) / formStructure.sections.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">{currentSectionData.title}</h3>
              <p className="text-sm text-gray-500">{currentSectionData.description}</p>

              <div className="space-y-4">
                {currentSectionData.fields.map((field: FormField) => (
                  <div key={field.fieldId} className="space-y-2">
                    <label htmlFor={field.fieldId} className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'dropdown' ? (
                      <select
                        id={field.fieldId}
                        value={formData[field.fieldId] || ''}
                        onChange={(e) => handleChange(field.fieldId, e.target.value)}
                        className={`mt-1 block w-full px-4 py-3 border ${
                          errors[field.fieldId] ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'radio' ? (
                      <select
                        id={field.fieldId}
                        value={formData[field.fieldId] || ''}
                        onChange={(e) => handleChange(field.fieldId, e.target.value)}
                        className={`mt-1 block w-full px-4 py-3 border ${
                          errors[field.fieldId] ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.fieldId}
                        value={formData[field.fieldId] || ''}
                        onChange={(e) => handleChange(field.fieldId, e.target.value)}
                        className={`mt-1 block w-full px-4 py-3 border ${
                          errors[field.fieldId] ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    )}
                    {errors[field.fieldId] && (
                      <p className="text-sm text-red-600">{errors[field.fieldId]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentSection === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {currentSection < formStructure.sections.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm; 