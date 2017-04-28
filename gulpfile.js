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
          "dealHtml",
          "refresh"
        ]
}

//js 合并 压缩
gulp.task("dealJs",function(){
  gulp.src("src/js/*.min.js").
    pipe(gulp.dest("dist/js/"));

  gulp.src(["src/js/*.js","!src/js/*.min.js"])
    // .pipe(uglify())
    .pipe(rename(function(path){
      path.basename += ".min"
    }))
    .pipe(gulp.dest("dist/js/"));
})
//less
.task("dealLess",function(){
  gulp.src("src/css/*.less")
    .pipe(less())
    .pipe(gulp.dest("src/css/"));
})
//css 合并 压缩
.task("dealCss",function(){
  gulp.src("src/css/*.css")
    // .pipe(minCss())
    .pipe(rename(function(path){
      path.basename += ".min"
    }))
    .pipe(gulp.dest("dist/css/"));
})
//pic
.task("dealPic",function(){
  gulp.src(["src/images/*.*","!src/images/*.psd"])
    .pipe(imageMin())
    .pipe(gulp.dest("dist/images/"))
})
//html 压缩
.task("dealHtml",function(){
  gulp.src(['src/*.html'])
    .pipe(htmlmin())
    .pipe(gulp.dest("dist/"))
})
//webserver
.task("connect",function(){
  connect.server({
    port:8066,
    livereload:true,
    root:"dist"
  })
})
//刷新
.task("refresh",function(){
  connect.reload();
})
//监听
.task("watch",function(){
  gulp.watch(config._src,config._task)
})


.task('default',[
                  "dealPic",
                  "dealJs",
                  "dealLess",
                  "dealCss",
                  "dealHtml",
                  "watch",
                  "connect"
                ]
);





