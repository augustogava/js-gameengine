class InputUserFieldInteractions {
    constructor(game) {
        this.game = game;
        this.fieldConfigurations = {};
        this.previousValues = {}; // Store previous values
        this.fieldValues = {};


        this.init();
    }

    init() {
        this.injectStyles();
        this.createContainer();

        this.createBindUpdate();
    }

    createBindUpdate() {
        setTimeout(() => {
            this.updateFromBoundObject();
            this.createBindUpdate();
        } , 1000);

    }

    injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            #dynamicFields {
                position: absolute;
                top: 10px;
                left: 10px;
                // background-color: rgba(5, 255, 255, 0.8);
                padding-left: 8px;
                z-index: 1000;

                padding: 1.5rem 2rem; /* Adjusted padding */
                border-radius: 8px; /* Slightly reduced border-radius */
            }
            
            h2 {
                margin-bottom: 1.5rem;
                text-align: center;
            }

            input{
                width: 80%;
                height: 15px; 
                padding: 0 0.0rem;  
            }
            
            label {
                display: block;
                margin-bottom: 5px; /* Adjusted margin */
                margin-top: 5px; /* Adjusted margin */
                font-size: 12px;
                color: #fff;
            }
            
            input {
                padding: 0.1rem 0.3rem; /* Adjusted padding */
                font-size: 11px; /* Reduced font size */
                border: 1px solid #ccc;
                border-radius: 4px; /* Slightly reduced border-radius */
                transition: border-color 0.3s ease;
                margin-bottom:3px;
            }
            
            input:focus {
                border-color: #007BFF;
                outline: none;
            }
           
        `;

        document.head.appendChild(style);
    }

    static enableInputModification(game) {
        const userInput = new InputUserFieldInteractions(game);
        return userInput;
    }

    createContainer() {
        this.dynamicDiv = document.createElement("div");

        this.dynamicDiv.id = "dynamicFields";

        this.dynamicDiv.style.position = "fixed";
        this.dynamicDiv.style.top = "5px";
        this.dynamicDiv.style.left = "5px";
        this.dynamicDiv.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        this.dynamicDiv.style.padding = "5px";
        this.dynamicDiv.style.borderRadius = "2px";
        this.dynamicDiv.style.width = "200px";

        this.dynamicDiv.style.zIndex = "9999"; // Ensures it's on top of other elements

        // Append it to the body
        document.body.appendChild(this.dynamicDiv);
    }

    bindDynamicObject(dynamicObject, objectType) {
        this.dynamicObject = dynamicObject;
        this.objectType = objectType;

        this.loadFieldsForType(objectType);
    }

    setFieldConfigurations(config) {
        this.fieldConfigurations = config;
    }

    updateFromBoundObject() {
        if (!this.dynamicObject || !this.objectType) {
            return;
        }

        const updatedConfig = this.dynamicObject.getInputFieldsConfig()[this.objectType];
        if (!updatedConfig) return;

        updatedConfig.forEach(field => {
            let existingInput = document.getElementById(field.id);
            if (existingInput && this.previousValues[field.id] !== field.value) {
                existingInput.value = field.value;
                this.previousValues[field.id] = field.value; // Update previous value
            }
        });
    }

    loadFieldsForType(objectType) {
        if (!this.dynamicObject) {
            return;
        }

        const fields = this.dynamicObject.getInputFieldsConfig()[objectType];
        if (!fields) return;

        let html = "";
        fields.forEach(field => {
            html += `<div>`;
            html += `<label for="${field.id}">${field.label}</label>`;
            if (field.type === 'number' && field.id.endsWith('X')) {
                const yField = fields.find(f => f.id === field.id.replace('X', 'Y'));
                html += `<input type="${field.type}" id="${field.id}" value="${field.value}"  />`;
                html += `<input type="${yField.type}" id="${yField.id}" value="${yField.value}"  />`;
            } else if (field.id.endsWith('Y')) {
            } else {
                html += `<input type="${field.type}" id="${field.id}" value="${field.value}"  />`;
            }
            html += `</div>`;
        });

        this.dynamicDiv.innerHTML = html;


        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                input.addEventListener('change', () => {
                    // Update the fieldValues object with the new value for the changed field
                    this.fieldValues[field.id] = input.value;

                    this.handleInputChange(field.id);
                });
            }
        });
    }

    handleInputChange(changedField) {
        if (changedField) {
            const newValue = this.fieldValues[changedField];

            // Check the field type, and parse as a number if it's a 'number' type
            if (this.isFieldTypeNumber(changedField)) {
                this.dynamicObject.updateFieldUser(changedField, parseFloat(newValue));
            } else {
                this.dynamicObject.updateFieldUser(changedField, newValue);
            }
        }
    }

    isFieldTypeNumber(changedField) {
        const fields = this.dynamicObject.getInputFieldsConfig()[this.objectType];
        if (fields) {
            const field = fields.find(field => field.id === changedField);
            return field && field.type === 'number';
        }
        return false;
    }
}