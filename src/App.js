import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import MessageAlert from "./components/Alert";
import Header from "./components/Header";

const Homepage = React.lazy(() => import("./pages/Homepage"));
const Coinpage = React.lazy(() => import("./pages/Coinpage"));

const App = () => {
  const Main = styled("div")({
    backgroundColor: "#14161A",
    color: "white",
    height: "100vh",
  });

  return (
    <>
      <Main>
        <Header />
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <Route path="/" component={Homepage} exact />
          <Route path="/coins/:id" component={Coinpage} />
        </Suspense>
      </Main>
      <MessageAlert />
    </>
  );
};

export default App;
