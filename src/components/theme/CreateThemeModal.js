import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useForm } from "react-hook-form";
import theme from "../../services/themeServices";

const CreateTheme = ({ open, handleClose }) => {
  const { handleSubmit, register } = useForm();
  const onSubmit = ({ themeName, open }) => {
    theme
      .createTheme({ title: themeName, open })
      .then(({ status }) => status == 201 && handleClose());
  };

  return (
    <Dialog fullWidth open={open} onClose={() => handleClose()}>
      <DialogTitle>Create a new theme</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ marginBottom: "15px" }}
          autoFocus
          label="Theme name"
          name="themeName"
          fullWidth
          variant="standard"
          {...register("themeName")}
        />
        <FormControlLabel
          name="open"
          value="true"
          control={<Switch name="open" {...register("open")} color="primary" />}
          label="Open"
          labelPlacement="end"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTheme;
