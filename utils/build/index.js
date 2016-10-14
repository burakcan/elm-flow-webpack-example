const spawn = require('child_process').spawn;
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV;
const cwd = process.cwd();

switch (NODE_ENV) {
  case 'development': {
    spawn(`${cwd}/node_modules/.bin/flow`, ['server']);
    return require('./dev.server')();
  }

  default: { // production
    const config = require('./webpack.config.js');
    const compiler = webpack(config);

    return compiler.run(function(err, stats) {
      if (err) throw err;

      console.log(stats.toString({
        colors : true,
        chunks : false
      }));
    });
  }
}
