const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const spritesmith = require("spritesmith");
const rimraf = require('rimraf');
const rename = require('gulp-rename');

/* ------- Server ---------- */
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 9000,
      baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload)

});

/* ------- Pug compilation ---------- */
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('src/template/index.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('build'))
});

/* ------- Styles compilation ---------- */
gulp.task('styles:compile', function () {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

/* ------- Sprites ---------- */
gulp.task('sprite', function () {
  const spriteData = gulp.src('./src/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    imgPath: '../images/sprite.png'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('src/styles/global/'));
  cb();     
});

/* ------- Clean ---------- */
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
}); 

/* ------- Copy fonts ---------- */
gulp.task('copy:fonts', function() {
  return gulp.src('./src/fonts/**/*.*')
  .pipe(gulp.dest('bild/fonts'));
});


/* ------- Copy images ---------- */
gulp.task('copy:images', function() {
  return gulp.src('./src/images/**/*.*')
  .pipe(gulp.dest('bild/images'));
});

/* ------- Copy both fonts && images---------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* ------- Watchers ---------- */
gulp.task('watch', function() {
  gulp.watch('src/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('src/template/**/*.scss', gulp.series('styles:compile'));
});

/* ------- Default ---------- */
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'copy'), // 'sprite' disabled temporarily
    gulp.parallel('watch', 'server')
  )
);