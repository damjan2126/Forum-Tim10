import React from "react";
import { FormControlLabel, MenuItem, Select } from "@mui/material";

const Sorting = ({ handleSortingChange, sortBy }) => {
  return (
    <FormControlLabel
      style={{ margin: "20px" }}
      name="Sort by"
      value="true"
      control={
        <Select
          style={{ marginLeft: "15px" }}
          size="small"
          value={sortBy}
          onChange={handleSortingChange}
        >
          <MenuItem value={"likeDesc"}>Likes &darr;</MenuItem>
          <MenuItem value={"likeAsc"}>Likes &uarr;</MenuItem>
          <MenuItem value={"dislikeDesc"}>Dislikes &darr;</MenuItem>
          <MenuItem value={"dislikeAsc"}>Dislikes &uarr;</MenuItem>
          <MenuItem value={"commentsAsc"}>Comments &uarr;</MenuItem>
          <MenuItem value={"commentDesc"}>Comments &darr;</MenuItem>
        </Select>
      }
      label="Sort by"
      labelPlacement="start"
    />
  );
};

export default Sorting;
