import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { styled } from "@mui/system";
import { signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState, Fragment } from "react";
import { AiFillDelete, AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import { auth, db } from "../../firebase";
import { CryptoState } from "../../store/CryptoProvider";
import { numberWithCommas } from "../Banner/Carousel";

export default function UserSidebar() {
  const [state, setState] = useState({
    right: false,
  });
  const { user, setAlert, watchlist, coins, symbol, setWatchlist } =
    CryptoState();
  const history = useHistory();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const logoutHandler = () => {
    signOut(auth);
    setWatchlist([]);
    setAlert({
      type: "success",
      message: "Logged out Successfully",
      open: true,
    });
    toggleDrawer("right", false);
  };

  const removeFromWatchList = async (coin) => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch !== coin?.id),
        },
        { merge: true }
      );
      setAlert({
        open: true,
        message: `${coin.name} removed from the watchlist`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Error removing coin from the watchlist",
        type: "error",
      });
    }
  };

  const MainContainer = styled("div")({
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Montserrat",
    backgroundColor: "#082464",
  });

  const Profile = styled("div")({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  });

  const WatchList = styled("div")({
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "",
    borderRadius: "10px",
    padding: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    ":-ms-overflow-style": "none",
    scrollbarWidth: "none",
    "::-webkit-scrollbar": {
      display: "none",
    },
    overflow: "auto",
  });

  const Coin = styled("div")({
    padding: "10px",
    borderRadius: "5px",
    color: "black",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEBC1D",
    boxShadow: "0 0 3px black",
  });

  return (
    <div>
      {["right"].map((anchor) => (
        <Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              cursor: "pointer",
              backgroundColor: "#EEBC1D",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            <MainContainer>
              <Profile>
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                  sx={{
                    width: 200,
                    height: 200,
                    cursor: "pointer",
                    backgroundColor: "#EEBC1D",
                    objectFit: "contain",
                  }}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <span style={{ fontWeight: 700, textShadow: "0 0 5px black" }}>
                  Watchlist
                </span>
                <WatchList>
                  {coins.map((coin) => {
                    if (watchlist.includes(coin.id)) {
                      return (
                        <Coin key={coin.name}>
                          <div>
                            <span
                              style={{
                                fontFamily: "Montserrat",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setState(false);
                                history.push(`/coins/${coin.id}`);
                              }}
                            >
                              {coin.name}
                            </span>
                            <span
                              style={{
                                display: "flex",
                                gap: 8,
                                padding: "4px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                color:
                                  coin.price_change_percentage_24h > 0
                                    ? "#00c853"
                                    : "#c62828",
                              }}
                            >
                              {numberWithCommas(
                                Math.abs(
                                  coin.price_change_percentage_24h.toFixed(2)
                                )
                              )}
                              {"%"}
                              {coin.price_change_percentage_24h.toFixed(2) >
                              0 ? (
                                <AiOutlineArrowUp
                                  style={{ color: "#00c853" }}
                                />
                              ) : (
                                <AiOutlineArrowDown
                                  style={{ color: "#c62828" }}
                                />
                              )}
                            </span>
                          </div>
                          <span
                            style={{
                              display: "flex",
                              gap: 8,
                              fontFamily: "sans-serif",
                            }}
                          >
                            {symbol}
                            {numberWithCommas(coin.current_price.toFixed(2))}
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              fontSize="16"
                              onClick={() => removeFromWatchList(coin)}
                              color="#c62828"
                            />
                          </span>
                        </Coin>
                      );
                    } else {
                      return null;
                    }
                  })}
                </WatchList>
              </Profile>
              <Button
                variant="contained"
                sx={{
                  height: "8%",
                  width: "100%",
                  backgroundColor: "gold",
                  marginTop: "20px",
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                }}
                onClick={logoutHandler}
              >
                Logout
              </Button>
            </MainContainer>
          </SwipeableDrawer>
        </Fragment>
      ))}
    </div>
  );
}
