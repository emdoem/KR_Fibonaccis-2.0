import React, { useState, useMemo, useCallback } from "react";
import moize from "moize";

import "./styles.css";

function fib(n) {
  if (n < 2) {
    return n;
  }
  return fib(n - 2) + fib(n - 1);
}
const memoizedFib = moize(fib);

export default class App extends React.Component {
  state = {
    numbers: [],
    baseNumber: 15,
    range: 5
  };

  generateNewNumber(prevState) {
    return {
      id: prevState.numbers.length + 1,
      value: Math.floor(Math.random() * prevState.range) + prevState.baseNumber
    };
  }
  handleRangeChange = (range) => this.setState({ range });
  handleBaseNumberChange = (baseNumber) => this.setState({ baseNumber });
  render() {
    const rangeLabel = `Spread: ${this.state.range}`;
    return (
      <div className="App">
        <H1>Fibonaccis</H1>
        <RangeInput
          onChange={this.handleBaseNumberChange}
          value={this.state.baseNumber}
          min="1"
          max="35"
        >
          {`Number: ${this.state.baseNumber}`}
        </RangeInput>
        <br />
        <RangeInput
          onChange={this.handleRangeChange}
          value={this.state.range}
          min="0"
          max="5"
        >
          {rangeLabel}
        </RangeInput>
        <br />
        <button
          onClick={() => {
            this.setState((prevState) => {
              const newNumber = this.generateNewNumber(prevState);
              return { numbers: [newNumber, ...prevState.numbers] };
            });
          }}
        >
          Prepend new number
        </button>
        <button
          onClick={() => {
            this.setState((prevState) => {
              const newNumber = this.generateNewNumber(prevState);
              return { numbers: [...prevState.numbers, newNumber] };
            });
          }}
        >
          Append new number
        </button>
        <Fibs numbers={this.state.numbers} />
      </div>
    );
  }
}

const Fibs = React.memo(({ numbers }) => {
  const handleClick = useCallback(
    (n, fibN) => console.log(`Clicked on fib(${n}) = ${fibN}`),
    []
  );
  return (
    <>
      {numbers.map((number) => (
        <Fib onClick={handleClick} key={number.id} n={number.value} />
      ))}
    </>
  );
});

const H1 = React.memo(function H1({ children }) {
  return <h1>{children}</h1>;
});

const RangeInput = React.memo(function RangeInput({
  children,
  onChange,
  min,
  max,
  value
}) {
  return (
    <label>
      {children}
      <input
        onChange={(event) => onChange(parseInt(event.target.value, 10))}
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
      />
    </label>
  );
});
const COLORS = ["black", "red", "green", "blue"];
const Fib = React.memo(function Fib({ n, onClick }) {
  const [colorIndex, setColorIndex] = useState(n % COLORS.length);
  const color = COLORS[colorIndex];
  const fibN = memoizedFib(n);
  // const fibN = useMemo(() => fib(n), [n]);
  function changeColor() {
    setColorIndex((prevColorIndex) => (prevColorIndex + 1) % COLORS.length);
  }
  return (
    <li onClick={() => onClick(n, fibN)} style={{ color }}>
      fib({n}) = {fibN} <button onClick={changeColor}>Change Color</button>
    </li>
  );
});
