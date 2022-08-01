import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { CoinList } from "../config/api";
import { auth, db } from "../firebase";
import Context from "./crypto-context";

const CryptoProvider = (props) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [coins, setCoins] = useState([]);
  const [loading, setloading] = useState(false);
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else setUser(null);
    });
  }, []);

  const fetchCoins = async () => {
    setloading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setloading(false);
  };

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else setSymbol("$");
  }, [currency]);

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user.uid);
      var unsubscribe = onSnapshot(coinRef, (snapshot) => {
        if (snapshot.exists) {
          setWatchlist(snapshot.data().coins);
        } else {
          console.log("No items in the list");
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <Context.Provider
      value={{
        currency,
        symbol,
        setCurrency,
        coins,
        loading,
        fetchCoins,
        alert,
        setAlert,
        user,
        watchlist,
        setWatchlist,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export const CryptoState = () => {
  return useContext(Context);
};

export default CryptoProvider;
