class UI {
    constructor(plotter) {
        this.plotter = plotter;
        this.currentFile = null;
    }

    initialize() {
        const cbCar = document.getElementById('cbCar');
        const cbRun = document.getElementById('cbRun');
        const cbFile = document.getElementById('cbFile');

        cbCar.addEventListener('change', event => {
            this.fillComboBox(cbRun, files.events.imola_2023[event.target.value]);
        })
        cbRun.addEventListener('change', event => {
            this.fillComboBox(cbFile, files.events.imola_2023[cbCar.value][event.target.value]);
        })
        cbFile.addEventListener('change', event => {
            const file = files.events.imola_2023[cbCar.value][cbRun.value][event.target.value];
            if (file.channels !== null) {
                this.currentFile = file;
                this.createChannelSelectionUI();
            }
            else {
                getCsv(file.url).then(x => {
                    file.channels = x;
                    this.currentFile = file;
                    this.createChannelSelectionUI();
                })
            }
        })

        this.fillComboBox(cbCar, files.events.imola_2023);
    }

    createChannelSelectionUI() {
        const el = document.getElementById('channelSelection');
        el.innerHTML = '';
        const ul = document.createElement('ul');

        Object.keys(this.currentFile.channels).forEach(key => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = key;
            checkbox.value = key;
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    this.plotter.drawLine(new LineData(checkbox.value, this.currentFile.channels[checkbox.value]));
                } else {
                    console.log('Checkbox unchecked:', checkbox.value);
                }
            });
            const label = document.createElement(key);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(key));
            li.appendChild(label);
            ul.appendChild(li);
        });

        el.appendChild(ul);
    }

    fillComboBox(comboBox, json) {
        comboBox.innerHTML = '';
        Object.keys(json).forEach(key => {
            const opt = document.createElement('option');
            opt.text = key;
            opt.value = key;
            comboBox.appendChild(opt);
        });
        // trigger a refreh
        comboBox.dispatchEvent(new Event("change"));
    }
}