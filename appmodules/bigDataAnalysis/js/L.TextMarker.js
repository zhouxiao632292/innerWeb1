/**
 * Created by JD on 2017/1/13.
 */
L.TextMarker = L.Path.extend({

    options: {
        fill: true,
        fillOpacity:1,
        stroke: false,
        offset: [0,0],
        angle:true,
        bounds:[[-10,0],[0,20]]
    },

    initialize: function (latlng, options) {
        L.setOptions(this, options);
        this._latlng = L.latLng(latlng);
        this._text = this.options.text;
        this._offset = L.point(this.options.offset);
        this._bounds = L.bounds(this.options.bounds);
    },

    // @method setLatLng(latLng: LatLng): this
    // Sets the position of a text marker to a new location.
    setLatLng: function (latlng) {
        this._latlng = L.latLng(latlng);
        this.redraw();
        return this.fire('move', {latlng: this._latlng});
    },

    // @method getLatLng(): LatLng
    // Returns the current geographical position of the text marker
    getLatLng: function () {
        return this._latlng;
    },

    // @method setText(text: String): this
    // Sets the text.
    setText: function (text) {
        this.options.text = this._text = text;
        return this.redraw();
    },

    // @method getText(): Number
    // Returns the current text
    getText: function () {
        return this._text;
    },

    setStyle : function (options) {
        var text = options && options.text || this._text;
        L.Path.prototype.setStyle.call(this, options);
        this.setText(text);
        return this;
    },

    _project: function () {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._point._add(this._offset);
        this._updateBounds();
    },

    _updateBounds: function () {
        var w = this._clickTolerance(),
            p = [w,w]
        this._pxBounds = new L.Bounds(this._point.add(this._bounds.min).subtract(p), this._point.add(this._bounds.max).add(p));
    },

   _update: function () {
        if (this._map) {
            this._updatePath();
        }
    },

    _updatePath: function () {

        if (this._empty()) { return; }
        var p = this._point,
            text = this._text,
            options = this.options,
            ctx = this._renderer._ctx,
            clear = this._clear;

        ctx.globalCompositeOperation = clear ? 'destination-out' : 'source-over';
        ctx.font=options.font;
        ctx.textAlign=options.textAlign;
        ctx.textBaseline=options.textBaseline;

        if (options.stroke && options.weight !== 0) {
            ctx.globalAlpha = clear ? 1 : options.opacity;

            // if clearing shape, do it with the previously drawn line width
            this._prevWeight = ctx.lineWidth = clear ? this._prevWeight + 1 : options.weight;
            ctx.strokeStyle = options.color;
            ctx.strokeText(text,p.x,p.y)
        }

        if (options.fill!==false) {
            ctx.globalAlpha = clear ? 1 : options.fillOpacity;
            ctx.fillStyle = options.fillColor || options.color;
            ctx.fillText(text,p.x,p.y)
        }

        if(options.angle){
            ctx.restore();
        }
    },

    _empty: function () {
        return !this._renderer._bounds.intersects(this._pxBounds);
    },

    _containsPoint:function (p) {
        return p.distanceTo(this._point) <= this._clickTolerance();
    }
});


// @factory L.textMarker(latlng: LatLng, options? TextMarker options)
//
L.textMarker = function (latlng, options) {
    return new L.TextMarker(latlng, options);
};