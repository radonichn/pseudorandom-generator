'use strict';

// Load plugins
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
// const cp = require('child_process');
const cssnano = require('cssnano');
const del = require('del');
const pug = require('gulp-pug');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const cache = require('gulp-cache');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const webpack = require('webpack');
const webpackconfig = require('./webpack.config.js');
const webpackstream = require('webpack-stream');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './dist/',
    },
    port: 4444,
    notify: false,
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function cacheClear() {
  cache.clear();
}

// Clean assets
function clean() {
  return del(['./dist']);
}

// Optimize Images
function images() {
  return gulp
    .src('./src/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'))
    .pipe(browsersync.stream());
}

function pugBuild() {
  return gulp
    .src('./src/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./dist/'))
    .pipe(browsersync.stream());
}

// CSS task
function css() {
  return gulp
    .src('./src/scss/main.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded', }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(rename({ suffix: '.min', }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src(['./src/**/*.js', './gulpfile.js'])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp
      .src(['./src/**/*.js'])
      .pipe(plumber())
      .pipe(webpackstream(webpackconfig, webpack))
      // folder only, filename is specified in webpack config
      .pipe(gulp.dest('./dist/js/'))
      .pipe(browsersync.stream())
  );
}

function fontsBuild() {
  return gulp
    .src(['./src/fonts/**/*'])
    .pipe(gulp.dest('./dist/fonts/'))
    .pipe(browsersync.stream());
}

// Jekyll
// function jekyll() {
//     return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {
//         stdio: 'inherit',
//     });
// }

// Watch files
function watchFiles() {
  gulp.watch('./src/scss/**/*.scss', css);
  gulp.watch('./src/**/*.pug', pugBuild);
  gulp.watch('./src/**/*.js', gulp.series(scriptsLint, scripts));
  // gulp.watch(['./src/**/*'], gulp.series(jekyll, browserSyncReload));
  gulp.watch(['./src/**/*'], gulp.series(cacheClear, browserSyncReload));
  gulp.watch('./src/img/**/*', images);
}

// define complex tasks
const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(clean, gulp.parallel(css, js, pugBuild, fontsBuild));
const watch = gulp.parallel(watchFiles, browserSync);


// export tasks
exports.images = images;
exports.css = css;
exports.js = js;
// exports.jekyll = jekyll;
exports.clean = clean;
exports.pug = pugBuild;
exports.build = build;
exports.watch = watch;
exports.default = build;
