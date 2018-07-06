"use strict"

const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const notify = require("gulp-notify");
const pug = require('gulp-pug');
const newer = require('gulp-newer');
const cached = require('gulp-cached');
const plumber = require('gulp-plumber');
const spritesmith = require('gulp.spritesmith');
const del = require('del');
const reload = browserSync.reload;

var path = {
	build: {
		pug: 'build/',
		js: {
			common: 'build/js/'
		},
		css: 'build/css/',
		fonts: 'build/fonts/',
		icons: 'build/img/',
		img: 'build/img/'
	},
	src: {
		pug: 'src/pug/!(_)*.pug',
		js: {
			common: 'src/js/**/*'
		},
		css: 'src/scss/**/*.scss',
		fonts: 'src/fonts/**/*',
		icons: 'src/icons/*.png',
		img: ['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.svg']
	},
	watch: {
		pug: 'src/pug/*.pug',
		includes: 'src/pug/includes/*.pug',
		js: {
			common: 'src/js/**/*.js',
		},
		css: 'src/scss/**/*.scss',
		fonts: 'src/fonts/**/*',
		icons: 'src/icons/**/*',
		img: 'src/img/**/*'
	}
};

gulp.task("server", function(){
	browserSync({
		server: {
			baseDir: "./build"
		},
		host: 'localhost',
		port: 3000
	});
});

gulp.task('build:pug', function(){
	var YOUR_LOCALS = {};
	return gulp.src(path.src.pug, {since: gulp.lastRun('build:pug')})
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Jade',
					message: err.message
				}
			})
		}))
		.pipe(pug({
			locals: YOUR_LOCALS,
			pretty: true
		}))
		.pipe(gulp.dest(path.build.pug))
		.pipe(reload({stream: true}))
});

gulp.task('build:includes', function(){
	var YOUR_LOCALS = {};
	return gulp.src(path.src.pug)
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'JadeIncludes',
					message: err.message
				}
			})
		}))
		.pipe(pug({
			locals: YOUR_LOCALS,
			pretty: true
		}))
		.pipe(gulp.dest(path.build.pug))
		.pipe(reload({stream: true}))
});

gulp.task('build:js', function(){
	return gulp.src(path.src.js.common, {since: gulp.lastRun('build:js')})
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'JS',
					message: err.message
				}
			})
		}))
		.pipe(gulp.dest(path.build.js.common))
		.pipe(reload({stream: true}));
})

gulp.task('build:icomoon', function(){
	return gulp.src(path.src.js.common, {since: gulp.lastRun('build:js')})
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'JS',
					message: err.message
				}
			})
		}))
		.pipe(gulp.dest(path.build.js.common))
		.pipe(reload({stream: true}));
})

gulp.task('build:css', function(){
	return gulp.src(path.src.css, {since: gulp.lastRun('build:css')})
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
		.pipe(sass({
			pretty: true
		}))
		.pipe(prefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}))
})

gulp.task('build:img', function(){
	return gulp.src(path.src.img)
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Images',
					message: err.message
				}
			})
		}))
		.pipe(cached())
        .pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
})

gulp.task('build:fonts', function(){
	return gulp.src(path.src.fonts)
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Fonts',
					message: err.message
				}
			})
		}))
		.pipe(newer(path.src.fonts))
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({stream: true}));
})

gulp.task('build:sprite', function (callback) {
  var spriteData = gulp.src(path.src.icons)
  		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
	  .pipe(newer(path.src.icons)).pipe(spritesmith({
	    imgName: 'icon-set.png',
	    cssName: 'icon-set.css',
	    imgPath: '../img/icon-set.png',
	    cssVarMap: function (sprite) {
		  sprite.name = 'icon-' + sprite.name;
		}
	  }));
	  spriteData.img.pipe(gulp.dest(path.build.icons));
	  spriteData.css.pipe(gulp.dest('build/css'));
	  callback();
});

gulp.task('clean', function(callback){
	cached.caches = {};
	del('build/img');
	callback();
});

gulp.task('build', gulp.parallel(
	'build:pug',
	'build:css',
	'build:js',
	'build:sprite',
	'build:img',
	'build:fonts'
));

gulp.task('watch', function(){
	gulp.watch(path.watch.pug, gulp.series('build:pug'));
	gulp.watch(path.watch.includes, gulp.series('build:includes'));
	gulp.watch(path.watch.css, gulp.series('build:css'));
	gulp.watch(path.watch.js.common, gulp.series('build:js'));
	gulp.watch(path.watch.icons, gulp.series('build:sprite'));
	gulp.watch(path.watch.img, gulp.series('build:img'));
	gulp.watch(path.watch.fonts, gulp.series('build:fonts'));
});

gulp.task('default', gulp.series(
	'clean',
	'build',
	gulp.parallel('watch', 'server')
));
