const babel = require('rollup-plugin-babel');
const css = require('rollup-plugin-css-only');
const copy = require('rollup-plugin-copy');

module.exports = {
    external: ['jsoneditor', 'react', 'prop-types'],
    output: {
        format: 'es',
        sourcemap: true
    },
    plugins: [
        css({ output: 'es/editor.css' }),
        babel({
            exclude: 'node_modules/**'
        }),
        copy({
            'node_modules/jsoneditor/dist/img': 'es/img',
            verbose: true
        })
    ]
};
