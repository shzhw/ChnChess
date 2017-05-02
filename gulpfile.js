"use strict"
var gulp = require("gulp"),
    uglify = require("gulp-uglify"),//js压缩
    less = require("gulp-less"),//编译less
    minCss = require("gulp-clean-css"),//css压缩
    imageMin = require("gulp-imagemin"),//压缩图片
    htmlmin = require("gulp-htmlmin"),
    rename = require("gulp-rename"),//重命名 
    connect = require("gulp-connect"),//刷新
    rev = require("gulp-rev"),//给文件+MD5后缀
    revCollector = require("gulp-rev-collector"),//替换路径
    concat = require("gulp-concat");//合并文件

var config ={
  _src:[
        "src/js/*.js",
        "src/css/*.css",
        "src/css/*.less",
        "src/images/*.*",
        "!src/images/*.psd",
        "src/*.html"
       ],
  _task:[ "dealPic",
          "dealJs",
          "dealLess",
          "dealCss",
          "dealHtml"
        ]
}

//js 合并 压缩
gulp.task("dealJs",function(){
  gulp.src("src/js/*.min.js")
    .pipe(gulp.dest("dist/js/"))
    .pipe(connect.reload());

  gulp.src(["src/js/*.js","!src/js/*.min.js"])
    .pipe(uglify())
    .pipe(rename(function(path){
      path.basename += ".min"
    }))
    .pipe(gulp.dest("dist/js/"))
    .pipe(connect.reload());
})
//less
.task("dealLess",function(){
  gulp.src("src/css/*.less")
    .pipe(less())
    .pipe(gulp.dest("src/css/"))
    .pipe(connect.reload());
})
//css 合并 压缩
.task("dealCss",function(){
  gulp.src("src/css/*.css")
    .pipe(minCss())
    .pipe(rename(function(path){
      path.basename += ".min"
    }))
    .pipe(gulp.dest("dist/css/"))
    .pipe(connect.reload());
})
//pic
.task("dealPic",function(){
  gulp.src(["src/images/*.*","!src/images/*.psd"])
    .pipe(imageMin())
    .pipe(gulp.dest("dist/images/"))
    .pipe(connect.reload());
})
//html 压缩
.task("dealHtml",function(){
  gulp.src(['src/*.html'])
    .pipe(htmlmin())
    .pipe(gulp.dest("dist/"))
    .pipe(connect.reload());
})
//webserver
.task("connect",function(){
  connect.server({
    port:8066,
    livereload:true,
    root:"dist",
    livereload: true
  })
})
//监听
.task("watch",function(){
  gulp.watch("src/js/*.js",["dealJs"])
  gulp.watch("src/css/*.css",["dealCss"])
  gulp.watch("src/css/*.less",["dealLess"])
  gulp.watch(["src/images/*.*","!src/images/*.psd"],["dealPic"])
  gulp.watch("src/*.html",["dealHtml"]);
})


.task('default',["connect","watch"]);





