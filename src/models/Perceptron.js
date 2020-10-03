class Perceptron {
    constructor(bias=1,learningRate= 0.1,weights=[]) {
        this.bias = bias;
        this.learningRate = learningRate;
        this.weights = weights;
        this.trainingSet = [];
        this.threshold = 0;
    }

    init(inputs,bias=this.bias) {
        this.weights = [...inputs.map(i => Math.random() * 10), bias];
    }

    train(inputs,expected) {
        if (!this.weights.length) this.init(inputs);
        if (inputs.length !== this.weights.length) inputs.push(1);
        let isChecked = true;

        if (!this.trainingSet.find(t => t.inputs.every((inp,i) => inp === inputs[i]))) {
            this.trainingSet.push({inputs,expected});
            isChecked = false;
        }

        const actual = this.evaluate(inputs);

        if (actual === expected) {
            //if (isChecked) this.oldVersions.push({inputs: inputs, weights: this.weights, bias: this.bias,
            //                                      learningRate: this.learningRate, threshold: this.threshold});
            return true;
        }

        this.weights = this.weights.map((w, i) => w += this.delta(actual, expected, inputs[i]));
        return this.weights;
    }

    delta(actual, expected, input, learningRate= this.learningRate) {
        const error = expected - actual;
        return error * learningRate * input;
    }

    learn(iterationCallback  = () => {}, trainingSet= this.trainingSet) {
        let success = false;

        while (!success) {
            iterationCallback.call(this);
            // success = trainingSet.every(t => this.train(t.inputs,t.expected) === true);
            success = this.train(trainingSet.inputs, trainingSet.expected);
        }
    }

    weightedSum(inputs=this.inputs,weights=this.weights) {
        return inputs.map((inp, i) => inp * weights[i]).reduce((x,y) => x + y, 0);
    }

    evaluate(inputs) {
        return this.activate(this.weightedSum(inputs));
    }

    // Sugar syntax evaluate with added bias input
    predict(inputs) {
        return this.evaluate([...inputs, 1]);
    }

    // Heaviside as the activation function
    activate(value) {
        return value >= this.threshold ? 1 : 0;
    }

}
    /*
    init(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            this.weights[i] = [1];
        }
    }

    train(inputs, expected) {
        if (!this.weights.length) this.init(inputs);
        //if (inputs.length !== this.weights.length) inputs.push(1);

        if (!this.trainingSet.find(t => t.inputs.every((inp,i) => inp === inputs[i])))
            this.trainingSet.push({inputs, expected});

        const actual = this.evaluate(inputs);
        if (actual === expected) return true;

        this.weights = this.weights.map((w, i) => (w += this.delta(actual, expected, inputs[i])));
        return this.weights;
    }

    delta(actual, expected, input, learningRate = this.learningRate) {
        const error = expected - actual;
        return error *  learningRate * input;
    }

    evaluate(inputs) {
        return this.activate(this.weightedSum(inputs));
    }

    activate(value) {
        return value >= 0 ? 1 : 0;
    }
*/

module.exports = Perceptron;