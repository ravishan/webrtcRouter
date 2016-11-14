var path = require('path')
var webpack = require('webpack')
console.log(__dirname," sasasfsdfsd");
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?path=htt'+'p://ravi-zt46.zohocorpin.com:3000/__webpack_hmr',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: '/Users/ravi-zt46/Documents/JavaScript_WorkSpace/webrtc_master/'
      }
    ]
  }
}


//'webpack-hot-middleware/client',