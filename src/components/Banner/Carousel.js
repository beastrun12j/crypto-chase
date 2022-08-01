import { styled } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../store/CryptoProvider";

export const numberWithCommas = (x) => {
  if (!x) return 0;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Carousel = () => {
  const { currency, symbol } = CryptoState();
  const [trending, setTrending] = useState([]);
  const MainCarousel = styled("div")({
    height: "50%",
    display: "flex",
    alignItems: "center",
  });

  const responsive = {
    0: { items: 2 },
    512: { items: 4 },
  };

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrending(data);
    };
    fetchTrendingCoins();
  }, [currency]);

  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;
    return (
      <Link
        to={`/coins/${coin.id}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          textTransform: "uppercase",
          color: "white",
        }}
      >
        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{
            marginBottom: 10,
          }}
        />
        <span>
          {coin.symbol} &nbsp;
          <span
            style={{
              color: profit ? "rgb(14, 203, 129)" : "red",
            }}
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h.toFixed(2)}
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol}
          {numberWithCommas(coin.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  return (
    <MainCarousel>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </MainCarousel>
  );
};

export default Carousel;
