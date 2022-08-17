//
// Variables
//

// Elements

const numberBtns = Array.from(document.querySelectorAll(".btn.number"));
const operatorBtns = Array.from(document.querySelectorAll(".btn.operator"));
const display = document.querySelector(".display");
const history = document.querySelector(".history.one");
const history2 = document.querySelector(".history.two");

// Global Variables

let currentCalc = new expression();
let calcHistory = [];
let numberOnScreen;
let lastActionWasOperator;
let lastActionWasEqual;

//
// Keyboard Navigation
//

window.addEventListener("keyup", (e) => {
  const keyPressed = e.key || e.keyCode;

  if (keyPressed.match(/[\d.]/)) {
    numberFunction(keyPressed);
  } else if (keyPressed === "-") operatorFunction("subtract");
  else if (keyPressed === "+") operatorFunction("add");
  else if (keyPressed === "Enter") operatorFunction("equal");
  else if (keyPressed === "/") operatorFunction("divide");
  else if (keyPressed === "*") operatorFunction("multiply");
  else if (keyPressed === "%") operatorFunction("modulus");
  else if (keyPressed === " " || keyPressed === "c") operatorFunction("clear");
  else if (keyPressed === "Backspace") operatorFunction("erase");
  else if (keyPressed === "=" || keyPressed === "enter")
    operatorFunction("equal");
});

//
// Operator Buttons
//

operatorBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    const operatorPressed = e.target.getAttribute("data-value");
    operatorFunction(operatorPressed);
  });
});

function operatorFunction(operatorPressed) {
  numberOnScreen = display.textContent;
  operatorBtns.forEach((btn) => btn.classList.remove("btn-highlight"));

  if (operatorPressed === "clear") {
    clearAll(); // history, display, history & display
  } else if (operatorPressed === "plusminus") {
    togglePlusMinus();
  } else if (operatorPressed === "erase") {
    display.textContent = display.textContent.slice(0, -1);
  } else if (operatorPressed === "equal") {
    if (currentCalc.num1 !== "NaN" && currentCalc.operator && numberOnScreen) {
      // safe to perform calculation
      currentCalc.num2 = +numberOnScreen;
      currentCalc.operate();
      lastActionWasOperator = 1;
      lastActionWasEqual = 1;
    }
  } else if (
    operatorPressed === "multiply" ||
    operatorPressed === "divide" ||
    operatorPressed === "subtract" ||
    operatorPressed === "add" ||
    operatorPressed === "modulus"
  ) {
    if (numberOnScreen === "") {
      // prevent operator action before a number is present
      return;
    } else if (lastActionWasOperator) {
      currentCalc.updateOperator(operatorPressed);
    } else if (currentCalc.operator && currentCalc.num1) {
      // first, complete existing calculation
      currentCalc.num2 = +numberOnScreen;
      currentCalc.operate();
      // then, push operator to new currentCalc object
      currentCalc.updateOperator(operatorPressed); // for new currentCalc
    } else {
      // create new calculation & display first half of expression above it
      currentCalc = new expression(operatorPressed, numberOnScreen);
      currentCalc.generatePartialExpression();
      updateHistory(currentCalc.expressionPartial);
    }

    lastActionWasEqual = 0;
    lastActionWasOperator = 1;

    document
      .querySelector(`[data-value=${operatorPressed}]`)
      .classList.add("btn-highlight");
  }
}

//
// Number Button Click Events: 0-9 .
//

numberBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    const numberPressed = e.target.getAttribute("data-value");
    numberFunction(numberPressed);
  });
});

function numberFunction(numberPressed) {
  numberOnScreen = display.textContent;

  if (lastActionWasOperator === 1) {
    // occurs when num1 & an operator exists
    lastActionWasOperator = 0;

    if (currentCalc.num1) {
      currentCalc.generatePartialExpression();
      updateHistory(currentCalc.expressionPartial);
    }

    clearScreen();
  }

  if (lastActionWasEqual === 1) {
    // occurs when a user isn't chaining multiple calculations together
    lastActionWasEqual = 0;
    clearAll();
  }

  // prevent multiple prefixing zero's (0001, 000302)
  if (numberPressed === "0" && numberOnScreen.match(/^0$/g)) return;

  // prevent prefixing zero if a decimal isn't present after it (0100, 0511)
  if (numberOnScreen.match(/^0$/g) && numberPressed !== ".") updateScreen("");

  // prevent multiple decimal dots in a single number
  if (numberPressed === "." && numberOnScreen.match("."))
    updateScreen(numberOnScreen.replace(".", ""));

  // update global var + display updated # to calc screen
  updateScreen((numberOnScreen += numberPressed));
}

//
// Expression constructor
//

function expression(operator, num1, num2) {
  this.num1 = +num1;
  this.num2 = +num2;
  this.operator = operator;

  // operate method
  this.operate = function () {
    if (this.operator === "divide" && this.num2 === 0) {
      alert("Dividing numbers by zero is a no no.");
      return 1;
    }
    this.answer = roundNumber(window[this.operator](this.num1, this.num2), 5);
    this.updateOperator();
    this.generateFullExpression();
    console.table(this);
    updateScreen(this.answer);
    updateHistory(this.expression);
    calcHistory.push(this);
    currentCalc = new expression("", numberOnScreen);
  };

  // generate expression "temporary" expression string: 55 +
  this.generatePartialExpression = function () {
    this.expressionPartial = `${this.num1} ${this.sign}`;
  };

  // generate expression string to place in history (after calculation is complete)
  this.generateFullExpression = function () {
    this.expression = `${this.num1} ${this.sign} ${this.num2} =`;
    this.expressionWithAnswer = `${this.expression} ${this.answer}`;
  };

  // convert operator word to symbol for history display
  this.updateOperator = function (operator = this.operator) {
    this.operator = operator;
    switch (this.operator) {
      case "multiply":
        this.sign = "x";
        break;
      case "divide":
        this.sign = "/";
        break;
      case "subtract":
        this.sign = "-";
        break;
      case "add":
        this.sign = "+";
        break;
      case "modulus":
        this.sign = "%";
        break;
      default:
        break;
    }
  };

  // on creation, update sign
  this.updateOperator();
}

//
// Toggle Plus Minus
//

function togglePlusMinus() {
  if (!numberOnScreen.startsWith("-")) {
    updateScreen("-" + numberOnScreen);
  } else {
    updateScreen(numberOnScreen.slice(1));
  }
}

//
// Update Screen/History Function
//

function updateScreen(content) {
  numberOnScreen = content;
  display.textContent = numberOnScreen;
}

function updateHistory(content) {
  // move history to history2 div if this is a consecutive calculation
  if (calcHistory.length !== 0) {
    history2.textContent =
      calcHistory[calcHistory.length - 1].expressionWithAnswer;
  }
  history.textContent = content;
}

//
// Clear functions
//

function clearAll() {
  currentCalc = new expression();
  calcHistory = [];
  clearScreen();
  history.textContent = "";
  history2.textContent = "";
}

function clearScreen() {
  numberOnScreen = "";
  display.textContent = "";
}

//
// Rounding Function w/o Trailing Zeros
//

function roundNumber(number, decimalPlaces) {
  const x = Math.pow(10, decimalPlaces);
  return Math.round(number * x) / x;
}

//
// Basic math functions
//

function add(x, y) {
  return +x + +y;
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

function modulus(x, y) {
  return x % y;
}
