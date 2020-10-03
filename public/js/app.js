const numberInputsForm = document.getElementById('number_inputs');
const amountInputsLabel = document.getElementById('amount-inputs');
const mainContainer = document.querySelector('.main-content');
const presetButton = document.getElementById('set-default');

numberInputsForm.addEventListener('submit', e => {
    e.preventDefault();
    const isPreset = (e.submitter.value === 'preset');

    if (!amountInputsLabel.value) {
        amountInputsLabel.value = 8;
    }

    if (amountInputsLabel.value && amountInputsLabel.value >=1 && amountInputsLabel.value <= 8) {
        const amountInputs = amountInputsLabel.value;
        clearOptionsForm();
        renderOptionsForm(amountInputs, isPreset);
        setupInputsFormListener();
    }
});

const setupInputsFormListener = () => {
    const perceptronInputsForm = document.getElementById('perceptron_inputs');

    perceptronInputsForm.addEventListener('submit',  e => {
        e.preventDefault();

        const _data = {
            learningRate:  parseFloat(document.perceptron_inputs.learning_rate.value),
            studyArray: getArrInputsWeights(document.getElementsByClassName('inputs'))
        }

        fetch('/perceptron/learn', {
            method: "POST",
            body: JSON.stringify(_data),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
            .then(response => response.json())
            .then(data => {
                clearTable();
                if (!renderTable(data)) renderError();
            })
            .catch(err => console.log(err));

    });
};

const clearOptionsForm = () => {
    const perceptronInputsForm = document.getElementById('perceptron_inputs');
    if (perceptronInputsForm) perceptronInputsForm.parentNode.parentNode.removeChild(perceptronInputsForm.parentNode);
};

const getArrInputsWeights = (inputsNodes) => {
    inputsNodes = Array.prototype.slice.call(inputsNodes);
    let inputsArr = inputsNodes.map(el => Array.prototype.slice.call(el.childNodes));
    inputsArr = inputsArr.map(el => el.filter( el => el.className && el.className.includes('weight')).map(el => parseInt(el.value)));
    return inputsArr.map(el => {
        return {
            inputs: [el[0], el[1], el[2]],
            expected: el[3]
        };
    })
};

const renderOptionsForm = (amount, isPreset) => {
        const HTML =
            `<div class="inputs-settings">
                    <form name="perceptron_inputs" id="perceptron_inputs">
                        ${renderInputsWeights(amount)}
                        <div class="learning-rate">
                            <label for="rate">Learning rate:</label>
                            <input type="number" id="rate" step="0.1" name="learning_rate" min="0.1" max="0.9" required>
                        </div>
                        <div class="accept-buttons">
                            <input type="submit" value="send">
                            <input type="reset" value="clear">
                        </div>
                    </form>
            </div>`;

        mainContainer.insertAdjacentHTML('beforeend', HTML);

    if (isPreset) {
        const presetArr = [
            [0, 0, 0],
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 0],
            [1, 0, 1],
            [0, 1, 1],
            [1, 1, 1]
        ];

        let inputs = document.querySelectorAll('.inputs');
        inputs = Array.prototype.slice.call(inputs);
        inputs = inputs.map(el => Array.prototype.slice.call(el.childNodes)
            .filter(el => el.nodeName === 'INPUT'));

        for (let i = 0; i < amount; i++) {
            for (let j = 0; j < 3; j++) {
                inputs[i][j].value = presetArr[i][j];
            }
        }
    }
};

const renderInputsWeights = (amount) => {
    let result= '';

    for (let i = 0; i < amount; i++) {
        result +=
            ` <div class="inputs">
            <form name="perceptron_inputs">
                <input class="weight" type="number" name="x1_${i+1}" min="0" max="1" required placeholder="x1">
                <input class="weight" type="number" name ="x2_${i+1}" min="0" max="1" required placeholder="x2">
                <input class="weight" type="number" name="x3_${i+1}" min="0" max="1" required placeholder="x3">
                <input class="weight" type="number" name="output" min="0" max="1" required placeholder="res">
           </div>\n`;
    }

    return result;
};

const renderTable = perceptrons => {
    if (!perceptrons) return false;

    if (!perceptrons.length) return false;

    for (let i = 0; i < perceptrons.length; i++) {

        let HTML =
            `<div class="out-table">
            <table>
                <tr class="headers-line">
                    <td>ω1</td>
                    <td>ω2</td>
                    <td>ω3</td>
                    <td>ω4</td>
                    <td>θ</td>
                    <td>x1</td>
                    <td>x2</td>
                    <td>x3</td>
                </tr>
                <tr>
                    <td>${perceptrons[i].weights[0].toFixed(4)}</td>
                    <td>${perceptrons[i].weights[1].toFixed(4)}</td>
                    <td>${perceptrons[i].weights[2].toFixed(4)}</td>
                    <td>${perceptrons[i].weights[3].toFixed(4)}</td>
                    <td>${perceptrons[i].threshold}</td>
                    <td>${perceptrons[i].inputs[0]}</td>
                    <td>${perceptrons[i].inputs[1]}</td>
                    <td>${perceptrons[i].inputs[2]}</td>
                </tr>
            </table>
        </div>`

        mainContainer.insertAdjacentHTML('beforeend', HTML);
    }

    return true;
}

const clearTable = () => {
    const table = document.querySelector('.out-table');
    if (table) table.parentElement.removeChild(table);
}

const renderError = () => {
    const HTML = `<h3>Error.</h3>`
    mainContainer.insertAdjacentHTML('beforeend', HTML);
}
