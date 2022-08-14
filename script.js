//
// Variables
//

// Elements

const numberBtns = Array.from(document.querySelectorAll(".btn.number"));
const operatorBtns = Array.from(document.querySelectorAll(".btn.operator"));
const display = document.querySelector(".display");
const history = document.querySelector(".history.one");

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

    // Determine if last button pressed was an operator
    if (lastActionWasOperator === 1) {
      clearScreen();
      lastActionWasOperator = 0;
    }

    // If last button was equals & a number is pressed
    if (lastActionWasEqual === 1) {
      clearAll();
      lastActionWasEqual = 0;
    }

    // Decimal place handling (prevent multiple .)
    if (numberPressed === "." && numberOnScreen.match(".")) {
      updateScreen(numberOnScreen.replace(".", ""));
    }

    // Update global var + display updated # to calc screen
    numberOnScreen += numberPressed;
    display.textContent = numberOnScreen;
  });
});

//
// Operator Button Events: * + / - = C
//

operatorBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    // Grab current data from calc display & operator button pressed
    const operatorPressed = e.target.getAttribute("data-value");
    numberOnScreen = display.textContent;

    if (operatorPressed === "clear") {
      clearAll(); // Clear history array & calc object
    } else if (operatorPressed === "plusminus") {
      togglePlusMinus(); // Toggle negative/positive number
    } else if (operatorPressed === "equal") {
      // if currentCalc contains an operator & a num1 & there's a number is on the calc display
      if (
        currentCalc.operator &&
        currentCalc.num1 !== "NaN" &&
        numberOnScreen
      ) {
        // push number on screen to num2 & do calculation
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
      // Override pressing equal & then a number (clears history/screen)
      lastActionWasEqual = 0;

      if (lastActionWasOperator) {
        // if last press was an operator, update the object w/ new operator
        currentCalc.updateOperator(operatorPressed);
      } else if (currentCalc.operator && currentCalc.num1) {
        // If current calc contains an operator & num1, perform calculation
        currentCalc.num2 = +numberOnScreen;
        clearScreen();
        doCalculation();
        currentCalc.updateOperator(operatorPressed);
      } else if (currentCalc.num1) {
        currentCalc.updateOperator(operatorPressed);
      } else {
        // Create new calculation
        currentCalc = new expression(operatorPressed, numberOnScreen);
        history.textContent = `${currentCalc.num1} ${currentCalc.sign} `;
      }

      // Notify number buttons of last action
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
  history.textContent = `${currentCalc.num1} ${currentCalc.sign} ${currentCalc.num2} = ${currentCalc.answer}`;
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
    if (this.operator === "divide" && this.num2 === 0) return 1;
    this.answer = roundNumber(window[this.operator](this.num1, this.num2), 5);
    this.updateOperator();
  };

  // convert operator to word to symbol for history display
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
// Update Screen Function
//

function updateScreen(content) {
  numberOnScreen = content;
  display.textContent = numberOnScreen;
}

//
// Clear functions
//

function clearAll() {
  currentCalc = new expression();
  calcHistory = [];
  clearScreen();
  history.textContent = "";
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
