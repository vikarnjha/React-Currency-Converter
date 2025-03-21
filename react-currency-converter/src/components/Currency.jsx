import { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import { HiSwitchHorizontal } from "react-icons/hi";
import Select from "react-select";
import "./Currency.css";

const Currency = () => {
  const [info, setInfo] = useState({});
  const [input, setInput] = useState(0);
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");
  const [options, setOptions] = useState([]);
  const [output, setOutput] = useState(0);

  // Function to convert the currency
  const convert = useCallback(() => {
    if (info[to.toLowerCase()] && input) {
      setOutput(input * info[to.toLowerCase()]);
    } else {
      setOutput(0);
    }
  }, [info, input, to]);

  // Fetch currency data when 'from' currency changes
  useEffect(() => {
    Axios.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`
    ).then((res) => {
      setInfo(res.data[from.toLowerCase()]);
    });
  }, [from]);

  // Update available currency options and call convert()
  useEffect(() => {
    setOptions(Object.keys(info)); // Store options in lowercase
    convert();
  }, [info, convert]);

  // Function to switch between currencies
  const flip = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="App">
      <div className="heading">
        <h1>Currency Converter</h1>
      </div>
      <div className="container">
        <div className="left">
          <h3>Amount</h3>
          <input
            type="text"
            placeholder="Enter the amount"
            value={input}
            onChange={(e) => {
              let value = e.target.value.replace(/^0+/, ""); // Remove leading zeros
              if (!isNaN(value)) {
                setInput(value);
              }
            }}
          />
        </div>
        <div className="middle">
          <h3>From</h3>
          <Select
            options={options.map((code) => ({
              label: code.toUpperCase(),
              value: code,
            }))} // Convert to object format
            onChange={(e) => setFrom(e.value)}
            value={{ label: from.toUpperCase(), value: from }} // Ensure display is uppercase
            placeholder="From"
          />
        </div>
        <div className="switch">
          <HiSwitchHorizontal size="30px" onClick={flip} />
        </div>
        <div className="right">
          <h3>To</h3>
          <Select
            options={options.map((code) => ({
              label: code.toUpperCase(),
              value: code,
            }))}
            onChange={(e) => setTo(e.value)}
            value={{ label: to.toUpperCase(), value: to }}
            placeholder="To"
          />
        </div>
      </div>
      <div className="result">
        <h2>Converted Amount:</h2>
        <p>{`${input || 0} ${from.toUpperCase()} = ${output.toFixed(
          2
        )} ${to.toUpperCase()}`}</p>
      </div>
    </div>
  );
};

export default Currency;
