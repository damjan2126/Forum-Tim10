import React, { useEffect, useState } from "react";
import user from "../services/userServices";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../store/userSlice";
import { Home } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getUser({ user_id: localStorage.getItem("user_id").slice(1, -1) })
    );
  });

  const dispatch = useDispatch();
  const avatar = useSelector(
    ({ firstName, lastName }) => firstName.slice(0, 1) + lastName.slice(0, 1)
  );

  const handleLogout = () => {
    user.logout().then((r) => {
      navigate("/login");
    });
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton size="small" onClick={() => navigate("/")} color="inherit">
          <Home />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FORUM
        </Typography>

        <IconButton size="large" onClick={handleMenu} color="inherit">
          <Avatar sx={{ bgcolor: "black" }}>{avatar}</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              navigate("/profile");
            }}
          >
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
