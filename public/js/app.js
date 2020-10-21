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
                console.log(data);
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
                            <input type="number" id="rate" step="0.01" name="learning_rate" min="0.01" max="0.99" required>
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

    // let HTML = '<div>\n' +
    //     '<svg height="20" width="650">\n' +
    //     '          <line x1="0" y1="10" x2="650" y2="10" style="stroke:rgb(96,3,3);stroke-width:4"></line> \n' +
    //     '        </svg>\n' +
    //     '</div>\n';

    let HTML = '';

    for (let i = 0; i < perceptrons.length; i++) {

         HTML +=
            `\n<div class="out-table">
           
            <table>
                <tr>
                    <td class="headers-line">x1</td>
                    <td>${perceptrons[i].inputs[0]}</td>
                </tr>
                <tr>
                    <td class="headers-line">x2</td>
                    <td>${perceptrons[i].inputs[1]}</td>
                </tr>
                <tr>
                    <td class="headers-line">x3</td>
                    <td>${perceptrons[i].inputs[2]}</td>
                </tr>
            </table>
            
            <table>
                <tr>
                    <td class="headers-line">ω1</td>
                    <td>${perceptrons[i].startWeights[0].toFixed(4)}</td>
                </tr>
                <tr>
                    <td class="headers-line">ω2</td>
                    <td>${perceptrons[i].startWeights[1].toFixed(4)}</td>
                </tr>
                <tr>
                    <td class="headers-line">ω3</td>
                    <td>${perceptrons[i].startWeights[2].toFixed(4)}</td>
                </tr>
                <tr>
                    <td class="headers-line">ω4</td>
                    <td>${perceptrons[i].startWeights[3].toFixed(4)}</td>
                </tr>
            </table>
            
            <table>
                <tr>
                    <td class="headers-line">Y</td>
                    <td></td>
                </tr>
                <tr>
                    <td class="headers-line">T</td>
                    <td></td>
                </tr>
                <tr>
                    <td class="headers-line">η(T-Y)</td>
                    <td></td>
                </tr>
            </table>
            
            <table>
                <tr>
                    <td class="headers-line">ɑ</td>
                    <td>${perceptrons[i].sum.toFixed(4)}</td>
                </tr>
                <tr>
                    <td class="headers-line">θ</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td class="headers-line">δθ</td>
                    <td>0</td>
                </tr>
            </table>
            
            <table>
                <tr>
                    <td class="headers-line">δω1</td>
                    <td>${perceptrons[i].finalWeights[0].toFixed(4)}</td>
                </tr>
                <tr>
                    <td class="headers-line">δω2</td>
                    <td>${perceptrons[i].finalWeights[1].toFixed(4)}</td>
                </tr>
                <tr>
                    <td class="headers-line">δω3</td>
                    <td>${perceptrons[i].finalWeights[2].toFixed(4)}</td>
                </tr>
                <tr>
                    <td class="headers-line">δω4</td>
                    <td>${perceptrons[i].finalWeights[3].toFixed(4)}</td>
                </tr>
            </table>
            
        </div>\n`
    }

    HTML = `<div class="out-tables-container"> ${HTML} </div>`;
    mainContainer.insertAdjacentHTML('beforeend', HTML);

    return true;
}

const renderError = () => {
    const HTML = `<h3>Error.</h3>`
    mainContainer.insertAdjacentHTML('beforeend', HTML);
}
