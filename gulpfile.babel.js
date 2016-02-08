import gulp       from 'gulp';
import { Server } from 'karma';
import path       from 'path';

// --------------- CONFIG

const app = {
  js: {
    src: 'lib/**/*.js',
  },
  test: {
    src: 'test/**/*.js',
    confSrc: path.resolve('karma.conf.js'),
  },
};

// --------------- TASK

gulp.task('dev', (callback) => {
  gulp.watch(app.js.src, gulp.series('test'));
  gulp.watch(app.test.src, gulp.series('test'));
  callback();
});

gulp.task('test', (callback) => {
  const server = new Server({
    configFile: app.test.confSrc,
    singleRun: true,
    autoWatch: false,
  });
  server.on('run_complete', () => { callback(); });
  server.start();
});

gulp.task('ci', (callback) => {
  const server = new Server({
    configFile: app.test.confSrc,
    singleRun: true,
    autoWatch: false,
    coverageReporter: {
      reporters: [
        { type: 'text' },
        { type: 'lcov' },
      ],
    },
  });
  server.on('run_complete', () => { callback(); });
  server.start();
});

gulp.task('tdd', (callback) => {
  const server = new Server({
    configFile: app.test.confSrc,
    singleRun: false,
    autoWatch: true,
  });
  server.start();
  callback();
});

gulp.task('default', gulp.series('tdd'), (callback) => {
  callback();
});
