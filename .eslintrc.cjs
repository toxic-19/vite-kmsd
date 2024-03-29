module.exports = {
    "env": {
        "browser": true, /* 浏览器工作 */
        "es2021": true,
        "node": true,
        "jest": true
    },
    /* 指定如何解析语法 */
    parser: 'vue-eslint-parser',
    /* 规则继承 */
    "extends": [
        "eslint:recommended", /* 开启推荐规则 */
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential",
        'plugin:prettier/recommended' /* 避免与prettier冲突*/
    ],
    /* 指定解析器 */
    "parserOptions": {
        "ecmaVersion": 'latest',
        "sourceType": 'module',
        "parser": '@typescript-eslint/parser',
        "jsxPragma": 'React',
        "ecmaFeatures": {
            "jsx": true
        },
    },
    /* 第三方插件 需要使用npm进行安装 该eslint-plugin-前缀可以从插件名称被省略 */
    "plugins": [
        "@typescript-eslint", /* 实则安装 eslint-plugin-@typescript-eslint */
        "vue" /* 实则安装 eslint-plugin-vue */
    ],
    "rules": {
        // eslint
        'no-var': 'error', // 要求使用 let 或 const 而不是 var
        'semi': ['error', 'never'], // 是否以分号结尾
        'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允许多个空行
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unexpected-multiline': 'error', // 禁止空余的多行
        'no-useless-escape': 'off', // 禁止不必要的转义字符

        // typeScript (https://typescript-eslint.io/rules)
        '@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量
        '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore
        '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。

        // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
        'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词
        'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用
        'vue/no-mutating-props': 'off', // 不允许组件 prop的改变
        'vue/attribute-hyphenation': 'off', // 对模板中的自定义组件强制执行属性命名样式
    }
}
