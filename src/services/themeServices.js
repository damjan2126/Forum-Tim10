import fetch from "../interceptor/axiosInterceptor";


const createTheme = ({ title, open }) => {
  return fetch.post("/theme/create", {
    title,
    open,
  });
};

const getAllThemes = ({ sort_by }) => {
  return fetch.get(`/theme/all/${sort_by}`);
};

const getTheme = ({ theme_id }) => {
  return fetch.get(`/theme/${theme_id}`);
};

const searchTheme = ({ theme_title }) => {
  return fetch.get(`/theme/all/search/${theme_title}`);
};

const addComment = ({ commentText, theme_id }) => {
  return fetch.post(`/theme/${theme_id}`, {
    commentText,
  });
};

const editComment = ({ commentText, comment_id }) => {
  return fetch.put(`/comment/${comment_id}`, {
    commentText,
  });
};

const rateComment = ({ rating, comment_id }) => {
  return fetch.post(`/comment/${comment_id}`, {
    rating: rating,
  });
};

const subscribeToTheme = ({ theme_id }) => {
  return fetch.post(`/theme/subscribe/${theme_id}`, {});
};

const changeOpen = ({ theme_id, open }) => {
  return fetch.patch(`/theme/${theme_id}`, {
    open,
  });
};

const deleteTheme = ({ theme_id }) => {
  return fetch.delete(`/theme/${theme_id}`);
};

const rateTheme = ({ theme_id, rating }) => {
  return fetch.post(`/theme/rate/${theme_id}`, { rating: rating });
};

const theme = {
  createTheme,
  getAllThemes,
  getTheme,
  addComment,
  searchTheme,
  editComment,
  rateComment,
  subscribeToTheme,
  changeOpen,
  deleteTheme,
  rateTheme,
};
export default theme;
