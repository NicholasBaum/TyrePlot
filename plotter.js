class LineData {
    constructor(id, name, yData) {
        this.id = id;
        this.name = name;
        this.yData = yData;
        this.visible = true;
        this.color = null;
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
                    // type: 'scatter',
                    // x: [1, 2, 3, 4],
                    y: x.yData,
                    // mode: 'lines',
                    name: x.name,
                    line: {
                        color: x.color,
                        // width: 3
                    }
                };
            });

        const layout = {
            "width": w,
            "height": h
        };

        Plotly.newPlot("plotElement", { data, layout });
    }

    currentColorIndex = 0;
    colorPalette = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    getNextColor() {
        return this.colorPalette[this.currentColorIndex++ % this.colorPalette.length]
    }
}