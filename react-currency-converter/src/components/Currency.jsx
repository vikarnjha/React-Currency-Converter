import { useEffect, useState } from "react";
import Axios from "axios";
import Dropdown from "react-dropdown";
import { HiSwitchHorizontal } from "react-icons/hi";
import "react-dropdown/style.css";
import "./Currency.css"

const Currency = () => {
  const [info, setInfo] = useState({});
  const [input, setInput] = useState(0);
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");
  const [options, setOptions] = useState([]);
  const [output, setOutput] = useState(0);

  // Fetch exchange rates when "from" currency changes
  useEffect(() => {
    Axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`)
      .then((res) => {
        setInfo(res.data[from] || {});
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [from]);

  // Update currency options list
  useEffect(() => {
    if (info && Object.keys(info).length > 0) {
      setOptions(Object.keys(info));
    }
  }, [info]);

  // Convert currency whenever input, "to", or "info" changes
  useEffect(() => {
    if (info[to]) {
      setOutput(input * info[to]);
    }
  }, [input, to, info]);

  // Swap "from" and "to" currencies
  const flip = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <>
      <div className="App">
        <div className="heading">
          <h1>React Currency Converter</h1>
        </div>
        <div className="container">
          <div className="left">
            <h3>Amount</h3>
            <input
              type="number"
              placeholder="Enter the amount"
              value={input}
              onChange={(e) => setInput(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="middle">
            <h3>From</h3>
            <Dropdown
              options={options}
              onChange={(e) => setFrom(e.value)}
              value={from}
              placeholder="From"
            />
          </div>
          <div className="switch">
            <HiSwitchHorizontal size="30px" onClick={flip} />
          </div>
          <div className="right">
            <h3>To</h3>
            <Dropdown
              options={options}
              onChange={(e) => setTo(e.value)}
              value={to}
              placeholder="To"
            />
          </div>
        </div>
        <div className="result">
          <h2>Converted Amount:</h2>
          <p>{`${input} ${from.toUpperCase()} = ${output.toFixed(2)} ${to.toUpperCase()}`}</p>
        </div>
      </div>
    </>
  );
};

export default Currency;
