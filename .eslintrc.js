module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  env: {
    browser: true,
    es2021: true,
  },
  rules: {
    // Catch stale closures and missing deps — the source of several bugs found in review.
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',

    // Disallow any — forces proper typing of colors, navigation props, etc.
    '@typescript-eslint/no-explicit-any': 'warn',

    // Unused variables are noise and often signal incomplete refactors.
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // Allow empty catch blocks only when explicitly annotated.
    'no-empty': ['error', { allowEmptyCatch: false }],
  },
  ignorePatterns: ['node_modules/', '.expo/', 'dist/', 'web-build/'],
};
