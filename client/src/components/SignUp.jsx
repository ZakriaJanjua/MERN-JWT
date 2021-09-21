import {
  Container,
  Button,
  TextField,
  Box,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import joi from "joi";
import React from "react";
import axios from "axios";
import file from '../assets/Infinity.svg'

function SignUp() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [cpassword, setCpassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  let user = {
    username,
    password,
    cpassword,
  };

  const schema = joi.object({
    username: joi
      .string()
      .regex(/(^[a-zA-Z0-9_]+$)/)
      .min(2)
      .max(30)
      .required(),
    password: joi.string().trim().min(6).required(),
    cpassword: joi.string().trim().min(6).required(),
  });

  const valid = () => {
    if (password !== cpassword) {
      setErrorMessage("Passwords must match");
      return false;
    }
    const result = schema.validate(user);

    if (!result.error) {
      return true;
    } else {
      setErrorMessage(result.error.message);
      return false;
    }
  };

  React.useEffect(() => {
    setErrorMessage("");
  }, [username, password, cpassword]);

  const handleSignup = (e) => {
    e.preventDefault()
    setErrorMessage("");

    if (!valid()) {
      return;
    } else {
      setLoading(true);
      axios
        .post("http://localhost:5000/auth/Signup", {
          username,
          password,
        })
        .then((response) => {
          localStorage.token = response.data.token
          setLoading(false);
          window.location.reload(false)
        })
        .catch((err) => {
          setLoading(false);
          setErrorMessage(err.response.data.message);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "5%" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {
         loading && <img src={file} alt='loader'/>
        }

        <Typography component="h1" variant="h5" style={{ color: "#c8d9ea" }}>
          Sign Up
        </Typography>

        {errorMessage.length > 0 && (
          <Alert severity="error">{errorMessage}</Alert>
        )}

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Confirm Password"
            type="password"
            value={cpassword}
            onChange={(e) => setCpassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{
              backgroundColor: "#dfd8cb",
              color: "#37afe2",
            }}
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;
