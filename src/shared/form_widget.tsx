import * as React from 'react';
import { ReactWidget } from './react_widget';

export interface IFormWidgetProps {
}

export function Form(props: IFormWidgetProps) {
    return <div>Hello World</div>;
}

export class FormWidget extends ReactWidget<IFormWidgetProps, React.SFC<IFormWidgetProps>> {
    constructor() {
        super(Form, {
            useStream: false,
        });
    }
}
