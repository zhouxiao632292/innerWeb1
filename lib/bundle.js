!function(t) {
    var e = {};
    function n(r) {
        if (e[r]) return e[r].exports;
        var o = e[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return t[r].call(o.exports, o, o.exports, n),
        o.l = !0,
        o.exports
    }
    n.m = t,
    n.c = e,
    n.d = function(t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, {
            configurable: !1,
            enumerable: !0,
            get: r
        })
    },
    n.r = function(t) {
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    },
    n.n = function(t) {
        var e = t && t.__esModule ?
        function() {
            return t.
        default
        }:
        function() {
            return t
        };
        return n.d(e, "a", e),
        e
    },
    n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    },
    n.p = "dist/",
    n(n.s = 12)
} ([function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }),
    (e.Color = function(t, e, n) {
        this.ident = t,
        this.steps = e,
        this.gradient = n,
        this.colors = null,
        this.setMinMax()
    }).prototype = {
        setColors: function(t) {
            this.wasModified || (this.defaultGradient = utils.clone(this.gradient)),
            this.wasModified = !0,
            this.gradient = t,
            this.setMinMax(),
            this.colors && this.forceGetColor()
        },
        toDefault: function() {
            this.defaultGradient && (this.wasModified = !1, this.gradient = utils.clone(this.defaultGradient), this.setMinMax(), this.colors && this.forceGetColor())
        },
        setMinMax: function() {
            this.min = this.gradient[0][0],
            this.max = this.gradient[this.gradient.length - 1][0]
        },
        forceGetColor: function() {
            return this.colors = null,
            this.getColor()
        },
        color: function(t, e, n) {
            var r = this.RGBA(t);
            return "rgba(" + r[0] + "," + r[1] + "," + r[2] + "," + (e || r[3] / (n || 256)) + ")"
        },
        colorInvert: function(t, e, n) {
            var r = this.RGBA(t);
            return "rgba(" + (255 - r[0]) + "," + (255 - r[1]) + "," + (255 - r[2]) + "," + (e || r[3] / (n || 256)) + ")"
        },
        colorRGB: function(t) {
            var e = this.RGBA(t);
            return "rgb( " + e[0] + ", " + e[1] + ", " + e[2] + ")"
        },
        colorDark: function(t, e) {
            var n = this.RGBA(t);
            return "rgba(" + (n[0] - e) + "," + (n[1] - e) + "," + (n[2] - e) + ",1)"
        },
        RGBA: function(t) {
            var e = this.value2index(t);
            return [this.colors[e], this.colors[++e], this.colors[++e], this.colors[++e]]
        },
        getMulArray: function(t, e) {
            var n, r = [],
            o = t.length;
            for (n = 0; n < o; n++) r.push(t[n] * e);
            return r
        },
        lerpArray: function(t, e, n) {
            var r, o = 1 - n,
            i = t.length,
            a = [];
            for (r = 0; r < i; r++) a.push(t[r] * o + e[r] * n);
            return a
        },
        rgb2yuv: function(t) {
            var e = [],
            n = .299 * t[0] + .587 * t[1] + .114 * t[2];
            return e.push(n),
            e.push(.565 * (t[2] - n)),
            e.push(.713 * (t[0] - n)),
            e.push(t.slice(3)),
            e
        },
        yuv2rgb: function(t) {
            return [t[0] + 1.403 * t[2], t[0] - .344 * t[1] - .714 * t[2], t[0] + 1.77 * t[1]].concat(t.slice(3))
        },
        // @preserveSaturation .. (maintain |UV| size)
        gradYuv: function(t, e, n, r) {
            var o = this.lerpArray(t, e, n);
            if (r) {
                var i = this.vec2size(t[1], t[2]),
                a = this.vec2size(e[1], e[2]);
                if (i > .05 && a > .05) {
                    var s = this.vec2size(o[1], o[2]);
                    if (s > .01) {
                        var l = (i * (1 - n) + a * n) / s;
                        o[1] *= l,
                        o[2] *= l
                    }
                }
            }
            return o
        },
        vec2size: function(t, e) {
            return Math.sqrt(t * t + e * e)
        },
        getGradientColor: function(t, e, n, r, o) {
            var i, a = 1 / 255,
            s = 1,
            l = 256;
            switch (t) {
            case "YUV":
                var u = this.gradYuv(this.rgb2yuv(this.getMulArray(e, a)), this.rgb2yuv(this.getMulArray(n, a)), r, !0);
                i = this.yuv2rgb(u);
                break;
            default:
                i = this.lerpArray(e, n, r),
                s = a,
                l = 1
            }
            for (var c = i[3] * s, f = 0; f < 4; f++) {
                var h = i[f];
                o && f < 3 && (h *= c),
                i[f] = Math.max(0, Math.min(h * l, 255))
            }
            return i
        },
        createGradientArray: function(t, e, n, r, o) {
            r = r || this.steps,
            o = o || 1;
            for (var i = new Uint8Array(4 * (r + (e ? 1 : 0))), a = 0, s = (this.max - this.min) / r, l = this.gradient, u = 1, c = l[0], f = l[u++], h = 0; h < r; h++) {
                var p = (this.min + s * h) * o;
                p > f[0] && u < l.length && (c = f, f = l[u++]);
                for (var d = (p - c[0]) / (f[0] - c[0]), g = this.getGradientColor(t, c[1], f[1], d, n), v = 0; v < 4; v++) i[a++] = g[v]
            }
            if (e) for (this.neutralGrayIndex = a, v = 0; v < 4; v++) i[a++] = 130;
            return i
        },
        getColor: function() {
            return this.colors ? this: (this.colors = this.createGradientArray("YUV", !1, !0), this.startingValue = this.min, this.step = (this.max - this.startingValue) / this.steps, this.value2index = function(t) {
                return isNaN(t) ? this.neutralGrayIndex: Math.max(0, Math.min(4 * (this.steps - 1), (t - this.startingValue) / this.step << 2))
            },
            this)
        }
    }
},
function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }),
    e.colors = void 0;
    var r = n(0);
    e.colors = {
        //三小时降水、6小时降水
        precipitation:new r.Color("precipitation",1024,[[0,[80,80,80,0]],[.3,[0,143,255,87]],[6,[0,255,255,89]],[8,[0,255,4,89]],[10,[177,255,0,89]],[15,[255,255,0,89]],[20,[253,1,0,89]],[31,[255,0,255,89]],[50,[255,255,255,100]]]),
        //12小时降水 24小时降水
        precipitation24:new r.Color("precipitation24",2048,[[0,[119,119,119,0]],[1,[135,135,135,28.16]],[5,[130,55,255,73]],[10,[35,175,255,99]],[30,[25,255,191,119]],[40,[142,255,61,120]],[50,[255,205,25,120]],[70,[255,107,55,120]],[90,[255,65,161,120]],[100,[170,85,255,120]]]),
        //温度，高温、低温
        temperature:new r.Color("temperature",2048,[[-70,[87,0,66,180]],[-55,[255,196,240,180]],[-40,[178,0,144,180]],[-25,[140,36,191,180]],[-15,[159,253,250,153]],[-8,[68,233,213,180]],[-4,[58,184,229,180]],[0,[43,121,247,180]],[.85,[7,85,50,180]],[6,[22,144,14,180]],[10,[103,190,9,180]],[15,[246,250,58,180]],[18,[250,220,50,180]],[22,[251,181,32,180]],[27,[229,89,4,180]],[29,[230,71,39,180.32]],[32,[233,8,59,92.16]],[39,[88,27,67,180.32]],[42,[212,0,192,107]],[46,[255,255,255,80]]]),
        //风场
        wind:new r.Color("wind",2048,[[0,[82,71,141,125]],[1,[85,78,177,125]],[2,[80,87,184,125]],[4,[67,105,196,125]],[6,[64,160,180,125]],[8,[78,193,103,125]],[10,[104,209,79,125]],[12,[157,221,68,125]],[18,[220,234,55,125]],[24,[234,164,62,125]],[30,[217,66,114,125]],[39.85,[88,27,67,125]],[36,[147,23,78,125]],[42,[43,0,1,125]]]),
        //相对湿度
        relativeHumidity:new r.Color("relativeHumidity",1024,[[0,[254,63,0,0]],[30,[254,117,0,102]],[40,[254,194,0,102]],[50,[105,254,0,102]],[60,[0,254,140,102]],[70,[0,255,253,102]],[75,[0,224,254,102]],[80,[0,218,254,102]],[83,[0,200,254,102]],[87,[0,170,254,102]],[90,[0,164,254,102]],[93,[0,146,254,102]],[97,[0,91,219,102]],[100,[0,30,126,102]]]),
        //云量
        cloud:new r.Color("cloud",800,[[0,[209,165,0,76.8]],[10,[169,133,0,76.8]],[30,[127,127,127,79.36]],[95,[228,228,228,104.96]],[100,[255,255,255,104.96]]]),
        //波高
        wave:new r.Color("wave",1024,[[0,[198,244,255,130]],[.5,[0,194,243,130]],[1,[0,89,166,130]],[1.5,[13,100,255,130]],[2,[15,21,167,130]],[2.5,[247,74,255,130]],[3,[188,0,184,130]],[4,[151,0,0,130]],[5,[255,4,83,130]],[7,[255,98,69,130]],[10,[255,255,255,130]],[12,[188,141,190,130]]]),
        //阵风
        gust:new r.Color("gust",600,[[0,[77,119,176,125]],[5,[78,153,164,125]],[10,[77,164,87,125]],[20,[175,170,75,125]],[30,[154,79,101,125]],[40,[118,100,159,125]],[60,[100,152,163,125]]]),
        //能见度
        visibility:new r.Color("visibility",2048,[[0,[255,255,255,0]],[0.8,[248,0,255,79.36]],[2.7,[255,0,0,87.04]],[6,[255,0,0,87.04]],[16,[0,28,255,79.36]],[20,[0,40,255,79.36]],[24,[0,231,24,151.04]],[30,[19,219,0,115.2]],[34,[15,193,3,125]],[38,[15,183,3,125]],[40,[13,157,3,125]],[45,[13,142,3,125]]]),
        //雾
        fog:new r.Color("fog",6,[[0,[255,255,255,0]],["1",[192,255,230,125]],["2",[100,255,255,125]],["3",[0,205,203,125]],["4",[0,153,153,125]],["5",[0,82,76,125]]]),
        //霾
        haze:new r.Color("haze",5,[[0,[255,255,255,0]],["1",[219,201,2,125]],["2",[169,112,0,125]],["3",[126,0,34,125]],["4",[255,60,60,125]]]),
        //沙尘
        dust:new r.Color("dust",4,[[0,[255,255,255,0]],["1",[239,178,53,125]],["2",[243,117,4,125]],["3",[255,60,60,125]]]),
        //雷暴
        thunder:new r.Color("thunder",40,[[0,[255,255,255,0]],[40,[173,255,47,125]],[60,[238,180,34,125]],[80,[255,60,60,125]]]),
        //短时强降水
        hrain:new r.Color("hrain",40,[[0,[255,255,255,0]],[40,[173,255,47,125]],[60,[238,180,34,125]],[80,[255,60,60,125]]]),
        //冰雹
        hail:new r.Color("hail",40,[[0,[255,255,255,0]],[1,[100,149,237,125]],[20,[0,250,154,125]],[40,[173,255,47,125]],[60,[238,180,34,125]],[80,[255,60,60,125]]]),
        //雷雨大风
        hwind:new r.Color("hwind",40,[[0,[255,255,255,0]],[1,[100,149,237,125]],[20,[0,250,154,125]],[40,[173,255,47,125]],[60,[238,180,34,125]],[80,[255,60,60,125]]])
    }
},
function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }),
    e.Catalog = e.spliceCacheKey = void 0,
    e.promiseCreateTexture = function(t, e, n, r) {
        var a = t.glo,
        u = a.get(),
        c = t.cache;
        return new Promise(function(f, h) {
            var p = s.fit(r.ele, e, n);
            //console.info(p);
            for (var d = p.bounds,
            g = d.getSize().add([1, 1]), v = p.tileSize, m = g.multiplyBy(v), x = m.divideBy(256).ceil().multiplyBy(256), y = new ArrayBuffer(x.x * x.y * 2), _ = new DataView(y), b = g.x * g.y, w = 0, R = !0, P = function(e) {
                404 != e.status && (R = !1);
                var n = e.tileKey;
                //console.info(n);
                for (var r = L.point(n.x, n.y).subtract(d.min).multiplyBy(v), o = new DataView(e.bin), i = 0; i < v; i++) for (var s = 0; s < v; s++) {
                    var l = 2 * ((r.y + i) * x.x + (r.x + s));
                    _.setInt16(l, o.getInt16(2 * (i * v + s)))
                }
                if (++w == b) {
                    R && t.fire("nothing");
                    var c = a.createTexture2D(u.NEAREST, u.NEAREST, u.CLAMP_TO_EDGE, u.UNSIGNED_SHORT_4_4_4_4, x.x, x.y, u.RGBA, new Uint16Array(y));
                    c.latLngBounds = p.latLngBounds,
                    c.res = p.res,
                    c.zoom = p.z,
                    c.scale = m.unscaleBy(x),
                    f(c)
                }
            },
            T = d.min.y; T <= d.max.y; T++) for (var M = d.min.x; M <= d.max.x; M++) {
                var z = new i(p.z, M, T),
                B = c.get(o(z.wrap(), r));
                B ? (B.tileKey = z, P(B)) : l(z, r).then(function(t) {
                    P(t),
                    c.put(o(t.tileKey.wrap(), r), t)
                })
            }
        })
    },
    e.TileKey = i,
    e.Meta = a;
    var r = n(7);
    var o = e.spliceCacheKey = function(t, e) {
        return e + "/" + t
    };
    function i(t, e, n) {
        this.z = t,
        this.x = e,
        this.y = n
    }
    function a(t, e, n) {
        this.ele = t,
        this.initTime = e,
        this.period = n
    }
    i.prototype.wrap = function() {
        var t = Math.pow(2, this.z);
        return new i(this.z, (this.x % t + t) % t, this.y)
    },
    i.prototype.toString = function() {
        return this.z + ":" + this.x + ":" + this.y
    },
    a.prototype.toString = function() {
        return this.ele + ":" + this.initTime + ":" + this.period
    };
    var s = e.Catalog = {
        fit: function(t, e, n) {
            var o, i = this.getMeta(t),
            a = (L.latLngBounds(i.bounds), i.res),
            s = this.getMaxZoom(a);
            try {
                o = this.getTileSize(a)
            } catch(t) {
                o = 256,
                a = 360 / (256 * Math.pow(2, s))
            }
            var l = n < a ? s: s - Math.ceil(Math.log(n / a) / Math.log(2));
            l < 1 && (l = 1);
            var u = r.Tile.tileKeys(e, l),
            c = 360 / Math.pow(2, l),
            f = (o - 1) / o;
            return {
                latLngBounds: L.latLngBounds(L.latLng(u.min.y * c - 90, u.min.x * c - 180), L.latLng(u.max.y * c + c * f - 90, u.max.x * c + c * f - 180)),
                bounds: u,
                tileSize: o,
                z: l,
                res: c / o
            }
        },
        getMaxZoom: function(t) {
            try {
                var e = this.getGlobalWidth(t),
                n = this.getTileSize(t);
                return Math.log(e / n) / Math.log(2)
            } catch(e) {
                //console.log(e);
                for (var r = 1.40625,
                o = 0; r / 2 > t && (o += 1, !((r /= 2) <= t)););
                return o
            }
        },
        getTileSize: function(t) {
            for (var e = this.getGlobalWidth(t); e % 2 == 0 && !((e /= 2) > 128 && e <= 256););
            if (e > 128 && e <= 256) return e;
            throw new Error("tileSize在(128,256]内才能使用跳点切块方法;而tileSize=" + e)
        },
        getGlobalWidth: function(t) {
            if (360 / t != Math.floor(360 / t)) throw new Error("360/dataRes 是整数时才能使用跳点切块方法;而dataRes=" + t);
            return 360 / t
        },
        intersect: function(t, e) {
            var n = L.latLngBounds();
            return n._southWest = L.latLng(Math.max(t.getSouth(), e.getSouth()), Math.max(t.getWest(), e.getWest())),
            n._northEast = L.latLng(Math.min(t.getNorth(), e.getNorth()), Math.min(t.getEast(), e.getEast())),
            n.getNorth() > n.getSouth() && n.getEast() > n.getWest() && n
        },
        cell: function(t, e, n) {
            var r, o = this.getMeta(e),
            a = (L.latLngBounds(o.bounds), o.res);
            try {
                r = this.getTileSize(a)
            } catch(t) {
                r = 256,
                a = 360 / (256 * Math.pow(2, maxZoom))
            }
            var s = 360 / Math.pow(2, n) / r,
            l = t.offset(L.latLng( - 90, -180)),
            u = L.LatLng.div(l, s)._floor(),
            c = u.divideBy(r)._floor(),
            f = u.subtract(c.multiplyBy(r)),
            h = L.point(l.lng % s / s, l.lat % s / s);
            return {
                tileKey: new i(n, c.x, c.y),
                cell: f,
                offset: h,
                tileSize: r
            }
        }
    },
    l = function(t, e) {
        return new Promise(function(n, r) {
            var o = new XMLHttpRequest,
            i = t.wrap();
            o.open("GET", s.getMeta(e.ele).dsi + "/" + e.ele + "/" + e.initTime + "." + e.period + "/" + i.z + "/" + i.x + "/" + i.y + ".bin", !0),
            o.responseType = "arraybuffer",
            o.onload = function() {
                if (200 == this.status) {
                    var r = this.response;
                    n({
                        bin: r,
                        tileKey: t,
                        args: e
                    })
                } else 404 == this.status && n({
                    bin: u,
                    tileKey: t,
                    args: e,
                    status: this.status
                })
            },
            o.onerror = function() {
                r("network error!")
            };
            try {
                o.send()
            } catch(t) {
                console.log(404)
            }
        })
    },
    u = function() {
        for (var t = new ArrayBuffer(101250), e = new DataView(t), n = 0; n < 50625; n++) e.setInt16(2 * n, 32767);
        return t
    } ()
},
function(t, e, n) {
    "use strict";
    L.TextMarker = L.Path.extend({
        options: {
            fill: !0,
            fillOpacity: 1,
            stroke: !1,
            offset: [0, 0],
            angle: !0,
            bounds: [[ - 10, 0], [0, 20]],
            background: !1,
            avoidOverlap: !1,
            detectOverlap: function(t) {
                var e = t._renderer._drawnLayers;
                for (var n in e) if (drawnLayer = e[n], drawnLayer._pxBounds.intersects(t._pxBounds)) return ! 0
            },
            drawn: function(t) {
                t._renderer._drawnLayers[t._leaflet_id] = t
            }
        },
        initialize: function(t, e) {
            L.setOptions(this, e),
            this._latlng = L.latLng(t),
            this._text = this.options.text,
            this._offset = L.point(this.options.offset),
            this._bounds = L.bounds(this.options.bounds),
            this._hightLight = this.options.highlight
        },
        setLatLng: function(t) {
            return this._latlng = L.latLng(t),
            this.redraw(),
            this.fire("move", {
                latlng: this._latlng
            })
        },
        getLatLng: function() {
            return this._latlng
        },
        setText: function(t) {
            return this.options.text = this._text = t,
            this.redraw()
        },
        getText: function() {
            return this._text
        },
        setStyle: function(t) {
            var e = t && t.text || this._text;
            return L.Path.prototype.setStyle.call(this, t),
            this.setText(e),
            this
        },
        _project: function() {
            this._point = this._map.latLngToLayerPoint(this._latlng),
            this._point._add(this._offset),
            this._updateBounds()
        },
        _updateBounds: function() {
            var t = this._clickTolerance(),
            e = [t, t];
            this._pxBounds = new L.Bounds(this._point.add(this._bounds.min).subtract(e), this._point.add(this._bounds.max).add(e))
        },
        _update: function() {
            this._map && this._updatePath()
        },
        _updatePath: function() {
            if (this._renderer._drawing && !this._empty()) {
                var t = this._point,
                e = this._text,
                n = this.options,
                r = this._renderer._ctx;
                if (r.font = n.font, r.textAlign = n.textAlign, r.textBaseline = n.textBaseline, n.background) {
                    var o = n.background;
                    switch (r.globalAlpha = o.opacity, r.fillStyle = o.color, r.translate(t.x, t.y), o.shape) {
                    case "rect":
                        var i = (s = L.bounds(o.bounds || n.bounds)).getTopLeft(),
                        a = s.getSize();
                        r.fillRect(i.x, i.y, a.x, a.y);
                        break;
                    case "roundRect":
                        var s;
                        i = (s = L.bounds(o.bounds || n.bounds)).getTopLeft(),
                        a = s.getSize();
                        r.roundRect(i.x, i.y, a.x, a.y, o.radius || 4),
                        r.fill();
                        break;
                    case "circle":
                    default:
                        r.beginPath(),
                        r.arc(0, 0, o.radius || 15, 0, 2 * Math.PI),
                        r.closePath(),
                        r.fill()
                    }
                    r.translate( - t.x, -t.y)
                }
                n.stroke && 0 !== n.weight && (r.globalAlpha = n.opacity, r.lineWidth = n.weight, r.strokeStyle = n.color, r.strokeText(e, t.x, t.y)),
                !1 !== n.fill && (r.globalAlpha = n.fillOpacity, r.fillStyle = n.fillColor || n.color, r.fillText(e, t.x, t.y)),
                n.angle && r.restore(),
                n.avoidOverlap && n.drawn(this)
            }
        },
        _empty: function() {
            return ! this._renderer._bounds.intersects(this._pxBounds) || this.options.avoidOverlap && this.options.detectOverlap(this)
        },
        _containsPoint: function(t) {
            return t.distanceTo(this._point) <= this._clickTolerance()
        }
    }),
    L.textMarker = function(t, e) {
        return new L.TextMarker(t, e)
    },
    L.Canvas.include({
        _removePath: function(t) {
            var e = t._order,
            n = e.next,
            r = e.prev;
            n ? n.prev = r: this._drawLast = r,
            r ? r.next = n: this._drawFirst = n,
            delete t._order,
            delete this._layers[L.stamp(t)],
            delete this._drawnLayers[L.stamp(t)],
            this._requestRedraw(t)
        }
    }),
    CanvasRenderingContext2D.prototype.roundRect = function(t, e, n, r, o) {
        var i = Math.min(n, r);
        return o > i / 2 && (o = i / 2),
        this.beginPath(),
        this.moveTo(t + o, e),
        this.arcTo(t + n, e, t + n, e + r, o),
        this.arcTo(t + n, e + r, t, e + r, o),
        this.arcTo(t, e + r, t, e, o),
        this.arcTo(t, e, t + n, e, o),
        this.closePath(),
        this
    }
},
function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var r = L.GeoJSON.extend({
        options: {
            bounds: [[ - 15, -6], [15, 6]],
            minZoom: 10,
            font: "10px sans-serif",
            visible: function(t) {
                return ! 0
            },
            filter: function(t) {
                return null != t.properties.val && this.options.visible(t)
            },
            pointToLayer: function(t, e) {
                return L.textMarker(e, {
                    text: t.properties.val,
                    font: this.options.font,
                    textAlign: "center",
                    textBaseline: "middle",
                    bounds: this.options.bounds,
                    renderer: this._renderer,
                    color: this._getColor(t),
                    background: this._getBackGround(t)
                })
            }
        },
        initialize: function(t) {
            L.GeoJSON.prototype.initialize.call(this, null, t),
            this.options.pointToLayer = L.bind(this.options.pointToLayer, this),
            this.options.filter = L.bind(this.options.filter, this),
            this._renderer = L.canvas()
        },
        onRemove: function() {
            L.GeoJSON.prototype.onRemove.call(this, this._map),
            L.Util.requestAnimFrame(this._renderer.remove, this._renderer)
        },
        setVisible: function(t) {
            this.options.visible = t,
            this._data && (this.clearLayers(), this.setData(this._data))
        },
        _getColor: function(t) {
            return this._glLayer._color.colorInvert(t.properties.val, 1)
        },
        _getBackGround: function(t) {
            return {
                color: this._glLayer._color.color(t.properties.val, 1),
                shape: "roundRect"
            }
        },
        bindGlLayer: function(t) {
            this._glLayer && this._glLayer.off("updated", this.__setData, this),
            this._glLayer = t,
            t.on("updated", this.__setData, this)
        },
        __setData: function() {
            var t = this._renderer._container;
            if (t) {
                var e = this._glLayer._container;
                t.parentNode.insertBefore(e, t)
            }
            if (this.clearLayers(), this._glLayer._map.getZoom() >= this.options.minZoom) {
                var n = [this.options.bounds[1][0] - this.options.bounds[0][0]];
                this.setData(this._glLayer.getGrid(1.2 * n))
            }
        },
        setData: function(t) {
            this._data = t,
            this.addData(t)
        }
    });
    e.
default = r
},
function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    e.Mercator = {
        point2latlng: function(t, e) {
            var n = this.getR(e);
            return L.latLng(360 * Math.atan(Math.pow(Math.E, t.y / n)) / Math.PI - 90, t.x / e)
        },
        latlng2point: function(t, e) {
            var n = this.getR(e);
            return L.point(t.lng * e, n * Math.log(Math.tan(Math.PI / 4 + t.lat * Math.PI / 360)))
        },
        getR: function(t) {
            return 180 / Math.PI * t
        }
    }
},
function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    e.shaders = {
        fs: "precision mediump float;\n\nconst float R = 6378137.0;\nconst float PI = 3.141592653589793;\nconst vec4 trans3857 = vec4(2.495320233665337e-8, 0.5, -2.495320233665337e-8, 0.5);\nconst vec4 trans4326 = vec4( 0.005555555555555556, 1, -0.005555555555555556, 0.5);\n\nuniform vec4 uLngLatBounds;//等经纬度的tex的经纬度范围[西,南,东,北]\nuniform float uRes; //等经纬度的tex的分辨率\nuniform sampler2D sLngLatTex; //等经纬度的tex\n\nuniform sampler2D sPltTex;//调色板\nuniform vec3 uPltMinMax; //x min ,y max, z (max-min)\n\nuniform int uEPSG;\nuniform float uZoom;//地图当前放缩级别\nuniform vec4 uBounds;//视窗地图像素范围 [左上右下]\nvarying vec2 vPos;//(0,0)~(1,1)\n\nfloat scale(float zoom){\n    return 256.0 * pow(2.0, zoom);\n}\nvec2 untransform(vec2 point,float scale,vec4 trans){\n    return (point/scale - trans.yw )/ trans.xz;\n}\nvec2 LonLat_unproject(vec2 point) {\n    return point.yx;\n}\nvec2 SphericalMercator_unproject(vec2 point) {\n    float d = 180.0 / PI;\n    vec2 latLng = vec2((2.0 * atan(exp(point.y / R)) - (PI / 2.0)) * d, point.x * d / R);\n    return latLng;\n}\nvec2 pointToLatLng(vec2 point, float zoom) {\n    float scl = scale(zoom);\n    if(uEPSG==3857){\n        vec2 untransformedPoint = untransform(point, scl,trans3857);\n        return SphericalMercator_unproject(untransformedPoint);\n    }else{\n        vec2 untransformedPoint = untransform(point, scl,trans4326);\n        return LonLat_unproject(untransformedPoint);\n    }\n}\n\nvec2 getPxLngLat(){\n    vec2 point = vPos*(uBounds.zw-uBounds.xy)*vec2(1,-1)+uBounds.xw;\n    vec2 latLng = pointToLatLng(point,uZoom);\n    return latLng.yx;\n}\n\nfloat b2f(float m0, float m1, float m2, float m3);\nfloat b2f(vec4 b){\n    return b2f(b.x,b.y,b.z,b.w);\n}\nvec4 getColor(vec4 rawVal){\n    float val = b2f(rawVal*255.0);\n    if(val>9998.)\n        return vec4(0,0,0,0);\n    return texture2D(sPltTex,vec2((val-uPltMinMax.x)/uPltMinMax.z,0.5));\n}\nvoid main() {\n    vec2 size = uLngLatBounds.zw-uLngLatBounds.xy;//等经纬tex的经纬度大小，deg\n    vec2 pxLngLat = getPxLngLat();\n    vec2 offset = (pxLngLat - uLngLatBounds.xy); //vPx的偏移量，deg\n    if(offset.x<0.||offset.y<0.||offset.x>size.x||offset.y>size.y)\n        gl_FragColor = vec4(0,0,0,0);\n    else{\n        vec4 rawVal = texture2D(sLngLatTex,offset/size);\n        gl_FragColor = getColor(rawVal);\n    }\n}\n\n\n//参考 http://blog.csdn.net/xinyu391/article/details/76708574\nfloat b2f(float m0, float m1, float m2, float m3){\n    // 求符号位\n    float sig = 1.;\n    if (m0 >=128.)\n        sig = -1.;\n\n//求阶码\n    float jie = 0.;\n     if (m0 >=128.)\n    {\n        jie = m0-128.  ;\n    }\n    else\n    {\n        jie = m0;\n    }\n    jie = jie * 2.;\n    if (m1 >=128.)\n        jie += 1.;\n    jie -= 127.;\n\n//求尾码\n\n    float tail = 0.;\n    if (m1 >=128.)\n        m1 -= 128.;\n    tail =  m3 + (m2 + m1 * 256.) * 256.;\n    tail  = (tail)/8388608.;   //   8388608 = 2^23\n\n    float f = sig * pow(2., jie) * (1.+tail);\n\n    return f;\n}",
        fsi16: "precision mediump float;\n\nconst float R = 6378137.0;\nconst float PI = 3.141592653589793;\nconst vec4 trans3857 = vec4(2.495320233665337e-8, 0.5, -2.495320233665337e-8, 0.5);\nconst vec4 trans4326 = vec4( 0.005555555555555556, 1, -0.005555555555555556, 0.5);\n\nuniform vec4 uLngLatBounds;//等经纬度的tex的经纬度范围[西,南,东,北]\nuniform float uRes; //等经纬度的tex的分辨率\nuniform sampler2D sLngLatTex; //等经纬度的tex\n\nuniform sampler2D sPltTex;//调色板\nuniform vec3 uPltMinMax; //x min ,y max, z (max-min)\n\nuniform int uEPSG;\nuniform float uZoom;//地图当前放缩级别\nuniform vec4 uBounds;//视窗地图像素范围 [左上右下]\nvarying vec2 vPos;//(0,0)~(1,1)\n\nfloat scale(float zoom){\n    return 256.0 * pow(2.0, zoom);\n}\nvec2 untransform(vec2 point,float scale,vec4 trans){\n    return (point/scale - trans.yw )/ trans.xz;\n}\nvec2 LonLat_unproject(vec2 point) {\n    return point.yx;\n}\nvec2 SphericalMercator_unproject(vec2 point) {\n    float d = 180.0 / PI;\n    vec2 latLng = vec2((2.0 * atan(exp(point.y / R)) - (PI / 2.0)) * d, point.x * d / R);\n    return latLng;\n}\nvec2 pointToLatLng(vec2 point, float zoom) {\n    float scl = scale(zoom);\n    if(uEPSG==3857){\n        vec2 untransformedPoint = untransform(point, scl,trans3857);\n        return SphericalMercator_unproject(untransformedPoint);\n    }else{\n        vec2 untransformedPoint = untransform(point, scl,trans4326);\n        return LonLat_unproject(untransformedPoint);\n    }\n}\n\nvec2 getPxLngLat(){\n    vec2 point = vPos*(uBounds.zw-uBounds.xy)*vec2(1,-1)+uBounds.xw;\n    vec2 latLng = pointToLatLng(point,uZoom);\n    return latLng.yx;\n}\n\nfloat b2f(float m0, float m1, float m2, float m3);\nfloat b2f(vec4 b){\n    return b2f(b.z,b.w,b.x,b.y);//小端\n}\nfloat getVal(vec2 p){\n    vec4 rawVal = texture2D(sLngLatTex,p);\n    return b2f(rawVal*15.);\n}\nvec4 getColor(float f){\n    //无效值设置为最大值32767\n    if(f>32766.)\n        return vec4(0,0,0,0);\n    float val = f/10.;\n    return texture2D(sPltTex,vec2((val-uPltMinMax.x)/uPltMinMax.z,0.5));\n}\nfloat biInterp(float v00,float v01,float v10,float v11,vec2 r){\n    return mix(mix(v00,v01,r.x),mix(v10,v11,r.x),r.y);\n}\nvoid main() {\n    vec2 size = uLngLatBounds.zw-uLngLatBounds.xy;//等经纬tex的经纬度大小，deg\n    vec2 pxLngLat = getPxLngLat();\n    vec2 offset = (pxLngLat - uLngLatBounds.xy); //vPx的偏移量，deg\n    if(offset.x<0.||offset.y<0.||offset.x>size.x||offset.y>size.y)\n        gl_FragColor = vec4(0,0,0,0);\n    else{\n        vec2 r = fract(offset/vec2(uRes,uRes)); //Position ratio\n        vec2 p00 = offset + vec2(-r.x*uRes,-r.y*uRes);\n        vec2 p01 = offset + vec2((1.-r.x)*uRes,-r.y*uRes);\n        vec2 p10 = offset + vec2(-r.x*uRes,(1.-r.y)*uRes);\n        vec2 p11 = offset + vec2((1.-r.x)*uRes,(1.-r.y)*uRes);\n        float v = biInterp(\n            getVal(p00/size),\n            getVal(p01/size),\n            getVal(p10/size),\n            getVal(p11/size),\n            r\n        );\n        //vec4 rawVal = texture2D(sLngLatTex,offset/size);\n        gl_FragColor = getColor(v);\n    }\n}\n\n\n//参考 uint4 转 int16\nfloat b2f(float m0, float m1, float m2, float m3){\n    //补码\n    float com = m0*16.*16.*16.+m1*16.*16.+m2*16.+m3;\n    if(com<32768.)//2^15\n        return com;\n    else{//补码的补码是原码\n        //-1 * (32767-(com-32768) + 1)\n        return com - 65536.0;\n    }\n}",
        fsi16hermite: "precision mediump float;\n\nconst float R = 6378137.0;\nconst float PI = 3.141592653589793;\nconst vec4 trans3857 = vec4(2.495320233665337e-8, 0.5, -2.495320233665337e-8, 0.5);\nconst vec4 trans4326 = vec4( 0.005555555555555556, 1, -0.005555555555555556, 0.5);\n\nuniform vec4 uLngLatBounds;//等经纬度的tex的经纬度范围[西,南,东,北]\nuniform float uRes; //等经纬度的tex的分辨率\nuniform sampler2D sLngLatTex; //等经纬度的tex\n\nuniform sampler2D sPltTex;//调色板\nuniform vec3 uPltMinMax; //x min ,y max, z (max-min)\n\nuniform int uEPSG;\nuniform float uZoom;//地图当前放缩级别\nuniform vec4 uBounds;//视窗地图像素范围 [左上右下]\nvarying vec2 vPos;//(0,0)~(1,1)\n\nfloat scale(float zoom){\n    return 256.0 * pow(2.0, zoom);\n}\nvec2 untransform(vec2 point,float scale,vec4 trans){\n    return (point/scale - trans.yw )/ trans.xz;\n}\nvec2 LonLat_unproject(vec2 point) {\n    return point.yx;\n}\nfloat wrapNum(float x){\n    return mod(mod(x,360.0)+360.0,360.0);\n    //float min = 0.,d = 360.;\n    //return ((x - min) % d + d) % d + min;\n}\nvec2 SphericalMercator_unproject(vec2 point) {\n    float d = 180.0 / PI;\n    vec2 latLng = vec2((2.0 * atan(exp(point.y / R)) - (PI / 2.0)) * d, point.x * d / R);\n    latLng.y = wrapNum(latLng.y);\n    return latLng;\n}\nvec2 pointToLatLng(vec2 point, float zoom) {\n    float scl = scale(zoom);\n    if(uEPSG==3857){\n        vec2 untransformedPoint = untransform(point, scl,trans3857);\n        return SphericalMercator_unproject(untransformedPoint);\n    }else{\n        vec2 untransformedPoint = untransform(point, scl,trans4326);\n        return LonLat_unproject(untransformedPoint);\n    }\n}\n\nvec2 getPxLngLat(){\n    vec2 point = vPos*(uBounds.zw-uBounds.xy)*vec2(1,-1)+uBounds.xw;\n    vec2 latLng = pointToLatLng(point,uZoom);\n    return latLng.yx;\n}\n\nfloat b2f(float m0, float m1, float m2, float m3);\nfloat b2f(vec4 b){\n    return b2f(b.z,b.w,b.x,b.y);//小端\n}\nfloat getVal(vec2 p){\n    vec4 rawVal = texture2D(sLngLatTex,p);\n    return b2f(rawVal*15.);\n}\nvec4 getColor(float f){\n    //无效值设置为最大值32767\n    if(f>32766.)\n        return vec4(0,0,0,0);\n    float val = f/10.;\n    return texture2D(sPltTex,vec2((val-uPltMinMax.x)/uPltMinMax.z,0.5));\n}\nfloat cubicHermite(float A, float B, float C, float D, float t) {\n    if(A>32766.||B>32766.||C>32766.||D>32766.)\n        return 32767.;\n    float a = -A * 0.5 + (3.0*B) * 0.5 - (3.0*C) * 0.5 + D * 0.5;\n    float b = A - (5.0*B) * 0.5 + 2.0 * C - D * 0.5;\n    float c = -A * 0.5 + C * 0.5;\n    float d = B;\n    return a*t*t*t + b*t*t + c*t + d;\n}\nvoid main() {\n    vec2 size = uLngLatBounds.zw-uLngLatBounds.xy;//等经纬tex的经纬度大小，deg\n    vec2 pxLngLat = getPxLngLat();\n    vec2 offset = (pxLngLat - uLngLatBounds.xy); //vPx的偏移量，deg\n    if(offset.x<0.||offset.y<0.||offset.x>size.x||offset.y>size.y)\n        gl_FragColor = vec4(0,0,0,0);\n    else{\n        vec2 r = fract(offset/vec2(uRes,uRes)); //Position ratio\n\n        vec2 p11 = offset + vec2(-r.x*uRes,-r.y*uRes);\n        vec2 p12 = offset + vec2((1.-r.x)*uRes,-r.y*uRes);\n        vec2 p10 = p11 - vec2(uRes,0);\n        vec2 p13 = p12 + vec2(uRes,0);\n        vec2 p21 = offset + vec2(-r.x*uRes,(1.-r.y)*uRes);\n        vec2 p22 = offset + vec2((1.-r.x)*uRes,(1.-r.y)*uRes);\n        vec2 p20 = p21 - vec2(uRes,0);\n        vec2 p23 = p22 + vec2(uRes,0);\n        vec2 p00 = p10 - vec2(0,uRes);\n        vec2 p01 = p11 - vec2(0,uRes);\n        vec2 p02 = p12 - vec2(0,uRes);\n        vec2 p03 = p13 - vec2(0,uRes);\n        vec2 p30 = p20 + vec2(0,uRes);\n        vec2 p31 = p21 + vec2(0,uRes);\n        vec2 p32 = p22 + vec2(0,uRes);\n        vec2 p33 = p23 + vec2(0,uRes);\n        float v = cubicHermite(\n            cubicHermite(getVal(p00/size),getVal(p01/size),getVal(p02/size),getVal(p03/size),r.x),\n            cubicHermite(getVal(p10/size),getVal(p11/size),getVal(p12/size),getVal(p13/size),r.x),\n            cubicHermite(getVal(p20/size),getVal(p21/size),getVal(p22/size),getVal(p23/size),r.x),\n            cubicHermite(getVal(p30/size),getVal(p31/size),getVal(p32/size),getVal(p33/size),r.x),\n            r.y\n        );\n        //vec4 rawVal = texture2D(sLngLatTex,offset/size);\n        gl_FragColor = getColor(v);\n    }\n}\n\n\n//参考 uint4 转 int16\nfloat b2f(float m0, float m1, float m2, float m3){\n    //补码\n    float com = m0*16.*16.*16.+m1*16.*16.+m2*16.+m3;\n    if(com<32768.)//2^15\n        return com;\n    else{//补码的补码是原码\n        //-1 * (32767-(com-32768) + 1)\n        return com - 65536.0;\n    }\n}",
        "fsi16hermite.xOy": "precision mediump float;\n\nconst float PI = 3.141592653589793;\nuniform vec4 uLngLatBounds;//等经纬度的tex的经纬度范围[西,南,东,北]\nuniform float uRes; //等经纬度的tex的分辨率\nuniform sampler2D sLngLatTex; //等经纬度的tex\nuniform vec2 uScale;\n\nuniform sampler2D sPltTex;//调色板\nuniform vec3 uPltMinMax; //x min ,y max, z (max-min)\n\nuniform int uEPSG;\nuniform float uPpd; //视窗分辨率（经度） pixel per degree\nuniform vec4 uBounds;//视窗地图xOy像素范围 [左下右上]\nvarying vec2 vPos;//(0,0)~(1,1)\n\nvec2 pointToLngLat(vec2 point, float ppd) {\n    if(uEPSG==3857){\n        float R = 180.0/PI * ppd;\n        return vec2(point.x/ppd , atan(exp(point.y / R)) * 360.0/PI - 90.0 );\n    }else{\n        return point/ppd;\n    }\n}\n\nvec2 getPxLngLat(){\n    vec2 point = vPos*(uBounds.zw-uBounds.xy)+uBounds.xy;\n    vec2 lngLat = pointToLngLat(point,uPpd);\n    return lngLat;\n}\n\nfloat b2f(float m0, float m1, float m2, float m3);\nfloat b2f(vec4 b){\n    return b2f(b.z,b.w,b.x,b.y);//小端\n}\nfloat getVal(vec2 p){\n    vec4 rawVal = texture2D(sLngLatTex,p*uScale);\n    return b2f(rawVal*15.);\n}\nvec4 getColor(float f){\n    //无效值设置为最大值32767\n    if(f>32766.)\n        return vec4(0,0,0,0);\n    float val = f/10.;\n    return texture2D(sPltTex,vec2((val-uPltMinMax.x)/uPltMinMax.z,0.5));\n}\nfloat cubicHermite(float A, float B, float C, float D, float t) {\n    if(A>32766.||B>32766.||C>32766.||D>32766.)\n        return 32767.;\n    float a = -A * 0.5 + (3.0*B) * 0.5 - (3.0*C) * 0.5 + D * 0.5;\n    float b = A - (5.0*B) * 0.5 + 2.0 * C - D * 0.5;\n    float c = -A * 0.5 + C * 0.5;\n    float d = B;\n    return a*t*t*t + b*t*t + c*t + d;\n}\nvoid main() {\n    vec2 size = uLngLatBounds.zw-uLngLatBounds.xy;//等经纬tex的有效区经纬度大小，deg\n    vec2 pxLngLat = getPxLngLat();\n    vec2 offset = (pxLngLat - uLngLatBounds.xy); //vPx的偏移量，deg\n    if(offset.x<0.||offset.y<0.||offset.x>size.x||offset.y>size.y)\n        gl_FragColor = vec4(0,0,0,0);\n    else{\n        vec2 r = fract(offset/vec2(uRes,uRes)); //Position ratio\n\n        vec2 p11 = offset + vec2(-r.x*uRes,-r.y*uRes);\n        vec2 p12 = offset + vec2((1.-r.x)*uRes,-r.y*uRes);\n        vec2 p10 = p11 - vec2(uRes,0);\n        vec2 p13 = p12 + vec2(uRes,0);\n        vec2 p21 = offset + vec2(-r.x*uRes,(1.-r.y)*uRes);\n        vec2 p22 = offset + vec2((1.-r.x)*uRes,(1.-r.y)*uRes);\n        vec2 p20 = p21 - vec2(uRes,0);\n        vec2 p23 = p22 + vec2(uRes,0);\n        vec2 p00 = p10 - vec2(0,uRes);\n        vec2 p01 = p11 - vec2(0,uRes);\n        vec2 p02 = p12 - vec2(0,uRes);\n        vec2 p03 = p13 - vec2(0,uRes);\n        vec2 p30 = p20 + vec2(0,uRes);\n        vec2 p31 = p21 + vec2(0,uRes);\n        vec2 p32 = p22 + vec2(0,uRes);\n        vec2 p33 = p23 + vec2(0,uRes);\n        float v = cubicHermite(\n            cubicHermite(getVal(p00/size),getVal(p01/size),getVal(p02/size),getVal(p03/size),r.x),\n            cubicHermite(getVal(p10/size),getVal(p11/size),getVal(p12/size),getVal(p13/size),r.x),\n            cubicHermite(getVal(p20/size),getVal(p21/size),getVal(p22/size),getVal(p23/size),r.x),\n            cubicHermite(getVal(p30/size),getVal(p31/size),getVal(p32/size),getVal(p33/size),r.x),\n            r.y\n        );\n        //vec4 rawVal = texture2D(sLngLatTex,offset/size);\n        gl_FragColor = getColor(v);\n    }\n}\n\n\n//参考 uint4 转 int16\nfloat b2f(float m0, float m1, float m2, float m3){\n    //补码\n    float com = m0*16.*16.*16.+m1*16.*16.+m2*16.+m3;\n    if(com<32768.)//2^15\n        return com;\n    else{//补码的补码是原码\n        //-1 * (32767-(com-32768) + 1)\n        return com - 65536.0;\n    }\n}",
        vs: "attribute vec2 aPos;\nvarying vec2 vPos;\nvoid main() {\n    gl_Position = vec4(aPos,0.0,1.0);\n    vPos = aPos * 0.5 + 0.5;\n}\n"
    }
},
function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }),
    L.LatLng.prototype.offset = function(t) {
        return L.latLng(this.lat - t.lat, this.lng - t.lng)
    },
    L.LatLng.div = function(t, e) {
        return L.point(t.lng / e, t.lat / e)
    };
    e.Tile = {
        tileKeys: function(t, e) {
            var n = 360 / Math.pow(2, e),
            r = L.latLng( - 90, -180);
            return L.bounds(L.LatLng.div(t.getSouthWest().offset(r), n).floor(), L.LatLng.div(t.getNorthEast().offset(r), n).floor())
        }
    }
},
function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var r = function() {
        this.reset()
    };
    r.getNextPowerOf2Size = function(t) {
        return 1 << Math.floor(Math.log(t + t - 1) / Math.LN2)
    },
    r.prototype = {
        reset: function() {
            this.canvas = null,
            this.gl = null,
            this.shaders = [],
            this.programs = [],
            this.framebuffers = [],
            this.buffers = [],
            this.textures = []
        },
        create: function(t, e, n) {
            if (this._id = n || "noname", !this.gl && !this.canvas) return this.canvas = t,
            this.gl = t.getContext("webgl", e) || t.getContext("experimental-webgl", e),
            this.gl
        },
        get: function() {
            return this.gl
        },
        getCanvas: function() {
            return this.canvas
        },
        createShader: function(t, e) {
            var n = this.get(),
            r = n.createShader(t);
            return n.shaderSource(r, e),
            n.compileShader(r),
            n.getShaderParameter(r, n.COMPILE_STATUS) || console.info(n.getShaderInfoLog(r)),
            this.shaders.push(r),
            r
        },
        createProgramObj: function(t, e, n, r) {
            var o = {},
            i = this.get(),
            a = i.createProgram();
            n = n.map(function(t) {
                return "#define " + t + " \n"
            }).join("");
            var s = this.createShader(i.VERTEX_SHADER, n + t),
            l = this.createShader(i.FRAGMENT_SHADER, n + e);
            i.attachShader(a, s),
            i.attachShader(a, l),
            i.linkProgram(a),
            i.getProgramParameter(a, i.LINK_STATUS) || console.info(i.getProgramInfoLog(a)),
            this.programs.push(a),
            a.name = r,
            o.program = a;
            for (var u = i.getProgramParameter(a, i.ACTIVE_ATTRIBUTES), c = 0; c < u; c++) {
                var f = i.getActiveAttrib(a, c);
                o[f.name] = i.getAttribLocation(a, f.name)
            }
            var h = i.getProgramParameter(a, i.ACTIVE_UNIFORMS);
            for (c = 0; c < h; c++) {
                var p = i.getActiveUniform(a, c);
                o[p.name] = i.getUniformLocation(a, p.name)
            }
            return o
        },
        bindAttribute: function(t, e, n, r) {
            var o = this.get();
            return o.bindBuffer(o.ARRAY_BUFFER, t),
            o.enableVertexAttribArray(e),
            o.vertexAttribPointer(e, n, r, !1, 0, 0),
            this
        },
        createTexture2D: function(t, e, n, r, o, i, a, s) {
            var l = this.get().createTexture();
            return this.setTexture2DParams(l, t, e, n),
            this.texImage2D(l, r, o, i, a, s),
            this.textures.push(l),
            l
        },
        setTexture2DParams: function(t, e, n, r) {
            var o = this.get();
            return o.bindTexture(o.TEXTURE_2D, t),
            o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MIN_FILTER, e),
            o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MAG_FILTER, n),
            o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_S, r),
            o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_T, r),
            this
        },
        texImage2D: function(t, e, n, r, o, i) {
            var a = this.get();
            return a.bindTexture(a.TEXTURE_2D, t),
            o = o || a.RGBA,
            null === e || e instanceof Uint8Array ? a.texImage2D(a.TEXTURE_2D, 0, o, n, r, 0, o, a.UNSIGNED_BYTE, e) : "number" == typeof e ? a.texImage2D(a.TEXTURE_2D, 0, o, n, r, 0, o, e, i) : a.texImage2D(a.TEXTURE_2D, 0, o, o, a.UNSIGNED_BYTE, e),
            t._width = n,
            t._height = r,
            this
        },
        texSampler2D: function(t, e, n) {
            var r = this.get();
            return r.activeTexture(r.TEXTURE0 + e),
            r.bindTexture(r.TEXTURE_2D, n),
            r.uniform1i(t, e),
            this
        },
        createBuffer: function(t) {
            return this._createBuffer(t, this.get().ARRAY_BUFFER)
        },
        createIndexBuffer: function(t) {
            return this._createBuffer(t, this.get().ELEMENT_ARRAY_BUFFER)
        },
        _createBuffer: function(t, e) {
            var n = this.get(),
            r = n.createBuffer();
            return n.bindBuffer(e, r),
            n.bufferData(e, t, n.STATIC_DRAW),
            this.buffers.push(r),
            r
        },
        createFramebuffer: function() {
            var t = this.get().createFramebuffer();
            return this.framebuffers.push(t),
            t
        },
        bindFramebuffer: function(t, e) {
            var n = this.get();
            return n.bindFramebuffer(n.FRAMEBUFFER, t),
            e && n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, e, 0),
            this
        },
        release: function() {
            var t = this.get();
            t && (t.flush(), t.finish(), this.shaders.forEach(function(e) {
                return t.isShader(e) && t.deleteShader(e)
            }), this.programs.forEach(function(e) {
                return t.isProgram(e) && t.deleteProgram(e)
            }), this.framebuffers.forEach(function(e) {
                return t.isFramebuffer(e) && t.deleteFramebuffer(e)
            }), this.buffers.forEach(function(e) {
                return t.isBuffer(e) && t.deleteBuffer(e)
            }), this.textures.forEach(function(e) {
                return t.isTexture(e) && t.deleteTexture(e)
            }), this.reset())
        }
    },
    e.
default = r
},
function(t, e, n) {
    "use strict";
    function r(t) {
        this.size = 0,
        this.limit = t,
        this._keymap = {}
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    }),
    e.
default = r,
    r.prototype.put = function(t, e) {
        var n = {
            key: t,
            value: e
        };
        this._keymap[t] = n,
        this.tail ? (this.tail.newer = n, n.older = this.tail) : this.head = n,
        this.tail = n,
        this.size === this.limit ? this.shift() : this.size++
    },
    r.prototype.shift = function() {
        var t = this.head;
        return this.head.newer ? (this.head = this.head.newer, this.head.older = void 0) : this.head = void 0,
        t.newer = t.older = void 0,
        delete this._keymap[t.key],
        t
    },
    r.prototype.get = function(t, e) {
        var n = this._keymap[t];
        if (n) return n === this.tail ? e ? n: n.value: (n.newer && (n == this.head && (this.head = n.newer), n.newer.older = n.older), n.older && (n.older.newer = n.newer), n.newer = void 0, n.older = this.tail, this.tail && (this.tail.newer = n), this.tail = n, e ? n: n.value)
    },
    r.prototype.remove = function(t) {
        var e = this._keymap[t];
        return e && delete this._keymap[e.key],
        e.newer && e.older ? (e.older.newer = e.newer, e.newer.older = e.older) : e.newer ? (e.newer.older = void 0, this.head = e.newer) : e.older ? (e.older.newer = void 0, this.tail = e.older) : this.head = this.tail = void 0,
        this.size--,
        e.value
    }
},
function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var r = u(n(9)),
    o = u(n(8)),
    i = n(2),
    a = n(6),
    s = n(1),
    l = n(5);
    function u(t) {
        return t && t.__esModule ? t: {
        default:
            t
        }
    }
    var c = L.Renderer.extend({
        options: {
            padding: .1,
            ratio: 1
        },
        onAdd: function() {
            L.Renderer.prototype.onAdd.call(this),
            this._updatePaths()
        },
        _initContainer: function() {
            var t = this._container = document.createElement("canvas"),
            e = this.glo = new o.
        default;
            e.create(t, {
                preserveDrawingBuffer: !0
            }),
            this.cache = new r.
        default(50),
            this.prgObj = e.createProgramObj(a.shaders.vs, a.shaders["fsi16hermite.xOy"], [], "tms"),
            this.setColor(s.colors[this.options.color])
        },
        _destroyContainer: function() {
            L.DomUtil.remove(this._container),
            L.DomEvent.off(this._container),
            delete this._container,
            this.glo.release()
        },
        _update: function() {
            if (!this._map._animatingZoom || !this._bounds) {
                L.Renderer.prototype._update.call(this),
                this._latLngBounds = L.latLngBounds(this._map.layerPointToLatLng(this._bounds.min), this._map.layerPointToLatLng(this._bounds.max));
                var t = this._map.options.crs,
                e = this._map.getZoom();
                this._pxBounds = L.bounds(t.latLngToPoint(this._latLngBounds.getSouthWest(), e), t.latLngToPoint(this._latLngBounds.getNorthEast(), e));
                var n = 1 / this._getRes();
                this.xOyBounds = t == L.CRS.EPSG4326 ? L.bounds(L.LatLng.div(this._latLngBounds.getSouthWest(), 1 / n), L.LatLng.div(this._latLngBounds.getNorthEast(), 1 / n)) : L.bounds(l.Mercator.latlng2point(this._latLngBounds.getSouthWest(), n), l.Mercator.latlng2point(this._latLngBounds.getNorthEast(), n)),
                this.fire("update")
            }
        },
        _updatePaths: function() { (0, i.promiseCreateTexture)(this, this._latLngBounds, this._getRes() * this.options.ratio, this.options.meta).then(L.bind(function(t) {
                var e = this._bounds,
                n = this._container,
                r = e.getSize(),
                o = L.Browser.retina ? 2 : 1;
                L.DomUtil.setPosition(n, e.min),
                n.width = o * r.x,
                n.height = o * r.y,
                n.style.width = r.x + "px",
                n.style.height = r.y + "px",
                this.render(t, t.latLngBounds, t.res, t.scale, this.xOyBounds, 1 / this._getRes()),
                this.texRes = t.res,
                this.texZoom = t.zoom,
                this.fire("updated")
            },
            this)).
            catch(function(t) {
                console.info(t)
            })
        },
        _getRes: function() {
            return (this._latLngBounds.getEast() - this._latLngBounds.getWest()) / this._pxBounds.getSize().x
        },
        setMeta: function(t) {
            this.options.meta = t,
            this.fire("update")
        },
        setColor: function(t) {
            this._color = t,
            this._pltTex = this.createGradientTexture(t),
            this.fire("update")
        },
        createGradientTexture: function(t) {
            var e = this.glo,
            n = e.get();
            return t.getColor(),
            e.createTexture2D(n.NEAREST, n.NEAREST, n.CLAMP_TO_EDGE, t.colors, t.steps, 1)
        },
        render: function(t, e, n, r, o, i) {
            var a = this.glo,
            s = a.get(),
            l = this.prgObj,
            u = this._map.options.crs.code.split(":")[1],
            c = o.getSize(),
            f = L.Browser.retina ? 2 : 1;
            c._multiplyBy(f),
            s.viewport(0, 0, c.x, c.y),
            s.clearColor(0, 0, 0, 0),
            s.clear(s.COLOR_BUFFER_BIT),
            s.useProgram(l.program),
            a.bindAttribute(a.createBuffer(new Float32Array([ - 1, -1, 1, -1, 1, 1, -1, 1])), l.aPos, 2, s.FLOAT),
            a.texSampler2D(l.sLngLatTex, 0, t),
            s.uniform4f(l.uLngLatBounds, e.getWest(), e.getSouth(), e.getEast(), e.getNorth()),
            s.uniform1f(l.uRes, n),
            s.uniform2f(l.uScale, r.x, r.y),
            s.uniform1i(l.uEPSG, u),
            s.uniform1f(l.uPpd, i),
            s.uniform4f(l.uBounds, o.min.x, o.min.y, o.max.x, o.max.y);
            var h = this._pltTex,
            p = this._color;
            a.texSampler2D(l.sPltTex, 1, h),
            s.uniform3f(l.uPltMinMax, p.min, p.max, p.max - p.min),
            s.drawArrays(s.TRIANGLE_FAN, 0, 4)
        },
        getVal: function(t) {
            var e = i.Catalog.cell(t, this.options.meta.ele, this.texZoom),
            n = e.tileKey,
            r = e.cell,
            o = e.offset,
            a = e.tileSize,
            s = this._getCell(n, r, a),
            l = this._getCell(n, r.add([1, 0]), a),
            u = this._getCell(n, r.add([1, 1]), a),
            c = this._getCell(n, r.add([0, 1]), a);
            return null != s && null != l && null != u && null != c ? (s * (1 - o.x) + l * o.x) * (1 - o.y) + (c * (1 - o.x) + u * o.x) * o.y: null
        },
        _getCell: function(t, e, n) {
            e.x >= n && (t.x += 1, e.x = e.x % n),
            e.y >= n && (t.y += 1, e.y = e.y % n);
            var r = this.cache.get((0, i.spliceCacheKey)(t.wrap(), this.options.meta));
            if (null == r) return null;
            var o = new DataView(r.bin).getInt16(2 * (e.y * n + e.x));
            return 32767 == o ? null: o / 10
        },
        getGrid: function(t) {
            var e, n = {
                type: "FeatureCollection",
                features: []
            },
            r = i.Catalog.getMeta(this.options.meta.ele).res;
            try {
                e = i.Catalog.getTileSize(r)
            } catch(t) {
                e = 256
            }
            for (var o = L.LatLng.div(this._latLngBounds.getSouthWest().offset(L.latLng( - 90, -180)), this.texRes)._floor(), a = L.LatLng.div(this._latLngBounds.getNorthEast().offset(L.latLng( - 90, -180)), this.texRes)._ceil(), s = this._getRes(), l = this.texRes / s > t ? 1 : Math.ceil(t / (this.texRes / s)), u = o.y; u <= a.y; u += l) for (var c = o.x; c <= a.x; c += l) {
                var f = new i.TileKey(this.texZoom, Math.floor(c / e), Math.floor(u / e)),
                h = L.point(c % e, u % e),
                p = this._getCell(f, h, e),
                d = L.latLng(u * this.texRes - 90, c * this.texRes - 180);
                null != p && n.features.push({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [d.lng, d.lat]
                    },
                    properties: {
                        val: p
                    }
                })
            }
            return n
        }
    });
    e.
default = c
},
function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var r = i(n(10)),
    o = i(n(4));
    function i(t) {
        return t && t.__esModule ? t: {
        default:
            t
        }
    }
    e.
default = L.LayerGroup.extend({
        options: {
            padding: .1,
            ratio: 1,
            marker: {
                bounds: [[ - 15, -6], [15, 6]],
                font: "10px sans-serif",
                minZoom: 10,
                visible: function(t) {
                    return ! 0
                }
            }
        },
        initialize: function(t) {
            L.setOptions(this, t),
            this._markerOptions = t.marker,
            delete t.marker,
            this._glLayerOptions = t,
            this._layers = {
                glLayer: new r.
            default(this._glLayerOptions),
                markerLayer: new o.
            default(this._markerOptions)
            },
            this._layers.markerLayer.bindGlLayer(this._layers.glLayer)
        },
        getVal: function(t) {
            return this._layers.glLayer.getVal(t)
        },
        setColor: function(t) {
            this._layers.glLayer.setColor(t)
        },
        setMeta: function(t) {
            this._layers.glLayer.setMeta(t)
        },
        setMarkerVisibleFn: function(t) {
            this._layers.markerLayer.setVisible(t)
        }
    })
},
function(t, e, n) {
    "use strict";
    var r, o = n(11),
    i = (r = o) && r.__esModule ? r: {
    default:
        r
    },
    a = n(2),
    s = n(1),
    l = n(0);
    n(3),
    function(t) {
        t.BinLayer = i.
    default,
        t.Meta = a.Meta,
        t.Catalog = a.Catalog,
        t.colors = s.colors,
        t.Color = l.Color
    } (window)
}]);