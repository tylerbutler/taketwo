// var remark = require("gulp-remark");
// var html = require("remark-html");
// var lint = require("remark-lint");
// var gap = require("remark-heading-gap");
// var shortcodes = require("remark-shortcodes");
// var squeezeParagraphs = require("remark-squeeze-paragraphs");
// var styleGuide = require("remark-preset-lint-markdown-style-guide");
// var gulpGrayMatter = require("gulp-gray-matter");

var chalk = require('chalk'),
	debug = require('gulp-debug'),
	filter = require('gulp-filter'),
	format = require('gulp-format-md'),
	gap = require('remark-heading-gap'),
	getSlug = require('speakingurl'),
	gulp = require('gulp'),
	gulpGrayMatter = require('gulp-gray-matter'),
	html = require('remark-html'),
	lint = require('remark-lint'),
	log = require('fancy-log'),
	moment = require('moment'),
	path = require('path'),
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

gulp.task('default', ['lint'], function () {
	//gulp.src('content/**/*.md')
	//.pipe(remark().use(lint))
	//.pipe(gulp.dest('content'))
});

gulp.task('base', function () {
	// do nothing
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

gulp.task('fix', function () {
	const postsOnly = filter(['**', '!content/posts/**/_index.md'], {
		restore: true
	});

	return (gulp.src('content/posts/**/*.md')
		.pipe(tap(addProperties))
		.pipe(gulpGrayMatter({
			property: 'frontMatter',
			remove: false
		}))
		.pipe(tap(formatDate))
		.pipe(postsOnly)
		//.pipe(debug())
		//.pipe(format())
		//.pipe(through.obj(cleanFrontMatter))
		//.pipe(tap(slugify))
		.pipe(postsOnly.restore)
	);
	//.pipe(gulp.dest("content"))
	//.pipe(size)
});

function slugify(file, t) {
	log(file.path);

	var slug = "";
	if (file.frontMatter.slug) {
		// Use the slug in the front matter if it is defined
		log(chalk.yellow("slug source: front matter"))
		slug = file.frontMatter.slug
	} else if (file.frontMatter.title) {
		// Otherwise we'll slugify post title - first checking the front matter
		// and falling back to the file name if needed.
		log(chalk.green("slug source: slugified title"))
		slug = getSlug(file.frontMatter.title);
	} else {
		log(chalk.blue("slug source: slugified file name"))
		slug = getSlug(file.stem);
	}
}

function addProperties(file) {
	file.basename = path.basename(file.path);
	file.extension = path.extname(file.path);
	file.stem = path.basename(file.path, file.extension);
}

function formatDate(file) {
	if(file.frontMatter.date) {
		var before = file.frontMatter.date;
		file.frontMatter.date = moment.utc(file.frontMatter.date).toISOString();
		log(chalk.green('BEFORE: ') + before + '  AFTER: ' + file.frontMatter.date);
	}
}

// function cleanFrontMatter(file, encoding, callback) {
// 	if (!file.isBuffer()) {
// 		// nothing to do
// 		return callback(null, file);
// 	}

// 	var slug = file.stem; //getSlug(file.stem);

// 	//slug = getSlug('Schöner Titel läßt grüßen!? Bel été !');
// 	//console.log(slug); // Output: schoener-titel-laesst-gruessen-bel-ete

// 	log(file.path + ' ==> ' + file.path);
// 	//log(chalk.blue(yaml.safeDump(file.frontMatter)));
// 	callback();
// }
