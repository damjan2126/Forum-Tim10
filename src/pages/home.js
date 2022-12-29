import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "../store/userSlice";
import Header from "../components/Header";
import CreateTheme from "../components/CreateThemeModal";
import theme from "../services/themeServices";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Home = () => {
  useEffect(() => {
    dispatch(
      getUser({ user_id: localStorage.getItem("user_id").slice(1, -1) })
    );
  });

  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("likeDesc");

  useEffect(() => {
    theme
      .getAllThemes({ sort_by: sortBy })
      .then(({ data }) => setMyThemes(data));
  }, [open]);

  const [myThemes, setMyThemes] = useState([]);
  const [otherThemes, setOtherThemes] = useState([]);

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <>
      <Header />
      <Grid container justifyContent="end">
        <Grid item>
          <Paper
            style={{ margin: "20px" }}
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              width: 300,
              height: 40,
            }}
          >
            <InputBase
              size="small"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search themes"
            />
            <IconButton type="button" sx={{ p: "10px" }}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item>
          <FormControlLabel
            style={{ margin: "20px" }}
            name="Sort by"
            value="true"
            control={
              <Select
                style={{ marginLeft: "15px" }}
                size="small"
                value={sortBy}
                onChange={handleChange}
              >
                <MenuItem value={"likeDesc"}>Likes &uarr;</MenuItem>
                <MenuItem value={"likeAsc"}>Likes &darr;</MenuItem>
                <MenuItem value={"dislikeDesc"}>Dislikes &uarr;</MenuItem>
                <MenuItem value={"dislikeAsc"}>Dislikes &darr;</MenuItem>
                <MenuItem value={"commentAsc"}>Comments &uarr;</MenuItem>
                <MenuItem value={"commentDesc"}>Comments &darr;</MenuItem>
              </Select>
            }
            label="Sort by"
            labelPlacement="start"
          />
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

      <Container sx={{ py: 6 }}>
        <Typography
          borderBottom="black 2px solid"
          gutterBottom
          variant="h4"
          component="h2"
        >
          My themes
        </Typography>
        <Grid container spacing={6}>
          {myThemes.map((theme) => {
            if (
              theme.owner_id == localStorage.getItem("user_id").slice(1, -1)
            ) {
              return (
                <Grid item key={theme.id} xs={12} sm={3} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#7c84b936",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {theme.title}
                      </Typography>
                      <Typography gutterBottom component="p">
                        {`${theme.comment_count} comments`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button>
                        <Link
                          style={{ textDecoration: "none", color: "#1976d2" }}
                          state={{ id: theme.id }}
                          to={`/${theme.title
                            .replace(/ /g, "_")
                            .toLowerCase()}`}
                        >
                          View
                        </Link>
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            }
          })}
        </Grid>
      </Container>
      <Container sx={{ py: 6 }}>
        <Typography
          borderBottom="black 2px solid"
          gutterBottom="large"
          variant="h4"
          component="h2"
        >
          All themes
        </Typography>
        <Grid container spacing={6}>
          {myThemes.map((theme) => {
            if (
              theme.owner_id != localStorage.getItem("user_id").slice(1, -1)
            ) {
              return (
                <Grid item key={theme.id} xs={12} sm={3} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {theme.title}
                      </Typography>
                      <Typography gutterBottom component="p">
                        {`Created by ${theme.owner.email}`}
                      </Typography>
                      <Typography gutterBottom component="p">
                        {`${theme.comment_count} comments`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button>
                        <Link
                          style={{ textDecoration: "none", color: "#1976d2" }}
                          state={{ id: theme.id }}
                          to={`/${theme.title
                            .replace(/ /g, "_")
                            .toLowerCase()}`}
                        >
                          View
                        </Link>
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            }
          })}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
