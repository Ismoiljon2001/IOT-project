import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		host: true,
	},
	build: {
		minify: 'terser',
		terserOptions: {
			ie8: false,
			ecma: 2020,
			sourceMap: false,
			format: {
				comments: false,
			},
			compress: {
				unused: true,
			},
		},
	},
})
