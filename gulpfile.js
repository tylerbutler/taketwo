var gulp = require('gulp');
var remark = require('gulp-remark');
var html = require('remark-html');
var lint = require('remark-lint');
var gap = require('remark-heading-gap');
var shortcodes = require('remark-shortcodes');
var squeezeParagraphs = require('remark-squeeze-paragraphs');
var styleGuide = require('remark-preset-lint-markdown-style-guide');
var gulpGrayMatter = require('gulp-gray-matter');

gulp.task('default', ['lint'], function () {
	//gulp.src('content/**/*.md')
	//.pipe(remark().use(lint))
	//.pipe(gulp.dest('content'))
});

gulp.task('lint', () =>
	gulp.src('content/**/*.md')
	.pipe(remark()
		//.use(shortcodes, {startBlock: "{{<", endBlock: ">}}"})
		//.use(gap)
		.use(lint)
		//.use(squeezeParagraphs)
		.use(styleGuide)
	)
);

gulp.task('fix', function () {
	return gulp.src('content/**/*.md')
		.pipe(gulpGrayMatter({'remove': false}))
		.pipe(gulp.dest('content'));
});
