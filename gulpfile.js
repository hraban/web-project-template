var browserify = require('browserify');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

gulp.task('default', ['browserify', 'html', 'vendor']);

gulp.task('watch', ['browserify', 'html'], function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch(['src/*.ts', 'src/*.js'], ['browserify']);
});

gulp.task('html', function () {
    gulp.src(['src/*.html']).pipe(gulp.dest('site/'));
});

// Files (or browserify resolvable entry points, like npm dirs) in the ext/ directory
EXTERNAL_LIBS = [
    {
        file: './ext/jquery-2.1.3.min.js',
        name: 'jquery'
    }
];

gulp.task('browserify', ['scripts'], function () {
    // Only specify the entry point (hello.js), browserify resolves the rest of
    // the dependencies. That's the point.
    var b = browserify('hello.js', {
            debug: true,
            paths: ['./build'],
            // This puts the module in window.hello
            standalone: 'hello',
        });

    EXTERNAL_LIBS.forEach(function (lib) {
        b.external(lib.name);
    });

    b.bundle()
        // Browserify bundle() uses text streams. The vinyl-source-stream plugin
        // converts that to a gulp-compatible pipe by wrapping it all in one
        // file (app.js).
        .pipe(source('app.js'))
        // The sourcemaps plugin doesn't like streaming so use vinyl-buffer to
        // capture all content before continuing.
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // This is the place for transformations like uglify
        //.pipe(uglify())
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

// 3rd party dependencies in a separate routine for quicker rebuilding and
// more cache hits
gulp.task('vendor', function () {
    var b = browserify();

    EXTERNAL_LIBS.forEach(function (lib) {
        b.require(lib.file, {expose: lib.name});
    });

    b.bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('site/'));
});
