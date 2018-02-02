import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONEditor from 'jsoneditor/dist/jsoneditor-minimalist.min';
import 'jsoneditor/dist/jsoneditor.min.css';

const modes = {
    tree: 'tree',
    view: 'view',
    form: 'form',
    code: 'code',
    text: 'text'
};

const values = Object.values(modes);

export default class Editor extends Component {
    static propTypes = {
        value: PropTypes.object,
        onChange: PropTypes.func,
        onModeChange: PropTypes.func,
        mode: PropTypes.oneOf(modes),
        allowedModes: PropTypes.arrayOf(PropTypes.oneOf(values)),
        schema: PropTypes.object,
        schemaRefs: PropTypes.object,
        tag: PropTypes.string,
        htmlElementProps: PropTypes.object,
        innerRef: PropTypes.func,
        ace: PropTypes.object,
        ajv: PropTypes.object
    };

    static defaultProps = {
        tag: 'div',
        mode: modes.tree
    };

    static modes = modes;

    constructor() {
        super();

        this.htmlElementRef = null;
        this.jsonEditor = null;

        this.handleChange = this.handleChange.bind(this);
        this.setRef = this.setRef.bind(this);
        this.collapseAll = this.collapseAll.bind(this);
        this.expandAll = this.expandAll.bind(this);
        this.focus = this.focus.bind(this);
    }

    componentDidMount() {
        const {
            value,
            ace,
            ajv,
            onModeChange,
            allowedModes,
            mode,
            schema,
            schemaRefs
        } = this.props;

        this.jsonEditor = new JSONEditor(this.htmlElementRef, {
            ace,
            ajv,
            onModeChange,
            onChange: this.handleChange,
            mode,
            schema,
            schemaRefs,
            modes: allowedModes
        }, value);
    }

    componentWillReceiveProps({
        mode,
        value,
        schema,
        schemaRefs
    }) {
        if (this.jsonEditor) {
            if (mode !== this.jsonEditor.getMode()) {
                this.jsonEditor.setMode(mode);
            }

            if (value !== this.props.value) {
                this.jsonEditor.set(value);
            }

            if (schema !== this.props.schema ||
                schemaRefs !== this.props.schemaRefs
            ) {
                this.jsonEditor.setSchema(schema, schemaRefs);
            }
        }
    }

    shouldComponentUpdate({ htmlElementProps }) {
        return htmlElementProps !== this.props.htmlElementProps;
    }

    componentWillUnmount() {
        this.jsonEditor.destroy();
        this.jsonEditor = null;
    }

    setRef(element) {
        this.htmlElementRef = element;
        if (this.props.innerRef) {
            this.props.innerRef(element);
        }
    }

    handleChange() {
        if (this.props.onChange) {
            const currentJson = this.jsonEditor.get();

            if (this.props.value !== currentJson) {
                this.props.onChange(currentJson);
            }
        }
    }

    collapseAll() {
        if (this.jsonEditor) {
            this.jsonEditor.collapseAll();
        }
    }

    expandAll() {
        if (this.jsonEditor) {
            this.jsonEditor.expandAll();
        }
    }

    focus() {
        if (this.jsonEditor) {
            this.jsonEditor.focus();
        }
    }

    render() {
        const {
            htmlElementProps,
            tag
        } = this.props;

        return React.createElement(
            tag,
            {
                ...htmlElementProps,
                ref: this.setRef
            }
        );
    }
}
