const fs         = require('fs');
const gulp       = require('gulp');
const typescript = require('gulp-typescript');
const jsdoc      = require('gulp-jsdoc3');



const folder = {
  tsServer : {
    src  : 'server/src/*.ts',
    dest : 'server/build/'
  },
  tsClient : {
    src  : 'client/src/*.ts',
    dest : 'client/build/'
  }
}

gulp.task('default', () => {
  init(folder.tsServer.dest);
  init(folder.tsClient.dest);

  gulp.watch(folder.tsServer.src,    ['compile']);
  gulp.watch(folder.tsClient.src,    ['compile']);
});
  

function init(path) {
  fs.readdir(path, (error, files) => {
    if (error) throw error;

    if (!files.length) {
      gulp.task('init', ['compile'], () => {
        console.log('init');
      });
      gulp.run('compile');
    }
  });
}

gulp.task('compile', () => {
  let paths = [folder.tsServer, folder.tsClient];

  paths.forEach((path) => {
    gulp.src(path.src)
    .pipe(typescript())
    .pipe(gulp.dest(path.dest));
  });
  return;
});

gulp.task('doc', (cb) => {
    gulp.src([
      folder.tsServer.dest + '*.js',
      folder.tsClient.dest + '*.js'
    ], {read: false})
        .pipe(jsdoc(cb));
});
