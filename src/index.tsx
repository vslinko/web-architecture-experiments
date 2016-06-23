
import * as React from 'react';
import { render, unmountComponentAtNode, findDOMNode } from 'react-dom';
import { renderToString } from 'react-dom/server';

type TReactComponent<TProps> = React.ComponentClass<TProps> | React.SFC<TProps>;

// widget.ts

interface IWidgetStream {
    subscribe(data: (data: string) => void, end: () => void): void;
}

interface IAttachedWidget<TProps> {
    update(props: TProps): void;
    detach(): void;
}

interface IClientWidget<TProps> {
    attach(element: Element, props: TProps): IAttachedWidget<TProps>;
}

interface IServerWidget<TProps> {
    render(props: TProps): IWidgetStream;
}

interface IWidget<TProps> extends IClientWidget<TProps>, IServerWidget<TProps> {
}

// react_renderer.ts

class ClientReactWidget<TProps, TComponent extends TReactComponent<TProps>> implements IClientWidget<TProps> {
    private component: TReactComponent<TProps>;

    constructor(component: TReactComponent<TProps>) {
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

class ServerReactWidget<TProps, TComponent extends TReactComponent<TProps>> implements IServerWidget<TProps> {
    private component: TReactComponent<TProps>;

    constructor(component: TReactComponent<TProps>) {
        this.component = component;
    }

    public render(props: TProps): IWidgetStream {
        const string = renderToString(React.createElement(this.component, props));

        return {
            subscribe: (data, end) => {
                setTimeout(() => {
                    data(string);
                    end();
                });
            },
        };
    }
}

class ReactWidget<TProps, TComponent extends TReactComponent<TProps>> implements IClientWidget<TProps>, IServerWidget<TProps> {
    private clientReactWidget: ClientReactWidget<TProps, TComponent>;
    private serverReactWidget: ServerReactWidget<TProps, TComponent>;

    constructor(component: TReactComponent<TProps>) {
        this.clientReactWidget = new ClientReactWidget(component);
        this.serverReactWidget = new ServerReactWidget(component);
    }

    public attach(element: Element, props: TProps): IAttachedWidget<TProps> {
        return this.clientReactWidget.attach(element, props);
    }

    public render(props: TProps): IWidgetStream {
        return this.serverReactWidget.render(props);
    }
}

// form_widget.tsx

interface IFormProps {

}

function Form(props: IFormProps) {
    return <div>Hello World</div>;
}

class FormWidget extends ReactWidget<IFormProps, React.SFC<IFormProps>> {
    constructor() {
        super(Form);
    }
}

// ad_widget.tsx

interface IAdWidgetProps {

}

class AdWidget implements IWidget<IAdWidgetProps> {
    public attach(element: Element, props: IAdWidgetProps): IAttachedWidget<IAdWidgetProps> {
        element.innerHTML = this.getHTML(props);

        return {
            update: (props: IAdWidgetProps) => {
                element.innerHTML = this.getHTML(props);
            },
            detach: () => {
                element.innerHTML = '';
            },
        };
    }

    public render(props: IAdWidgetProps): IWidgetStream {
        return {
            subscribe: (data, end) => {
                setTimeout(() => {
                    data(this.getHTML(props));
                    end();
                })
            },
        };
    }

    private getHTML(props: IAdWidgetProps): string {
        return `<div>ad</div>`;
    }
}

// page.tsx

class TemplateNode {
    private name: string;
    private parent: TemplateNode;
    private root: TemplateRoot;

    constructor(name: string, parent: TemplateNode, root: TemplateRoot) {
        this.name = name;
        this.parent = parent;
        this.root = root;
    }

    public node(name: string): TemplateNode {
        return new TemplateNode(name, this, this.root);
    }

    public widget<TProps>(widget: IWidget<TProps>, props: TProps): this {
        return this;
    }

    public end(): TemplateNode {
        return this.parent;
    }
}

class TemplateRoot {
    public node(name: string): TemplateNode {
        return new TemplateNode(name, null, this);
    }
}

interface IPageBlock {
    tag: string;
    children?: IPageBlock[] | IWidget<any>;
}

class Page implements IWidget<{}> {
    private formWidget: FormWidget;
    private adWidget: AdWidget;

    constructor() {
        this.formWidget = new FormWidget();
        this.adWidget = new AdWidget();
    }

    public attach(element: Element, props: IAdWidgetProps): IAttachedWidget<IAdWidgetProps> {
        // element.innerHTML = this.getHTML(props);

        return {
            update: (props: IAdWidgetProps) => {
                // element.innerHTML = this.getHTML(props);
            },
            detach: () => {
                // element.innerHTML = '';
            },
        };
    }

    public render(props: IAdWidgetProps): IWidgetStream {
        return {
            subscribe: (data, end) => {
                setTimeout(() => {
                    // data(this.getHTML(props));
                    end();
                })
            },
        };
    }

    private jsxTemplate(): JSX.Element {
        return (
            <div>
                <div>{this.formWidget}</div>
                <div>{this.adWidget}</div>
            </div>
        );
    }

    private template(): IPageBlock {
        return {
            tag: 'div',
            children: [
                {
                    tag: 'div',
                    children: this.formWidget,
                },
                {
                    tag: 'div',
                    children: this.adWidget,
                },
            ],
        };
    }
}
