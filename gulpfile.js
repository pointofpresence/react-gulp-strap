var gulp       = require("gulp"),                   // GulpJS
    mkdirp     = require("mkdirp"),                 // make dir
    csso       = require("gulp-csso"),              // CSS min
    header     = require("gulp-header"),            // banner maker
    out        = require("gulp-out"),               // output to file
    source     = require("vinyl-source-stream"),    // vinyl objects
    browserify = require("browserify"),             // Browserify
    reactify   = require("reactify"),               // Reactify
    fs         = require("fs"),                     // fs
    uglify     = require("gulp-uglify"),            // JS min
    buffer     = require("vinyl-buffer"),           // streaming
    less       = require("gulp-less");              // LESS

var src         = "./src",
    srcLess     = src + "/less",
    srcLessMain = srcLess + "/main.less",
    srcJs       = src + "/js",
    srcJsIndex  = srcJs + "/index.jsx";

var dist             = "./dist",
    distCss          = dist + "/css",
    distCssApp       = distCss + "/app.css",
    distJs           = dist + "/js",
    distJsBundleFile = "bundle.js",
    distJsBundle     = distJs + "/" + distJsBundleFile;

var pkg = require('./package.json');

var banner = [
    '/**',
    ' * Copyright (c) <%= new Date().getFullYear() %> <%= pkg.author %>',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.repository %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');

function versionIncrement() {
    var v = (pkg.version || "1.0.0").split(".");

    pkg.version = [
        v[0] ? v[0] : 0,
        v[1] ? v[1] : 0,
        (v[2] ? parseInt(v[2]) : 0) + 1
    ].join(".");

    writeJsonFile("./package.json", pkg);
    console.log("Version: ", pkg.version);
}

function writeJsonFile(file, obj, options) {
    var spaces = 2,
        str = JSON.stringify(obj, null, spaces) + '\n';

    return fs.writeFileSync(file, str, options);
}

function buildCss() {
    mkdirp(distCss);

    return gulp
        .src(srcLessMain)
        .pipe(less())
        .pipe(csso())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(out(distCssApp));
}

function buildJs() {
    mkdirp(distJs);

    browserify(srcJsIndex)
        .transform(reactify)
        .bundle()
        .pipe(source(distJsBundleFile))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest(distJs));
}

gulp.task("build_css", buildCss);
gulp.task("build_js", buildJs);

gulp.task("watch", function () {
    gulp.watch(srcLess + "/**/*.less", ["build_css"]);
    gulp.watch(srcJs + "/**/*.jsx", ["build_js"]);
});

gulp.task("build", function () {
    versionIncrement();
    buildCss();
    buildJs();
});