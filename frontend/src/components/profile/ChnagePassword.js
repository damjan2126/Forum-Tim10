import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import YupPassword from "yup-password";
import { yupResolver } from "@hookform/resolvers/yup";
import user from "../../services/userServices";
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
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  YupPassword(yup);

  const registrationSchema = yup.object().shape({
    password: yup
      .string()
      .required("Password requierd")
      .min(8, "Password must have at least 8 characters")
      .minLowercase(1, "Password must contain at least 1 lowercase letter")
      .minUppercase(1, "Password must contain at least 1 uppercase letter")
      .minNumbers(1, "Password must contain at least 1 numbers")
      .minSymbols(1, "Password must contain at least 1 special character"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit = ({ password }) => {
    user
      .changePassword({
        user_id: localStorage.getItem("user_id").slice(1, -1),
        password,
      })
      .then(() => {navigate("/login");
    localStorage.removeItem('user_id');
    localStorage.removeItem('accessToken')
    });
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
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                  label="Newpassword"
                />
                <FormHelperText style={{ color: "#d32f2f" }}>
                  {errors["password"] && errors["password"].message}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Change password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ChangePassword;
