import {IWidget, IAttachedWidget, IWidgetStream} from './widget';
import {FormWidget, IFormWidgetProps} from "./form_widget";
import {AdWidget, IAdWidgetProps} from "./ad_widget";
import {widgetStream} from './widget_stream';

interface IMainPageProps {
    form: IFormWidgetProps;
    ad: IAdWidgetProps;
}

export class MainPage implements IWidget<IMainPageProps> {
    private formWidget: FormWidget;
    private adWidget: AdWidget;

    public constructor() {
        this.formWidget = new FormWidget();
        this.adWidget = new AdWidget();
    }

    public attach(element: Element, props: IMainPageProps): IAttachedWidget<IMainPageProps> {
        const formElement = element.querySelector('#form');
        const adElement = element.querySelector('#ad');

        const formWidgetAttached = this.formWidget.attach(formElement, props.form);
        const adWidgetAttached = this.adWidget.attach(adElement, props.ad);

        return {
            update: (nextProps: IMainPageProps) => {
                formWidgetAttached.update(props.form);
                adWidgetAttached.update(props.ad);
            },
            detach: () => {
                formWidgetAttached.detach();
                adWidgetAttached.detach();
            },
        };
    }

    public render(props: IMainPageProps): IWidgetStream {
        return widgetStream`
            <div>
                <div id="form">${this.formWidget.render(props.form)}</div>
                <div id="ad">${this.adWidget.render(props.ad)}</div>
            </div>
            <script src="/app.js" async defer></script>
        `;
    }
}
