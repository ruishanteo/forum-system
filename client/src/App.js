import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import { Header } from "./components/Header.js";
import Home from "./components/Home";
import Replies from "./components/Replies";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  status: {
    danger: "#ebaaa7",
  },
  palette: {
    primary: {
      main: "#A49393",
      darker: "#E8B4B8",
    },
    neutral: {
      main: "#67595E",
      contrastText: "#fff",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/:id/replies" element={<Replies />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};
export default App;
