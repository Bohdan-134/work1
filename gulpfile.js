import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import del from 'del';
import svgSprite from 'gulp-svg-sprite';
import fileInclude from 'gulp-file-include';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);
const server = browserSync.create();

const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/script/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images/'
  },
  svg: {
    src: 'src/sprite/**/*.svg',
    dest: 'dist/sprite/'
  },
  html: {
    src: 'src/html/**/*.html',
    dest: 'dist/'
  },
  sprite: {
    src: 'src/sprite/**/*',
    dest: 'dist/sprite/'
  }
};

// Clean output directory
export function clean() {
  return del(['dist']);
}

// Compile SCSS into CSS
export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

// Minify and concatenate JavaScript
export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(server.stream());
}

// Optimize images and convert to webp
export function images() {
  return gulp.src([paths.images.src, '!src/images/**/*.ico'])
    .pipe(imagemin())
    .pipe(webp())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(gulp.src('src/images/**/*.ico'))
    .pipe(gulp.dest(paths.images.dest));
}

// Copy and include HTML files to dist
export function html() {
  return gulp.src(['src/html/**/*.html', '!src/html/partials/**/*.html'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(server.stream());
}

// Generate SVG sprite
export function svg() {
  return gulp.src(paths.svg.src)
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../sprite.svg",
          render: {
            scss: {
              dest: '../../../../src/scss/_sprite.scss'
            }
          }
        }
      }
    }))
    .pipe(gulp.dest(paths.svg.dest));
}

// Copy sprite files to dist
export function sprite() {
  return gulp.src(paths.sprite.src)
    .pipe(gulp.dest(paths.sprite.dest))
    .pipe(server.stream());
}

// Watch files
export function watch() {
  server.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.html.src, html).on('change', server.reload);
  gulp.watch(paths.svg.src, svg).on('change', server.reload);
  gulp.watch(paths.sprite.src, sprite).on('change', server.reload);
}

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(styles, scripts, images, html, svg, sprite));
const dev = gulp.series(build, watch);

export { build, dev };
export default dev;
