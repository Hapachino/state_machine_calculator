const testCases = [
  {
    name: 'Addition',
    input: '1+2=',
    output: 3,
  },
  {
    name: 'Multiplication',
    input: '1×2=',
    output: 2,
  },
  {
    name: 'Division',
    input: '1÷2=',
    output: 0.5,
  },
  {
    name: 'Subtraction',
    input: '1-2=',
    output: -1,
  },
  {
    name: 'Successive Operation',
    input: '1+1+2=',
    output: 4,
  },
  {
    name: 'Decimal',
    input: '1.1=',
    output: 1.1,
  },
  {
    name: 'Multiple Decimals',
    input: '1...1=',
    output: 1.1,
  },
  {
    name: 'Multiple Operation',
    input: '1++++2=',
    output: 3,
  },
  {
    name: 'Changing Operation',
    input: '1+-×/2=',
    output: 0.5,
  },
  {
    name: 'Repeat Operation',
    input: '1+1===',
    output: 4,
  },
  {
    name: 'Rollover Operation',
    input: '1+1+=+=',
    output: 8,
  },
  {
    name: 'Successive Operation',
    input: '1+3÷4+10×2=',
    output: 22,
  },
  {
    name: 'Division by Zero',
    input: '1÷0=',
    output: 'ERROR',
  },
  {
    name: 'Premature Operation',
    input: '++++1×2=',
    output: 2,
  },
  {
    name: 'Partial Operand',
    input: '2×=',
    output: 4,
  },
  {
    name: 'Missing Operation',
    input: '1=',
    output: 1,
  },
  {
    name: 'Missing Operands',
    input: '====0',
    output: 0,
  },
];
