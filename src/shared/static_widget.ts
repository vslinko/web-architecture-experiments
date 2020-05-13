import { IWidgetStream, IWidget, IAttachedWidget } from './widget';

export abstract class StaticWidget<TProps> implements IWidget<TProps> {
  public render(props: TProps): IWidgetStream {
    return {
      subscribe: (data, end) => {
        data(this.getHTML(props));
        end();
      },
    };
  }

  public abstract attach(element: Element, props: TProps): IAttachedWidget<TProps>;
  protected abstract getHTML(props: TProps): string;
}
