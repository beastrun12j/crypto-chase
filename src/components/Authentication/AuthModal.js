import { AppBar, Tab, Tabs } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import GoogleButton from "react-google-button";
import { auth } from "../../firebase";
import { CryptoState } from "../../store/CryptoProvider";
import Login from "./Login";
import SignUp from "./SignUp";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 325,
  bgcolor: "#08041c",
  border: "2px solid #000",
  borderRadius: 5,
};

const AuthModal = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const { setAlert } = CryptoState();
  const googleAuthProvider = new GoogleAuthProvider();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      setAlert({
        type: "success",
        message: `Logged in Successfully. Welcome ${
          result.user.displayName || result.user.email
        }`,
        open: true,
      });
      handleClose();
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message,
        open: true,
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        style={{
          width: 85,
          height: 40,
          backgroundColor: "gold",
          fontWeight: "bold",
          borderBottom: "2px solid gold",
          bgcolor: "#08041c",
        }}
        onClick={handleOpen}
      >
        Login
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <AppBar
              position="static"
              style={{ color: "white", backgroundColor: "transparent" }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ borderRadius: 10 }}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#f50057",
                  },
                }}
              >
                <Tab
                  label="Login"
                  sx={{
                    bgcolor: "#08041c",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  }}
                />
                <Tab
                  label="Sign Up"
                  sx={{
                    bgcolor: "#08041c",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  }}
                />
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <SignUp handleClose={handleClose} />}
            <Box
              sx={{
                padding: "24px",
                paddingTop: 0,
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                gap: "20px",
                fontWeight: "bold",
              }}
            >
              <span style={{ color: "white", fontFamily: "Montserrat" }}>
                OR
              </span>
              <GoogleButton
                style={{
                  width: "100%",
                  outline: "none",
                  fontFamily: "Montserrat",
                }}
                onClick={signInWithGoogle}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AuthModal;
