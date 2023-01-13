module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'vue/no-v-html': 0,
    'multiline-ternary': ['off']
  },
  overrides: [
    {
      files: ['generated.ts'],
      rules: {
        'no-redeclare': 'off',
        'import/export': 'off',
        'no-use-before-define': 'off',
        'no-multiple-empty-lines': 'off',
        camelcase: 'off',
        semi: 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ]
}
