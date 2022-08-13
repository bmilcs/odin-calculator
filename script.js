//
// Variables
//
const buttons = Array.from(document.getElementsByTagName("button"));
const display = document.getElementsByClassName("calculation-bar")[0];
let currentDisplay = 0;
let operations = [];

//
// EventListeners
//

// TODO

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    //
    console.log(e.target.getAttribute("data-value"));

    if (e.target.textContent === "C") {
      // clear button
      currentDisplay = "";
      operations = [];
    } else if (
      e.target.textContent === "*" ||
      e.target.textContent === "+" ||
      e.target.textContent === "-" ||
      e.target.textContent === "/"
    ) {
      // On operator press +-/*
      // if array array [0] = number && [1] = old operator
      //      push number to array [2]
      //      answer = operate([1], [0], [2]);
      //      array.splice(0,2, answer, new operator)
      //      display result
      // else
      //   array.push number [0]
      //   array.push operator [1]
      //   clear display
    } else if (e.target.textContent === "=") {
      // On equal press =
      // if array.length !== 2, throw error, return
      // push number to array [2]
      // answer = operate([1], [0], [2]);
      // array.splice(0,2, answer, new operator)
      // show results in display
    } else {
      // clear screen
      currentDisplay += e.target.textContent;
    }

    display.textContent = currentDisplay;
  });
});

//
// event listeners
//

// basic math function operators

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  return x / y;
}

// operate: takes operator and 2 numbers

function operate(operator, x, y) {
  return window[operator](x, y);
}
