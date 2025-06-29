// gulpfile.mjs

import gulp from 'gulp'
import rename from 'gulp-rename'
import gulpSass   from 'gulp-sass'
import * as dartSass from 'sass'
import sourcemaps from 'gulp-sourcemaps'
import plumber    from 'gulp-plumber'
import gulpEsbuild from 'gulp-esbuild'

const sass = gulpSass(dartSass)

// ─── Copy vendor JS as-is ─────────────────────────────────────
export function copyVendorJs() {
  return gulp
    .src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js',
      'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js.map'
    ])
    .pipe(gulp.dest('public/js'));
}

// ─── Build your own JS with Esbuild ───────────────────────────
export function buildAppJs() {
  return gulp
    .src('app/js/**/*.js', { base: 'app/js' })
    .pipe(plumber())
    .pipe(gulpEsbuild({
      bundle: false,
      outdir: 'public/js',
      minify: true,
      sourcemap: true,
      target: 'es2015',
    }))
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('public/js'));
}

export function styles() {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'));
}

export function rebrandImages() {
  return gulp
    .src('node_modules/govuk-frontend/dist/govuk/assets/rebrand/**/*{png,jpg,jpeg,svg,gif,ico}')  // grab all files
    .pipe(gulp.dest('public/'));
}

export function otherImages() {
  return gulp
    .src('app/images/**/*{png,jpg,jpeg,svg,gif}')  // grab all files
    .pipe(gulp.dest('public/images'));
}

export const js = gulp.parallel(copyVendorJs, buildAppJs)
export default gulp.parallel(js, styles, rebrandImages, otherImages)