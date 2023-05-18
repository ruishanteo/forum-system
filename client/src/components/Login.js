import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Box, Button, TextField, Typography } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = () => {
    fetch("http://localhost:4000/api/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
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
          alert(data.message);
          navigate("/dashboard");
          localStorage.setItem("_id", data.id);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
    setEmail("");
    setPassword("");
  };

  return (
    <Box align="center">
      <Box align="center" display="flex" flexDirection="column" maxWidth="50vw">
        <Typography variant="h2" sx={{ mt: 2 }}>
          Login
        </Typography>

        <TextField
          type="text"
          name="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
          variant="standard"
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
          SIGN IN
        </Button>
        <Typography sx={{ mt: 5 }}>
          Don't have an account? <Link to="/register">Create one</Link>
        </Typography>
      </Box>
    </Box>
  );
};
export default Login;
