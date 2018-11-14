$(document).ready(addButtonHandlers);

const operators = '+-*/';

const states = {
  start(input) {
    switch(model.inputType) {
      case '0':
        model.result = '0';
        break;
      case 'non-zero digit':
        model.result = input;
        model.state = states.integer;
        break;
      case '.':
        model.result = input;
        model.state = states.float;
        break;
      case 'operator':
        model.operator = input;
        model.operand = model.result;
        model.state = states.compute;
        break;
      case '=':
        if (!calculate(model.operator)) return;
        model.state = states.start;
        break;
    }
  },
  integer(input) {
    switch (model.inputType) {
      case '0':
      case 'non-zero digit':
        appendDigit(input);
        break;
      case '.':
        appendDigit(input);
        model.state = states.float;
        break;
      case 'operator':
        model.operator = input;
        model.operand = model.result;
        model.state = states.compute;
        break;
      case '=':
        if (!calculate(model.operator)) return;
        model.state = states.start;
        break;
    }
  },
  float(input) {
    switch (model.inputType) {
      case '0':
      case 'non-zero digit':
        appendDigit(input);
        break;
      case '.':
        break;
      case 'operator':
        model.operator = input;
        model.operand = model.result;
        model.state = states.compute;
        break;
      case '=':
        if (!calculate(model.operator)) return;
        model.state = states.start;
        break;
    }
  }, 
  compute(input) {
    switch (model.inputType) {
      case '0':
        model.result = '0';
        model.state = states.start;
        break;
      case 'non-zero digit':
        model.result = input;
        model.state = states.integer;
        break;
      case '.':
        model.result = input;
        model.state = states.float;
        break;
      case 'operator':
        model.operator = input;
        model.operand = model.result;
        break;
      case '=':
        if (!calculate(model.operator)) return;
        model.state = states.start;
        break;
    }
  },
  error() {
  }
}

const model = {
  state: states.start,
  result: 0,
  operator: null,
  previousOperator: null,
  operand: null,
  inputType: null,
}

const MAX_DISPLAY_LENGTH = 10;

function appendDigit(input) {
  if (model.result.length >= MAX_DISPLAY_LENGTH) return;

  model.result += input;
}

function calculate(input) {
  model.result = +model.result;
  model.operand = +model.operand;

  switch (input) {
    case '+':
      model.result += model.operand;
      break;
    case '-':
      model.result += -(model.operand);
      break;
    case '*':
      model.result *= model.operand;
      break;
    case '/':
      if (model.result === 0) {
        model.result = 'Error';
        model.state = states.error;
        return false;
      }

      if (model.state === states.start && model.previousOperator === '/') {
        model.result = model.result / model.operand;
      } else {
        [model.result, model.operand] = [model.operand / model.result, model.result];
      }

      break;
  }

  model.previousOperator = model.operator;
  model.result += '';
  model.operand += '';

  if (model.result.length >= MAX_DISPLAY_LENGTH) {
    toExponential(MAX_DISPLAY_LENGTH - 5);
  }

  return true;
}

function addButtonHandlers() {
  $('.button').click((e) => {
    const target = $(e.currentTarget);
    const isOperator = target.hasClass('operator');
    const input = isOperator ? target.attr('data-key') : target.find('.center').text();

    updateModel(input);
  })
}

function updateModel(input) {
  if (input === 'c') {
    model.state = states.start;
    model.result = 0;
    model.operator = null;
    model.operand = null;
  } else if (input === 'ce') {
    model.state = states.start;
    model.result = 0;
  }

  updateInputType(input);
  model.state(input);

  updateDisplay();
}

function updateInputType(input) {
  if (input.match(/[1-9]/)) {
    model.inputType = 'non-zero digit';
  } else if (operators.includes(input)) {
    model.inputType = 'operator';
  } else {
    model.inputType = input;
  }
}

function toExponential(fraction) {
  model.result = Number.parseFloat(model.result).toExponential(fraction);
}

function updateDisplay() {
  $('.display-container').text(model.result);
}

// TODO:
// overflow
  // calculate() detect length
    // if length === max, don't append
    // updateDisplay - scientific notation
// button feedback