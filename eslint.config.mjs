import antfu from '@antfu/eslint-config'

export default {
  ...antfu({
    rules: {
      'no-console': 1,
      'ts/ban-ts-comment': 1,
    },
  }),
  ignores: ['*.md', 'README.md', 'docs/**', 'eslint.config.mjs'],
}
