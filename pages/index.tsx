import { useState, useEffect } from 'react';
import Login from '@/components/Login';
import DynamicForm from '@/components/DynamicForm';
import { getForm } from '@/services/api';
import { FormResponse, FormData } from '@/types/form';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  // Check if there's a stored roll number in localStorage
  useEffect(() => {
    const storedRollNumber = localStorage.getItem('rollNumber');
    if (storedRollNumber) {
      setRollNumber(storedRollNumber);
      handleLogin(storedRollNumber);
    }
  }, []);

  const handleLogin = async (rollNumber: string) => {
    setLoading(true);
    setError('');

    try {
      const data = await getForm(rollNumber);
      if (data && data.form) {
        setFormData(data);
        setIsLoggedIn(true);
        // Store the roll number in localStorage
        localStorage.setItem('rollNumber', rollNumber);
      } else {
        throw new Error('Invalid form data received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch form data. Please try again.');
      setIsLoggedIn(false);
      // Clear stored roll number on error
      localStorage.removeItem('rollNumber');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFormData(null);
    setRollNumber('');
    localStorage.removeItem('rollNumber');
  };

  const handleFormSubmit = async (data: FormData) => {
    console.log('Form submitted with data:', data);
    // You can add additional handling here if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <button
              onClick={() => {
                setError('');
                setIsLoggedIn(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : formData?.form ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{formData.form.formTitle}</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>
          <DynamicForm 
            formStructure={formData.form} 
            onSubmit={handleFormSubmit}
            rollNumber={rollNumber}
          />
        </div>
      ) : null}
    </div>
  );
} 