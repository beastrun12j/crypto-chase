import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { CryptoState } from "../store/CryptoProvider";

const MessageAlert = () => {
  const { alert, setAlert } = CryptoState();
  const handleClose = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, open: false });
  };
  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Alert
        onClose={handleClose}
        elevation={10}
        variant="filled"
        severity={alert.type}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default MessageAlert;
