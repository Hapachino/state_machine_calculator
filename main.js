const operators = '+=*/';



// clears handled elsewhere
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
        model.result = input;
        model.state = states.compute;
        break;
      case '=':
        calculate(input);
        model.state = states.start;
        break;
    }
  },
  integer(input) {
    switch (model.inputType) {
      case '0':
      case 'non-zero digit':
      case '.':
        model.result = input;
        break;
      case 'operator':
        model.operand = result;
        model.state = states.compute;
        break;
      case '=':
        calculate(input);
        model.state = states.start;
        break;
    }
  },
  float(input) {

  }, 
  compute(input) {

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

  model.operand = 0;
}

function addButtonHandlers() {
  $('.button').click((e) => {
    const target = $(e.currentTarget);
    const isOperator = target.hasClass('operator');
    const input = isOperator ? target.attr('data-key') : target.find('.center').text();
    console.log(input);
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
