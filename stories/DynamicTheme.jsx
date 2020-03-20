import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'brace/theme/chrome';
import 'brace/theme/tomorrow_night_blue';
import ace from 'brace';

import Editor from '../src/Editor';

export default class DynamicTheme extends Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            theme: 'light'
        };
    }

    handleChange = () => this.setState({
        theme: this.isLight() ? 'dark' : 'light'
    });

    isLight = () => this.state.theme === 'light';

    render() {
        const {
            json,
            onError,
            onChange
        } = this.props;

        const isLight = this.isLight();
        return [
            <button type="button" key={0} onClick={this.handleChange}>
                {`Change to ${isLight ? 'dark' : 'light'}`}
            </button>,
            <Editor
                key={1}
                mode={Editor.modes.code}
                ace={ace}
                value={json}
                onChange={onChange}
                onError={onError}
                theme={
                    isLight
                        ? 'ace/theme/chrome'
                        : 'ace/theme/tomorrow_night_blue'
                }
            />
        ];
    }
}

DynamicTheme.propTypes = {
    json: PropTypes.object,
    onError: PropTypes.func,
    onChange: PropTypes.func
};
