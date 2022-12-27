import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "../store/userSlice";
import Header from "../components/Header";

const Home = () => {


  return (
    <>
      <Header />
    </>
  );
};

export default Home;
