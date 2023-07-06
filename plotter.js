
class ColorsUtil {
    currentColorIndex = 0;
    colorPalette = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    getNextColor() {
        return this.colorPalette[this.currentColorIndex++ % this.colorPalette.length]
    }
}
COLOR_PALETTE = new ColorsUtil();
LINE_DATA_ID = 0;
class LineData {
    constructor(name, channelName, info, time, yData) {
        this.id = LINE_DATA_ID++;
        this.name = name;
        this.channelName = channelName;
        this.info = info;
        this.time = time;
        this.yData = yData;
        this.visible = true;
        this.color = COLOR_PALETTE.getNextColor();
    }

    static create(file, channelName) {
        //const input = '/imola_2023/T2303_IMO_#29/D1PMRun1/Tr491_Abs00006148_CAR 29_Lap0_cableData.csv';
        const carNumber = file.path.match("CAR (\\d+)")[1];
        const run = file.path.split('/')[4];
        const trNumber = file.path.match("Abs(\\d+)")[0].slice(-4);
        const desc = `${carNumber}_${run}_${trNumber}`;
        const name = `${channelName}@${desc}`;
        return new LineData(name, channelName, desc, file.channels['Time'], file.channels[channelName])
    }
}

class Plotter {
    constructor() {
        this.lines = [];
        this.onChangedHandlers = [];
    }

    addOnChanged(callback) {
        this.onChangedHandlers.push(callback);
    }

    removeOnChanged(callback) {
        const index = this.onChangedHandlers.indexOf(callback);
        if (index !== -1) {
            this.onChangedHandlers.splice(index, 1);
        }
    }

    raiseOnChanged() {
        for (const c of this.onChangedHandlers) {
            c();
        }
    }

    addLine(lineData) {
        this.lines.push(lineData);
        this.raiseOnChanged();
    }

    drawLine(lineData) {
        this.lines.push(lineData);
        this.render();
        this.raiseOnChanged();
    }

    render() {
        if (this.lines.length === 0) return;
        const el = document.getElementById('plotContainer');
        const w = 0.9 * el.offsetWidth;
        const h = 0.8 * el.offsetHeight;


        const data = this.lines
            .filter(x => x.visible)
            .map(x => {
                if (x.color === null)
                    x.color = this.getNextColor();
                return {
                    type: 'line',
                    x: x.time,
                    y: x.yData,
                    yaxis: `y${x.id + 1}`,
                    // mode: 'lines',
                    //name: `${x.channelName}<br>${x.info}`,
                    name: x.channelName,
                    line: {
                        color: x.color,
                        // width: 3
                    }
                };
            });

        const layout = {
            "width": w,
            "height": h,
            xaxis: { title: 'time in s', showgrid: false, showline: true, zeroline: false },
            yaxis: { title: 'y-axis 1', showline: false, zeroline: false, showgrid: false },
            yaxis2: { title: 'y-axis 2', overlaying: 'y', side: 'right', showgrid: false }
        };

        Plotly.newPlot("plotElement", { data, layout });
    }
}

