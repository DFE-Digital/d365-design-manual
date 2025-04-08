import gulp from 'gulp';
import GulpCleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import dartSass from 'sass';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import gulpEsbuild from 'gulp-esbuild';

const sassCompiler = sass(dartSass);

// Process SCSS files
function processAppScss() {
  return gulp
    .src('app/assets/scss/app.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(GulpCleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/assets/css'));
}

// Process font files
function processFonts() {
  return gulp
    .src('app/assets/fonts/*.{woff,woff2}')
    .pipe(gulp.dest('public/assets/fonts'));
}

// Process JavaScript files
function processJs() {
  return gulp
    .src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js',
      'node_modules/dfe-frontend/dist/dfefrontend.min.js',
      'app/assets/js/update-html-example.js',
      'app/assets/js/dfe-custom-components.js',
    ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(gulpEsbuild({
      outdir: 'public/assets/js',
      bundle: false,
      minify: true,
      sourcemap: true,
      target: 'es2015',
    }))
    .pipe(rename({ dirname: '' })) // Remove path from filenames
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/assets/js'));
}

// Watch files for changes
function watchFiles() {
  gulp.watch('app/assets/scss/**/*.scss', processAppScss);
  gulp.watch(
    [
      'app/assets/js/update-html-example.js',
      'app/assets/js/dfe-custom-components.js',
      'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js',
      'node_modules/dfe-frontend/dist/dfefrontend.min.js',
    ],
    processJs
  )
}

// Define the default task
const build = gulp.series(
  gulp.parallel(processAppScss, processFonts, processJs)
);

// Export tasks
export { processAppScss, processFonts, processJs, watchFiles as watch };
export default build;