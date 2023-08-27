module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.js', '*.config.js', '*.config.ts', '*.config.mjs'],
  extends: ['@whitebird'],
  rules: {
    'quotes': ['error', 'single', { avoidEscape: true }],
  },
  overrides: [
    {
      files: ['*'],
      rules: {
        'functional/no-return-void': 'off',
        'functional/no-conditional-statements': 'off',
        'functional/no-throw-statements': 'off',
      },
    },
    {
      files: ['*.tsx'],
      rules: {
        'es/no-destructuring': 'off',
        'jsx-quotes': ['error', 'prefer-single'],
      },
    },
  ],
}
