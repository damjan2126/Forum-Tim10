import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import theme from "../services/themeServices";
import Comments from "../components/Comments";

const Theme = () => {
  const location = useLocation();
  const { id } = location.state;
  const [themePage, setThemePage] = useState();

  useEffect(() => {
    theme.getTheme({ theme_id: id }).then(({ data }) => setThemePage(data));
  }, []);

  return (
    <>
      <Header />
      {themePage && themePage.open && <Comments theme_id={id} />}
    </>
  );
};

export default Theme;
