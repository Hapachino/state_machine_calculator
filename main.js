const model = {
  previousInputs: [],
  operand: null,
  operator: null,
  result: 0,
  operations: {
    add() {
      model.result += model.operand;
    },

  },
  update(input) {
    const 
    // determine input type
    if (isN)
  },

  storeInput(input) {
    if (result === 0) {

    }
    
    const lastIndex = this.previousInputs.length - 1;

    // ie: last = '+', input = 1
    if (isNaN(this.previousInputs[lastIndex]) && !isNaN(input)) {
      this.previousInputs.push(input);
    }

    // ie: last = '1', input = 1
    if (!isNaN(this.previousInputs[lastIndex]) && !isNaN(input)) {
      this.previousInputs[lastIndex] += input;
    }

    // ie: last = '1', input = +
    if (!isNaN(this.previousInputs[lastIndex]) && !isNaN(input)) {
      this.previousInputs.push(input);
    }

    // ie: last = '*', input = +
    if (isNaN(this.previousInputs[lastIndex]) && isNaN(input)) {
      this.previousInputs.push(input);
      // additional cases: '.', '*' '=', 
    }

    // update previousInputs
    // update other variables
  },
  returnResult() {
    return this.result;
  },

}

const controller = {
  addButtonHandlers() {
    $('.button').click((e) => {
      const target = $(e.currentTarget);
      const isOperator = target.hasClass('operator');
      let input;

      if (isOperator) {
        input = target.attr('key');
      } else {
        input = target.find('.center').text();
      }

      model.storeInput(input);
    })
  },
  updateOutput() {
    const result = model.returnResult();
    view.displayOutput(result);
  }
}

const view = {
  displayOutput(output) {
    $('.display-container').text(output);
  },
}

/* remove */
$(document).ready(() => {
  controller.updateOutput();
  controller.addButtonHandlers();
});



/**
 * Stores user inputs in array
 * @param { array } previousInputs 
 * @param { number/operator } currentInput
 */

/**
 * Updates current user output
 * 
 */

/**
 * updates operand1, operand2, operator
 * 
 */

/**
 * detects use case and performs calculation
 * 
 */

/**
 * 
 * 
 */