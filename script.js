const calculatorDisplay = document.querySelector('.output-screen h1');
const inputBtns = document.querySelectorAll('button');
const clearBtn = document.getElementById('clear-btn');

let firstValue = 0;
let operatorValue = '';
let awaitingNextValue = false;
//for keeping operating calculation after function +/- pressed
let keepOperating = false;

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
  'Enter': (firstNumber, secondNumber) => secondNumber,
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
      calculatorDisplay.textContent = Math.round(Math.sqrt(x) * Math.pow(10, 15)) / Math.pow(10, 15);
      break;
    case "Exp":
      calculatorDisplay.textContent = Math.round(Math.exp(x) * Math.pow(10, 15)) / Math.pow(10, 15);
      break;
    case "Ln":
      calculatorDisplay.textContent = Math.round(Math.log(x) * Math.pow(10, 15)) / Math.pow(10, 15);
      break;
    case "Sin":
      calculatorDisplay.textContent = Math.round(Math.sin(x) * Math.pow(10, 15)) / Math.pow(10, 15);
      break;
    case "Cos":
      calculatorDisplay.textContent = Math.round(Math.cos(x) * Math.pow(10, 15)) / Math.pow(10, 15);
      break;
    case "Tan":
      calculatorDisplay.textContent = Math.round(Math.tan(x) * Math.pow(10, 15)) / Math.pow(10, 15);
      break;
    case "Sign":
      {
        calculatorDisplay.textContent = (-x);
        keepOperating = true;
      }
      break;
    case "Rand":
      calculatorDisplay.textContent = Math.round(Math.random() * Math.pow(10, 15)) / Math.pow(10, 15);
      break;
    case "1/":
      calculatorDisplay.textContent = Math.round(1 / (x) * Math.pow(10, 15)) / Math.pow(10, 15);
      break;
    case "^2":
      calculatorDisplay.textContent = Math.pow(x, 2);
      break;
    default:
      calculatorDisplay.textContent = funct + "= Other Funct of (" + x + ")";
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
  if (operatorValue && awaitingNextValue && !keepOperating) {
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
  if (!keepOperating) {
    awaitingNextValue = true;
    operatorValue = operator;
  }
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
  keepOperating = false;
  calculatorDisplay.textContent = '0';
}

// Event Listener
clearBtn.addEventListener('click', () => resetAll());

// Detect key press for valid characters and process
//document.onkeypress = logKey; <=> document.addEventListener('keypress', logKey);
document.addEventListener('keypress', logKey);
function keyboardKeysAccepted(event) {
  return (event.charCode === 0 || /[-+*\/0-9.\r=]/.test(String.fromCharCode(event.charCode)));
}
function logKey(e) {
  //preventDefault to avoid 'Enter' to trigger also 'Click' on last selected field  
  e.preventDefault();

  /* console.log("Keyboard Key Pressed: code=", ` ${e.code}`, " key=", e.key, "; Check if accepted =>", keyboardKeysAccepted(e)); */

  // Store key pressed data, defaults to undefined.
  if (keyboardKeysAccepted(e)) {
    // console.log('input key = \'',e.key, '\' is OK for processing');
    switch (e.key) {
      // Calculate '+ - * /' and '='
      case (e.key.match(/[-+*\/=]/) || {}).input:
        {
          useOperator(e.key);
          break;
        }
      // Enter
      case 'Enter':
        {
          useOperator(e.key);
          break;
        }
      /* 
      // =
      case '=':
        {
          useOperator(e.key);
          break;
        } 
      */
      // Only numbers.
      //('|| {}' for avoidning .input on null error)
      case (e.key.match(/\d/) || {}).input:
        {
          sendNumberValue(e.key);
          break;
        }
      // Decimal 
      case '.':
        {
          addDecimal(e.key);
          break;
        }
      // Clear screen.
      /* case 'Delete':
        {
          keyPressed = 'CA';
          break;
        } */
      default:
        console.log(e.key, "=> not in cases! type=", typeof e.key);
        break;
    }
  } else {
    // Log input for troubleshooting incorrect data.
    console.log('Keyboard input key = \'', e.key, '\' is not supported for this calculator.\nPlease use numbers 0-9; operators + - * /; decimal point . ; Enter or =, or clic buttons displayed.');
    alert('Keyboard key = \' ' + e.key + ' \' is not supported for this calculator.\nUse numbers 0-9; operators + - * /; decimal point . ; Enter or =\nOr clic buttons displayed.');
  }
};