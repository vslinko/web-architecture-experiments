export interface IWidgetStreamDataCallback {
    (data: string): void;
}

export interface IWidgetStreamEndCallback {
    (): void;
}

export interface IWidgetStream {
    subscribe(dataCallback: IWidgetStreamDataCallback, endCallback: IWidgetStreamEndCallback): void;
}

export interface IAttachedWidget<TProps> {
    update(props: TProps): void;
    detach(): void;
}

export interface IClientWidget<TProps> {
    attach(element: Element, props: TProps): IAttachedWidget<TProps>;
}

export interface IServerWidget<TProps> {
    render(props: TProps): IWidgetStream;
}

export interface IWidget<TProps> extends IClientWidget<TProps>, IServerWidget<TProps> {
}
