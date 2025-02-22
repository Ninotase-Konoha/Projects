import { Alert, AlertTitle, Button, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import WaitingCircle from '../components/WaitingCircle';
import { AuthContext } from '../context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // alert message
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Error');
  const [alertMessage, setAlertMessage] = useState('hello');
  const [alertSeverity, setAlertSeverity] = useState('error');

  // loading
  const [isLoading, setIsLoading] = useState(false);

  // navigate
  const navigate = useNavigate();

  // get the context of the login state
  const { contextIsLogin, contextSetIsLogin } = useContext(AuthContext);

  // if the user is login, but try to access the login page,
  // redirect to the home page
  if (contextIsLogin) {
    navigate('/', { replace: true });
  }

  console.log(`Login: ${contextIsLogin}`);


  const submitForm = async () => {
    // turn on the loading state
    setIsLoading(true);

    // check the email and password
    if (email.trim() === '' || password.trim() === '') {
      setAlertTitle('Error');
      setAlertMessage('Enter both password and email');
      setAlertSeverity('error');
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    // check the email follows the requirement
    const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (!emailRegex.test(email)) {
      setAlertTitle('Error');
      setAlertMessage('Invalid email address');
      setAlertSeverity('error');
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    // check password should be at least 8 characters long
    if (password.length < 8) {
      setAlertTitle('Error');
      setAlertMessage('Password should be at least 8 characters long');
      setAlertSeverity('error');
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    // prepare the request
    const url = 'http://127.0.0.1:5000/auth/login';
    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    // send the request
    try {
      const response = await fetch(url, options);
      console.log(response.status);

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);

        // save data
        contextSetIsLogin(data);

        // redirect to the home page
        navigate('/', { replace: true });
      } else {
        // incorrect email or password
        setAlertTitle('Error');
        setAlertMessage('Incorrect email or password');
        setAlertSeverity('error');
        setShowAlert(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          minWidth: '30%',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 3,
          py: 15,
          px: 12,
          gap: 5,
        }}
      >
        {isLoading ? (
          <WaitingCircle text="Submitting in progress..."/>
        ) : (
          <>
            <Typography
              variant="h4"
            >
              Login Form
            </Typography>
            <TextField
              label="Email"
              size="large"
              value={email}
              fullWidth
              onChange={(event) => {
                setEmail(event.target.value);
                setShowAlert(false);
              }}
            />
            <TextField
              label="Password"
              size="large"
              value={password}
              type='password'
              fullWidth
              onChange={(event) => {
                setPassword(event.target.value);
                setShowAlert(false);
              }}
            />
            {showAlert && (
              <Alert
                severity={alertSeverity}
                sx={{
                  my: 2,
                  px: 4,
                  fontSize: 18,
                }}
              >
                <AlertTitle>{alertTitle}</AlertTitle>
                {alertMessage}
              </Alert>
            )}
            <Button
              variant='contained'
              size='large'
              sx={{
                fontSize: 18,
              }}
              onClick={submitForm}
            >
              Login
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}
