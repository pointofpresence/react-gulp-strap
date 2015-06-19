var gulp           = require("gulp"),                   // GulpJS
    mkdirp         = require("mkdirp"),                 // make dir
    csso           = require("gulp-csso"),              // CSS min
    header         = require("gulp-header"),            // banner maker
    out            = require("gulp-out"),               // output to file
    source         = require("vinyl-source-stream"),    // vinyl objects
    browserify     = require("browserify"),             // Browserify
    reactify       = require("reactify"),               // Reactify
    fs             = require("fs"),                     // fs
    uglify         = require("gulp-uglify"),            // JS min
    buffer         = require("vinyl-buffer"),           // streaming
    less           = require("gulp-less"),              // LESS
    exorcist       = require("exorcist"),
    gulpif         = require("gulp-if"),
    includeSources = require("gulp-include-source"),
    replace        = require("gulp-replace");           // replace

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

var dateHelper = {
    /**
     * @param {Date} d
     */
    toUnixTimestamp: function (d) {
        return Math.floor(d.getTime() / 1000);
    }
};

function buildReadme() {
    gulp.src(src + "/README.md")
        .pipe(replace("##TITLE##", pkg.title || "Unknown"))
        .pipe(replace("##NAME##", pkg.name || "Unknown"))
        .pipe(replace("##DESCRIPTION##", pkg.description || "Unknown"))
        .pipe(replace("##AUTHOR##", pkg.author || "Unknown"))
        .pipe(replace("##REPOSITORY##", pkg.repository || "Unknown"))
        .pipe(replace("##VERSION##", pkg.version || "Unknown"))
        .pipe(replace("##DATE##", pkg.lastBuildDateUtc || "Unknown"))
        .pipe(out("./README.md"));
}

function dateUpdate() {
    var d = new Date();
    pkg.lastBuildDate = dateHelper.toUnixTimestamp(d);
    pkg.lastBuildDateUtc = d.toUTCString();
    writeJsonFile("./package.json", pkg);
}

function versionIncrement() {
    var v = (pkg.version || "0.0.0").split(".");

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

function buildJs(production) {
    production = !(typeof(production) === "function" || !production);

    mkdirp(distJs);

    //var srcMap = distJsBundle + ".map";

    browserify({
        entries: srcJsIndex,
        debug:   !production
    })
        .transform(reactify)
        .bundle()
        //.pipe(gulpif(!production, exorcist(srcMap))) // sourcemap
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
    dateUpdate();
    versionIncrement();
    buildCss();
    buildJs(true);
    buildReadme();
});