import { Container, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Carousel from "./Carousel";

const Banner = () => {
  const BannerBody = styled("div")({
    backgroundImage: "url(./banner.jpeg)",
  });

  const Tagline = styled("div")({
    display: "flex",
    height: "40%",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  });

  return (
    <BannerBody>
      <Container
        sx={{
          height: 400,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <Tagline>
          <Typography
            variant="h2"
            style={{
              fontWeight: "bold",
              marginBottom: 15,
              fontFamily: "Montserrat",
            }}
          >
            Crypto Chase
          </Typography>
          <Typography
            variant="subtitle2"
            style={{
              color: "darkgrey",
              fontFamily: "Montserrat",
              textTransform: "capitalize",
            }}
          >
            Track your crypto currencies
          </Typography>
        </Tagline>
        <Carousel />
      </Container>
    </BannerBody>
  );
};

export default Banner;
