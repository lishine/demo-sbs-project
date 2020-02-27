const env = require('./env-config.js')

module.exports = {
	"presets": [
		[
			"@babel/preset-env",
			{
				"targets": {
					"node": "current"
				}
			}
		],
	],
	"plugins": [
		[
			"module-resolver",
			{
				"root": [
					"./src"
				]
			}
		],
		['transform-define', env],
		"@babel/plugin-proposal-export-default-from"
	]
}