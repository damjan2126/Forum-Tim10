import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetch from "../interceptor/axiosInterceptor";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  city: "",
  address: "",
  phoneNumber: "",
  user_id: "",
};

export const getUser = createAsyncThunk(
  "/getUser",
  async ({ user_id }, thunkAPI) => {
    try {
      const userData = await fetch.get(`/user/${user_id}`, {
        mode: "cors",
      });
      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "/updateUser",
  async (
    { user_id, lastName, firstName, country, city, address, phoneNumber },
    thunkAPI
  ) => {
    try {
      const userData = await fetch.put(
        `/user/${user_id}`,
        {
          lastName,
          firstName,
          country,
          city,
          address,
          phoneNumber,
        },
        {
          mode: "cors",
        }
      );
      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.firstName = payload.data.firstName;
      state.lastName = payload.data.lastName;
      state.email = payload.data.email;
      state.country = payload.data.country;
      state.address = payload.data.address;
      state.city = payload.data.city;
      state.phoneNumber = payload.data.phoneNumber;
    });
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.firstName = payload.data.firstName;
      state.lastName = payload.data.lastName;
      state.country = payload.data.country;
      state.address = payload.data.address;
      state.city = payload.data.city;
      state.phoneNumber = payload.data.phoneNumber;
    });
  },
});

export default userSlice.reducer;
