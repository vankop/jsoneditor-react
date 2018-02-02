import React from 'react';
import { Form, Field, reduxForm } from 'redux-form';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Editor from '../src/Editor';
import Decorator from './decorator';
import { reduxDecorator } from './reduxDecorator';
import { FieldComponent } from './FieldComponent';

const onChangeAction = action('onChange');
const onErrorAction = action('onError');

let value = { this: 'this', is: 'is', 'JSON!!!111!!': 'JSON!!!111!!' };

function handleChange(json) {
    onChangeAction(JSON.stringify(json));
    value = json;
}

function handleError(error) {
    onErrorAction(JSON.stringify(error));
}

storiesOf('JsonEditor/code', module)
    .addDecorator(Decorator)
    .add('onChange', () => (
        <Editor
            value={value}
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
    ));

storiesOf('JsonEditor/form', module)
    .addDecorator(Decorator)
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
