class LineData {
    constructor(name, yData) {
        this.name = name;
        this.yData = yData;
    }
}

class Plotter {
    constructor() {
        this.lines = [];
    }

    addLine(lineData) {
        this.lines.push(lineData);
    }

    drawLine(lineData) {
        this.lines.push(lineData);
        this.render();
    }

    render() {
        if (this.lines.length === 0) return;
        Plotly.newPlot("plotElement", /* JSON object */ {
            "data": this.lines.map(x => ({ "y": x.yData })),
            //"layout": { "width": 600, "height": 400 }
            "layout": { "autosize": true }
        })
    }
}