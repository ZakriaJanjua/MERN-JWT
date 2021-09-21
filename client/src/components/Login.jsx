import {
  Container,
  Button,
  TextField,
  Box,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useState, useEffect } from "react";
import joi from "joi";
import axios from "axios";
import file from "../assets/Infinity.svg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const user = {
    username,
    password,
  };

  useEffect(() => {
    setErrorMessage("");
  }, [username, password]);

  const schema = joi.object({
    username: joi
      .string()
      .regex(/(^[a-zA-Z0-9_]+$)/)
      .min(2)
      .max(30)
      .required(),
    password: joi.string().trim().min(6).required(),
  });

  const valid = () => {
    const result = schema.validate(user);

    if (!result.error) {
      return true;
    } else {
      setErrorMessage(result.error.message);
      return false;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (valid()) {
      setLoading(true);
      axios
        .post("http://localhost:5000/auth/login", {
          username,
          password,
        })
        .then((response) => {
          localStorage.setItem('token', response.data.token)
            setLoading(false);
            window.location.reload(false)
        })
        .catch((err) => {
            setLoading(false);
            setErrorMessage(err.response.data.message);
        });
      return true;
    } else {
      return false;
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
        {loading && <img src={file} alt="loader" />}

        <Typography component="h1" variant="h5" style={{ color: "#c8d9ea" }}>
          Login
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
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{
              backgroundColor: "#dfd8cb",
              color: "#37afe2",
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
