// gulp 및 패키지 모듈 호출
const { task, series, parallel } = require('gulp');
const stripDebug = require('gulp-strip-debug');
const Debug = require('gulp-debug');
var gulp = require('gulp'),
	// CSS 프리프로세서
	sourcemaps = require('gulp-sourcemaps'),
	scss = require('gulp-sass')(require('sass')),
	// CSS3 제조사의 접두사 처리 모듈
	autoprefixer = require('gulp-autoprefixer'),
	modifyCssUrls = require('gulp-modify-css-urls'),
	runSeq = require('run-sequence'),
	del = require('del')

/**
 * ==============================+
 * @Path 정의
 * ==============================+
 */
var src = './'
var dist = './'
var paths = {
	// html: src + './',
	css: src + 'assets/css/**/*.css',
	// js: src + 'assets/js/*.js',
	scss: src + 'assets/scss/**/*.{sass,scss}',
}

/**
 * ==============================+
 * @SCSS : SCSS Config(환경설정)
 * ==============================+
 */
var scssOptions = {
	outputStyle: 'expanded', // nested, expanded, compact, compressed
	indentType: 'space', // space, tab
	indentWidth: 1, // nested, expanded 인 경우에 사용
	precision: 1,
	sourceComments: false,
}

/**
 * ==================================+
 * @task : SCSS Compile & sourcemaps
 * ==================================+
 */

gulp.task('scssCompile',function (){
	return gulp
		.src(paths.scss)
		// .pipe(Debug())
		.pipe(sourcemaps.init())
    // .pipe(scss(scssOptions).on('error', scss.logError))
		.pipe(scss(scssOptions)
			 .on('error', function (err) {
				 scss.logError(err);
				 this.emit('end');
			 })
		 )
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./maps')) /* 소스맵 경로 */
    .pipe(gulp.dest(dist + 'assets/css',{cwd: __dirname}))
})

/**
 * ==================================+
 * @task : Change CSS URL Path
 * ==================================+
 */
gulp.task('modifyUrls',function (){
  return gulp
  .src(paths.css)
  .pipe(
    modifyCssUrls({
      modify(url) {
        return url.replace(/..\/..\/..\//g, '../')
      },
    })
  )
  .pipe(gulp.dest(dist + 'assets/css',{cwd: __dirname}))
})
/**
 * ==============================+
 * @task : gulp default
 * ==============================+
 */

 gulp.task('default', function () {
   return runSeq('scssCompile');
 });


 gulp.task('clean', function(){
   del([paths.css]);
 });

/**
 * ==================================+
 * @task : watch 파일 변경을 감지
 * ==================================+
 */
gulp.task(
	"watch",
	gulp.series("modifyUrls", function() {
		// gulp.watch(paths.css, gulp.series(['clean']));
		gulp.watch(paths.scss, gulp.series(['scssCompile']));
		// gulp.watch(paths.css, gulp.series(['modifyUrls']));
		gulp.watch(paths.css).on("change", gulp.series(['modifyUrls']));
	})
);

/**
 * ==============================+
 * @task : gulp default
 * ==============================+
 */
gulp.task('default', gulp.parallel('watch'));
