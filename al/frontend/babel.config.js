module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Enable React Fast Refresh for better development experience
      'react-native-reanimated/plugin',
      // Optimize imports
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@components': './app/components',
            '@contexts': './contexts',
            '@services': './services',
            '@hooks': './hooks',
          },
        },
      ],
    ],
    env: {
      production: {
        plugins: [
          // Remove console.log in production
          'transform-remove-console',
        ],
      },
    },
  };
};