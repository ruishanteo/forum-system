import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Box, Button, TextField, Typography } from "@mui/material";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = () => {
    fetch("http://localhost:4000/api/register/", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        username,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error_message) {
          alert(data.error_message);
        } else {
          alert("Account created successfully!");
          navigate("/");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp();
    setEmail("");
    setUsername("");
    setPassword("");
  };

  return (
    <Box align="center">
      <Box align="center" display="flex" flexDirection="column" maxWidth="50vw">
        <Typography variant="h2" sx={{ mt: 2 }}>
          Register
        </Typography>

        <TextField
          type="text"
          name="username"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Username"
          variant="standard"
          sx={{ mt: 2 }}
        />

        <TextField
          type="text"
          name="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
          variant="standard"
          sx={{ mt: 2 }}
        />

        <TextField
          type="password"
          name="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          variant="standard"
          sx={{ mt: 2 }}
        />

        <Button onClick={handleSubmit} variant="contained" sx={{ mt: 5 }}>
          REGISTER
        </Button>

        <Typography sx={{ mt: 5 }}>
          Have an account? <Link to="/">Sign in</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
