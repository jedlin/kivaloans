module.exports = {
  /**
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */

  apps : [
    {
      name      : 'Loan Card Server',
      script    : 'index.js',
      // http://pm2.keymetrics.io/docs/usage/watch-and-restart/
      'watch' : ['index.js', './server'],
      'ignore_watch' : ['./node_modules', './app'],
      'watch_options' : {
        'followSymlinks' : false
      },
      env: {
        COMMON_VARIABLE: 'true'
      }
      // ,
      // env_production : {
      //   NODE_ENV: 'production'
      // }
    }
  ]
};
