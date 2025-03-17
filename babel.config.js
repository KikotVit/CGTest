module.exports = {
    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    '@': './src',
                },
                extensions: ['.js', '.json'],
                root: ['./src'],
            },
        ],
    ],
    presets: ['module:@react-native/babel-preset'],
};
