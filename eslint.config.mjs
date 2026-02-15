import vitest from '@vitest/eslint-plugin'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import testingLibrary from 'eslint-plugin-testing-library'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off', // 標準のルールをオフにする（競合防止）
      '@typescript-eslint/no-unused-vars': 'off', // TS環境ならこちらもオフ
      'unused-imports/no-unused-imports': 'error', // 未使用インポートをエラー（自動修正対象）にする
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_', // _で始まる変数は無視
          args: 'after-used',
          argsIgnorePattern: '^_', // _で始まる引数は無視
        },
      ],
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    plugins: {
      vitest,
      'testing-library': testingLibrary,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      ...testingLibrary.configs['flat/react'].rules,
    },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
  ]),
])

export default eslintConfig
