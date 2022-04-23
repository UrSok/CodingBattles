module.exports = {
  styledComponents: {
    displayName: process.env.NODE_ENV !== 'production',
  },
  module: {
    rules: [
      {
        test: /\.less$/i,
        loader: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },
};
