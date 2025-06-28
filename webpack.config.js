const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add headers for handling CORS
  if (config.devServer) {
    config.devServer.headers = {
      ...config.devServer.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    };
  }

  // Handle image loading with proper CORS settings
  const imageRule = config.module.rules.find(
    rule => rule.oneOf && rule.oneOf.find(r => r.test && r.test.toString().includes('png|jpg'))
  );

  if (imageRule) {
    imageRule.oneOf.forEach(rule => {
      if (rule.use && Array.isArray(rule.use)) {
        rule.use.forEach(loader => {
          if (loader.loader && loader.loader.includes('file-loader')) {
            loader.options = {
              ...loader.options,
              esModule: false,
            };
          }
        });
      }
    });
  }

  return config;
};