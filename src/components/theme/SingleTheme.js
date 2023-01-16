import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import theme from "../../services/themeServices";
import Comments from "./../comment/Comments";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { AddAlert, Delete, ThumbDown, ThumbUp } from "@mui/icons-material";

const SingleTheme = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id } = location.state;
  const [themePage, setThemePage] = useState();
  const [subscribe, setSubscribe] = useState();
  const [opened, setOpened] = useState();
  const [rate, setRate] = useState();
  const [toggle, setToggle] = useState();

  const handleSubscribeButton = ({ theme_id }) => {
    theme.subscribeToTheme({ theme_id }).then(() => {
      setSubscribe((prevState) => !prevState);
    });
  };

  const handleDeleteTheme = ({ theme_id }) => {
    theme.deleteTheme({ theme_id }).then(() => {
      navigate("/");
    });
  };

  const rateTheme = ({ rating }) => {
    theme.rateTheme({ theme_id: id, rating });
  };


  const handleOpenSwitch = ({ theme_id, open }) => {
    theme.changeOpen({ theme_id, open });
  };

  const handleLikeThumbDisable = () => {
    if (rate == true) {
      return "secondary";
    } else if (rate == false) {
      return "primary";
    } else if (rate == null) {
      return "primary";
    }
  };

  const handleDislikeThumbDisable = () => {
    if (rate == true) {
      return "primary";
    } else if (rate == false) {
      return "secondary";
    } else if (rate == null) {
      return "primary";
    }
  };

  useEffect(() => {
    theme.getTheme({ theme_id: id }).then(({ data }) => {
      setThemePage(data);
      setOpened(data.open);
      setSubscribe(data.subbed);
      setRate(data.rating);
      setToggle(data.rating);
    });
  }, [subscribe, opened, toggle]);


  if (!themePage) return null;

  return themePage.owner_id === localStorage.getItem("user_id").slice(1, -1) ? (
    <>
      <Box
        sx={{
          margin: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          name="open"
          value={opened}
          control={
            <Switch
              onChange={(e) => {
                setOpened(e.target.checked);
                handleOpenSwitch({
                  theme_id: themePage.id,
                  open: e.target.checked,
                });
              }}
              checked={opened}
              name="open"
              color="primary"
            />
          }
          label={themePage.open ? "Opened" : "Closed"}
          labelPlacement="end"
        />
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => handleDeleteTheme({ theme_id: themePage.id })}
        >
          Delete theme
        </Button>
      </Box>
      <Box
        sx={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h4">
          {`${themePage.owner.firstName} ${themePage.owner.lastName}`}
        </Typography>
        <Typography variant="h1" component="h2">
          {themePage.title}
        </Typography>
      </Box>
      <Box
        sx={{
          margin: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button disabled startIcon={<ThumbUp />}>
          {themePage.like_count}
        </Button>
        <Button disabled startIcon={<ThumbDown />}>
          {themePage.dislike_count}
        </Button>
      </Box>
      <Comments opened={themePage.open} theme_id={id} />
    </>
  ) : (
    <>
      <Box
        sx={{
          margin: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          disabled={subscribe}
          variant="outlined"
          color="warning"
          startIcon={<AddAlert />}
          onClick={() => handleSubscribeButton({ theme_id: id })}
        >
          {subscribe ? "Subscribed" : "Subscribe"}
        </Button>
      </Box>
      <Box
        sx={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h4">
          {`${themePage.owner.firstName} ${themePage.owner.lastName}`}
        </Typography>
        <Typography variant="h1" component="h2">
          {themePage.title}
        </Typography>
      </Box>
      <Box
        sx={{
          margin: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          color={handleLikeThumbDisable()}
          onClick={() => {
            setToggle((prevState) => !prevState);
            rateTheme({ rating: true });
          }}
          startIcon={<ThumbUp />}
        >
          {themePage.like_count}
        </Button>
        <Button
          color={handleDislikeThumbDisable()}
          onClick={() => {
            setToggle((prevState) => !prevState);
            rateTheme({ rating: false });
          }}
          startIcon={<ThumbDown />}
        >
          {themePage.dislike_count}
        </Button>
      </Box>
      <Comments opened={themePage.open} theme_id={id} />
    </>
  );
};
export default SingleTheme;
