const calculatorDisplay = document.querySelector('.output-screen h1');
const inputBtns = document.querySelectorAll('button');
const clearBtn = document.getElementById('clear-btn');

let firstValue = 0;
let operatorValue = '';
let awaitingNextValue = false;

function sendNumberValue(number) {
  // Replace current display value if first value is entered
  if (awaitingNextValue) {
    calculatorDisplay.textContent = number;
    awaitingNextValue = false;
  } else {
    // If current display value is 0, replace it, if not add number to display value
    const displayValue = calculatorDisplay.textContent;
    calculatorDisplay.textContent = 
      (displayValue === '0')
      ?
      number
      :
      displayValue + number;
  }
}

function addDecimal() {
  // If operator pressed, don't add decimal
  if (awaitingNextValue) return;
  // If no decimal, add one
  //Search with .includes()
  if (!calculatorDisplay.textContent.includes('.')) {
    calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`;
  }
}

// Calculate first and second values depending on operator
// Object with 'reserved words' as props => calculate = {'/','*','+','-','='}
const calculate = {
  '/': (firstNumber, secondNumber) => firstNumber / secondNumber,
  '*': (firstNumber, secondNumber) => firstNumber * secondNumber,
  '+': (firstNumber, secondNumber) => firstNumber + secondNumber,
  '-': (firstNumber, secondNumber) => firstNumber - secondNumber,
  '=': (firstNumber, secondNumber) => secondNumber,
  'Pow': (firstNumber, secondNumber) => (Math.pow(firstNumber, secondNumber)),
};

function useFunction(funct) {
  const x = Number(calculatorDisplay.textContent);
  awaitingNextValue = true;
  switch (funct) {
    case "Abs":
        calculatorDisplay.textContent = Math.abs(x);
      break;
    case "SqRoot":
        calculatorDisplay.textContent = Math.round(Math.sqrt(x) * Math.pow(10,15))/ Math.pow(10,15);
      break;
    case "Exp":
        calculatorDisplay.textContent = Math.round(Math.exp(x) * Math.pow(10,15))/ Math.pow(10,15);
      break;
    case "Ln":
        calculatorDisplay.textContent = Math.round(Math.log(x) * Math.pow(10,15))/ Math.pow(10,15);
      break;
    case "Sin":
        calculatorDisplay.textContent = Math.round(Math.sin(x) * Math.pow(10,15))/ Math.pow(10,15);
      break;
    case "Cos":
        calculatorDisplay.textContent = Math.round(Math.cos(x) * Math.pow(10,15))/ Math.pow(10,15);
      break;
    case "Tan":
        calculatorDisplay.textContent = Math.round(Math.tan(x) * Math.pow(10,15))/ Math.pow(10,15);
      break;
    case "Sign":
        calculatorDisplay.textContent = (-x);
      break;
    case "Rand":
        calculatorDisplay.textContent = Math.round(Math.random() * Math.pow(10,15))/ Math.pow(10,15);
      break;
    case "1/":
        calculatorDisplay.textContent = Math.round(1/(x) * Math.pow(10,15))/ Math.pow(10,15);
      break;
    case "^2":
        calculatorDisplay.textContent = Math.pow(x,2);
      break;
    default:
        calculatorDisplay.textContent = funct +"= Other Funct of ("+x+")";
      break;
  }
}

function useConst(constante) {
  awaitingNextValue = true;
  switch (constante) {
    case "PI": 
      calculatorDisplay.textContent = Math.PI     
      break;
    case "E": 
      calculatorDisplay.textContent = Math.E     
      break;
    default:
      break;
  }
}

function useOperator(operator) {
  const currentValue = Number(calculatorDisplay.textContent);
  // Prevent multiple operators
  if (operatorValue && awaitingNextValue) {
    operatorValue = operator;
    return;
  }
  // Assign firstValue if no value
  if (!firstValue) {
    firstValue = currentValue;
  } else {
    const calculation = calculate[operatorValue](firstValue, currentValue);
    calculatorDisplay.textContent = calculation;
    firstValue = calculation;
  }
  // Ready for next value, store operator
  awaitingNextValue = true;
  operatorValue = operator;
}

// Add Event Listeners for numbers, operators, decimal
inputBtns.forEach((inputBtn) => {
  if (inputBtn.classList.length === 0) {
    inputBtn.addEventListener('click', () => sendNumberValue(inputBtn.value));
  } else if (inputBtn.classList.contains('operator')) {
    inputBtn.addEventListener('click', () => useOperator(inputBtn.value));
  } else if (inputBtn.classList.contains('function')) {
    inputBtn.addEventListener('click', () => useFunction(inputBtn.value));
  } else if (inputBtn.classList.contains('const')) {
    inputBtn.addEventListener('click', () => useConst(inputBtn.value));
  } else if (inputBtn.classList.contains('decimal')) {
    inputBtn.addEventListener('click', () => addDecimal());
  }
});

// Reset all values, display
function resetAll() {
  firstValue = 0;
  operatorValue = '';
  awaitingNextValue = false;
  calculatorDisplay.textContent = '0';
}

// Event Listener
clearBtn.addEventListener('click', resetAll);
