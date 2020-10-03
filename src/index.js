const express = require('express');
const hbs = require('hbs');
const path = require('path');
const perceptronRouter = require('./routers/Perceptron');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.use(perceptronRouter);

app.get('', (req, res) => {
    res.render('index', {
        title: 'Neuron networks'
    })
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me'
    })
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found'
    });
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});