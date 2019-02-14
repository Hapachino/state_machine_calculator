function addSelfTestClickHandler() {
  $('.test.btn').click(() => {
    $('.test.btn').hide();
    $('.test.display').css('display', 'flex');
    $('.results.display').css('display', 'flex');
    $('.failed-operations').text('');
    $('.passed').text('0');
    $('.failed').text('0');

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
  const halfInterval = interval / 2; // for alternating between button click and input
  let testCaseIndex = inputIndex = 0;
  let clickButton = true;
  let passed = failed = 0;
  let failedOperations = 'Failed Operations: ';

  const timerId = setInterval(() => {
    if (testCaseIndex === testCases.length) {
      clearInterval(timerId);

      $('.passed').text(passed);
      $('.failed').text(failed);

      if (!failed) {
        $('.failed-operations').text('All Tests Passed');
      } else {
        $('.failed-operations').append(failedOperations.slice(0, -2));
      }

      $('.test.display').hide();
      $('.results.display').css('display', 'flex');
      $('.retest').show();

      return;
    }

    const testCase = testCases[testCaseIndex];
    const { name, input, output } = testCase;

    if (inputIndex === 0) {
      $('.test.name').text(name);
      $('.test.input').text(input);
      $('.test.output').text(`Expected Output: ${output}`);
      $('.test.result').text('');
    }

    const key = translateKey(testCase.input[inputIndex]);

    if (clickButton) {
      SimulateKeyPress(key, halfInterval);
    } else {
      updateModel(key);

      inputIndex++;
    }

    clickButton = !clickButton;
    const display = $('.display-container').text();

    if (inputIndex === testCase.input.length) {
      $('.test.input').append(display);

      let result;

      if (display == testCase.output) {
        result = 'ok';
        $('.passed').text(++passed);
      } else {
        result = 'remove';
        $('.failed').text(++failed);

        failedOperations += `${name}, `;
      }

      $('.test.result').html(`<i class="glyphicon glyphicon-${result}"></i>`);

      testCaseIndex++;
      inputIndex = 0;

      model.reset();
    }
  }, halfInterval);
}
