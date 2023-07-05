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
        Plotly.newPlot("plotElement", /* JSON object */ {
            "data": this.lines.filter(x => x.visible).map(x => ({ "y": x.yData })),
            "layout": { "width": w, "height": h }
        })
    }
}