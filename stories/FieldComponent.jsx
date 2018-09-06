import React, { Component } from 'react';
import { fieldInputPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
import Editor from '../src/Editor';

export class FieldComponent extends Component {
    constructor(props) {
        super(props);

        this.handleBlur = this.handleBlur.bind(this);

        this.htmlElementProps = {
            onFocus: props.input.onFocus,
            onBlur: this.handleBlur,
            tabIndex: -1,
            style: { border: '4px solid' }
        };
    }

    handleBlur(event) {
        if (!event.relatedTarget
            || !event.currentTarget.contains(event.relatedTarget)) {
            this.props.input.onBlur();
        }
    }

    render() {
        const {
            input: {
                value,
                onChange
            }
        } = this.props;

        return (
            <Editor
                value={value}
                onChange={onChange}
                history
                htmlElementProps={this.htmlElementProps}
                mode={Editor.modes.form}
                allowedModes={Editor.modes.allValues}
            />
        );
    }
}

FieldComponent.propTypes = {
    input: PropTypes.shape(fieldInputPropTypes).isRequired
};
