import * as React from 'react';

export interface IPage<T> {
    renderClient(element: Element, props: T): void;
    renderServer(props: T): void;
}

export abstract class ReactPage<T> implements IPage<T> {
    public renderClient(element: Element, props: T): void {

    }

    public renderServer(props: T): void {

    }

    protected abstract render(props: T): JSX.Element;
}
