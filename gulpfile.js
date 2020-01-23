"use strict";

var gulp = require("gulp");
var del = require("del");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var htmlmin = require("gulp-htmlmin");
var size = require("gulp-filesize");
var server = require("browser-sync").create();

gulp.task("copy", function () {
  return gulp.src([
      "source/image/*.{jpg,png,svg}"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(size())
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(size())
    .pipe(server.stream());
});

gulp.task("optimage", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(size())
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"))
    .pipe(size());
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(size())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"))
    .pipe(size());
});

gulp.task("js", function () {
  return gulp.src("source/js/*.js")
    .pipe(gulp.dest("build/js"))
});

gulp.task("server", function () {
  server.init({
    server: "build/"
  })

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/img/icon-*.svg", gulp.series("html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("js", "refresh"));
});

gulp.task("refresh", function () {
  server.reload();
  done();
})

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "html",
  "js",
));

gulp.task("start", gulp.series("build", "server"));