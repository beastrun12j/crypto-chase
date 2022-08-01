import { Button, LinearProgress, styled, Typography } from "@mui/material";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { numberWithCommas } from "../components/Banner/Carousel";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { db } from "../firebase";
import { CryptoState } from "../store/CryptoProvider";

const Coinpage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [desc, setDesc] = useState("");
  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const MainContainer = styled("div")(({ theme }) => ({
    display: "flex",
    backgroundImage: "linear-gradient(to right, black , #1a237e)",
    height: "100%",
    overflow: "hidden",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  }));

  const SideBar = styled("div")(({ theme }) => ({
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  }));

  const MarketData = styled("div")(({ theme }) => ({
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  }));

  const inWatchList = watchlist.includes(coin?.id);

  const addToWatchList = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin?.id] : [coin?.id],
      });
      setAlert({
        open: true,
        message: `${coin.name} added to watchlist`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Error adding coin to watchlist",
        type: "error",
      });
    }
  };

  const removeFromWatchList = async () => {
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

  useEffect(() => {
    const fetchCoin = async () => {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
      setDesc(data?.description.en.split(". ")[0]);
    };
    fetchCoin();
  }, [id]);

  if (!coin) {
    return <LinearProgress style={{ backgroundColor: "gold" }} />;
  }

  return (
    <MainContainer>
      <SideBar>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            marginbottom: 20,
            fontFamily: "Montserrat",
          }}
        >
          {coin?.name}
        </Typography>
        <Typography
          variant="subtitle1"
          style={{
            width: "100%",
            fontFamily: "Montserrat",
            padding: 25,
            paddingBottom: 15,
            paddingTop: 0,
            textAlign: "justify",
          }}
        >
          {parse(desc)}
        </Typography>
        <MarketData>
          <span style={{ display: "flex", marginBottom: 20 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginbottom: 20,
                fontFamily: "Montserrat",
              }}
            >
              Rank :
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {coin?.market_cap_rank}
            </Typography>
          </span>
          <span style={{ display: "flex", marginBottom: 20 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginbottom: 20,
                fontFamily: "Montserrat",
              }}
            >
              Current Price :
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex", marginBottom: 20 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginbottom: 20,
                fontFamily: "Montserrat",
              }}
            >
              Market Cap :
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
            </Typography>
          </span>

          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                marginTop: "10px",
                backgroundColor: inWatchList ? "#ff0000" : "#EEBC1D",
                fontFamily: "Montserrat",
                fontWeight: "bold",
                color: inWatchList ? "white" : "black",
              }}
              onClick={inWatchList ? removeFromWatchList : addToWatchList}
            >
              {inWatchList ? "Remove from watchlist" : "Add to watchlist"}
            </Button>
          )}
        </MarketData>
      </SideBar>
      <CoinInfo coin={coin} />
    </MainContainer>
  );
};

export default Coinpage;
