import prettierPlugin from 'eslint-plugin-prettier';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: ['node_modules', 'dist'],
  },
];
