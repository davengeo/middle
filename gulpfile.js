var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    env = require('gulp-env'),
    gutil = require('gulp-util'),
    istanbul = require('gulp-istanbul');

gulp.task('default', ['watch', 'coverage']);

gulp.doneCallback = function (err) {
    process.exit(err ? 1 : 0);
};

gulp.task('watch', function() {
    gulp.watch(['gulpfile.js', 'lib/**', 'test/**'], ['mocha']);
});

gulp.task('mocha', function() {
    const envs = env.set({
        NODE_ENV: 'development'
    });
    return gulp.src(['test/*.js'], { read: false })
        .pipe(envs)
        .pipe(mocha({ reporter: 'list', showStack: true }))
        .on('error', gutil.log);
});

gulp.task('pre-test', function () {
    return gulp.src(['lib/**/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('coverage', ['pre-test'], function() {
    return gulp.src(['test/**/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }));
});

gulp.task('ci', ['pre-test'], function() {
    return gulp.src(['test/**/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }));

});

