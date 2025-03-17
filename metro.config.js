const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
        extraNodeModules: {
            '@': path.resolve(__dirname, 'src'),
        },
        sourceExts: ['tsx', 'ts', 'js', 'jsx', 'json'],
    },
    projectRoot: path.resolve(__dirname),
    watchFolders: [path.resolve(__dirname, 'src')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);