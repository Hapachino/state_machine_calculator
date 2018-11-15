$(document).ready(addButtonHandlers);

const operators = '+-*/';

const states = {
  start(input) {
    switch(model.inputType) {
      case '0':
        break;
      case 'non-zero digit':

        break;
      case '.':

        break;
      case 'operator':

        break;
      case '=':

        break;
    }
  },
  integer(input) {
    switch (model.inputType) {
      case '0':
      case 'non-zero digit':

        break;
      case '.':

        break;
      case 'operator':

        break;
      case '=':

        break;
    }
  },
  float(input) {
    switch (model.inputType) {
      case '0':
      case 'non-zero digit':

      case '.':
        break;
      case 'operator':

        break;
      case '=':

        break;
    }
  }, 
  compute(input) {
    switch (model.inputType) {
      case '0':

        break;
      case 'non-zero digit':

        break;
      case '.':

        break;
      case 'operator':

        break;
      case '=':

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
      break;
    case '-':
      break;
    case '*':
      break;
    case '/':
      break;
  }

  model.result += '';
  model.operand += '';

  if (model.result.length >= MAX_DISPLAY_LENGTH) {
    toExponential(MAX_DISPLAY_LENGTH - 6);
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

  
  console.log('result:', model.result);
  console.log('operand:', model.operand);
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
// overflow - change max display based on screen width
// button feedback