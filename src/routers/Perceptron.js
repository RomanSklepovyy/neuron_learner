const express = require('express');
const Perceptron = require('../models/Perceptron');
const bodyParser = require('body-parser');

const router = new express.Router();
const jsonParser = express.json();

router.get('/perceptron', (req, res) => {
    res.render('perceptron', {
        title: 'Perceptron'
    });
});

router.post('/perceptron/learn', jsonParser, (req, res) => {

    if (!req.body)
        return res.status(400);

    let perceptronStatuses = [];

    let perceptron = new Perceptron(1, req.body.learningRate);

    for (let i = 0; i < req.body.studyArray.length; i++) {
        perceptron.learn(x => console.log('learning...'), req.body.studyArray[i]);
        perceptronStatuses.push({inputs: req.body.studyArray[i].inputs, weights: perceptron.weights, bias: perceptronStatuses.bias,
                                                  learningRate: perceptron.learningRate, threshold: perceptron.threshold});
    }
    //perceptron.learn(x => {console.log('learning...')}, req.body.studyArray);
    res.status(200).send(perceptronStatuses);
});

router.get('/perceptron/learn', (req, res) => {

    res.render('perceptron', {
        title:'perceptron'
    });
    /*
    try {
        let perceptron = new Perceptron();
        perceptron.learn(x=>{console.log('learning...')},
            [
                {inputs: [0, 0, 0], expected: 0},
                {inputs: [1, 0, 0], expected: 1},
                {inputs: [0, 1, 0], expected: 1},
                {inputs: [0, 0, 1], expected: 1},
                {inputs: [1, 1, 1], expected: 1},
                {inputs: [0, 1, 1], expected: 1},
                {inputs: [1, 0, 1], expected: 1},
                {inputs: [0, 1, 0], expected: 1},
                {inputs: [1, 1, 0], expected: 1}]);

        console.log(perceptron.predict([0, 0, 0]));
        console.log(perceptron.predict([1, 0, 1]));
        console.log(perceptron.predict([0, 1, 1]));
        console.log(perceptron.predict([1, 1, 1]));

        res.status(200).send(perceptron);

    } catch(e) {
        res.status(500).send(e);
    }
    */

});


module.exports = router;