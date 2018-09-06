import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONEditor from 'jsoneditor/dist/jsoneditor-minimalist';
import 'jsoneditor/dist/jsoneditor.css';
import './fixAce.css';

/**
 * @typedef {{
 * tree: string,
 * view: string,
 * form: string,
 * code: string,
 * text: string,
 * allValues: Array<string>
 * }} TJsonEditorModes
 */
const modes = {
    tree: 'tree',
    view: 'view',
    form: 'form',
    code: 'code',
    text: 'text'
};

const values = Object.values(modes);

modes.allValues = values;

/**
 * @type {object}
 * @property {object} [value]
 * @property {string} [mode='tree'] - Set the editor mode.
 * @property {string} [name=undefined] - Initial field name for the root node
 * @property {object} [schema] - Validate the JSON object against a JSON schema.
 * @property {object} [schemaRefs] - Schemas that are referenced using
 * the $ref property
 * @property {Function} [onChange] - Set a callback function
 * triggered when the contents of the JSONEditor change.
 * Called without parameters. Will only be triggered on changes made by the user.
 * Return new json.
 * @property {Function} [onError] - Set a callback function triggered when an error occurs.
 * Invoked with the error as first argument.
 * The callback is only invoked for errors triggered by a users action,
 * like switching from code mode to tree mode or clicking
 * the Format button whilst the editor doesn't contain valid JSON.
 * @property {Function} [onModeChange] - Set a callback function
 * triggered right after the mode is changed by the user.
 * @property {object} [ace] - Provide a version of the Ace editor.
 * Only applicable when mode is code
 * @property {object} [ajv] - Provide a instance of ajv,
 * the library used for JSON schema validation.
 * @property {string} [theme] - Set the Ace editor theme,
 * uses included 'ace/theme/jsoneditor' by default.
 * @property {boolean} [history=false] - Enables history,
 * adds a button Undo and Redo to the menu of the JSONEditor. Only applicable when
 * mode is 'tree' or 'form'
 * @property {boolean} [navigationBar=true] - Adds navigation bar to the menu
 * the navigation bar visualize the current position on the
 * tree structure as well as allows breadcrumbs navigation.
 * @property {boolean} [statusBar=true] - Adds status bar to the buttom of the editor
 * the status bar shows the cursor position and a count of the selected characters.
 * Only applicable when mode is 'code' or 'text'.
 * @property {boolean} [search=true] - Enables a search box in
 * the upper right corner of the JSONEditor.
 * @property {Array<string>} [allowedModes] - Create a box in the editor menu where
 * the user can switch between the specified modes.
 * @property {string} [tag='div'] - Html element to render
 * @property {object} [htmlElementProps] - html element custom props
 * @property {Function} [innerRef] - callback to get html element reference
 */
export default class Editor extends Component {
    static propTypes = {
        //  jsoneditor props
        value: PropTypes.object,
        mode: PropTypes.oneOf(values),
        name: PropTypes.string,
        schema: PropTypes.object,
        schemaRefs: PropTypes.object,

        onChange: PropTypes.func,
        onError: PropTypes.func,
        onModeChange: PropTypes.func,

        ace: PropTypes.object,
        ajv: PropTypes.object,
        theme: PropTypes.string,
        history: PropTypes.bool,
        navigationBar: PropTypes.bool,
        statusBar: PropTypes.bool,
        search: PropTypes.bool,
        allowedModes: PropTypes.arrayOf(PropTypes.oneOf(values)),

        //  custom props
        tag: PropTypes.string,
        htmlElementProps: PropTypes.object,
        innerRef: PropTypes.func
    };

    static defaultProps = {
        tag: 'div',
        mode: modes.tree,
        history: false,
        search: true,
        navigationBar: true,
        statusBar: true
    };

    /**
     * @type TJsonEditorModes
     */
    static modes = modes;

    constructor(props) {
        super(props);

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
            allowedModes,
            innerRef,
            htmlElementProps,
            tag,
            onChange,
            ...rest
        } = this.props;

        this.createEditor({
            ...rest,
            modes: allowedModes
        });
    }

    componentWillReceiveProps({
        allowedModes,
        schema,
        name,
        theme,
        schemaRefs,
        innerRef,
        htmlElementProps,
        tag,
        onChange,
        ...rest
    }) {
        if (this.jsonEditor) {
            if (theme !== this.props.theme) {
                this.createEditor({
                    ...rest,
                    theme,
                    modes: allowedModes
                });
            } else {
                if (schema !== this.props.schema
                    || schemaRefs !== this.props.schemaRefs
                ) {
                    this.jsonEditor.setSchema(schema, schemaRefs);
                }

                if (name !== this.jsonEditor.getName()) {
                    this.jsonEditor.setName(name);
                }
            }
        }
    }

    shouldComponentUpdate({ htmlElementProps }) {
        return htmlElementProps !== this.props.htmlElementProps;
    }

    componentWillUnmount() {
        if (this.jsonEditor) {
            this.jsonEditor.destroy();
            this.jsonEditor = null;
        }
    }

    setRef(element) {
        this.htmlElementRef = element;
        if (this.props.innerRef) {
            this.props.innerRef(element);
        }
    }

    createEditor({ value, ...rest }) {
        if (this.jsonEditor) {
            this.jsonEditor.destroy();
        }

        this.jsonEditor = new JSONEditor(this.htmlElementRef, {
            onChange: this.handleChange,
            ...rest
        });

        this.jsonEditor.set(value);
    }

    handleChange() {
        if (this.props.onChange) {
            try {
                const text = this.jsonEditor.getText();
                if (text === '') {
                    this.props.onChange(null);
                }

                const currentJson = this.jsonEditor.get();
                if (this.props.value !== currentJson) {
                    this.props.onChange(currentJson);
                }
            } catch (err) {
                this.err = err;
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
