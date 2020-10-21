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
        if (!perceptron.weights.length) perceptron.init(req.body.studyArray[i].inputs);
        const startWeights = perceptron.weights;

        perceptron.learn(x => console.log('learning...'), req.body.studyArray[i]);

        let deltaW = [];

        for (let i = 0; i < perceptron.weights.length; i++) {
            deltaW[i] = perceptron.weights[i] - startWeights[i];
        }

        perceptronStatuses.push(
            {   inputs: req.body.studyArray[i].inputs,
                finalWeights: deltaW,
                learningRate: perceptron.learningRate,
                threshold: perceptron.threshold,
                sum: perceptron.weightedSum(req.body.studyArray[i].inputs),
                startWeights,
                threshold: this.threshold,
                error: 0,
            });
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