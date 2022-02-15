// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', path.resolve(__dirname, './src')]],
        extensions: ['.ts', '.js', '.jsx', '.tsx', '.json', '.png', '.svg'],
      },
    },
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'testing-library',
    'jest-dom',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true },
    ],
    '@typescript-eslint/no-namespace': 'off',
    'simple-import-sort/imports': 2,
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
