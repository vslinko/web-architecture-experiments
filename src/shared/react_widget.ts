import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { renderToString as renderToStringAsync } from 'react-dom-stream/server';
import { renderToString as renderToStringSync } from 'react-dom/server';

import { IClientWidget, IServerWidget, IWidget, IAttachedWidget, IWidgetStream } from './widget';

type TReactComponent<TProps> = React.ComponentClass<TProps> | React.SFC<TProps>;

export class ClientReactWidget<TProps, TComponent extends TReactComponent<TProps>> implements IClientWidget<TProps> {
    private component: TReactComponent<TProps>;

    public constructor(component: TReactComponent<TProps>) {
        this.component = component;
    }

    public attach(element: Element, props: TProps): IAttachedWidget<TProps> {
        const update = (props: TProps) => {
            render(React.createElement(this.component, props), element);
        };
        const detach = () => {
            unmountComponentAtNode(element);
        };

        update(props);

        return { update, detach };
    }
}

export class ServerReactWidget<TProps, TComponent extends TReactComponent<TProps>> implements IServerWidget<TProps> {
    private component: TReactComponent<TProps>;
    private useStream: boolean;

    constructor(component: TReactComponent<TProps>, options: {useStream?: boolean} = {}) {
        this.component = component;
        this.useStream = !!options.useStream;
    }

    public render(props: TProps): IWidgetStream {
        let complete = false;
        let started = false;
        let result: string;
        let listeners: Array<{dataCallback: (data: string) => void, endCallback: () => void}> = [];

        return {
            subscribe: (dataCallback, endCallback) => {
                if (complete) {
                    dataCallback(result);
                    endCallback()
                } else if (!complete && !this.useStream) {
                    complete = true;
                    result = renderToStringSync(React.createElement(this.component, props));
                    dataCallback(result);
                    endCallback();
                } else if (!complete && this.useStream) {
                    if (started) {
                        if (result) {
                            dataCallback(result);
                        }

                        listeners.push({dataCallback, endCallback});
                    } else {
                        started = true;
                        listeners.push({dataCallback, endCallback});

                        const stream = renderToStringAsync(React.createElement(this.component, props));

                        stream.on('data', (data: string) => {
                            if (result) {
                                result += data;
                            } else {
                                result = data;
                            }

                            listeners.forEach(listener => {
                                listener.dataCallback(data);
                            });
                        });

                        stream.on('end', () => {
                            complete = true;
                            started = false;
                            listeners.forEach(listener => listener.endCallback());
                            listeners = [];
                        });
                    }
                } else {
                    throw new Error('You should not be here');
                }
            },
        };
    }
}

export class ReactWidget<TProps, TComponent extends TReactComponent<TProps>> implements IWidget<TProps> {
    private clientReactWidget: ClientReactWidget<TProps, TComponent>;
    private serverReactWidget: ServerReactWidget<TProps, TComponent>;

    constructor(component: TReactComponent<TProps>, options: {useStream?: boolean} = {}) {
        const {useStream} = options;

        this.clientReactWidget = new ClientReactWidget(component);
        this.serverReactWidget = new ServerReactWidget(component, {useStream});
    }

    public attach(element: Element, props: TProps): IAttachedWidget<TProps> {
        return this.clientReactWidget.attach(element, props);
    }

    public render(props: TProps): IWidgetStream {
        return this.serverReactWidget.render(props);
    }
}
