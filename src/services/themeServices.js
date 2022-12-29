import axios from "axios";
import fetch from "../interceptor/axiosInterceptor";

const getAllThemesEndpoint = "/theme/all";

const createTheme = ({ title, open }) => {
  return fetch.post(
    "/theme/create",
    {
      title,
      open,
    },
    { mode: "cors" }
  );
};

const getAllThemes = ({ sort_by }) => {
  return fetch.get(`/theme/all/${sort_by}`);
};

const getTheme = ({ theme_id }) => {
  return fetch.get(`/theme/${theme_id}`);
};

const addComment = ({ commentText, theme_id }) => {
  return fetch.post(`/theme/${theme_id}`, {
    commentText,
  });
};

const theme = { createTheme, getAllThemes, getTheme, addComment };
export default theme;
