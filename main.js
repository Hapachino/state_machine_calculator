$(document).ready(addButtonHandlers);

class Calculator {

}

const MAX_DISPLAY_LENGTH = 10;
const FRACTION = 6;

const states = {
  equal(input) {
    switch (model.inputType) {
      case '0':
        model.accumulator = input;
        break;
      case '[1-9]':
      case '.':
        model.accumulator = input;
        model.state = states.accumulator;
        break;
      case '[+-*/]':
        model.operator = input;
        model.operand = model.accumulator;
        model.state = states.operator;
        break;
      case '=':
        calculate();
        break;
    }
  },
  accumulator(input) {
    switch (model.inputType) {
      case '0':
      case '[1-9]':
        model.accumulator += input;
        break;
      case '.':
        if (canAppendInput(model.accumulator)) model.accumulator += input;
        break;
      case '[+-*/]':
        model.operator = input;
        model.operand = model.accumulator;
        model.state = states.operator;
        break;
      case '=':
        model.state = states.equal;
        calculate();
        break;
    }
  },
  operator(input) {
    switch (model.inputType) {
      case '0':
      case '[1-9]':
      case '.':
        model.operand = input;
        model.state = states.operand;
        break;
      case '[+-*/]':
        model.operator = input;
        break;
      case '=':
        calculate();
        model.operand = model.accumulator;
        break;
    }
  },
  operand(input) {
    switch (model.inputType) {
      case '0':
        if (model.operand) model.operand += input;
        break;
      case '[1-9]':
        model.operand ? model.operand += input : model.operand = input;
        break;
      case '.':
        if (canAppendInput(model.operand)) model.operand += input;
        break;
      case '[+-*/]':
        model.state = states.operator;
        calculate();
        model.operator = input;
        model.operand = model.accumulator;
        break;
      case '=':
        model.state = states.equal;
        calculate();
        break;
    }
  },
  error() {
  }
}

const model = {
  state: states.equal,
  accumulator: 0,
  operand: 0,
  operator: null,
  inputType: null,
}

function ExceedMaxDisplayWidth(number) {
  const string = number + '';

  return string.length >= MAX_DISPLAY_LENGTH;
}

function canAppendInput(number) {
  return !ExceedMaxDisplayWidth(number) && !number.includes('.');
}

function calculate() {
  model.accumulator = +model.accumulator;
  model.operand = +model.operand;

  switch (model.operator) {
    case '+':
      model.accumulator += model.operand;
      break;
    case '-':
      model.accumulator -= model.operand;
      break;
    case '*':
      model.accumulator *= model.operand;
      break;
    case '/':
      if (model.operand === 0) {
        model.state = states.error;
      } else {
        model.accumulator /= model.operand;
      }
      break;
  }
}

function addButtonHandlers() {
  $('.button').click(e => {
    const button = $(e.currentTarget);
    const isOperator = button.hasClass('operator');
    const input = isOperator ? button.attr('data-key') : button.find('.center').text();

    updateModel(input);
  })
}

function updateModel(input) {
  switch(input) {
    case 'c':
      model.state = states.equal;
      model.accumulator = 0;
      model.operand = 0;
      model.operator = null;
      break;
    case 'ce':
      model.operand = 0;
      model.state = states.operand;
      break;
    default:
      updateInputType(input);
      model.state(input);
      break;
  }

  updateDisplay();
}

function updateInputType(input) {
  if (input.match(/[1-9]/)) {
    model.inputType = '[1-9]';
  } else if ('+-*/'.includes(input)) {
    model.inputType = '[+-*/]';
  } else {
    model.inputType = input;
  }
}

function exponentialFormat(number, fraction) {
  return Number.parseFloat(number).toExponential(fraction);
}

function updateDisplay() {
  if (ExceedMaxDisplayWidth(model.accumulator)) {
    model.accumulator = exponentialFormat(model.accumulator, FRACTION);
  }

  let output;

  if (model.state === states.error) {
    output = 'ERROR';
  } else {
    output = model.state === states.operand ? model.operand : model.accumulator;
  }

  $('.display-container').text(output);
}

// TODO:
// handle infinity
// OOP
// add test 
// add history
// fancy background
// button hover effect
// adjust max display width for mobile - breakpoints
