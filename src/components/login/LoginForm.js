import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import user from "../../services/userServices";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const loginSchema = yup.object().shape({
    email: yup.string().required("Required"),
    password: yup.string().required("Required"),
  });

  const [showAlert, setShowAlert] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  let navigate = useNavigate();

  const onSubmit = ({ password, email }) => {
    user
      .login({
        password,
        email,
      })
      .then(({ status, data }) => {
        status == 200 && navigate("/");
        localStorage.setItem("user_id", JSON.stringify(data.user_id));
      })
      .catch(() => setShowAlert(true));
  };

  return (
    <Container component="main" maxWidth="xs" spacing={6}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            size="small"
            margin="normal"
            autoFocus
            fullWidth
            label="Email"
            name="email"
            error={!!errors["email"]}
            helperText={errors["email"] ? errors["email"].message : ""}
            {...register("email")}
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel
              size="small"
              style={errors["password"] && { color: "#d32f2f" }}
            >
              Password
            </InputLabel>
            <OutlinedInput
              size="small"
              error={!!errors["password"]}
              {...register("password")}
              name="password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            <FormHelperText style={{ color: "#d32f2f" }}>
              {errors["password"] && errors["password"].message}
            </FormHelperText>
          </FormControl>
          {showAlert && (
            <Alert margin="normal" severity="error">
              Wrong email or password!
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/registration" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
