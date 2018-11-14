const operators = '+-*/';

// clears handled in updateModel()
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
        calculate(model.operator);
        model.state = states.start;
        break;
    }
  },
  integer(input) {
    switch (model.inputType) {
      case '0':
      case 'non-zero digit':
        model.result += input;
        break;
      case '.':
        model.result += input;
        model.state = states.float;
        break;
      case 'operator':
        model.operator = input;
        model.operand = model.result;
        model.state = states.compute;
        break;
      case '=':
        calculate(model.operator);
        model.state = states.start;
        break;
    }
  },
  float(input) {
    
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
        calculate(input);
        model.state = states.start;
        break;
    }
  },
  error(input) {

  }
}

const model = {
  state: states.start,
  result: 0,
  operator: null,
  operand: null,
  inputType: null,
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
      model.result = model.operand / model.result;
      break;
  }

  model.result += '';
  model.operand += '';
}

function addButtonHandlers() {
  $('.button').click((e) => {
    const target = $(e.currentTarget);
    const isOperator = target.hasClass('operator');
    const input = isOperator ? target.attr('data-key') : target.find('.center').text();
    // console.log(input);
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

  // console.log('state:', model.state);
  console.log('result:', model.result);
  console.log('operand:', model.operand);
  displayResult();
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

function displayResult() {
  $('.display-container').text(model.result);
}

$(document).ready(() => {
  displayResult();
  addButtonHandlers();
});
