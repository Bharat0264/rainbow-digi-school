import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';
export default [
  { ignores: ['node_modules/**', 'dist/**', 'artifacts/**', 'server/**', 'integrations/**'] },
  {
    files: ['src/**/*.{js,jsx}', 'scripts/review/**/*.mjs'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { react },
    rules: {
      ...js.configs.recommended.rules,
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
];
