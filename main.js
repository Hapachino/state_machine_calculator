$(document).ready(init);

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
        if (canAppend(model.accumulator)) model.accumulator += input;
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
        if (canAppend(model.operand)) model.operand += input;
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
  }, 
}

const model = {
  reset() {
    this.state = states.equal;
    this.accumulator = 0;
    this.operand = 0;
    this.operator = null;
    this.inputType = null;
  },
}

function init() {
  model.reset();
  addButtonHandlers();
}

function ExceedMaxDisplayWidth(number) {
  const string = number + '';
  return string.length >= MAX_DISPLAY_LENGTH;
}

function canAppend(number) {
  return !ExceedMaxDisplayWidth(number) && !number.includes('.');
}

function calculate() {
  model.accumulator = +model.accumulator;
  model.operand = +model.operand;

  switch (model.operator) {
    case '+':
      return model.accumulator += model.operand;
    case '-':
      return model.accumulator -= model.operand;
    case '*':
      return model.accumulator *= model.operand;
    case '/':
      return model.operand === 0 ? model.state = states.error : model.accumulator /= model.operand;
  }
}

function addButtonHandlers() {
  $('.button').click((e) => {
    const target = $(e.currentTarget);
    const input = target.hasClass('operator') ? target.attr('data-key') : target.find('.center').text();

    updateModel(input);
  })
}

function updateModel(input) {
  if (input === 'c') {
    model.reset();
  } else if (input === 'ce') {
    model.operand = 0;
    model.state = states.operand;
  } else {
    updateInputType(input);
    model.state(input);
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

function toExponential(number, fraction) {
  return Number.parseFloat(number).toExponential(fraction);
}

function updateDisplay() {
  let output;

  if (model.state === states.error) {
    output = 'ERROR';
  } else {
    output = model.state === states.operand ? model.operand : model.accumulator;
  }

  if (ExceedMaxDisplayWidth(output)) output = toExponential(output, FRACTION);

  $('.display-container').text(output);
}

// TODO:
// handle infinity
// overflow - change max display based on screen width
// graphing
