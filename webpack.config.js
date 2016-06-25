const path = require('path');

module.exports = {
    entry: [
        path.join(__dirname, 'src', 'client', 'index.tsx'),
    ],

    output: {
        filename: 'app.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                include: [
                    path.join(__dirname, 'src'),
                ],
                loader: 'awesome-typescript-loader',
            },
        ],
    },

    resolve: {
        extensions: ['', '.js', '.jsx', '.json', '.ts', '.tsx'],
    },

    devtool: 'source-map',
};