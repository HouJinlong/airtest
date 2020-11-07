/**
 * DaoJia ESLint for Vue
 *
 * 使用 babel-eslint 作为解析器
 *
 * @fixable 表示此配置支持 --fix
 *
 */
module.exports = {
	extends: ['eslint-config-egg','./.daojia-eslint-base.js'],
	root: true,
	parserOptions: {
		parser: 'babel-eslint',
		ecmaVersion: 7,
		sourceType: 'module',
		ecmaFeatures: {}
	},
	globals: {
		App: true,
		Page: true,
		Component: true,
		Behavior: true,
		wx: true,
		getApp: true
	},
	plugins: [],
	rules: {
		/* 可能的错误 */
	}
}
