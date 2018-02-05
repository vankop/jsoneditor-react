var nodeResolve = require('rollup-plugin-node-resolve');
var babel = require('rollup-plugin-babel');
var commonjs = require('rollup-plugin-commonjs');
var packageJson = require('./package.json');
var css = require('rollup-plugin-css-only');
var sourcemaps = require('rollup-plugin-sourcemaps');

module.exports = {
    output: {
        format: 'es',
        sourcemap: true
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            extensions: ['.js', '.jsx']
        }),
        css({ output: 'es/editor.css' }),
        babel({
            exclude: 'node_modules/**'
        }),
        commonjs(),
        sourcemaps()
    ],
    external: Object.keys(packageJson.dependencies)
        .concat(Object.keys(packageJson.peerDependencies))
};
