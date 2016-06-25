import { IAttachedWidget } from './widget';
import {StaticWidget} from "./static_widget";

export interface IAdWidgetProps {
}

export class AdWidget extends StaticWidget<IAdWidgetProps> {
    public attach(element: Element, props: IAdWidgetProps): IAttachedWidget<IAdWidgetProps> {
        return {
            update: (props: IAdWidgetProps) => {
            },
            detach: () => {
            },
        };
    }

    protected getHTML(props: IAdWidgetProps): string {
        return `<div>ad</div>`;
    }
}
