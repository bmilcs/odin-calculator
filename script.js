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

let calcHistory = [];
let currentCalc = new expression();
let numberOnScreen;
let lastActionWasOperator;
let lastActionWasEqual;

//
// EventListeners
//

// Number Button Events: 0-9 .

numberBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    // Grab current data from calc display & number button pressed
    const numberPressed = e.target.getAttribute("data-value");
    numberOnScreen = display.textContent;

    if (lastActionWasOperator === 1) {
      lastActionWasOperator = 0;
      // prevent NaN/undefined issue (operator followed by clear)
      if (currentCalc.num1) {
        currentCalc.generatePartialExpression();
        updateHistory(currentCalc.expressionPartial);
      }
      clearScreen();
    }

    if (lastActionWasEqual === 1) {
      lastActionWasEqual = 0;
      clearAll();
    }

    // Decimal place handling (prevent multiple .)
    if (numberPressed === "." && numberOnScreen.match(".")) {
      updateScreen(numberOnScreen.replace(".", ""));
    }

    // Update global var + display updated # to calc screen
    updateScreen((numberOnScreen += numberPressed));
  });
});

//
// Operator Button Events: * + / - = C % +-
//

operatorBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    // Grab current data from calc display & operator button pressed
    const operatorPressed = e.target.getAttribute("data-value");
    numberOnScreen = display.textContent;

    operatorBtns.forEach((btn) => btn.classList.remove("btn-highlight"));

    if (operatorPressed === "clear") {
      clearAll(); // Clear history array & calc object
    } else if (operatorPressed === "plusminus") {
      togglePlusMinus(); // Toggle negative/positive number
    } else if (operatorPressed === "erase") {
      display.textContent = display.textContent.slice(0, -1);
    } else if (operatorPressed === "equal") {
      if (
        currentCalc.num1 !== "NaN" &&
        currentCalc.operator &&
        numberOnScreen
      ) {
        currentCalc.num2 = +numberOnScreen;
        doCalculation();
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
      console.log(currentCalc.num1);
      console.log(display.textContent);
      if (currentCalc.num1 === "NaN") {
        console.log("fail");
      } else if (lastActionWasOperator) {
        currentCalc.updateOperator(operatorPressed);
      } else if (currentCalc.operator && currentCalc.num1) {
        currentCalc.num2 = +numberOnScreen;
        clearScreen();
        doCalculation();
        // ^ clears currentCalc. therefore:
        currentCalc.updateOperator(operatorPressed);
      } else {
        // create new calculation
        currentCalc = new expression(operatorPressed, numberOnScreen);
        // history.textContent = `${currentCalc.num1} ${currentCalc.sign} `;
        currentCalc.generatePartialExpression();
        updateHistory(currentCalc.expressionPartial);
      }

      e.target.classList.add("btn-highlight");
      lastActionWasEqual = 0;
      lastActionWasOperator = 1;
    }
  });
});

//
// Perform calculation function
//

function doCalculation() {
  currentCalc.operate();
  updateScreen(currentCalc.answer);
  updateHistory(currentCalc.expression);
  calcHistory.push(currentCalc);
  currentCalc = new expression("", numberOnScreen);
}

//
// Operator constructor
//

function expression(operator, num1, num2) {
  this.num1 = +num1;
  this.num2 = +num2;
  this.operator = operator;

  // operate method
  this.operate = function () {
    if (this.operator === "divide" && this.num2 === 0) {
      clearScreen();
      return;
    }
    this.answer = roundNumber(window[this.operator](this.num1, this.num2), 5);
    this.updateOperator();
    this.generateFullExpression();
    console.table(this);
  };

  this.generatePartialExpression = function () {
    this.expressionPartial = `${this.num1} ${this.sign}`;
  };

  // generate expression string to place in history
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
  // Push history upward if there is a history of calculations
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
