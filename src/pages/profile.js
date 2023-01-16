import React, { useState } from "react";
import Header from "../components/layout/Header";
import PersonalInformation from "../components/profile/PersonalInformation";
import ChangePassword from "../components/profile/ChnagePassword";
import { Box, Tab, Tabs, Typography } from "@mui/material";

const TabPanel = (props) => {
  const { children, value, index } = props;

  return (
    value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    )
  );
};

const Profile = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Header />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Personal information" />
            <Tab label="Change password" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <PersonalInformation />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ChangePassword />
        </TabPanel>
      </Box>
    </>
  );
};

export default Profile;
