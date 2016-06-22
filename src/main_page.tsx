import * as React from 'react';
import { ReactPage } from './page';

interface IMainPageProps {

}

class MainPageView extends React.Component<IMainPageProps, void> {
    public render() {
        return <div>123</div>;
    }
}

class MainPage extends ReactPage<IMainPageProps> {
    protected render(props: IMainPageProps) {
        return (
            <MainPageView />
        );
    }
}
