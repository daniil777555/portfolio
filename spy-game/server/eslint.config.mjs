import { defineConfig, globalIgnores } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

const eslintConfig = defineConfig([
  {
    plugins: {
      '@stylistic': stylistic,
      '@typescript-eslint': tsPlugin
    },
    languageOptions: {
      parser: tsParser
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@stylistic/indent': ['error', 2],
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/list-style': 'error',
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/member-delimiter-style': ['error', {
        multiline: { delimiter: 'none', requireLast: false },
        singleline: { delimiter: 'comma', requireLast: false }
      }]
    }
  },
  {
    files: ['**/*.ts', '**/*.mjs', '**/*.js'],
    rules: {
      '@stylistic/comma-dangle': ['error', { generics: 'ignore' }]
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    'out/**',
    'build/**',
    'dist/**',
    'types/**'
  ])
])

export default eslintConfig
