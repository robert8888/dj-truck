export default function(cc, x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    cc.beginPath();
    cc.moveTo(x + radius, y);
    cc.arcTo(x + width, y, x + width, y + height, radius);
    cc.arcTo(x + width, y + height, x, y + height, radius);
    cc.arcTo(x, y + height, x, y, radius);
    cc.arcTo(x, y, x + width, y, radius);
    cc.closePath();
    return cc;
}