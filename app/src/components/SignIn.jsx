import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
/**
 * @author Patrick Shaw
 */
function SignIn() {
  const { state, signIn, signOut } = useAuthContext();
  const { signedIn } = state;
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signInError, setSignInError] = useState(false);
  const [fieldsEmpty, setFieldsEmpty] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (checkTokenExpiration(token)) {
        signOut();
      } else {
        signIn(token);
      }
    }

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && checkTokenExpiration(token)) {
        signOut();
        localStorage.removeItem('token');
        toast.error('Session has expired, please sign in again.');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const checkTokenExpiration = (token) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  };

  const handleSignIn = () => {
    const isUsernameEmpty = username === '';
    const isPasswordEmpty = password === '';

    setUsernameError(isUsernameEmpty);
    setPasswordError(isPasswordEmpty);

    if (isUsernameEmpty || isPasswordEmpty) {
      setFieldsEmpty(true);
      setSignInError(false);
      return;
    }

    setFieldsEmpty(false);
    setSignInError(false);

    const encodedString = btoa(`${username}:${password}`);

    fetch('https://w20012045.nuwebspace.co.uk/kv60032/api/token', {
      method: 'GET',
      headers: new Headers({ Authorization: 'Basic ' + encodedString }),
    })
      .then((response) => {
        if (response.status === 200) {
          setUsernameError(false);
          setPasswordError(false);
          setSignInError(false);
          setFieldsEmpty(false);
          toast.success('Signed in successfully!');
        } else {
          setUsernameError(true);
          setPasswordError(true);
          setSignInError(true);
          setFieldsEmpty(false);
          toast.error('Incorrect username and/or password.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          signIn(data.token);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem('token');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSignIn();
    }
  };

  return (
    <div className="bg-slate-800 p-2 text-md text-right">
      {!signedIn && (
        <div className="flex justify-end">
          <div className="w-full sm:w-auto">
            <div className="flex flex-col items-end">
              <div className="flex justify-end">
                <input
                  type="text"
                  placeholder="username"
                  className={`p-1 m-2 rounded-md ${usernameError ? 'bg-red-200' : 'bg-slate-100'} w-48`}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <input
                  type="password"
                  placeholder="password"
                  className={`p-1 m-2 rounded-md ${passwordError ? 'bg-red-200' : 'bg-slate-100'} w-48`}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="flex justify-end">
                <input
                  type="submit"
                  value="Sign In"
                  className="py-1 px-4 m-2 bg-green-100 hover:bg-green-500 rounded-md cursor-pointer"
                  onClick={handleSignIn}
                />
                <Link
                  to="/signup"
                  className="py-1 px-4 m-2 bg-green-100 hover:bg-green-500 rounded-md cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {signedIn && (
        <div>
          <input
            type="submit"
            value="Sign Out"
            className="py-1 px-4 mx-2 bg-green-100 hover:bg-green-500 rounded-md cursor-pointer"
            onClick={handleSignOut}
          />
          <input
            type="submit"
            value="Account"
            className="py-1 px-4 mx-2 bg-green-100 hover:bg-green-500 rounded-md cursor-pointer"
            onClick={() => navigate('/account')}
          />
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default SignIn;