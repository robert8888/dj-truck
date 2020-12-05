export default function drawBuffer() {
    const nominalWidth = Math.round(
        this.getDuration() *
        this.params.minPxPerSec *
        this.params.pixelRatio
    );
    const parentWidth = this.drawer.getWidth();
    let width = nominalWidth;
    // always start at 0 after zooming for scrolling : issue redraw left part
    let start = 0;
    let end = Math.max(start + parentWidth, width);

    this.fireEvent("processing")
    this.backend.getPeaksPromise(width, start, end).then(peaks => {
        this.drawer.drawPeaks(peaks, width, start, end);
        this.fireEvent('redraw', peaks, width);
        this.fireEvent("processed")
    });
}