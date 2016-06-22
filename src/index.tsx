interface IRenderStreamData {
    (data: string): void;
}

interface IRenderStreamEnd {
    (): void;
}

interface IRenderStreamSubscribe {
    (data: IRenderStreamData, end: IRenderStreamEnd): void;
}

interface IWidgetDetach {
    (): void;
}

interface IWidget<TProps> {
    attach(element: Element, props: TProps): IWidgetDetach;
    render(props: TProps): IRenderStreamSubscribe;
}

interface IRenderer {
    render<TProps>(widget: IWidget<TProps>, props: TProps): void;
}

class ClientRenderer implements IRenderer {
    private element: Element;

    constructor(element: Element) {
        this.element = element;
    }

    public render<TProps>(widget: IWidget<TProps>, props: TProps): void {
        widget.attach(this.element, props);
    }
}

class ServerRenderer implements IRenderer {
    public data: IRenderStreamData;
    public end: IRenderStreamEnd;

    constructor(data: IRenderStreamData, end: IRenderStreamEnd) {
        this.data = data;
        this.end = end;
    }

    public render<TProps>(widget: IWidget<TProps>, props: TProps): void {
        widget.render(props)(this.data, this.end);
    }
}
