import antfu, { pluginPerfectionist, pluginTs } from '@antfu/eslint-config'
import filenamePlugin from 'eslint-plugin-filename-rules'
import fpPlugin from 'eslint-plugin-fp'

export default antfu(
    {
        rules: {
            ...pluginPerfectionist.configs['recommended-natural'].rules,
            'perfectionist/sort-imports': 'off',
            'style/indent': ['error', 2, {
                flatTernaryExpressions: true,
            }],
            'style/max-len': ['error', {
                code: 80,
                comments: 120,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                tabWidth: 2,
            }],
            'style/multiline-ternary': 'off',
        },
        stylistic: true,
    },
    {
        plugins: {
            ts: pluginTs,
        },
        rules: {
            'ts/naming-convention': 'error',
            'ts/no-import-type-side-effects': 'error',
            'ts/no-use-before-define': 'off',
        },
    },
    {
        plugins: {
            'filename-rules': filenamePlugin,
            'fp': fpPlugin,
        },
        rules: {
            'curly': ['error', 'all'],

            'filename-rules/not-match': [2, /(^index\..*)/],

            'fp/no-throw': 'error',

            'import/no-default-export': ['error'],

            'ts/no-explicit-any': ['error'],
            'unicorn/filename-case': [
                'error',
                {
                    case: 'kebabCase',
                },
            ],
            'unicorn/switch-case-braces': ['error'],
        },
    },
    {
        files: ['**/*.config.*'],
        rules: {
            'import/no-default-export': 'off',
        },
    },
    {
        ignores: ['**/__generated__/**', '**/*.config.*'],
    },
)