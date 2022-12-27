import * as React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/userSlice";
import { Box, Button, Container, Grid, TextField } from "@mui/material";

const PersonalInformation = () => {
  const personalInformationSchema = yup.object().shape({
    firstName: yup
      .string()
      .required("First name requierd")
      .matches(/^[a-zA-Z ]*$/, "Invalid first name"),
    lastName: yup
      .string()
      .required("Last name required")
      .matches(/^[a-zA-Z ]*$/, "Invalid last name"),
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

  const user = useSelector(
    ({ lastName, firstName, country, city, address, phoneNumber }) => {
      return {
        lastName,
        firstName,
        country,
        city,
        address,
        phoneNumber,
      };
    }
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: user,
    resolver: yupResolver(personalInformationSchema),
  });

  const dispatch = useDispatch();

  const onSubmit = ({
    lastName,
    firstName,
    country,
    city,
    address,
    phoneNumber,
  }) => {
    dispatch(
      updateUser({
        user_id: localStorage.getItem("user_id").slice(1, -1),
        lastName,
        firstName,
        country,
        city,
        address,
        phoneNumber,
      })
    );
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
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                name="firstName"
                fullWidth
                label="First Name"
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
                fullWidth
                label="Last Name"
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
            Change personal information
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PersonalInformation;
