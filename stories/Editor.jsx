import React from 'react';
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/tomorrow_night_blue';
import { Form, Field, reduxForm } from 'redux-form';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Ajv from 'ajv';
import Editor from '../src/Editor';
import Decorator from './decorator';
import { reduxDecorator } from './reduxDecorator';
import { FieldComponent } from './FieldComponent';

import '../src/fixAce.css';
import DynamicTheme from './DynamicTheme';

const onChangeAction = action('onChange');
const onErrorAction = action('onError');

let value = {
    this: 'this',
    is: 'is',
    'JSON!!!111!!': 'JSON!!!111!!',
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
};

function handleChange(json) {
    onChangeAction(JSON.stringify(json));
    value = json;
}

function handleError(error) {
    onErrorAction(JSON.stringify(error));
}

const schema = {
    type: 'object',
    properties: {
        some: {
            type: 'integer'
        }
    },
    required: ['some']
};

storiesOf('JsonEditor/modes/code', module)
    .addDecorator(Decorator)
    .add('onChange', () => (
        <Editor
            value={null}
            onChange={handleChange}
            mode={Editor.modes.code}
        />
    ))
    .add('onError', () => (
        <Editor
            value={value}
            onError={handleError}
            mode={Editor.modes.code}
        />
    ))
    .add('customization', () => (
        <Editor
            value={value}
            onError={handleError}
            onChange={handleChange}
            schema={schema}
            mode={Editor.modes.code}
            theme="ace/theme/tomorrow_night_blue"
            ajv={Ajv({ allErrors: true, verbose: true })}
        />
    ));

const onEventAction = action('onEvent');
function handleEvent(node, event) {
    onEventAction(JSON.stringify({ node, eventType: event.type }));
}
    
storiesOf('JsonEditor/modes/form', module)
    .addDecorator(Decorator)
    .add('with onEvent handler', () => (
        <Editor
            value={value}
            onEvent={handleEvent}
            mode={Editor.modes.form}
        />
    ))
    .add('with history enabled', () => (
        <Editor
            value={value}
            history
            mode={Editor.modes.form}
        />
    ));    

const submitAction = action('onSubmit');
const form = reduxForm({
    form: 'form',
    initialValues: { field: value }
})(() => (
    <Form onSubmit={(formData) => {
        submitAction(JSON.stringify(formData));
    }}
    >
        <Field
            name="field"
            component={FieldComponent}
        />
    </Form>
));

storiesOf('JsonEditor/redux-form', module)
    .addDecorator(reduxDecorator)
    .add('controlling by redux-form', () => React.createElement(form));
    
const aceStory = storiesOf('JsonEditor/ace', module).addDecorator(Decorator);

const aceThemes = require.context('brace/theme/', false, /.js$/);

aceThemes.keys().forEach((key) => {
    const themeName = key.replace('.js', '').replace(/^\./, '');
    aceStory.add(themeName, () => {
        aceThemes(key);
        return (
            <Editor
                value={value}
                mode={Editor.modes.code}
                ace={ace}
                theme={`ace/theme${themeName}`}
            />
        );
    });
});

aceStory.add('Changing theme dynamically', () => (
    <DynamicTheme
        json={value}
        onError={handleError}
        onChange={handleChange}
    />
));

storiesOf('JsonEditor/ajv', module)
    .addDecorator(Decorator)
    .add('validate', () => [
        <div key={0}>
            <span>Schema:</span>
            <Editor
                value={schema}
                mode={Editor.modes.view}
            />
        </div>,
        <div key={1}>
            <span>JSON:</span>
            <Editor
                value={value}
                mode={Editor.modes.code}
                ajv={Ajv({ allErrors: true, verbose: true })}
                schema={schema}
            />
        </div>
    ]);
