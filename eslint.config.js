import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import security from 'eslint-plugin-security';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'dist-stats/**',
      '*.d.ts',
      'vite.config.d.ts',
      'vitest.config.d.ts',
    ],
  },
  js.configs.recommended,
  // TypeScript / React files
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        __APP_VERSION__: 'readonly',
        __BUILD_DATE__: 'readonly',
        __APP_ENV__: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      security,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
    },
    settings: { react: { version: 'detect' } },
  },
  // Test files (no project to speed up + avoid parsing error)
  {
    files: ['tests/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: null },
      globals: {
        ...globals.browser,
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
  // Config / scripts (no TS project requirement)
  {
    files: [
      '*.{cjs,mjs,js}',
      'eslint.config.js',
      'vite.config.ts',
      'vitest.config.ts',
      'commitlint.config.cjs',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: null },
      globals: { ...globals.node },
    },
    rules: { '@typescript-eslint/no-var-requires': 'off' },
  },
  // Declaration files
  {
    files: ['**/*.d.ts'],
    rules: { '@typescript-eslint/no-unused-vars': 'off', 'no-unused-vars': 'off' },
  },
  // Prettier compatibility
  prettier,
];
