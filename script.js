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

console.log(operate("multiply", 5, 10));
