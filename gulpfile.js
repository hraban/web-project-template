var browserify = require('browserify');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

gulp.task('default', ['browserify', 'html']);

gulp.task('watch', ['browserify', 'html'], function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch(['src/*.ts', 'src/*.js'], ['browserify']);
});

gulp.task('html', function () {
    gulp.src(['src/*.html']).pipe(gulp.dest('site/'));
});

gulp.task('browserify', ['scripts'], function () {
    var b = browserify('hello.js', {
            debug: true,
            paths: ['./build'],
            standalone: 'hello',
        });

    b.bundle()
        .pipe(source('project.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('site/'));
});

gulp.task('scripts', function () {
    gulp.src(['src/*.ts', 'src/*.js'])
        .pipe(sourcemaps.init())
        .pipe(gulpif(/\.ts$/, typescript({
                declarationFiles: false,
                module: "commonjs",
                sortOutput: true
            })))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/'));
});
