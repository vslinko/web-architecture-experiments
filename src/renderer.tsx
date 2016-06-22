import * as React from 'react';

export interface IClientRenderer<T> {
    render(element: Element, props: T): void;
}

export interface IServerRenderer<T> {
    render(props: T): void;
}

export class ReactClientRenderer<T> implements IClientRenderer<T> {
    private component: React.ComponentClass<T>;

    constructor(component: React.ComponentClass<T>) {
        this.component = component;
    }

    public render(element: Element, props: T): void {

    }
}

export class ReactServerRenderer<T> implements IServerRenderer<T> {
    private component: React.ComponentClass<T>;

    constructor(component: React.ComponentClass<T>) {
        this.component = component;
    }

    public render(props: T): void {

    }
}

export interface IWidget<T> {
    getClientRenderer(): IClientRenderer<T>;
    getServerRenderer(): IServerRenderer<T>;
}

export class ReactWidget<T> implements IWidget<T> {
    private clientRenderer: ReactClientRenderer<T>;
    private serverRenderer: ReactServerRenderer<T>;

    constructor(component: React.ComponentClass<T>) {
        this.clientRenderer = new ReactClientRenderer(component);
        this.serverRenderer = new ReactServerRenderer(component);
    }

    public getClientRenderer(): IClientRenderer<T> {
        return this.clientRenderer;
    }

    public getServerRenderer(): IServerRenderer<T> {
        return this.serverRenderer;
    }
}