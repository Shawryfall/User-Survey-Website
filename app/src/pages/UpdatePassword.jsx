/**
 *
 * @author Patrick Shaw
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { state} = useAuthContext();
  const { signedIn } = state;

  useEffect(() => {
    if (!signedIn) {
      navigate('/');
    }
  }, [signedIn, navigate]);

  const validateForm = () => {
    if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
      toast.error('Password must be at least 8 characters long and contain at least one digit and one letter.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
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
      body: JSON.stringify({ password: newPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        // Redirect to the home page after a successful update
        navigate('/');
        // Reload the page
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while updating the password.');
      });
  };

  return (
    <>
      <div className="text-center my-4">
        <h2 className="text-2xl font-bold my-2">Update Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-2">
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Update Password
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default UpdatePassword;