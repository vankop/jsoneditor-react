import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Editor from '../src/Editor';
import Decorator from './decorator';

const onChangeAction = action('onChange');

let value = { this: 'this', is: 'is', 'JSON!!!111!!': 'JSON!!!111!!' };

function handleChange(json) {
    onChangeAction(JSON.stringify(json));
    value = json;
}

storiesOf('JsonEditor', module)
    .addDecorator(Decorator)
    .add('onChange', () => (
        <Editor
            value={value}
            onChange={handleChange}
            mode={Editor.modes.code}
        />
    ));
