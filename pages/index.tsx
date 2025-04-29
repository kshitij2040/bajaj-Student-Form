import { useState } from 'react';
import Login from '../components/Login';
import DynamicForm from '../components/DynamicForm';
import { getForm } from '../services/api';
import { FormResponse } from '../types/form';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (rollNumber: string) => {
    setLoading(true);
    setError('');

    try {
      const data = await getForm(rollNumber);
      setFormData(data);
      setIsLoggedIn(true);
    } catch (err) {
      setError('Failed to fetch form data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : formData ? (
        <DynamicForm formData={formData} />
      ) : null}
    </div>
  );
} 