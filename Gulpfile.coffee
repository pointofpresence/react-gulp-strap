gulp            = require 'gulp'
webserver       = require 'gulp-webserver'
less            = require 'gulp-less'
source          = require 'vinyl-source-stream'
browserify      = require 'browserify'
watchify        = require 'watchify'
cjsxify         = require 'cjsxify'
# browserifyShim  = require 'browserify-shim'


handleErrors = (title) -> (args...)->
  # TODO: Send error to notification center with gulp-notify
  console.error(title, args...)
  # Keep gulp from hanging on this task
  @emit('end')


buildBrowserify = (srcPath, destDir, destFile, isWatching) ->
  args = (if isWatching then watchify.args else {})
  args.entries = [srcPath]
  args.extensions = ['.coffee', '.cjsx']
  args.debug = true if isWatching
  bundler = browserify(args)
  # bundler.transform(browserifyShim)
  bundler.transform(cjsxify)

  bundler = watchify(bundler, {}) if isWatching

  bundle = ->
    bundler
    .bundle()
    .on('error', handleErrors('Browserify error'))
    .pipe(source(destFile))
    .pipe(gulp.dest(destDir))

  bundler.on('update', bundle) if isWatching
  bundle()


build = (isWatching)->
  destDir = './'
  destDirFonts = './dist/fonts'

  destFile = './dist/build.js'
  srcPath = './src/index.coffee'
  buildBrowserify(srcPath, destDir, destFile, isWatching)
  .on 'end', ->

    gulp.src('bower_components/**/*.{eot,svg,ttf,woff}')
    .pipe(gulp.dest(destDirFonts))


gulp.task 'styles', ->
  destDirCss = './dist'
  destDirCssFonts = './dist/fonts'
  # Build the CSS file
  gulp.src('./style/all.less')
  .pipe(less())
  .pipe(gulp.dest(destDirCss))

  # Move the font files over to dist as well
  gulp.src('./node_modules/font-awesome/fonts/*.{eot,svg,ttf,woff}')
  .pipe(gulp.dest(destDirCssFonts))


gulp.task 'dist', ['styles'], -> build(false)


gulp.task 'serve', ['dist'], ->
  build(true)
  config = webserver
    port: process.env['PORT'] or undefined
    # host: '0.0.0.0'
    open: true
    livereload:
      filter: (f) -> console.log(arguments)
    # fallback: 'index.html'

  gulp.src('./')
    .pipe(config)
