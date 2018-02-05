var config = require('./rollup.es.config.js');
var uglify = require('rollup-plugin-uglify');

const umdConfig = Object.assign({}, config, {
    output: Object.assign({}, config.output, {
        format: 'umd',
        name: 'JsonEditorReact',
        globals: {
            'prop-types': 'PropTypes',
            react: 'React',
            invariant: 'invariant'
        }
    })
});

umdConfig.plugins.push(uglify({
    compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
    }
}));

module.exports = umdConfig;
