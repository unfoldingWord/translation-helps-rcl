const { name, version, repository } = require("./package.json");
const { styles, theme } = require("./styleguide.styles");

module.exports = {
  title: `${name} v${version}`,
  ribbon: {
    url: repository.url,
    text: "View on GitHub",
  },
  styles,
  theme,
  components: "src/components/**/[A-Z]*.js",
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
      ],
    },
  },
};
