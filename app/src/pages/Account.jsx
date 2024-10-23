import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
/**
 * @author Patrick Shaw
 */
function Account() {
  const { state, signOut } = useAuthContext();
  const { signedIn, username, email, age, gender, country } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!signedIn) {
      navigate('/');
    }
  }, [signedIn, navigate]);

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      fetch("https://w20012045.nuwebspace.co.uk/kv60032/api/userdata", {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure the token is stored securely
        },
      })
        .then(response => {
          if (response.ok) {
            localStorage.removeItem('token'); // Remove the token from localStorage
            alert('Account deleted successfully.');
            signOut(); 
            navigate('/');
          } else {
            alert('Failed to delete the account. Please try again.');
          }
        })
        .catch(err => {
          console.error('Error:', err);
          alert('Error deleting account. Please check your network connection.');
        });
    }
  };

  if (!signedIn) {
    return null;
  }

  return (
    <div className="text-center my-4">
      <h2 className="text-2xl font-bold my-2">Account Details</h2>
      <div className="mt-4">
        <p>Username: {username}</p>
        <p>Email: {email}</p>
        <p>Age: {age}</p>
        <p>Gender: {gender}</p>
        <p>Country: {country}</p>
      </div>
      <div className="mt-4">
        <Link
          to="/updatepassword"
          className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out mr-2"
        >
          Update Password
        </Link>
        <Link
          to="/updateemail"
          className="px-4 py-2 text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-white transition duration-200 ease-in-out"
        >
          Update Email
        </Link>
      </div>
      <button
        className="mt-4 px-4 py-2 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition duration-200 ease-in-out"
        onClick={handleDeleteAccount}
      >
        Delete Account
      </button>
    </div>
  );
}

export default Account;