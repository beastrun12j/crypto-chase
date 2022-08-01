import { CircularProgress, styled } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { HistoricalChart } from "../config/api";
import { chartDays } from "../config/data";
import { CryptoState } from "../store/CryptoProvider";
import SelectButton from "./SelectButton";

const CoinInfo = (props) => {
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  const MainContainer = styled("div")(({ theme }) => ({
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  }));

  useEffect(() => {
    const fetchHistoricalData = async () => {
      const { data } = await axios.get(
        HistoricalChart(props.coin.id, days, currency)
      );
      setHistoricalData(data.prices);
      console.log(data.prices);
    };
    fetchHistoricalData();
  }, [currency, days, props.coin.id]);

  return (
    <ThemeProvider theme={darkTheme}>
      <MainContainer>
        {!historicalData ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicalData.map((coin) => {
                  const date = new Date(coin[0]);
                  const minutes =
                    date.getMinutes() < 10
                      ? `0${date.getMinutes()}`
                      : date.getMinutes();
                  const time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${minutes} PM`
                      : `${date.getHours()}:${minutes} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historicalData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                  responsive: true,
                },
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                marginTop: 20,
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => setDays(day.value)}
                  selected={days === day.value}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </MainContainer>
    </ThemeProvider>
  );
};

export default CoinInfo;
