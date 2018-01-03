// var remark = require("gulp-remark");
// var html = require("remark-html");
// var lint = require("remark-lint");
// var gap = require("remark-heading-gap");
// var shortcodes = require("remark-shortcodes");
// var squeezeParagraphs = require("remark-squeeze-paragraphs");
// var styleGuide = require("remark-preset-lint-markdown-style-guide");
// var gulpGrayMatter = require("gulp-gray-matter");

const path = require('path');

var chalk = require('chalk'),
	debug = require('gulp-debug'),
	format = require('gulp-format-md'),
	gap = require('remark-heading-gap'),
	getSlug = require('speakingurl'),
	gulp = require('gulp'),
	gulpGrayMatter = require('gulp-gray-matter'),
	html = require('remark-html'),
	lint = require('remark-lint'),
	log = require('fancy-log'),
	remark = require('gulp-remark'),
	shortcodes = require('remark-shortcodes'),
	size = require('gulp-size'),
	squeezeParagraphs = require('remark-squeeze-paragraphs'),
	styleGuide = require('remark-preset-lint-markdown-style-guide'),
	tap = require('gulp-tap'),
	through = require('through2'),
	yaml = require('js-yaml');

var gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins();

gulp.task('default', ['lint'], function() {
	//gulp.src('content/**/*.md')
	//.pipe(remark().use(lint))
	//.pipe(gulp.dest('content'))
});

gulp.task('lint', () =>
	gulp.src('content/**/*.md').pipe(
		remark()
			//.use(shortcodes, {startBlock: "{{<", endBlock: ">}}"})
			//.use(gap)
			.use(lint)
			//.use(squeezeParagraphs)
			.use(styleGuide)
	)
);

gulp.task('fix', function() {
	return (gulp
			.src('content/**/*.md')
			//.pipe(debug())
			//.pipe(format())
			.pipe(gulpGrayMatter({ property: 'frontMatter', remove: false }))
			//.pipe(through.obj(cleanFrontMatter))
			.pipe(tap(tapFunction))
		);
	//.pipe(gulp.dest("content"))
	//.pipe(size)
});

function tapFunction(file){
	var Vinyl = require('vinyl');
	//log(chalk.red(Vinyl.isVinyl(file)));

	var basename = path.basename(file.path);
	var extension = path.extname(file.path);
	var stem = path.basename(file.path, extension);
	var slug = getSlug(stem);

	log(stem + ' ==> ' + slug);
}

function cleanFrontMatter(file, encoding, callback) {
	if (!file.isBuffer()) {
		// nothing to do
		return callback(null, file);
	}

	var slug = file.stem; //getSlug(file.stem);

	//slug = getSlug('Schöner Titel läßt grüßen!? Bel été !');
	//console.log(slug); // Output: schoener-titel-laesst-gruessen-bel-ete

	log(file.path + ' ==> ' + file.path);
	//log(chalk.blue(yaml.safeDump(file.frontMatter)));
	callback();
}
