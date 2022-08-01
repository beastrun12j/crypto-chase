import {
  AppBar, Container, MenuItem, Select, Toolbar,
  Typography
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { CryptoState } from "../store/CryptoProvider";
import AuthModal from "./Authentication/AuthModal";
import UserSidebar from "./Authentication/UserSidebar";

function Header() {
  const history = useHistory();
  const { currency, setCurrency, user } = CryptoState();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar
        color="transparent"
        position="static"
        style={{
          backgroundImage: "linear-gradient(to right, black , #182c6c)",
        }}
      >
        <Container>
          <Toolbar>
            <Typography
              sx={{
                flex: 1,
                color: "gold",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              onClick={() => history.push("/")}
            >
              Crypto Chase
            </Typography>
            <Select
              variant="outlined"
              style={{ width: 85, height: 40, marginRight: 15 }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"INR"}>INR</MenuItem>
            </Select>
            {user ? <UserSidebar /> : <AuthModal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
