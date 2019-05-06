//npm install --save-dev gulp-babel @babel/core @babel/preset-env @babel/preset-react @babel/preset-es2015
//npm install --save-dev gulp-replace gulp-util
const gulp = require("gulp");
const nearUtils = require("near-shell/gulp-utils");

var babel = require('gulp-babel');
var gutil = require('gulp-util')
var greplace = require('gulp-replace')

gulp.task("build:model", callback => {
  nearUtils.generateBindings("model.ts", "../out/model.near.ts", callback);
});

gulp.task("build:bindings", ["build:model"], callback => {
  nearUtils.generateBindings("main.ts", "../out/main.near.ts", callback);
});

gulp.task("build", ["build:bindings"], callback => {
  nearUtils.compile("../out/main.near.ts", "../out/main.wasm", callback);
});

gulp.task('build:react', () => {
  gulp.src('src/*.jsx')
    .pipe(greplace('class=', 'className='))
    .pipe(babel({presets: ['@babel/preset-env', '@babel/preset-react']}))
    .on('error', gutil.log)
    .pipe(gulp.dest('src/'));
});

gulp.task("default", ["build:react", "build"]);

// TODO: Extract all following boilerplate into library

// This task is not required when running the project locally. Its purpose is to set up the
// AssemblyScript compiler when a new project has been loaded in WebAssembly Studio.
gulp.task("project:load", () => {
  const utils = require("@wasm/studio-utils");
  utils.eval(utils.project.getFile("setup.js").getData(), {
    logLn,
    project,
    monaco,
    fileTypeForExtension,
  });
});
