module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'implicit-arrow-linebreak': 0,
    'function-paren-newline': 0,
    'comma-dangle': 0,
    'no-console': 0,
    'no-return-await': 0,
  },
};
