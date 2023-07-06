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
                this.createAddChannelControl();
            }
            else {
                getCsv(file.url).then(x => {
                    file.channels = x;
                    this.currentFile = file;
                    this.createAddChannelControl();
                })
            }
        })

        this.fillComboBox(cbCar, files.events.imola_2023);
    }

    createAddChannelControl() {
        const el = document.getElementById('channelSelection');
        el.innerHTML = '';
        const ul = document.createElement('ul');
        ul.classList.add('list-group');
        Object.keys(this.currentFile.channels).forEach(key => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-primary');
            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-plus');
            button.appendChild(icon);
            button.addEventListener('click', () => {
                this.plotter.drawLine(LineData.create(this.currentFile, key));
            });
            li.appendChild(document.createTextNode(key));
            li.appendChild(button);
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