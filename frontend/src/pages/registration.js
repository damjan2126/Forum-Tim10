import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import YupPassword from "yup-password";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import user from "../services/userServices";
import {
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

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  YupPassword(yup);

  const registrationSchema = yup.object().shape({
    firstName: yup
      .string()
      .required("First name requierd")
      .matches(/^[a-zA-Z ]*$/, "Invalid first name"),
    lastName: yup
      .string()
      .required("Last name required")
      .matches(/^[a-zA-Z ]*$/, "Invalid last name"),
    email: yup.string().required("Email requierd").email("Invalid email"),
    password: yup
      .string()
      .required("Password requierd")
      .min(8, "Password must have at least 8 characters")
      .minLowercase(1, "Password must contain at least 1 lowercase letter")
      .minUppercase(1, "Password must contain at least 1 uppercase letter")
      .minNumbers(1, "Password must contain at least 1 numbers")
      .minSymbols(1, "Password must contain at least 1 special character"),
    city: yup
      .string()
      .required("City requierd")
      .matches(/^[a-zA-Z ]*$/, "Invalid city"),
    country: yup
      .string()
      .required("Country requierd")
      .matches(/^[a-zA-Z ]*$/, "Invalid country"),
    address: yup
      .string()
      .required("Address requierd")
      .matches(/^[a-zA-Z0-9-/ ]*$/, "Invalid address"),
    phoneNumber: yup
      .string()
      .required("Phone number requierd")
      .matches(/^[0-9-/ ]*$/, "Invalid phone number"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setFocus,
    setError,
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  let navigate = useNavigate();

  const emailDuplicateFocus = () => {
    setFocus("email");
    setError("email", {
      type: "duplicate",
      message: "Email is already in use",
    });
  };

  const onSubmit = ({
    password,
    email,
    lastName,
    firstName,
    country,
    city,
    address,
    phoneNumber,
  }) => {
    user
      .register({
        password,
        email,
        lastName,
        firstName,
        country,
        city,
        address,
        phoneNumber,
      })
      .then(({ status }) => status == 201 && navigate("/login"))
      .catch(({ response }) => response.status == 409 && emailDuplicateFocus());
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                name="firstName"
                required
                fullWidth
                label="First name"
                autoFocus
                error={!!errors["firstName"]}
                helperText={
                  errors["firstName"] ? errors["firstName"].message : ""
                }
                {...register("firstName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                name="lastName"
                required
                fullWidth
                label="Last name"
                error={!!errors["lastName"]}
                helperText={
                  errors["lastName"] ? errors["lastName"].message : ""
                }
                {...register("lastName")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                required
                fullWidth
                label="Email"
                name="email"
                error={!!errors["email"]}
                helperText={errors["email"] ? errors["email"].message : ""}
                {...register("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  size="small"
                  style={errors["password"] && { color: "#d32f2f" }}
                >
                  Password*
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                required
                fullWidth
                name="city"
                label="City"
                error={!!errors["city"]}
                helperText={errors["city"] ? errors["city"].message : ""}
                {...register("city")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                required
                fullWidth
                name="country"
                label="Country"
                error={!!errors["country"]}
                helperText={errors["country"] ? errors["country"].message : ""}
                {...register("country")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                required
                fullWidth
                name="address"
                label="Address"
                error={!!errors["address"]}
                helperText={errors["address"] ? errors["address"].message : ""}
                {...register("address")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                required
                fullWidth
                name="phoneNumber"
                label="Phone number"
                error={!!errors["phoneNumber"]}
                helperText={
                  errors["phoneNumber"] ? errors["phoneNumber"].message : ""
                }
                {...register("phoneNumber")}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Registration;
