import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../store/userSlice";
import Header from "../components/layout/Header";

import theme from "../services/themeServices";
import { Button, Grid } from "@mui/material";
import Search from "../components/theme/SearchTheme";
import Sorting from "../components/theme/SortingTheme";
import CreateTheme from "../components/theme/CreateThemeModal";
import MyThemes from "../components/theme/MyThemes";
import OtherThemes from "../components/theme/OtherThemes";

const Home = () => {
  useEffect(() => {
    dispatch(
      getUser({ user_id: localStorage.getItem("user_id").slice(1, -1) })
    );
  });

  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("likeDesc");
  const [searchParams, setSearchParams] = useState("");

  useEffect(() => {
    if (searchParams.length === 0) {
      theme
        .getAllThemes({ sort_by: sortBy })
        .then(({ data }) => setMyThemes(data));
    } else {
      theme
        .searchTheme({ theme_title: searchParams })
        .then(({ data }) => setMyThemes(data));
    }
  }, [open, sortBy, searchParams]);
  

  const [myThemes, setMyThemes] = useState([]);


  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSortingChange = (event) => {
    setSortBy(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearchParams(event.target.value);
  };

  return (
    <>
      <Header />
      <Grid container justifyContent="end">
        <Grid item>
          <Search handleSearchChange={handleSearchChange} />
        </Grid>
        <Grid item>
          <Sorting handleSortingChange={handleSortingChange} sortBy={sortBy} />
        </Grid>
        <Grid item>
          <Button
            style={{ margin: "20px" }}
            variant="outlined"
            onClick={handleClickOpen}
          >
            Create new theme
          </Button>
          <CreateTheme open={open} handleClose={handleClose} />
        </Grid>
      </Grid>

      <MyThemes myThemes={myThemes} />
      <OtherThemes myThemes={myThemes} />
    </>
  );
};

export default Home;
