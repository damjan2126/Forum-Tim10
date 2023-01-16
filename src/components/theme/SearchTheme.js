import React from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({ handleSearchChange }) => {
  return (
    <>
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
          onChange={handleSearchChange}
        />
        <IconButton type="button" sx={{ p: "10px" }}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  );
};

export default Search;
