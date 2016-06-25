import {IWidgetStream} from "./widget";

export class WidgetStream {
    private sources: Array<string | IWidgetStream>;

    public constructor() {
        this.sources = [];
    }

    public write(data: string): this {
        this.sources.push(data);
        return this;
    }

    public pipe(stream: IWidgetStream): this {
        this.sources.push(stream);
        return this;
    }

    public build(): IWidgetStream {
        let result: string;
        let complete: boolean = false;
        let started: boolean = false;
        let listeners: Array<{dataCallback: (data: string) => void, endCallback: () => void}> = [];

        return {
            subscribe: (dataCallback, endCallback) => {
                if (complete) {
                    dataCallback(result);
                    endCallback();
                } else if (started) {
                    if (result) {
                        dataCallback(result);
                    }
                    listeners.push({dataCallback, endCallback});
                } else {
                    let i = 0;
                    let processSources: () => void;

                    listeners.push({dataCallback, endCallback});
                    started = true;

                    const processData = (data: string) => {
                        if (result) {
                            result += data;
                        } else {
                            result = data;
                        }

                        listeners.forEach((listener) => listener.dataCallback(data));
                    };

                    processSources = () => {
                        const source = this.sources[i++];

                        if (!source) {
                            complete = true;
                            started = false;
                            listeners.forEach((listener) => listener.endCallback());
                            listeners = [];
                            return;
                        }

                        if (typeof source === 'string') {
                            processData(source);
                            processSources();
                        } else {
                            source.subscribe(
                                (data) => processData(data),
                                () => processSources()
                            );
                        }
                    };

                    processSources();
                }
            },
        };
    }
}

export function widgetStream(parts: string[], ...includes: IWidgetStream[]): IWidgetStream {
    const streamer = parts.reduce((streamer, part, index) => {
        if (index === 0) {
            return streamer
                .write(part);
        } else {
            return streamer
                .pipe(includes[index - 1])
                .write(part);
        }
    }, new WidgetStream());

    return streamer.build();
}
