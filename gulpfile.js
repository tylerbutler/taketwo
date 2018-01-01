var gulp = require('gulp');
var remark = require('gulp-remark');
var html = require('remark-html');
var lint = require('remark-lint');
var gap = require('remark-heading-gap');
var shortcodes = require('remark-shortcodes');
var squeezeParagraphs = require('remark-squeeze-paragraphs');

gulp.task('default', () =>
	gulp.src('content/**/*.md')
	.pipe(remark().use(lint))
	.pipe(gulp.dest('content'))
);

gulp.task('fix', () =>
	gulp.src('content/**/*.md')
	.pipe(remark()
		//.use(shortcodes, {startBlock: "{{<", endBlock: ">}}"})
		//.use(gap)
		.use(lint)
		.use(squeezeParagraphs)
	)
	.pipe(gulp.dest('content'))
);
