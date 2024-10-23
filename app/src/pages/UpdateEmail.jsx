/**
 *
 * @author Patrick Shaw
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';


function UpdateEmail() {
  const { state} = useAuthContext();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { signedIn } = state;
  

  useEffect(() => {
    if (!signedIn) {
      navigate('/');
    }
  }, [signedIn, navigate]);

  const validateForm = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');

    fetch('https://w20012045.nuwebspace.co.uk/kv60032/api/userdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success('Email updated successfully!');
          navigate('/');
          window.location.reload();
        } else if (response.status === 409) {
          toast.error('Email already exists.');
          throw new Error('Email update failed');
        } else {
          toast.error('Email update failed. Please try again.');
          throw new Error('Email update failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while updating the email.');
      });
  };

  return (
    <>
      <div className="text-center my-4">
        <h2 className="text-2xl font-bold my-2">Update Email</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              New Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Update Email
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default UpdateEmail;