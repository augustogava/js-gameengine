// js/iot-engine/ai/SimpleBrain.js

class SimpleBrain {
    constructor() {
        // Initialize TensorFlow.js model
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({ inputShape: [6], units: 8, activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: 2, activation: 'tanh' })); // Outputs: [turning angle, acceleration]
        this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

        // Training data
        this.trainingInputs = [];
        this.trainingOutputs = [];
    }

    decide(inputs) {
        const inputTensor = tf.tensor2d([inputs]);
        const outputTensor = this.model.predict(inputTensor);
        const outputs = outputTensor.dataSync();
        tf.dispose([inputTensor, outputTensor]);
        return outputs;
    }

    addTrainingData(inputs, outputs) {
        this.trainingInputs.push(inputs);
        this.trainingOutputs.push(outputs);

        // Limit training data size
        if (this.trainingInputs.length > 1000) {
            this.trainingInputs.shift();
            this.trainingOutputs.shift();
        }
    }

    async train() {
        if (this.trainingInputs.length < 10) return; // Not enough data to train

        const xs = tf.tensor2d(this.trainingInputs);
        const ys = tf.tensor2d(this.trainingOutputs);
        await this.model.fit(xs, ys, {
            epochs: 10,
            batchSize: 32,
            shuffle: true,
        });
        tf.dispose([xs, ys]);
    }

    clone() {
        const newBrain = new SimpleBrain();
        newBrain.model.setWeights(this.model.getWeights().map(w => w.clone()));
        newBrain.trainingInputs = [...this.trainingInputs];
        newBrain.trainingOutputs = [...this.trainingOutputs];
        return newBrain;
    }
}
