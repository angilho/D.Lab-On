const mix = require("laravel-mix");
const webpack = require("webpack");
require("laravel-mix-bundle-analyzer");

mix.webpackConfig({
	plugins: [
		// reduce bundle size by ignoring moment js local files
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
	],
	resolve: {
		alias: {
			"@common": path.resolve(__dirname, "resources/js/common/"),
			"@components": path.resolve(__dirname, "resources/js/components/"),
			"@images": path.resolve(__dirname, "resources/image/"),
			"@hooks": path.resolve(__dirname, "resources/js/hooks/"),
			"@constants": path.resolve(__dirname, "resources/js/constants/")
		}
	}
});

if (mix.inProduction()) {
	mix.version();
} else {
	//mix.bundleAnalyzer({ openAnalyzer: true });
}

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

/**
 * app
 */
mix.react("resources/js/app.js", "public/js/");

//Front Video file
mix.copy("resources/image/main/video.mp4", "public/images/video.mp4");

/**
 * Style
 */
mix.sass("resources/sass/app.scss", "public/css/app.css");
mix.sass("resources/sass/address.scss", "public/css/address.css");
