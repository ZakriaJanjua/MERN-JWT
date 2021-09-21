import {
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import joi from 'joi'

function UpdateUser() {
  const history = useHistory()
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [username, setUsername] = useState("");
  const [active, setActive] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const schema = joi.object({
    username: joi
      .string()
      .regex(/(^[a-zA-Z0-9_]+$)/)
      .min(2)
      .max(30),
    password: joi.string().trim().min(6),
    role: joi.string().valid("user", "admin"),
    active: joi.bool(),
  });

  let data = {
    username,
    active,
    role,
  };

  const valid = () => {
    const result = schema.validate(data)
    if (!result.error) {
      return true;
    } else {
      setErrorMessage(result.error.message);
      return false;
    }

  }


  const getUserData = () => {
    axios
      .get("http://localhost:5000/api/v1/users/" + path, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setUsername(res.data.username);
        setRole(res.data.role);
        setActive(res.data.active);
      });
  };

  const updateUserData = () => {
    if (valid()) {
      axios
        .patch("http://localhost:5000/api/v1/users/" + path, {username, active, role}, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((res) => {
          console.log(res);
          history.push('/dashboard')
        })
        .catch((err) => setErrorMessage(err));
    } 
  };

  useEffect(() => {
    getUserData();
  }, [path]);

  useEffect(() => {
    setErrorMessage('')
  }, [username, role, active])

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
        <Typography component="h1" variant="h5" style={{ color: "#c8d9ea" }}>
          Update User
        </Typography>

        {errorMessage.length > 0 && (
          <Alert severity="error">{errorMessage}</Alert>
        )}

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            autoFocus
            value={username}
            onChange = {e => setUsername(e.target.value)}
          />
          <br />
          <br />
          <InputLabel>Active</InputLabel>
          <Select
            onChange={(e) => setActive(e.target.value)}
            label="Active"
            value={active}
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
          <br />
          <br />
          <InputLabel>Role</InputLabel>
          <Select
            onChange={(e) => setRole(e.target.value)}
            label="Role"
            value={role}
          >
            <MenuItem value="admin">admin</MenuItem>
            <MenuItem value="user">user</MenuItem>
          </Select>
          <br />
          <br />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{
              backgroundColor: "#dfd8cb",
              color: "#37afe2",
            }}
            onClick={updateUserData}
          >
            update
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default UpdateUser;
