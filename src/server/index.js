const express = require('express');
const path = require('path');

const app = express();

const MainPage = require('../shared/main_page').MainPage;

const mainPage = new MainPage();

app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

app.get('/', (req, res) => {
    const stream = mainPage.render({form: {}, ad: {}});

    stream.subscribe(
        (data) => res.write(data),
        () => res.send()
    );
});

app.listen(3000, () => {
    console.log('Listening 3000');
});
