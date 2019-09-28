const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const path = require("path");
const del = require('del');
const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const templateCache = require('gulp-angular-templatecache');
const package = require('./package.json')
const iife = require("gulp-iife");
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const minifyes = composer(uglifyes, console);
const fs = require('fs');
const replace = require('gulp-replace');
const bulkSass = require('gulp-sass-bulk-import');
const babel = require('gulp-babel');

const distributionFolder = 'dist/';

gulp.task('clean', function () {
    return del('./' + distributionFolder + '**');
});

gulp.task('copy-files', function () {
    return gulp.src([
        'index.html',

    ], {base: ".", nodir: true})
        .pipe(gulp.dest(distributionFolder));
});


// Static server
gulp.task('browser-sync', function (done) {

    historyApiFallback = require('connect-history-api-fallback');
    browserSync.init({
        ui: false,
        middleware: [historyApiFallback()],
        //browser: "google chrome"
    });

    done();
});

gulp.task('javascript', function (done) {
    var sources = ['src/js/app.js', 'src/js/**/*.js'];

    return gulp.src(sources, {base: '.'})
        .pipe(sourcemaps.init())
        .pipe(concat('angular-filemanager.js'))
        .on('error', logError)
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/'}))
        .pipe(gulp.dest(distributionFolder));
});

gulp.task('scss', function () {
    return gulp.src('src/css/style.scss')
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass({importer: importer}))
        .on('error', logError)
        // since gulp-sass doesn't let you rename the file
        .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/src/css'}))
        .pipe(concat('angular-filemanager.css'))
        .pipe(gulp.dest(distributionFolder))
        .pipe(browserSync.stream());
});


let svgSprite = require("gulp-svg-sprite");
let svgIconConfig = {
    shape: {
        id: { // SVG shape ID related options
            generator: "svg-", // SVG shape ID generator callback
        },
        dimension: {			// Set maximum dimensions
            maxWidth: 24,
            maxHeight: 24
        },
        spacing: {			// Add padding
            padding: 0,
            box: 'icon'
        },
        transform: ['svgo'],
        meta: null,

    },
    mode: {
        symbol: {			// Activate the «view» mode
            common: 'svg',
            bust: false,
            dimensions: false,
            sprite: 'angular-filemanager.svg',
            //example: true,
            render: {
                css: false
            },
            inline: true,
            dest:""
        }
    },
    svg: {							// General options for created SVG files
        xmlDeclaration: false,						// Add XML declaration to SVG sprite
        doctypeDeclaration: true,						// Add DOCTYPE declaration to SVG sprite
        namespaceIDs: true,						// Add namespace token to all IDs in SVG shapes
        namespaceClassnames: true,						// Add namespace token to all CSS class names in SVG shapes
        dimensionAttributes: false						// Width and height attributes on the sprite
    }

};

gulp.task('sprites_icon', function () {
    return gulp.src("src/svg/**/*.svg").pipe(svgSprite(svgIconConfig)).pipe(gulp.dest(distributionFolder));
});


function browserSyncReload(done) {
    browserSync.reload();
    done();
}


gulp.task('watch', gulp.series(gulp.parallel('scss', 'javascript', 'sprites_icon'), function watchTask(done) {
    gulp.watch(['src/**/*css'], gulp.parallel('scss'));
    gulp.watch(['src/svg/*.svg'], gulp.series('sprites_icon', browserSyncReload));
    gulp.watch(['src/js/**/*.js'], gulp.series('javascript', browserSyncReload));
    gulp.watch(["src/**/*.html", "index.html"], gulp.parallel(browserSyncReload));

    done();
}));


gulp.task('default', gulp.series(gulp.parallel('clean'), 'watch', 'browser-sync'));

function importer(url, prev, done) {
    if (url[0] === '~') {
        url = path.resolve('./node_modules/' + url.substr(1));
    } else if (url[0] === '/') {
        //url = path.resolve( url.substr(1));
    }
    return {file: url};
}

function logError(error) {

    // If you want details of the error in the console
    console.log(error.toString());
    this.emit('end')
}

gulp.task('ng-templates', function () {
    return gulp.src(['src/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            sortAttributes: true,
            sortClassName: true,
            ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?(\?>|$)/],
            trimCustomFragments: true
        }))
        .pipe(templateCache({root: '/'}))
        .pipe(replace("angular.module('templates')", 'app'))
        .pipe(gulp.dest(distributionFolder));
});


gulp.task('concat-ng-templates', function () {
    return gulp.src(['angular-filemanager.js', 'templates.js'], {base: distributionFolder, cwd: distributionFolder})
        .pipe(concat('angular-filemanager.js'))
        .pipe(gulp.dest(distributionFolder));
});


gulp.task('scripts-minify', gulp.series('javascript', 'ng-templates', 'concat-ng-templates', function minify(done) {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    del('./' + distributionFolder + 'templates.js');
    return gulp.src(['angular-filemanager.js'], {base: distributionFolder, cwd: distributionFolder})
        .pipe(iife({
            useStrict: false
        }))
        .pipe(minifyes().on('error', function (e) {
            console.log(e);
            //callback(e);
        }))
        .pipe(header(fs.readFileSync('header.txt', 'utf8'), {pkg: package}))
        .pipe(gulp.dest(distributionFolder));
}));


gulp.task('styles-minify', gulp.series(gulp.parallel('scss', 'sprites_icon'), function () {
    return gulp.src(['angular-filemanager.css'], {base: distributionFolder, cwd: distributionFolder})
    //.pipe(sourcemaps.init())
        .pipe(cleanCSS({
            level: {
                1: {
                    specialComments: 'none'
                },
                2: {
                    //normalizeUrls: false
                }
            },
            //inline: ['local'],
            rebase: false
        }))
        //.pipe(sourcemaps.write())
        .pipe(header(fs.readFileSync('header.txt', 'utf8'), {pkg: package}))
        .pipe(gulp.dest(distributionFolder));
}));


gulp.task('html-minify', function () {
    return gulp.src(['index.html'], {base: distributionFolder, cwd: distributionFolder})
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            sortAttributes: true,
            sortClassName: true,
            ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?(\?>|$)/],
            trimCustomFragments: true
        }))
        .pipe(gulp.dest(distributionFolder));
});


gulp.task('production-replace', function (done) {
    function rndStr() {
        var x = '';
        while (x.length != 5) {
            x = Math.random().toString(36).substring(7).substr(0, 5);
        }
        return x;
    }

    var cacheBuster = rndStr();

    return gulp.src(['index.html', 'angular-filemanager.js'], {
        base: distributionFolder,
        cwd: distributionFolder
    })
    //adding version to stop caching
        .pipe(replace('js/app.js', 'js/app.js?cs=' + cacheBuster))
        .pipe(replace('css/style.css', 'css/style.css?cs=' + cacheBuster))

        .pipe(replace('debugInfoEnabled(!0)', 'debugInfoEnabled(false)'))
        .pipe(replace('[[version]]', package.version))
        .pipe(replace(/<ng-include src="'(.*?\.svg)'"><\/ng-include>/g, function (match, p1) {
            const svg = fs.readFileSync(path.resolve('.' + p1));
            del('.' + p1);
            return svg;
        }))
        .pipe(replace('/dist/', '/'))
        .pipe(replace('/assets/app/', '/'))

        .pipe(gulp.dest(distributionFolder));

});

gulp.task('distribute', gulp.series('clean', 'copy-files',
    gulp.parallel('styles-minify', 'scripts-minify'),
    gulp.parallel('html-minify'),
    'production-replace'
    )
);


gulp.task('lint', function () {
    return gulp.src([src + 'js/app.js', src + 'js/*/*.js'])
        .pipe(eslint({
            'rules': {
                'quotes': [2, 'single'],
                //'linebreak-style': [2, 'unix'],
                'semi': [2, 'always']
            },
            'env': {
                'browser': true
            },
            'globals': {
                'angular': true,
                'jQuery': true
            },
            'extends': 'eslint:recommended'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});
