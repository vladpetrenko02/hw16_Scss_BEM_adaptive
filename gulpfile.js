const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

function server() {
    browserSync.init({
        server: {
            baseDir: "./public/"
        }
    });
}

function fonts() {
    return src('./dev/fonts/*')
        .pipe(dest('./public/fonts/'))
        .pipe(browserSync.stream());
}

function copy() {
    return src('./dev/js/**/*.js')
        .pipe(dest('./public/js/'))
        .pipe(browserSync.stream());
}

function html() {
    return src(['./dev/*.html'])
        .pipe(dest('./public/'))
        .pipe(browserSync.stream())
}

function scss() {
    return src('./dev/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(
            //{ outputStyle: 'compressed' }
        ).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest('./public/css/'))
        .pipe(browserSync.stream());
}

function images() {
    return src('./dev/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })]))
        .pipe(dest('./public/images/'))
        .pipe(browserSync.stream());
}

function watching() {
    watch('./dev/scss/**/*.scss', scss);
    watch('./dev/js/**/*.js', copy);
    watch('./dev/*.html', html);
    watch('./dev/images/**/*', imagemin);
    watch('./dev/fonts/*', fonts);
};

exports.fonts = fonts;
exports.images = images;
exports.watching = watching;
exports.server = server;
exports.html = html;

exports.default = parallel(html, images, fonts, server, watching);