//
// Variables
//

// Elements

const numberBtns = Array.from(document.querySelectorAll(".btn.number"));
const operatorBtns = Array.from(document.querySelectorAll(".btn.operator"));
const display = document.getElementsByClassName("display")[0];
const history = document.getElementsByClassName("history")[0];

// Global Variables

let calcHistory = [];
let currentCalc = new expression();
let numberOnScreen;
let lastActionWasOperator;
let lastActionWasEqual;

//
// EventListeners
//

// Number Buttons: 0-9 .

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

    // Update global var + display updated # to calc screen
    numberOnScreen += numberPressed;
    display.textContent = numberOnScreen;
    console.log(currentCalc);
    console.table(calcHistory);
  });
});

// Operator Buttons: * + / - = C

operatorBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    // Grab current data from calc display & operator button pressed
    const operatorPressed = e.target.getAttribute("data-value");
    numberOnScreen = display.textContent;
    console.log(operatorPressed);

    if (operatorPressed === "clear") {
      clearAll(); // Clear history array & calc object
    } else if (operatorPressed === "equal") {
      // if currentCalc contains an operator, num1 is a number & there's a number is on the calc display
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
      operatorPressed === "add"
    ) {
      // Override pressing equal & then a number functionality (clears history/screen)
      lastActionWasEqual = 0;

      // if last press was an operator, update the object w/ new operator
      if (lastActionWasOperator) {
        currentCalc.operator = operatorPressed;

        // If current calc contains an operator & num1, perform calculation
      } else if (currentCalc.operator && currentCalc.num1) {
        console.log("Operator & Num1 exist");
        currentCalc.num2 = +numberOnScreen;
        clearScreen();
        doCalculation();
        currentCalc.operator = operatorPressed;
      } else if (currentCalc.num1) {
        currentCalc.operator = operatorPressed;
      } else {
        // Create new calculation
        currentCalc = new expression(operatorPressed, numberOnScreen);
      }

      // Notify number buttons of last action
      lastActionWasOperator = 1;
    }

    // console.table(calcHistory);
    // console.table(currentCalc);
  });
});

// Perform calculation function

function doCalculation() {
  currentCalc.operate();
  currentCalc.updateSign();

  display.textContent = currentCalc.answer;
  history.textContent = `${currentCalc.num1} ${currentCalc.sign} ${currentCalc.num2} =`;
  numberOnScreen = currentCalc.answer;

  calcHistory.push(currentCalc);
  currentCalc = "";
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
    this.answer = window[this.operator](this.num1, this.num2);
    this.updateSign();
  };

  // convert operator to word to symbol for history display
  this.updateSign = function () {
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
      default:
        break;
    }
  };

  // on creation, update sign
  this.updateSign();
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

// basic math function operators

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
