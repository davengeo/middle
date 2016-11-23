const gulp        = require('gulp'),
      mocha       = require('gulp-mocha'),
      env         = require('gulp-env'),
      gutil       = require('gulp-util'),
      git         = require('gulp-git'),
      runSequence = require('run-sequence'),
      bump        = require('gulp-bump'),
      istanbul    = require('gulp-istanbul');

require('gulp-release-tasks')(gulp);

//noinspection JSValidateTypes
gulp.task('default', ['watch', 'coverage']);

gulp.doneCallback = function(err) {
    process.exit(err ? 1 : 0);
};

//noinspection JSValidateTypes
gulp.task('watch', function() {
    gulp.watch(['gulpfile.js', 'lib/**', 'test/**'], ['mocha']);
});

//noinspection JSValidateTypes
gulp.task('mocha', function() {
    const envs = env.set({
        NODE_ENV: 'development'
    });
    return gulp.src(['test/*.js'], { read: false })
               .pipe(envs)
               .pipe(mocha({ reporter: 'list', showStack: true }))
               .on('error', gutil.log);
});

//noinspection JSValidateTypes
gulp.task('pre-test', function() {
    return gulp.src(['lib/**/*.js'])
               .pipe(istanbul())
               .pipe(istanbul.hookRequire());
});

//noinspection JSValidateTypes
gulp.task('coverage', ['pre-test'], function() {
    return gulp.src(['test/**/*.js'])
               .pipe(mocha())
               .pipe(istanbul.writeReports())
               .pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }));
});

//noinspection JSValidateTypes
gulp.task('ci', ['pre-test'], function() {
    return gulp.src(['test/**/*.js'])
               .pipe(mocha())
               .pipe(istanbul.writeReports())
               .pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }));

});

//noinspection JSValidateTypes
gulp.task('bump', function() {
    gulp.src('./*.json')
        .pipe(bump({ type: 'patch' }))
        .on('error', gutil.log)
        .pipe(gulp.dest('./'));
});

//noinspection JSValidateTypes
gulp.task('commit-changes', function () {
    return gulp.src('.')
               .pipe(git.add())
               .pipe(git.commit('[Prerelease] Bumped version number'));
});

//noinspection JSValidateTypes
gulp.task('push-changes', function (cb) {
    //noinspection JSUnresolvedFunction
    git.push('origin', 'master', cb);
});

//noinspection JSValidateTypes
gulp.task('create-new-tag', function (cb) {
    let version = require('./package.json').version;
    //noinspection JSUnresolvedFunction
    git.tag(version, 'Created Tag for version: ' + version, function(error) {
        if(error) {
            return cb(error);
        }
        //noinspection JSUnresolvedFunction
        git.push('origin', 'master', { args: '--tags' }, cb);
    });
});

//noinspection JSValidateTypes
gulp.task('release', function (callback) {
    runSequence(
        'bump',
        'commit-changes',
        'push-changes',
        'create-new-tag',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('RELEASE FINISHED SUCCESSFULLY');
            }
            callback(error);
        });
});
