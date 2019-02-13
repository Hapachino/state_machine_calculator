$(document).ready(init);

const MAX_DISPLAY_LENGTH = 10;
const FRACTION = 6;
const TEST_INTERVAL = 150;

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
    // For future error handling
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
  addClickHandlers();
}

function addClickHandlers() {
  addButtonHandlers();
  addSelfTestClickHandler();
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
      model.operand === 0 ? model.state = states.error : model.accumulator /= model.operand;
      break;
  }
}

function addButtonHandlers() {
  $('.button').click(e => {
    const input = $(e.currentTarget).attr('data-key');

    updateModel(input);
  });
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

function toExponentialFormat(number, fraction) {
  return Number.parseFloat(number).toExponential(fraction);
}

function updateDisplay() {
  let output;

  if (model.state === states.error) {
    output = 'ERROR';
  } else {
    output = model.state === states.operand ? model.operand : model.accumulator;
  }

  if (ExceedMaxDisplayWidth(output)) {
    output = toExponentialFormat(output, FRACTION);
  }

  $('.display-container').text(output);
}

function translateKey(key) {
  switch(key) {
    case '×':
      return '*';
    case '÷':
      return '/';
  }

  return key;
}

// Self-testing Functions

function addSelfTestClickHandler() {
  $('.test.btn').click(() => {
    $('.test.btn').hide();
    $('.test.display').css('display', 'flex');
    runSelfTest(testCases, TEST_INTERVAL);
  })
}

function SimulateKeyPress(input, duration) {
  const button = $(`[data-key='${input}']`);
  const activeDuration = duration / 5;

  button.addClass('hover');
  setTimeout(() => {
    button.removeClass('hover');

    button.addClass('active');

    setTimeout(() => {
      button.removeClass('active');
    }, activeDuration);
  }, duration - activeDuration);
}

function runSelfTest(testCases, interval) {
  let testCaseIndex = inputIndex = 0;
  let clickButton = true;
  const halfInterval = interval / 2; // for alternating between button click and input

  const timerId = setInterval(async () => {
    if (testCaseIndex === testCases.length) {
      clearInterval(timerId);
      // display final results
      return;
    }
    
    if (inputIndex === 0) {
      const { name, input, output } = testCases[testCaseIndex];
      $('.test.name').text(name);
      $('.test.input').text(input);
      $('.test.output').text(`Expected Output: ${output}`);
      $('.test.result').text('');
    }

    const key = translateKey(testCases[testCaseIndex].input[inputIndex]);

    if (clickButton) {
      SimulateKeyPress(key, halfInterval);
    } else {
      updateModel(key);

      inputIndex++;
    }

    clickButton = !clickButton;

    if (inputIndex === testCases[testCaseIndex].input.length) {
      $('.test.input').append(model.accumulator);

      const result = model.accumulator === testCases[testCaseIndex].output ? 'pass' : 'fail';

      $('.test.result').text(result);

      // increment failed test case number, store?

      testCaseIndex++;
      inputIndex = 0;

      model.reset();
    }
  }, halfInterval);
}

// validates output and displays

// TODO: add js doc comments
