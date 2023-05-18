import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import MenuIcon from "@mui/icons-material/Menu";

export function Header() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signOut = () => {
    localStorage.removeItem("_id");
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#EED6D3" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <QuestionAnswerIcon
            sx={{
              fontSize: 40,
              display: { color: "black", xs: "none", md: "flex" },
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: ".3rem",
              color: "black",
              textDecoration: "none",
            }}
          >
            Forum
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              component="a"
              href="/home"
              color="black"
            >
              <QuestionAnswerIcon sx={{ fontSize: 40, color: "black" }} />
            </IconButton>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: ".3rem",
              color: "black",
              textDecoration: "none",
            }}
          >
            Forum
          </Typography>

          <Box
            sx={{
              flexGrow: 0,
            }}
          >
            <Tooltip title="Open Settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  p: 0,
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem component="a" href="/home">
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              <MenuItem onClick={signOut}>
                <Typography textAlign="center">Sign out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
