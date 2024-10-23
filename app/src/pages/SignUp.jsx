import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';
/**
 * @author Patrick Shaw
 */
function SignUp() {
  const navigate = useNavigate();
  const { state, signIn } = useAuthContext();
  const { signedIn } = state;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    age: '',
    genderID: '',
    country: '',
    consent: {
      readInfo: false,
      askQuestions: false,
      canWithdraw: false,
      agree: false,
    },
  });

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (signedIn) {
      navigate('/');
    }

    fetch('https://w20012045.nuwebspace.co.uk/kv60032/api/country')
      .then(response => response.json())
      .then(data => {
        setCountries(data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, [signedIn, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, genderID: parseInt(e.target.value) });
  };

  const handleConsentChange = (e) => {
    setFormData({
      ...formData,
      consent: {
        ...formData.consent,
        [e.target.name]: e.target.checked,
      },
    });
  };

  const validateForm = () => {
    const { username, password, confirmPassword, email, age, country, consent } = formData;

    if (username.length < 5) {
      toast.error('Username must be at least 5 characters long.');
      return false;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      toast.error('Password must be at least 8 characters long and contain at least one digit and one letter.');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    if (age < 18 || age > 100) {
      toast.error('Age must be between 18 and 100.');
      return false;
    }

    if (!formData.genderID) {
      toast.error('Please select a gender.');
      return false;
    }

    if (!country) {
      toast.error('Please select a country.');
      return false;
    }

    if (!consent.readInfo || !consent.askQuestions || !consent.canWithdraw || !consent.agree) {
      toast.error('You must agree to all consent statements to sign up.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const requestData = {
      ...formData,
    };

    const encodedString = btoa(`${formData.username}:${formData.password}`);

    fetch('https://w20012045.nuwebspace.co.uk/kv60032/api/createaccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => {
      if (response.ok) {
        toast.success('Registration successful!');
        return fetch('https://w20012045.nuwebspace.co.uk/kv60032/api/token', {
          method: 'GET',
          headers: new Headers({ Authorization: 'Basic ' + encodedString }),
        });
      } else if (response.status === 409) {
        toast.error('Username or email already exists.');
        throw new Error('Registration failed');
      } else {
        toast.error('Registration failed. Please try again.');
        throw new Error('Registration failed');
      }
    })
    .then(response => response.json())
    .then(data => {
      const { token } = data;
      if (token) {
        localStorage.setItem('token', token);
        signIn(token);
        navigate('/');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    });
  };

  return (
    <>
      {!signedIn && (
        <div className="text-center my-4">
          <h2 className="text-2xl font-bold my-2">Sign Up</h2>
          <p>
            Please read and agree to the{' '}
            <Link to="/consentform" className="text-blue-500">
              Participant Information Sheet
            </Link>{' '}
            before signing up.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username" 
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password" 
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password" 
              />
            </div>
            <h2 className="text-2xl font-bold my-2">Details</h2>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email" 
              />
            </div>
            <div>
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                autoComplete="age" 
              />
            </div>
            <div>
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="genderID"
                value={formData.genderID}
                onChange={handleGenderChange}
                required
                autoComplete="sex" 
              >
                <option value="">Select gender</option>
                <option value={1}>Male</option>
                <option value={2}>Female</option>
                <option value={3}>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="country">Country of residence:</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                autoComplete="country-name" 
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.country} value={country.country}>
                    {country.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-left ml-0 space-y-2">
              <div>
                <label className="text-sm flex items-center">
                  <input
                    type="checkbox"
                    name="readInfo"
                    checked={formData.consent.readInfo}
                    onChange={handleConsentChange}
                    className="mr-2"
                  />
                  I have carefully read and understood the Participant Information Sheet.
                </label>
              </div>
              <div>
                <label className="text-sm flex items-center">
                  <input
                    type="checkbox"
                    name="askQuestions"
                    checked={formData.consent.askQuestions}
                    onChange={handleConsentChange}
                    className="mr-2"
                  />
                  I have had an opportunity to ask questions and discuss this
                  study and I have received satisfactory answers.
                </label>
              </div>
              <div>
                <label className="text-sm flex items-center">
                  <input
                    type="checkbox"
                    name="canWithdraw"
                    checked={formData.consent.canWithdraw}
                    onChange={handleConsentChange}
                    className="mr-2"
                  />
                  I understand I am free to withdraw from the study at any time,
                  without having to give a reason for withdrawing, and without
                  prejudice.
                </label>
              </div>
              <div>
                <label className="text-sm flex items-center">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.consent.agree}
                    onChange={handleConsentChange}
                    className="mr-2"
                  />
                  I agree to take part in this study.
                </label>
              </div>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign Up</button>
          </form>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
  
}

export default SignUp;
