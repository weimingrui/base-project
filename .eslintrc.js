module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
    'plugin:cypress/recommended'
  ],
  plugins: ['vue', 'prettier', 'cypress'],
  globals: {
    cloudinary: true,
    jQuery: true,
    _: true,
    cypress: true
  },
  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    // 'max-len': ["error", { "code": 120 }],
    'vue/max-attributes-per-line': [
      1,
      {
        singleline: 20,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-v-html': 'off',
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: false
      }
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'generator-star-spacing': 0, //生成器函数*的前后空格
    'no-console': 'off',
    quotes: ['error', 'single'], //强制使用单引号
    semi: ['error', 'never'], //强制不使用分号结尾
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': [
      2,
      {
        skipBlankLines: true
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any'
        }
      }
    ],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'none',
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        arrowParens: 'always'
      }
    ]
  }
}
