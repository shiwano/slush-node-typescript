'use strict';

var fs = require('fs');
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var plugins = require('gulp-load-plugins')();

var paths = {
  gulpfile: 'gulpfile.js',
  src: 'src/**/*.ts',
  dest: 'lib/',
  testDest: '.tmp/',
  typescriptFiles: '{src,test}/**/*.ts'
};

var tsProject = plugins.type.createProject({
  target: 'ES5',
  module: 'commonjs',
  noImplicitAny: true
});

var mochaOptions = {
  reporter: 'nyan'
};

gulp.task('jshint', function() {
  return gulp.src(paths.gulpfile)
    .pipe(plugins.plumber())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'));
});

gulp.task('tslint', function(){
  return gulp.src(paths.typescriptFiles)
    .pipe(plugins.plumber())
    .pipe(plugins.tslint())
    .pipe(plugins.tslint.report('verbose'));
});

gulp.task('test', function(callback) {
  runSequence('clean:testDest', 'test:changed', callback);
});

gulp.task('test:changed', function () {
  return gulp.src(paths.typescriptFiles)
    .pipe(plugins.plumber())
    .pipe(plugins.changed(paths.testDest, {extension: '.js', hasChanged: hasChangedForTest}))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.type(tsProject)).js
    .pipe(plugins.espower())
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(paths.testDest))
    .pipe(plugins.mocha(mochaOptions));
});

gulp.task('clean:dest', function(callback) {
  del(paths.dest, callback);
});

gulp.task('clean:testDest', function(callback) {
  del(paths.testDest, callback);
});

gulp.task('compile', ['clean:dest'], function(){
  return gulp.src(paths.src)
    .pipe(plugins.type(tsProject)).js
    .pipe(gulp.dest(paths.dest));
});

gulp.task('build', function(callback) {
  runSequence(['jshint', 'tslint', 'test'], 'compile', callback);
});

gulp.task('default', ['build']);

gulp.task('watch', function () {
  gulp.watch(paths.typescriptFiles, ['tslint', 'test:changed']);
});

function hasChangedForTest(stream, callback, sourceFile, destPath) {
  if (!fs.existsSync(destPath)) {
    stream.push(sourceFile);
    return callback();
  }

  var destStat = fs.statSync(destPath);

  if (sourceFile.stat.mtime > destStat.mtime) {
    stream.push(sourceFile);
  } else if (/_test.ts$/.test(sourceFile.path)) {
    var testTargetPath = sourceFile.path
      .replace(/_test.ts$/, '.ts')
      .replace(process.cwd() + '/test', process.cwd());
    var testTargetStat = fs.statSync(testTargetPath);

    if (testTargetStat.mtime > destStat.mtime) {
      stream.push(sourceFile);
    }
  }

  callback();
}
