import fetch from "../interceptor/axiosInterceptor";

const register = ({
  password,
  email,
  lastName,
  firstName,
  country,
  city,
  address,
  phoneNumber,
}) => {
  return fetch.post(
    "/user/register",
    {
      password: password,
      email,
      lastName,
      firstName,
      country,
      city,
      address,
      phoneNumber,
    },
    { mode: "cors" }
  );
};

const login = async ({ email, password }) => {
  const response = await fetch.post("/user/login", {
    email: email,
    password: password,
  });
  if (response.data.access_token) {
    console.log(response);
    localStorage.setItem(
      "accessToken",
      JSON.stringify(response.data.access_token)
    );
  }
  return response;
};

const logout = async () => {
  const response = await fetch.post("/user/logout");
  await localStorage.removeItem("accessToken");
  await localStorage.removeItem("user_id");
  return response;
};


const user = { register, login, logout };

export default user;
