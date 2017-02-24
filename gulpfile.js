const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

gulp.task('scss', () => {
  return gulp.src('./scss/*.scss')
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gulp.dest('./public/styles'))
})

gulp.task('browserSync', () => {
  return browserSync.init(['./scss'], {
    server: {
    baseDir: './public'
  }
  })
})
gulp.task('watch', ['browserSync'], () => {
  gulp.watch('./scss/**/*.scss', ['scss'])
})

gulp.task('default', ['watch', 'scss'])