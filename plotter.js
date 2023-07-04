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
        const el = document.getElementById('plotContainer');
        const w = 0.9 * el.offsetWidth;
        const h = 0.8 * el.offsetHeight;
        Plotly.newPlot("plotElement", /* JSON object */ {
            "data": this.lines.map(x => ({ "y": x.yData })),
            "layout": { "width": w, "height": h }
        })
    }
}