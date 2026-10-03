module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: { react: { version: 'detect' } },
  env: { node: true, es2022: true },
  ignorePatterns: ['node_modules/', '.expo/', 'android/', 'ios/', 'dist/', 'design-references/', '*.config.js', '.eslintrc.js'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
