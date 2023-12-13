module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/typescript',
    '@nuxtjs/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error',
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'accessor-pairs': 'off',
    'brace-style': ['error', 'stroustrup']
  }
}
