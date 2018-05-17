(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.turf = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

module.exports = {
     helpers: require('@turf/helpers'),
    pointGrid : require('@turf/point-grid'),
    within: require('@turf/within'),
   isobands: require('@turf/isobands'),
};
   
},{"@turf/helpers":2,"@turf/isobands":3,"@turf/point-grid":21,"@turf/within":28}],2:[function(require,module,exports){
/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geometry, properties, bbox, id) {
    if (geometry === undefined) throw new Error('geometry is required');
    if (properties && properties.constructor !== Object) throw new Error('properties must be an Object');

    var feat = {
        type: 'Feature',
        properties: properties || {},
        geometry: geometry
    };
    if (bbox) {
        if (bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');
        feat.bbox = bbox;
    }
    if (id) feat.id = id;
    return feat;
}

/**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<number>} coordinates Coordinates
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = 'Point';
 * var coordinates = [110, 50];
 *
 * var geometry = turf.geometry(type, coordinates);
 *
 * //=geometry
 */
function geometry(type, coordinates, bbox) {
    // Validation
    if (!type) throw new Error('type is required');
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');

    var geom;
    switch (type) {
    case 'Point': geom = point(coordinates).geometry; break;
    case 'LineString': geom = lineString(coordinates).geometry; break;
    case 'Polygon': geom = polygon(coordinates).geometry; break;
    case 'MultiPoint': geom = multiPoint(coordinates).geometry; break;
    case 'MultiLineString': geom = multiLineString(coordinates).geometry; break;
    case 'MultiPolygon': geom = multiPolygon(coordinates).geometry; break;
    default: throw new Error(type + ' is invalid');
    }
    if (bbox) {
        if (bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');
        geom.bbox = bbox;
    }
    return geom;
}

/**
 * Takes coordinates and properties (optional) and returns a new {@link Point} feature.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
function point(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length === undefined) throw new Error('Coordinates must be an array');
    if (coordinates.length < 2) throw new Error('Coordinates must be at least 2 numbers long');
    if (typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') throw new Error('Coordinates must contain numbers');

    return feature({
        type: 'Point',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Takes an array of LinearRings and optionally an {@link Object} with properties and returns a {@link Polygon} feature.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<Polygon>} a Polygon feature
 * @throws {Error} throw an error if a LinearRing of the polygon has too few positions
 * or if a LinearRing of the Polygon does not have matching Positions at the beginning & end.
 * @example
 * var polygon = turf.polygon([[
 *   [-2.275543, 53.464547],
 *   [-2.275543, 53.489271],
 *   [-2.215118, 53.489271],
 *   [-2.215118, 53.464547],
 *   [-2.275543, 53.464547]
 * ]], { name: 'poly1', population: 400});
 *
 * //=polygon
 */
function polygon(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    for (var i = 0; i < coordinates.length; i++) {
        var ring = coordinates[i];
        if (ring.length < 4) {
            throw new Error('Each LinearRing of a Polygon must have 4 or more Positions.');
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error('First and last Position are not equivalent.');
            }
        }
    }

    return feature({
        type: 'Polygon',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link LineString} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<LineString>} a LineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var linestring1 = turf.lineString([
 *   [-21.964416, 64.148203],
 *   [-21.956176, 64.141316],
 *   [-21.93901, 64.135924],
 *   [-21.927337, 64.136673]
 * ]);
 * var linestring2 = turf.lineString([
 *   [-21.929054, 64.127985],
 *   [-21.912918, 64.134726],
 *   [-21.916007, 64.141016],
 *   [-21.930084, 64.14446]
 * ], {name: 'line 1', distance: 145});
 *
 * //=linestring1
 *
 * //=linestring2
 */
function lineString(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length < 2) throw new Error('Coordinates must be an array of two or more positions');

    return feature({
        type: 'LineString',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @returns {FeatureCollection} a FeatureCollection of input features
 * @example
 * var features = [
 *  turf.point([-75.343, 39.984], {name: 'Location A'}),
 *  turf.point([-75.833, 39.284], {name: 'Location B'}),
 *  turf.point([-75.534, 39.123], {name: 'Location C'})
 * ];
 *
 * var collection = turf.featureCollection(features);
 *
 * //=collection
 */
function featureCollection(features, bbox) {
    if (!features) throw new Error('No features passed');
    if (!Array.isArray(features)) throw new Error('features must be an Array');

    var fc = {
        type: 'FeatureCollection',
        features: features
    };
    if (bbox) fc.bbox = bbox;
    return fc;
}

/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
function multiLineString(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiLineString',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
function multiPoint(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiPoint',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
function multiPolygon(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiPolygon',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = {
 *     "type": "Point",
 *       "coordinates": [100, 0]
 *     };
 * var line = {
 *     "type": "LineString",
 *     "coordinates": [ [101, 0], [102, 1] ]
 *   };
 * var collection = turf.geometryCollection([pt, line]);
 *
 * //=collection
 */
function geometryCollection(geometries, properties, bbox, id) {
    if (!geometries) throw new Error('geometries is required');
    if (!Array.isArray(geometries)) throw new Error('geometries must be an Array');

    return feature({
        type: 'GeometryCollection',
        geometries: geometries
    }, properties, bbox, id);
}

// https://en.wikipedia.org/wiki/Great-circle_distance#Radius_for_spherical_Earth
var factors = {
    miles: 3960,
    nauticalmiles: 3441.145,
    degrees: 57.2957795,
    radians: 1,
    inches: 250905600,
    yards: 6969600,
    meters: 6373000,
    metres: 6373000,
    centimeters: 6.373e+8,
    centimetres: 6.373e+8,
    kilometers: 6373,
    kilometres: 6373,
    feet: 20908792.65
};

var areaFactors = {
    kilometers: 0.000001,
    kilometres: 0.000001,
    meters: 1,
    metres: 1,
    centimetres: 10000,
    millimeter: 1000000,
    acres: 0.000247105,
    miles: 3.86e-7,
    yards: 1.195990046,
    feet: 10.763910417,
    inches: 1550.003100006
};
/**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */
function round(num, precision) {
    if (num === undefined || num === null || isNaN(num)) throw new Error('num is required');
    if (precision && !(precision >= 0)) throw new Error('precision must be a positive number');
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(num * multiplier) / multiplier;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToDistance
 * @param {number} radians in radians across the sphere
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} distance
 */
function radiansToDistance(radians, units) {
    if (radians === undefined || radians === null) throw new Error('radians is required');

    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error('units is invalid');
    return radians * factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name distanceToRadians
 * @param {number} distance in real units
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} radians
 */
function distanceToRadians(distance, units) {
    if (distance === undefined || distance === null) throw new Error('distance is required');

    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error('units is invalid');
    return distance / factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name distanceToDegrees
 * @param {number} distance in real units
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} degrees
 */
function distanceToDegrees(distance, units) {
    return radians2degrees(distanceToRadians(distance, units));
}

/**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAngle
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */
function bearingToAngle(bearing) {
    if (bearing === null || bearing === undefined) throw new Error('bearing is required');

    var angle = bearing % 360;
    if (angle < 0) angle += 360;
    return angle;
}

/**
 * Converts an angle in radians to degrees
 *
 * @name radians2degrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
function radians2degrees(radians) {
    if (radians === null || radians === undefined) throw new Error('radians is required');

    var degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
}

/**
 * Converts an angle in degrees to radians
 *
 * @name degrees2radians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
function degrees2radians(degrees) {
    if (degrees === null || degrees === undefined) throw new Error('degrees is required');

    var radians = degrees % 360;
    return radians * Math.PI / 180;
}


/**
 * Converts a distance to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} distance to be converted
 * @param {string} originalUnit of the distance
 * @param {string} [finalUnit=kilometers] returned unit
 * @returns {number} the converted distance
 */
function convertDistance(distance, originalUnit, finalUnit) {
    if (distance === null || distance === undefined) throw new Error('distance is required');
    if (!(distance >= 0)) throw new Error('distance must be a positive number');

    var convertedDistance = radiansToDistance(distanceToRadians(distance, originalUnit), finalUnit || 'kilometers');
    return convertedDistance;
}

/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeter, acre, mile, yard, foot, inch
 * @param {number} area to be converted
 * @param {string} [originalUnit=meters] of the distance
 * @param {string} [finalUnit=kilometers] returned unit
 * @returns {number} the converted distance
 */
function convertArea(area, originalUnit, finalUnit) {
    if (area === null || area === undefined) throw new Error('area is required');
    if (!(area >= 0)) throw new Error('area must be a positive number');

    var startFactor = areaFactors[originalUnit || 'meters'];
    if (!startFactor) throw new Error('invalid original units');

    var finalFactor = areaFactors[finalUnit || 'kilometers'];
    if (!finalFactor) throw new Error('invalid final units');

    return (area / startFactor) * finalFactor;
}

module.exports = {
    feature: feature,
    geometry: geometry,
    featureCollection: featureCollection,
    geometryCollection: geometryCollection,
    point: point,
    multiPoint: multiPoint,
    lineString: lineString,
    multiLineString: multiLineString,
    polygon: polygon,
    multiPolygon: multiPolygon,
    radiansToDistance: radiansToDistance,
    distanceToRadians: distanceToRadians,
    distanceToDegrees: distanceToDegrees,
    radians2degrees: radians2degrees,
    degrees2radians: degrees2radians,
    bearingToAngle: bearingToAngle,
    convertDistance: convertDistance,
    convertArea: convertArea,
    round: round
};

},{}],3:[function(require,module,exports){
var bbox = require('@turf/bbox');
var area = require('@turf/area');
var inside = require('@turf/inside');
var helpers = require('@turf/helpers');
var explode = require('@turf/explode');
var invariant = require('@turf/invariant');
var gridToMatrix = require('grid-to-matrix');
var marchingsquares = require('marchingsquares');
var polygon = helpers.polygon;
var multiPolygon = helpers.multiPolygon;
var collectionOf = invariant.collectionOf;
var featureCollection = helpers.featureCollection;

/**
 * Takes a grid {@link FeatureCollection} of {@link Point} features with z-values and an array of
 * value breaks and generates filled contour isobands.
 *
 * @name isobands
 * @param {FeatureCollection<Point>} pointGrid input points
 * @param {Array<number>} breaks where to draw contours
 * @param {string} [zProperty='elevation'] the property name in `points` from which z-values will be pulled
 * @param {Object} [options={}] options on output
 * @param {Array<Object>} [options.isobandProperties=[]] GeoJSON properties passed, in order, to the correspondent isoband (order defined by breaks)
 * @param {Object} [options.commonProperties={}] GeoJSON properties passed to ALL isobands
 * @returns {FeatureCollection<MultiPolygon>} a FeatureCollection of {@link MultiPolygon} features representing isobands
 * @example
 * // create a grid of points with random z-values in their properties
 * var extent = [-70.823364, -33.553984, -69.823364, -32.553984];
 * var cellWidth = 5;
 * var units = 'miles';
 * var pointGrid = turf.pointGrid(extent, cellWidth, units);
 * for (var i = 0; i < pointGrid.features.length; i++) {
 *     pointGrid.features[i].properties.elevation = Math.random() * 10;
 * }
 * var breaks = [0, 5, 8.5];
 *
 * var isobands = turf.isobands(pointGrid, breaks);
 *
 * //addToMap
 * var addToMap = [isobands];
 */
module.exports = function (pointGrid, breaks, zProperty, options) {
    // Input validation
    var isObject = function (input) {
        return (!!input) && (input.constructor === Object);
    };
    collectionOf(pointGrid, 'Point', 'Input must contain Points');
    if (!breaks || !Array.isArray(breaks)) throw new Error('breaks is required');
    options = options || {};
    if (options.commonProperties && !isObject(options.commonProperties)) {
        throw new Error('commonProperties is not an Object');
    }
    if (options.isobandProperties && !Array.isArray(options.isobandProperties)) {
        throw new Error('isobandProperties is not an Array');
    }
    if (zProperty && typeof zProperty !== 'string') { throw new Error('zProperty is not a string'); }

    zProperty = zProperty || 'elevation';
    var commonProperties = options.commonProperties || {};
    var isobandProperties = options.isobandProperties || [];

    // Isoband methods
    var matrix = gridToMatrix(pointGrid, zProperty, true);
    var contours = createContourLines(matrix, breaks, zProperty);
    contours = rescaleContours(contours, matrix, pointGrid);

    var multipolygons = contours.map(function (contour, index) {
        if (isobandProperties[index] && !isObject(isobandProperties[index])) {
            throw new Error('Each mappedProperty is required to be an Object');
        }
        // collect all properties
        var contourProperties = Object.assign(
            {},
            commonProperties,
            isobandProperties[index]
        );
        contourProperties[zProperty] = contour[zProperty];
        var multiP = multiPolygon(contour.groupedRings, contourProperties);
        return multiP;
    });

    return featureCollection(multipolygons);
};

/**
 * Creates the contours lines (featuresCollection of polygon features) from the 2D data grid
 *
 * Marchingsquares process the grid data as a 3D representation of a function on a 2D plane, therefore it
 * assumes the points (x-y coordinates) are one 'unit' distance. The result of the IsoBands function needs to be
 * rescaled, with turfjs, to the original area and proportions on the map
 *
 * @private
 * @param {Array<Array<number>>} matrix Grid Data
 * @param {Array<number>} breaks Breaks
 * @param {string} [property='elevation'] Property
 * @returns {Array<any>} contours
 */
function createContourLines(matrix, breaks, property) {

    var contours = [];
    for (var i = 1; i < breaks.length; i++) {
        var lowerBand = +breaks[i - 1]; // make sure the breaks value is a number
        var upperBand = +breaks[i];

        var isobandsCoords = marchingsquares.isoBands(matrix, lowerBand, upperBand - lowerBand);
        // as per GeoJson rules for creating a Polygon, make sure the first element
        // in the array of LinearRings represents the exterior ring (i.e. biggest area),
        // and any subsequent elements represent interior rings (i.e. smaller area);
        // this avoids rendering issues of the MultiPolygons on the map
        var nestedRings = orderByArea(isobandsCoords);
        var groupedRings = groupNestedRings(nestedRings);
        var obj = {};
        obj['groupedRings'] = groupedRings;
        obj[property] = lowerBand + '-' + upperBand;
        contours.push(obj);
    }
    return contours;
}

/**
 * Transform isobands of 2D grid to polygons for the map
 *
 * @private
 * @param {Array<any>} contours Contours
 * @param {Array<Array<number>>} matrix Grid Data
 * @param {Object} points Points by Latitude
 * @returns {Array<any>} contours
 */
function rescaleContours(contours, matrix, points) {

    // get dimensions (on the map) of the original grid
    var gridBbox = bbox(points); // [ minX, minY, maxX, maxY ]
    var originalWidth = gridBbox[2] - gridBbox[0];
    var originalHeigth = gridBbox[3] - gridBbox[1];

    // get origin, which is the first point of the last row on the rectangular data on the map
    var x0 = gridBbox[0];
    var y0 = gridBbox[1];
    // get number of cells per side
    var matrixWidth = matrix[0].length - 1;
    var matrixHeight = matrix.length - 1;
    // calculate the scaling factor between matrix and rectangular grid on the map
    var scaleX = originalWidth / matrixWidth;
    var scaleY = originalHeigth / matrixHeight;

    var resize = function (point) {
        point[0] = point[0] * scaleX + x0;
        point[1] = point[1] * scaleY + y0;
    };

    // resize and shift each point/line of the isobands
    contours.forEach(function (contour) {
        contour.groupedRings.forEach(function (lineRingSet) {
            lineRingSet.forEach(function (lineRing) {
                lineRing.forEach(resize);
            });
        });
    });
    return contours;
}


/*  utility functions */


/**
 * Returns an array of coordinates (of LinearRings) in descending order by area
 *
 * @private
 * @param {Array<LineString>} ringsCoords array of closed LineString
 * @returns {Array} array of the input LineString ordered by area
 */
function orderByArea(ringsCoords) {
    var ringsWithArea = [];
    var areas = [];
    ringsCoords.forEach(function (coords) {
        // var poly = polygon([points]);
        var ringArea = area(polygon([coords]));
        // create an array of areas value
        areas.push(ringArea);
        // associate each lineRing with its area
        ringsWithArea.push({ring: coords, area: ringArea});
    });
    areas.sort(function (a, b) { // bigger --> smaller
        return b - a;
    });
    // create a new array of linearRings coordinates ordered by their area
    var orderedByArea = [];
    areas.forEach(function (area) {
        for (var lr = 0; lr < ringsWithArea.length; lr++) {
            if (ringsWithArea[lr].area === area) {
                orderedByArea.push(ringsWithArea[lr].ring);
                ringsWithArea.splice(lr, 1);
                break;
            }
        }
    });
    return orderedByArea;
}

/**
 * Returns an array of arrays of coordinates, each representing
 * a set of (coordinates of) nested LinearRings,
 * i.e. the first ring contains all the others
 *
 * @private
 * @param {Array} orderedLinearRings array of coordinates (of LinearRings) in descending order by area
 * @returns {Array<Array>} Array of coordinates of nested LinearRings
 */
function groupNestedRings(orderedLinearRings) {
    // create a list of the (coordinates of) LinearRings
    var lrList = orderedLinearRings.map(function (lr) {
        return {lrCoordinates: lr, grouped: false};
    });
    var groupedLinearRingsCoords = [];
    while (!allGrouped(lrList)) {
        for (var i = 0; i < lrList.length; i++) {
            if (!lrList[i].grouped) {
                // create new group starting with the larger not already grouped ring
                var group = [];
                group.push(lrList[i].lrCoordinates);
                lrList[i].grouped = true;
                var outerMostPoly = polygon([lrList[i].lrCoordinates]);
                // group all the rings contained by the outermost ring
                for (var j = i + 1; j < lrList.length; j++) {
                    if (!lrList[j].grouped) {
                        var lrPoly = polygon([lrList[j].lrCoordinates]);
                        if (isInside(lrPoly, outerMostPoly)) {
                            group.push(lrList[j].lrCoordinates);
                            lrList[j].grouped = true;
                        }
                    }
                }
                // insert the new group
                groupedLinearRingsCoords.push(group);
            }
        }
    }
    return groupedLinearRingsCoords;
}

/**
 * @private
 * @param {Polygon} testPolygon polygon of interest
 * @param {Polygon} targetPolygon polygon you want to compare with
 * @returns {boolean} true if test-Polygon is inside target-Polygon
 */
function isInside(testPolygon, targetPolygon) {
    var points = explode(testPolygon);
    for (var i = 0; i < points.features.length; i++) {
        if (!inside(points.features[i], targetPolygon)) {
            return false;
        }
    }
    return true;
}

/**
 * @private
 * @param {Array<Object>} list list of objects which might contain the 'group' attribute
 * @returns {boolean} true if all the objects in the list are marked as grouped
 */
function allGrouped(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].grouped === false) {
            return false;
        }
    }
    return true;
}

},{"@turf/area":4,"@turf/bbox":8,"@turf/explode":10,"@turf/helpers":12,"@turf/inside":13,"@turf/invariant":14,"grid-to-matrix":15,"marchingsquares":20}],4:[function(require,module,exports){
var area = require('@mapbox/geojson-area').geometry;
var geomReduce = require('@turf/meta').geomReduce;

/**
 * Takes one or more features and returns their area in square meters.
 *
 * @name area
 * @param {FeatureCollection|Feature<any>} geojson input GeoJSON feature(s)
 * @returns {number} area in square meters
 * @addToMap polygon
 * @example
 * var polygon = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [
 *       [
 *         [125, -15],
 *         [113, -22],
 *         [117, -37],
 *         [130, -33],
 *         [148, -39],
 *         [154, -27],
 *         [144, -15],
 *         [125, -15]
 *       ]
 *     ]
 *   }
 * }
 * var area = turf.area(polygon);
 * //=area => square meters
 * //=polygon
 */
module.exports = function (geojson) {
    return geomReduce(geojson, function (value, geometry) {
        return value + area(geometry);
    }, 0);
};

},{"@mapbox/geojson-area":5,"@turf/meta":7}],5:[function(require,module,exports){
var wgs84 = require('wgs84');

module.exports.geometry = geometry;
module.exports.ring = ringArea;

function geometry(_) {
    var area = 0, i;
    switch (_.type) {
        case 'Polygon':
            return polygonArea(_.coordinates);
        case 'MultiPolygon':
            for (i = 0; i < _.coordinates.length; i++) {
                area += polygonArea(_.coordinates[i]);
            }
            return area;
        case 'Point':
        case 'MultiPoint':
        case 'LineString':
        case 'MultiLineString':
            return 0;
        case 'GeometryCollection':
            for (i = 0; i < _.geometries.length; i++) {
                area += geometry(_.geometries[i]);
            }
            return area;
    }
}

function polygonArea(coords) {
    var area = 0;
    if (coords && coords.length > 0) {
        area += Math.abs(ringArea(coords[0]));
        for (var i = 1; i < coords.length; i++) {
            area -= Math.abs(ringArea(coords[i]));
        }
    }
    return area;
}

/**
 * Calculate the approximate area of the polygon were it projected onto
 *     the earth.  Note that this area will be positive if ring is oriented
 *     clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
 *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
 *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
 *
 * Returns:
 * {float} The approximate signed geodesic area of the polygon in square
 *     meters.
 */

function ringArea(coords) {
    var p1, p2, p3, lowerIndex, middleIndex, upperIndex, i,
    area = 0,
    coordsLength = coords.length;

    if (coordsLength > 2) {
        for (i = 0; i < coordsLength; i++) {
            if (i === coordsLength - 2) {// i = N-2
                lowerIndex = coordsLength - 2;
                middleIndex = coordsLength -1;
                upperIndex = 0;
            } else if (i === coordsLength - 1) {// i = N-1
                lowerIndex = coordsLength - 1;
                middleIndex = 0;
                upperIndex = 1;
            } else { // i = 0 to N-3
                lowerIndex = i;
                middleIndex = i+1;
                upperIndex = i+2;
            }
            p1 = coords[lowerIndex];
            p2 = coords[middleIndex];
            p3 = coords[upperIndex];
            area += ( rad(p3[0]) - rad(p1[0]) ) * Math.sin( rad(p2[1]));
        }

        area = area * wgs84.RADIUS * wgs84.RADIUS / 2;
    }

    return area;
}

function rad(_) {
    return _ * Math.PI / 180;
}
},{"wgs84":6}],6:[function(require,module,exports){
module.exports.RADIUS = 6378137;
module.exports.FLATTENING = 1/298.257223563;
module.exports.POLAR_RADIUS = 6356752.3142;

},{}],7:[function(require,module,exports){
/**
 * Callback for coordEach
 *
 * @private
 * @callback coordEachCallback
 * @param {[number, number]} currentCoords The current coordinates being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
 *
 * @name coordEach
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (currentCoords, currentIndex)
 * @param {boolean} [excludeWrapCoord=false] whether or not to include
 * the final coordinate of LinearRings that wraps the ring in its iteration.
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [26, 37]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [36, 53]
 *       }
 *     }
 *   ]
 * };
 * turf.coordEach(features, function (currentCoords, currentIndex) {
 *   //=currentCoords
 *   //=currentIndex
 * });
 */
function coordEach(layer, callback, excludeWrapCoord) {
    var i, j, k, g, l, geometry, stopG, coords,
        geometryMaybeCollection,
        wrapShrink = 0,
        currentIndex = 0,
        isGeometryCollection,
        isFeatureCollection = layer.type === 'FeatureCollection',
        isFeature = layer.type === 'Feature',
        stop = isFeatureCollection ? layer.features.length : 1;

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
    for (i = 0; i < stop; i++) {

        geometryMaybeCollection = (isFeatureCollection ? layer.features[i].geometry :
        (isFeature ? layer.geometry : layer));
        isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection';
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (g = 0; g < stopG; g++) {
            geometry = isGeometryCollection ?
            geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
            coords = geometry.coordinates;

            wrapShrink = (excludeWrapCoord &&
                (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon')) ?
                1 : 0;

            if (geometry.type === 'Point') {
                callback(coords, currentIndex);
                currentIndex++;
            } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
                for (j = 0; j < coords.length; j++) {
                    callback(coords[j], currentIndex);
                    currentIndex++;
                }
            } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
                for (j = 0; j < coords.length; j++)
                    for (k = 0; k < coords[j].length - wrapShrink; k++) {
                        callback(coords[j][k], currentIndex);
                        currentIndex++;
                    }
            } else if (geometry.type === 'MultiPolygon') {
                for (j = 0; j < coords.length; j++)
                    for (k = 0; k < coords[j].length; k++)
                        for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                            callback(coords[j][k][l], currentIndex);
                            currentIndex++;
                        }
            } else if (geometry.type === 'GeometryCollection') {
                for (j = 0; j < geometry.geometries.length; j++)
                    coordEach(geometry.geometries[j], callback, excludeWrapCoord);
            } else {
                throw new Error('Unknown Geometry Type');
            }
        }
    }
}
module.exports.coordEach = coordEach;

/**
 * Callback for coordReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @private
 * @callback coordReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {[number, number]} currentCoords The current coordinate being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
 *
 * @name coordReduce
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentCoords, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @param {boolean} [excludeWrapCoord=false] whether or not to include
 * the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [26, 37]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [36, 53]
 *       }
 *     }
 *   ]
 * };
 * turf.coordReduce(features, function (previousValue, currentCoords, currentIndex) {
 *   //=previousValue
 *   //=currentCoords
 *   //=currentIndex
 *   return currentCoords;
 * });
 */
function coordReduce(layer, callback, initialValue, excludeWrapCoord) {
    var previousValue = initialValue;
    coordEach(layer, function (currentCoords, currentIndex) {
        if (currentIndex === 0 && initialValue === undefined) {
            previousValue = currentCoords;
        } else {
            previousValue = callback(previousValue, currentCoords, currentIndex);
        }
    }, excludeWrapCoord);
    return previousValue;
}
module.exports.coordReduce = coordReduce;

/**
 * Callback for propEach
 *
 * @private
 * @callback propEachCallback
 * @param {*} currentProperties The current properties being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
 *
 * @name propEach
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (currentProperties, currentIndex)
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {"foo": "bar"},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [26, 37]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {"hello": "world"},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [36, 53]
 *       }
 *     }
 *   ]
 * };
 * turf.propEach(features, function (currentProperties, currentIndex) {
 *   //=currentProperties
 *   //=currentIndex
 * });
 */
function propEach(layer, callback) {
    var i;
    switch (layer.type) {
    case 'FeatureCollection':
        for (i = 0; i < layer.features.length; i++) {
            callback(layer.features[i].properties, i);
        }
        break;
    case 'Feature':
        callback(layer.properties, 0);
        break;
    }
}
module.exports.propEach = propEach;


/**
 * Callback for propReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @private
 * @callback propReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {*} currentProperties The current properties being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce properties in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all properties is unnecessary.
 *
 * @name propReduce
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentProperties, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {"foo": "bar"},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [26, 37]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {"hello": "world"},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [36, 53]
 *       }
 *     }
 *   ]
 * };
 * turf.propReduce(features, function (previousValue, currentProperties, currentIndex) {
 *   //=previousValue
 *   //=currentProperties
 *   //=currentIndex
 *   return currentProperties
 * });
 */
function propReduce(layer, callback, initialValue) {
    var previousValue = initialValue;
    propEach(layer, function (currentProperties, currentIndex) {
        if (currentIndex === 0 && initialValue === undefined) {
            previousValue = currentProperties;
        } else {
            previousValue = callback(previousValue, currentProperties, currentIndex);
        }
    });
    return previousValue;
}
module.exports.propReduce = propReduce;

/**
 * Callback for featureEach
 *
 * @private
 * @callback featureEachCallback
 * @param {Feature<any>} currentFeature The current feature being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name featureEach
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, currentIndex)
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [26, 37]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [36, 53]
 *       }
 *     }
 *   ]
 * };
 * turf.featureEach(features, function (currentFeature, currentIndex) {
 *   //=currentFeature
 *   //=currentIndex
 * });
 */
function featureEach(layer, callback) {
    if (layer.type === 'Feature') {
        callback(layer, 0);
    } else if (layer.type === 'FeatureCollection') {
        for (var i = 0; i < layer.features.length; i++) {
            callback(layer.features[i], i);
        }
    }
}
module.exports.featureEach = featureEach;

/**
 * Callback for featureReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @private
 * @callback featureReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<any>} currentFeature The current Feature being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name featureReduce
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {"foo": "bar"},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [26, 37]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {"hello": "world"},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [36, 53]
 *       }
 *     }
 *   ]
 * };
 * turf.featureReduce(features, function (previousValue, currentFeature, currentIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=currentIndex
 *   return currentFeature
 * });
 */
function featureReduce(layer, callback, initialValue) {
    var previousValue = initialValue;
    featureEach(layer, function (currentFeature, currentIndex) {
        if (currentIndex === 0 && initialValue === undefined) {
            previousValue = currentFeature;
        } else {
            previousValue = callback(previousValue, currentFeature, currentIndex);
        }
    });
    return previousValue;
}
module.exports.featureReduce = featureReduce;

/**
 * Get all coordinates from any GeoJSON object.
 *
 * @name coordAll
 * @param {Object} layer any GeoJSON object
 * @returns {Array<Array<number>>} coordinate position array
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [26, 37]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [36, 53]
 *       }
 *     }
 *   ]
 * };
 * var coords = turf.coordAll(features);
 * //=coords
 */
function coordAll(layer) {
    var coords = [];
    coordEach(layer, function (coord) {
        coords.push(coord);
    });
    return coords;
}
module.exports.coordAll = coordAll;

/**
 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
 *
 * @name geomEach
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (currentGeometry, currentIndex)
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [26, 37]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [36, 53]
 *       }
 *     }
 *   ]
 * };
 * turf.geomEach(features, function (currentGeometry, currentIndex) {
 *   //=currentGeometry
 *   //=currentIndex
 * });
 */
function geomEach(layer, callback) {
    var i, j, g, geometry, stopG,
        geometryMaybeCollection,
        isGeometryCollection,
        currentIndex = 0,
        isFeatureCollection = layer.type === 'FeatureCollection',
        isFeature = layer.type === 'Feature',
        stop = isFeatureCollection ? layer.features.length : 1;

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
    for (i = 0; i < stop; i++) {

        geometryMaybeCollection = (isFeatureCollection ? layer.features[i].geometry :
        (isFeature ? layer.geometry : layer));
        isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection';
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (g = 0; g < stopG; g++) {
            geometry = isGeometryCollection ?
            geometryMaybeCollection.geometries[g] : geometryMaybeCollection;

            if (geometry.type === 'Point' ||
                geometry.type === 'LineString' ||
                geometry.type === 'MultiPoint' ||
                geometry.type === 'Polygon' ||
                geometry.type === 'MultiLineString' ||
                geometry.type === 'MultiPolygon') {
                callback(geometry, currentIndex);
                currentIndex++;
            } else if (geometry.type === 'GeometryCollection') {
                for (j = 0; j < geometry.geometries.length; j++) {
                    callback(geometry.geometries[j], currentIndex);
                    currentIndex++;
                }
            } else {
                throw new Error('Unknown Geometry Type');
            }
        }
    }
}
module.exports.geomEach = geomEach;

/**
 * Callback for geomReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @private
 * @callback geomReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {*} currentGeometry The current Feature being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
 *
 * @name geomReduce
 * @param {Object} layer any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentGeometry, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {"foo": "bar"},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [26, 37]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {"hello": "world"},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [36, 53]
 *       }
 *     }
 *   ]
 * };
 * turf.geomReduce(features, function (previousValue, currentGeometry, currentIndex) {
 *   //=previousValue
 *   //=currentGeometry
 *   //=currentIndex
 *   return currentGeometry
 * });
 */
function geomReduce(layer, callback, initialValue) {
    var previousValue = initialValue;
    geomEach(layer, function (currentGeometry, currentIndex) {
        if (currentIndex === 0 && initialValue === undefined) {
            previousValue = currentGeometry;
        } else {
            previousValue = callback(previousValue, currentGeometry, currentIndex);
        }
    });
    return previousValue;
}
module.exports.geomReduce = geomReduce;

},{}],8:[function(require,module,exports){
var each = require('@turf/meta').coordEach;

/**
 * Takes a set of features, calculates the bbox of all input features, and returns a bounding box.
 *
 * @name bbox
 * @param {(Feature|FeatureCollection)} geojson input features
 * @returns {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @addToMap features, bboxPolygon
 * @example
 * var pt1 = turf.point([114.175329, 22.2524])
 * var pt2 = turf.point([114.170007, 22.267969])
 * var pt3 = turf.point([114.200649, 22.274641])
 * var pt4 = turf.point([114.200649, 22.274641])
 * var pt5 = turf.point([114.186744, 22.265745])
 * var features = turf.featureCollection([pt1, pt2, pt3, pt4, pt5])
 *
 * var bbox = turf.bbox(features);
 *
 * var bboxPolygon = turf.bboxPolygon(bbox);
 *
 * //=bbox
 *
 * //=bboxPolygon
 */
module.exports = function (geojson) {
    var bbox = [Infinity, Infinity, -Infinity, -Infinity];
    each(geojson, function (coord) {
        if (bbox[0] > coord[0]) bbox[0] = coord[0];
        if (bbox[1] > coord[1]) bbox[1] = coord[1];
        if (bbox[2] < coord[0]) bbox[2] = coord[0];
        if (bbox[3] < coord[1]) bbox[3] = coord[1];
    });
    return bbox;
};

},{"@turf/meta":9}],9:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],10:[function(require,module,exports){
var featureCollection = require('@turf/helpers').featureCollection;
var featureEach = require('@turf/meta').featureEach;
var coordEach = require('@turf/meta').coordEach;
var point = require('@turf/helpers').point;

/**
 * Takes a feature or set of features and returns all positions as
 * {@link Point|points}.
 *
 * @name explode
 * @param {(Feature|FeatureCollection)} geojson input features
 * @returns {FeatureCollection<point>} points representing the exploded input features
 * @throws {Error} if it encounters an unknown geometry type
 * @example
 * var poly = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [177.434692, -17.77517],
 *       [177.402076, -17.779093],
 *       [177.38079, -17.803937],
 *       [177.40242, -17.826164],
 *       [177.438468, -17.824857],
 *       [177.454948, -17.796746],
 *       [177.434692, -17.77517]
 *     ]]
 *   }
 * };
 *
 * var points = turf.explode(poly);
 *
 * //=poly
 *
 * //=points
 */
module.exports = function (geojson) {
    var points = [];
    if (geojson.type === 'FeatureCollection') {
        featureEach(geojson, function (feature) {
            coordEach(feature, function (coord) {
                points.push(point(coord, feature.properties));
            });
        });
    } else {
        coordEach(geojson, function (coord) {
            points.push(point(coord, geojson.properties));
        });
    }
    return featureCollection(points);
};

},{"@turf/helpers":12,"@turf/meta":11}],11:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],12:[function(require,module,exports){
/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} properties properties
 * @returns {FeatureCollection} a FeatureCollection of input features
 * @example
 * var geometry = {
 *      "type": "Point",
 *      "coordinates": [
 *        67.5,
 *        32.84267363195431
 *      ]
 *    }
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geometry, properties) {
    if (!geometry) throw new Error('No geometry passed');

    return {
        type: 'Feature',
        properties: properties || {},
        geometry: geometry
    };
}
module.exports.feature = feature;

/**
 * Takes coordinates and properties (optional) and returns a new {@link Point} feature.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object=} properties an Object that is used as the {@link Feature}'s
 * properties
 * @returns {Feature<Point>} a Point feature
 * @example
 * var pt1 = turf.point([-75.343, 39.984]);
 *
 * //=pt1
 */
module.exports.point = function (coordinates, properties) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length === undefined) throw new Error('Coordinates must be an array');
    if (coordinates.length < 2) throw new Error('Coordinates must be at least 2 numbers long');
    if (typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') throw new Error('Coordinates must numbers');

    return feature({
        type: 'Point',
        coordinates: coordinates
    }, properties);
};

/**
 * Takes an array of LinearRings and optionally an {@link Object} with properties and returns a {@link Polygon} feature.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object=} properties a properties object
 * @returns {Feature<Polygon>} a Polygon feature
 * @throws {Error} throw an error if a LinearRing of the polygon has too few positions
 * or if a LinearRing of the Polygon does not have matching Positions at the
 * beginning & end.
 * @example
 * var polygon = turf.polygon([[
 *  [-2.275543, 53.464547],
 *  [-2.275543, 53.489271],
 *  [-2.215118, 53.489271],
 *  [-2.215118, 53.464547],
 *  [-2.275543, 53.464547]
 * ]], { name: 'poly1', population: 400});
 *
 * //=polygon
 */
module.exports.polygon = function (coordinates, properties) {
    if (!coordinates) throw new Error('No coordinates passed');

    for (var i = 0; i < coordinates.length; i++) {
        var ring = coordinates[i];
        if (ring.length < 4) {
            throw new Error('Each LinearRing of a Polygon must have 4 or more Positions.');
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error('First and last Position are not equivalent.');
            }
        }
    }

    return feature({
        type: 'Polygon',
        coordinates: coordinates
    }, properties);
};

/**
 * Creates a {@link LineString} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<LineString>} a LineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var linestring1 = turf.lineString([
 *   [-21.964416, 64.148203],
 *   [-21.956176, 64.141316],
 *   [-21.93901, 64.135924],
 *   [-21.927337, 64.136673]
 * ]);
 * var linestring2 = turf.lineString([
 *   [-21.929054, 64.127985],
 *   [-21.912918, 64.134726],
 *   [-21.916007, 64.141016],
 *   [-21.930084, 64.14446]
 * ], {name: 'line 1', distance: 145});
 *
 * //=linestring1
 *
 * //=linestring2
 */
module.exports.lineString = function (coordinates, properties) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'LineString',
        coordinates: coordinates
    }, properties);
};

/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @returns {FeatureCollection} a FeatureCollection of input features
 * @example
 * var features = [
 *  turf.point([-75.343, 39.984], {name: 'Location A'}),
 *  turf.point([-75.833, 39.284], {name: 'Location B'}),
 *  turf.point([-75.534, 39.123], {name: 'Location C'})
 * ];
 *
 * var fc = turf.featureCollection(features);
 *
 * //=fc
 */
module.exports.featureCollection = function (features) {
    if (!features) throw new Error('No features passed');

    return {
        type: 'FeatureCollection',
        features: features
    };
};

/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 *
 */
module.exports.multiLineString = function (coordinates, properties) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiLineString',
        coordinates: coordinates
    }, properties);
};

/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 *
 */
module.exports.multiPoint = function (coordinates, properties) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiPoint',
        coordinates: coordinates
    }, properties);
};


/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
module.exports.multiPolygon = function (coordinates, properties) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiPolygon',
        coordinates: coordinates
    }, properties);
};

/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<{Geometry}>} geometries an array of GeoJSON Geometries
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = {
 *     "type": "Point",
 *       "coordinates": [100, 0]
 *     };
 * var line = {
 *     "type": "LineString",
 *     "coordinates": [ [101, 0], [102, 1] ]
 *   };
 * var collection = turf.geometryCollection([pt, line]);
 *
 * //=collection
 */
module.exports.geometryCollection = function (geometries, properties) {
    if (!geometries) throw new Error('No geometries passed');

    return feature({
        type: 'GeometryCollection',
        geometries: geometries
    }, properties);
};

var factors = {
    miles: 3960,
    nauticalmiles: 3441.145,
    degrees: 57.2957795,
    radians: 1,
    inches: 250905600,
    yards: 6969600,
    meters: 6373000,
    metres: 6373000,
    kilometers: 6373,
    kilometres: 6373,
    feet: 20908792.65
};

/*
 * Convert a distance measurement from radians to a more friendly unit.
 *
 * @name radiansToDistance
 * @param {number} distance in radians across the sphere
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} distance
 */
module.exports.radiansToDistance = function (radians, units) {
    var factor = factors[units || 'kilometers'];
    if (factor === undefined) throw new Error('Invalid unit');

    return radians * factor;
};

/*
 * Convert a distance measurement from a real-world unit into radians
 *
 * @name distanceToRadians
 * @param {number} distance in real units
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} radians
 */
module.exports.distanceToRadians = function (distance, units) {
    var factor = factors[units || 'kilometers'];
    if (factor === undefined) throw new Error('Invalid unit');

    return distance / factor;
};

/*
 * Convert a distance measurement from a real-world unit into degrees
 *
 * @name distanceToRadians
 * @param {number} distance in real units
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} degrees
 */
module.exports.distanceToDegrees = function (distance, units) {
    var factor = factors[units || 'kilometers'];
    if (factor === undefined) throw new Error('Invalid unit');

    return (distance / factor) * 57.2958;
};

},{}],13:[function(require,module,exports){
var invariant = require('@turf/invariant');

// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

/**
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point resides inside the polygon. The polygon can
 * be convex or concave. The function accounts for holes.
 *
 * @name inside
 * @param {Feature<Point>} point input point
 * @param {Feature<(Polygon|MultiPolygon)>} polygon input polygon or multipolygon
 * @returns {boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 * @example
 * var pt = turf.point([-77, 44]);
 * var poly = turf.polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]]);
 *
 * var isInside = turf.inside(pt, poly);
 *
 * //=isInside
 */
module.exports = function (point, polygon) {
    var pt = invariant.getCoord(point);
    var polys = polygon.geometry.coordinates;
    // normalize to multipolygon
    if (polygon.geometry.type === 'Polygon') polys = [polys];

    for (var i = 0, insidePoly = false; i < polys.length && !insidePoly; i++) {
        // check if it is in the outer ring first
        if (inRing(pt, polys[i][0])) {
            var inHole = false;
            var k = 1;
            // check for the point in any of the holes
            while (k < polys[i].length && !inHole) {
                if (inRing(pt, polys[i][k], true)) {
                    inHole = true;
                }
                k++;
            }
            if (!inHole) insidePoly = true;
        }
    }
    return insidePoly;
};

// pt is [x,y] and ring is [[x,y], [x,y],..]
function inRing(pt, ring, ignoreBoundary) {
    var isInside = false;
    if (ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]) ring = ring.slice(0, ring.length - 1);

    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0], yi = ring[i][1];
        var xj = ring[j][0], yj = ring[j][1];
        var onBoundary = (pt[1] * (xi - xj) + yi * (xj - pt[0]) + yj * (pt[0] - xi) === 0) &&
            ((xi - pt[0]) * (xj - pt[0]) <= 0) && ((yi - pt[1]) * (yj - pt[1]) <= 0);
        if (onBoundary) return !ignoreBoundary;
        var intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
}

},{"@turf/invariant":14}],14:[function(require,module,exports){
/**
 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
 *
 * @param {Array<any>|Geometry|Feature<Point>} obj any value
 * @returns {Array<number>} coordinates
 */
function getCoord(obj) {
    if (!obj) throw new Error('No obj passed');

    var coordinates = getCoords(obj);

    // getCoord() must contain at least two numbers (Point)
    if (coordinates.length > 1 &&
        typeof coordinates[0] === 'number' &&
        typeof coordinates[1] === 'number') {
        return coordinates;
    } else {
        throw new Error('Coordinate is not a valid Point');
    }
}

/**
 * Unwrap coordinates from a Feature, Geometry Object or an Array of numbers
 *
 * @param {Array<any>|Geometry|Feature<any>} obj any value
 * @returns {Array<any>} coordinates
 */
function getCoords(obj) {
    if (!obj) throw new Error('No obj passed');
    var coordinates;

    // Array of numbers
    if (obj.length) {
        coordinates = obj;

    // Geometry Object
    } else if (obj.coordinates) {
        coordinates = obj.coordinates;

    // Feature
    } else if (obj.geometry && obj.geometry.coordinates) {
        coordinates = obj.geometry.coordinates;
    }
    // Checks if coordinates contains a number
    if (coordinates) {
        containsNumber(coordinates);
        return coordinates;
    }
    throw new Error('No valid coordinates');
}

/**
 * Checks if coordinates contains a number
 *
 * @private
 * @param {Array<any>} coordinates GeoJSON Coordinates
 * @returns {boolean} true if Array contains a number
 */
function containsNumber(coordinates) {
    if (coordinates.length > 1 &&
        typeof coordinates[0] === 'number' &&
        typeof coordinates[1] === 'number') {
        return true;
    }
    if (coordinates[0].length) {
        return containsNumber(coordinates[0]);
    }
    throw new Error('coordinates must only contain numbers');
}

/**
 * Enforce expectations about types of GeoJSON objects for Turf.
 *
 * @alias geojsonType
 * @param {GeoJSON} value any GeoJSON object
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function geojsonType(value, type, name) {
    if (!type || !name) throw new Error('type and name required');

    if (!value || value.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + value.type);
    }
}

/**
 * Enforce expectations about types of {@link Feature} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @alias featureOf
 * @param {Feature} feature a feature with an expected geometry type
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} error if value is not the expected type.
 */
function featureOf(feature, type, name) {
    if (!feature) throw new Error('No feature passed');
    if (!name) throw new Error('.featureOf() requires a name');
    if (!feature || feature.type !== 'Feature' || !feature.geometry) {
        throw new Error('Invalid input to ' + name + ', Feature with geometry required');
    }
    if (!feature.geometry || feature.geometry.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
    }
}

/**
 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @alias collectionOf
 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function collectionOf(featureCollection, type, name) {
    if (!featureCollection) throw new Error('No featureCollection passed');
    if (!name) throw new Error('.collectionOf() requires a name');
    if (!featureCollection || featureCollection.type !== 'FeatureCollection') {
        throw new Error('Invalid input to ' + name + ', FeatureCollection required');
    }
    for (var i = 0; i < featureCollection.features.length; i++) {
        var feature = featureCollection.features[i];
        if (!feature || feature.type !== 'Feature' || !feature.geometry) {
            throw new Error('Invalid input to ' + name + ', Feature with geometry required');
        }
        if (!feature.geometry || feature.geometry.type !== type) {
            throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
        }
    }
}

module.exports.geojsonType = geojsonType;
module.exports.collectionOf = collectionOf;
module.exports.featureOf = featureOf;
module.exports.getCoord = getCoord;
module.exports.getCoords = getCoords;

},{}],15:[function(require,module,exports){
var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;
var featureEach = require('@turf/meta').featureEach;

/**
 * Takes a {@link Point} grid and returns a correspondent matrix {Array<Array<number>>}
 * of the 'property' values
 *
 * @name gridToMatrix
 * @param {FeatureCollection<Point>} grid of points
 * @param {string} [property='elevation'] the property name in `points` from which z-values will be pulled
 * @param {boolean} [flip=false] returns the matrix upside-down
 * @returns {Array<Array<number>>} matrix of property values
 * @example
 *   var pointGrid = require('@turf/point-grid');
 *   var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 *   var cellSize = 3;
 *   var grid = pointGrid(extent, cellSize);
 *   // add a random property to each point between 0 and 60
 *   for (var i = 0; i < grid.features.length; i++) {
 *     grid.features[i].properties.elevation = (Math.random() * 60);
 *   }
 *   gridToMatrix(grid);
 *   //= [
 *     [ 1, 13, 10,  9, 10, 13, 18],
 *     [34,  8,  5,  4,  5,  8, 13],
 *     [10,  5,  2,  1,  2,  5,  4],
 *     [ 0,  4, 56, 19,  1,  4,  9],
 *     [10,  5,  2,  1,  2,  5, 10],
 *     [57,  8,  5,  4,  5,  0, 57],
 *     [ 3, 13, 10,  9,  5, 13, 18],
 *     [18, 13, 10,  9, 78, 13, 18]
 *   ]
 */
module.exports = function (grid, property, flip) {
    // validation
    invariant.collectionOf(grid, 'Point', 'input must contain Points');
    property = property || 'elevation';

    var pointsMatrix = sortPointsByLatLng(grid, flip);

    var matrix = [];

    // create property matrix from sorted points
    // looping order matters here
    for (var r = 0; r < pointsMatrix.length; r++) {
        var pointRow = pointsMatrix[r];
        var row = [];
        for (var c = 0; c < pointRow.length; c++) {
            var point = pointRow[c];
            // property exist
            if (point.properties[property]) {
                row.push(point.properties[property]);
            } else {
                row.push(0);
            }
        }
        matrix.push(row);
    }

    return matrix;
};

/**
 * Sorts points by latitude and longitude, creating a 2-dimensional array of points
 *
 * @private
 * @param {FeatureCollection<Point>} points GeoJSON Point features
 * @param {boolean} [flip=false] returns the matrix upside-down
 * @returns {Array<Array<Point>>} points by latitude and longitude
 */
function sortPointsByLatLng(points, flip) {
    var pointsByLatitude = {};

    // divide points by rows with the same latitude
    featureEach(points, function (point) {
        var lat = getCoords(point)[1];
        if (!pointsByLatitude[lat]) { pointsByLatitude[lat] = []; }
        pointsByLatitude[lat].push(point);
    });

    // sort points (with the same latitude) by longitude
    var orderedRowsByLatitude = Object.keys(pointsByLatitude).map(function (lat) {
        var row = pointsByLatitude[lat];
        var rowOrderedByLongitude = row.sort(function (a, b) {
            return getCoords(a)[0] - getCoords(b)[0];
        });
        return rowOrderedByLongitude;
    });

    // sort rows (of points with the same latitude) by latitude
    var pointMatrix = orderedRowsByLatitude.sort(function (a, b) {
        if (flip) {
            return getCoords(a[0])[1] - getCoords(b[0])[1];
        } else {
            return getCoords(b[0])[1] - getCoords(a[0])[1];
        }
    });
    return pointMatrix;
}

},{"@turf/invariant":16,"@turf/meta":17}],16:[function(require,module,exports){
/**
 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
 *
 * @name getCoord
 * @param {Array<number>|Geometry<Point>|Feature<Point>} obj Object
 * @returns {Array<number>} coordinates
 * @example
 * var pt = turf.point([10, 10]);
 *
 * var coord = turf.getCoord(pt);
 * //= [10, 10]
 */
function getCoord(obj) {
    if (!obj) throw new Error('obj is required');

    var coordinates = getCoords(obj);

    // getCoord() must contain at least two numbers (Point)
    if (coordinates.length > 1 &&
        typeof coordinates[0] === 'number' &&
        typeof coordinates[1] === 'number') {
        return coordinates;
    } else {
        throw new Error('Coordinate is not a valid Point');
    }
}

/**
 * Unwrap coordinates from a Feature, Geometry Object or an Array of numbers
 *
 * @name getCoords
 * @param {Array<number>|Geometry|Feature} obj Object
 * @returns {Array<number>} coordinates
 * @example
 * var poly = turf.polygon([[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]);
 *
 * var coord = turf.getCoords(poly);
 * //= [[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]
 */
function getCoords(obj) {
    if (!obj) throw new Error('obj is required');
    var coordinates;

    // Array of numbers
    if (obj.length) {
        coordinates = obj;

    // Geometry Object
    } else if (obj.coordinates) {
        coordinates = obj.coordinates;

    // Feature
    } else if (obj.geometry && obj.geometry.coordinates) {
        coordinates = obj.geometry.coordinates;
    }
    // Checks if coordinates contains a number
    if (coordinates) {
        containsNumber(coordinates);
        return coordinates;
    }
    throw new Error('No valid coordinates');
}

/**
 * Checks if coordinates contains a number
 *
 * @name containsNumber
 * @param {Array<any>} coordinates GeoJSON Coordinates
 * @returns {boolean} true if Array contains a number
 */
function containsNumber(coordinates) {
    if (coordinates.length > 1 &&
        typeof coordinates[0] === 'number' &&
        typeof coordinates[1] === 'number') {
        return true;
    }

    if (Array.isArray(coordinates[0]) && coordinates[0].length) {
        return containsNumber(coordinates[0]);
    }
    throw new Error('coordinates must only contain numbers');
}

/**
 * Enforce expectations about types of GeoJSON objects for Turf.
 *
 * @name geojsonType
 * @param {GeoJSON} value any GeoJSON object
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function geojsonType(value, type, name) {
    if (!type || !name) throw new Error('type and name required');

    if (!value || value.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + value.type);
    }
}

/**
 * Enforce expectations about types of {@link Feature} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name featureOf
 * @param {Feature} feature a feature with an expected geometry type
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} error if value is not the expected type.
 */
function featureOf(feature, type, name) {
    if (!feature) throw new Error('No feature passed');
    if (!name) throw new Error('.featureOf() requires a name');
    if (!feature || feature.type !== 'Feature' || !feature.geometry) {
        throw new Error('Invalid input to ' + name + ', Feature with geometry required');
    }
    if (!feature.geometry || feature.geometry.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
    }
}

/**
 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name collectionOf
 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function collectionOf(featureCollection, type, name) {
    if (!featureCollection) throw new Error('No featureCollection passed');
    if (!name) throw new Error('.collectionOf() requires a name');
    if (!featureCollection || featureCollection.type !== 'FeatureCollection') {
        throw new Error('Invalid input to ' + name + ', FeatureCollection required');
    }
    for (var i = 0; i < featureCollection.features.length; i++) {
        var feature = featureCollection.features[i];
        if (!feature || feature.type !== 'Feature' || !feature.geometry) {
            throw new Error('Invalid input to ' + name + ', Feature with geometry required');
        }
        if (!feature.geometry || feature.geometry.type !== type) {
            throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
        }
    }
}

/**
 * Get Geometry from Feature or Geometry Object
 *
 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
 * @returns {Geometry|null} GeoJSON Geometry Object
 * @throws {Error} if geojson is not a Feature or Geometry Object
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getGeom(point)
 * //={"type": "Point", "coordinates": [110, 40]}
 */
function getGeom(geojson) {
    if (!geojson) throw new Error('geojson is required');
    if (geojson.geometry !== undefined) return geojson.geometry;
    if (geojson.coordinates || geojson.geometries) return geojson;
    throw new Error('geojson must be a valid Feature or Geometry Object');
}

/**
 * Get Geometry Type from Feature or Geometry Object
 *
 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
 * @returns {string} GeoJSON Geometry Type
 * @throws {Error} if geojson is not a Feature or Geometry Object
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getGeom(point)
 * //="Point"
 */
function getGeomType(geojson) {
    if (!geojson) throw new Error('geojson is required');
    var geom = getGeom(geojson);
    if (geom) return geom.type;
}

module.exports = {
    geojsonType: geojsonType,
    collectionOf: collectionOf,
    featureOf: featureOf,
    getCoord: getCoord,
    getCoords: getCoords,
    containsNumber: containsNumber,
    getGeom: getGeom,
    getGeomType: getGeomType
};

},{}],17:[function(require,module,exports){
/**
 * Callback for coordEach
 *
 * @callback coordEachCallback
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * Starts at index 0.
 * @param {number} featureIndex The current index of the feature being processed.
 * @param {number} featureSubIndex The current subIndex of the feature being processed.
 */

/**
 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
 *
 * @name coordEach
 * @param {FeatureCollection|Geometry|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, featureSubIndex)
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, featureSubIndex) {
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=featureSubIndex
 * });
 */
function coordEach(geojson, callback, excludeWrapCoord) {
    // Handles null Geometry -- Skips this GeoJSON
    if (geojson === null) return;
    var featureIndex, geometryIndex, j, k, l, geometry, stopG, coords,
        geometryMaybeCollection,
        wrapShrink = 0,
        coordIndex = 0,
        isGeometryCollection,
        type = geojson.type,
        isFeatureCollection = type === 'FeatureCollection',
        isFeature = type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

    // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.
    for (featureIndex = 0; featureIndex < stop; featureIndex++) {
        var featureSubIndex = 0;

        geometryMaybeCollection = (isFeatureCollection ? geojson.features[featureIndex].geometry :
        (isFeature ? geojson.geometry : geojson));
        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (geometryIndex = 0; geometryIndex < stopG; geometryIndex++) {
            geometry = isGeometryCollection ?
            geometryMaybeCollection.geometries[geometryIndex] : geometryMaybeCollection;

            // Handles null Geometry -- Skips this geometry
            if (geometry === null) continue;
            coords = geometry.coordinates;
            var geomType = geometry.type;

            wrapShrink = (excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon')) ? 1 : 0;

            switch (geomType) {
            case null:
                break;
            case 'Point':
                callback(coords, coordIndex, featureIndex, featureSubIndex);
                coordIndex++;
                featureSubIndex++;
                break;
            case 'LineString':
            case 'MultiPoint':
                for (j = 0; j < coords.length; j++) {
                    callback(coords[j], coordIndex, featureIndex, featureSubIndex);
                    coordIndex++;
                    featureSubIndex++;
                }
                break;
            case 'Polygon':
            case 'MultiLineString':
                for (j = 0; j < coords.length; j++)
                    for (k = 0; k < coords[j].length - wrapShrink; k++) {
                        callback(coords[j][k], coordIndex, featureIndex, featureSubIndex);
                        coordIndex++;
                        featureSubIndex++;
                    }
                break;
            case 'MultiPolygon':
                for (j = 0; j < coords.length; j++)
                    for (k = 0; k < coords[j].length; k++)
                        for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                            callback(coords[j][k][l], coordIndex, featureIndex, featureSubIndex);
                            coordIndex++;
                            featureSubIndex++;
                        }
                break;
            case 'GeometryCollection':
                for (j = 0; j < geometry.geometries.length; j++)
                    coordEach(geometry.geometries[j], callback, excludeWrapCoord);
                break;
            default: throw new Error('Unknown Geometry Type');
            }
        }
    }
}

/**
 * Callback for coordReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback coordReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureIndex The current index of the feature being processed.
 * @param {number} featureSubIndex The current subIndex of the feature being processed.
 */

/**
 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
 *
 * @name coordReduce
 * @param {FeatureCollection|Geometry|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentCoord, coordIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, featureSubIndex) {
 *   //=previousValue
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=featureSubIndex
 *   return currentCoord;
 * });
 */
function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
    var previousValue = initialValue;
    coordEach(geojson, function (currentCoord, coordIndex, featureIndex, featureSubIndex) {
        if (coordIndex === 0 && initialValue === undefined) previousValue = currentCoord;
        else previousValue = callback(previousValue, currentCoord, coordIndex, featureIndex, featureSubIndex);
    }, excludeWrapCoord);
    return previousValue;
}

/**
 * Callback for propEach
 *
 * @callback propEachCallback
 * @param {Object} currentProperties The current properties being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
 *
 * @name propEach
 * @param {FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentProperties, featureIndex)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propEach(features, function (currentProperties, featureIndex) {
 *   //=currentProperties
 *   //=featureIndex
 * });
 */
function propEach(geojson, callback) {
    var i;
    switch (geojson.type) {
    case 'FeatureCollection':
        for (i = 0; i < geojson.features.length; i++) {
            callback(geojson.features[i].properties, i);
        }
        break;
    case 'Feature':
        callback(geojson.properties, 0);
        break;
    }
}


/**
 * Callback for propReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback propReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {*} currentProperties The current properties being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce properties in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all properties is unnecessary.
 *
 * @name propReduce
 * @param {FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentProperties, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
 *   //=previousValue
 *   //=currentProperties
 *   //=featureIndex
 *   return currentProperties
 * });
 */
function propReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    propEach(geojson, function (currentProperties, featureIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentProperties;
        else previousValue = callback(previousValue, currentProperties, featureIndex);
    });
    return previousValue;
}

/**
 * Callback for featureEach
 *
 * @callback featureEachCallback
 * @param {Feature<any>} currentFeature The current feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name featureEach
 * @param {Geometry|FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex)
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.featureEach(features, function (currentFeature, featureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 * });
 */
function featureEach(geojson, callback) {
    if (geojson.type === 'Feature') {
        callback(geojson, 0);
    } else if (geojson.type === 'FeatureCollection') {
        for (var i = 0; i < geojson.features.length; i++) {
            callback(geojson.features[i], i);
        }
    }
}

/**
 * Callback for featureReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback featureReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name featureReduce
 * @param {Geometry|FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   return currentFeature
 * });
 */
function featureReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    featureEach(geojson, function (currentFeature, featureIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
        else previousValue = callback(previousValue, currentFeature, featureIndex);
    });
    return previousValue;
}

/**
 * Get all coordinates from any GeoJSON object.
 *
 * @name coordAll
 * @param {Geometry|FeatureCollection|Feature} geojson any GeoJSON object
 * @returns {Array<Array<number>>} coordinate position array
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * var coords = turf.coordAll(features);
 * //= [[26, 37], [36, 53]]
 */
function coordAll(geojson) {
    var coords = [];
    coordEach(geojson, function (coord) {
        coords.push(coord);
    });
    return coords;
}

/**
 * Callback for geomEach
 *
 * @callback geomEachCallback
 * @param {Geometry} currentGeometry The current geometry being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} currentProperties The current feature properties being processed.
 */

/**
 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
 *
 * @name geomEach
 * @param {Geometry|FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentGeometry, featureIndex, currentProperties)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomEach(features, function (currentGeometry, featureIndex, currentProperties) {
 *   //=currentGeometry
 *   //=featureIndex
 *   //=currentProperties
 * });
 */
function geomEach(geojson, callback) {
    var i, j, g, geometry, stopG,
        geometryMaybeCollection,
        isGeometryCollection,
        geometryProperties,
        featureIndex = 0,
        isFeatureCollection = geojson.type === 'FeatureCollection',
        isFeature = geojson.type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
    for (i = 0; i < stop; i++) {

        geometryMaybeCollection = (isFeatureCollection ? geojson.features[i].geometry :
        (isFeature ? geojson.geometry : geojson));
        geometryProperties = (isFeatureCollection ? geojson.features[i].properties :
                              (isFeature ? geojson.properties : {}));
        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (g = 0; g < stopG; g++) {
            geometry = isGeometryCollection ?
            geometryMaybeCollection.geometries[g] : geometryMaybeCollection;

            // Handle null Geometry
            if (geometry === null) {
                callback(null, featureIndex, geometryProperties);
                featureIndex++;
                continue;
            }
            switch (geometry.type) {
            case 'Point':
            case 'LineString':
            case 'MultiPoint':
            case 'Polygon':
            case 'MultiLineString':
            case 'MultiPolygon': {
                callback(geometry, featureIndex, geometryProperties);
                featureIndex++;
                break;
            }
            case 'GeometryCollection': {
                for (j = 0; j < geometry.geometries.length; j++) {
                    callback(geometry.geometries[j], featureIndex, geometryProperties);
                    featureIndex++;
                }
                break;
            }
            default: throw new Error('Unknown Geometry Type');
            }
        }
    }
}

/**
 * Callback for geomReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback geomReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Geometry} currentGeometry The current Feature being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {Object} currentProperties The current feature properties being processed.
 */

/**
 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
 *
 * @name geomReduce
 * @param {Geometry|FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentGeometry, featureIndex, currentProperties)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, currentProperties) {
 *   //=previousValue
 *   //=currentGeometry
 *   //=featureIndex
 *   //=currentProperties
 *   return currentGeometry
 * });
 */
function geomReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    geomEach(geojson, function (currentGeometry, currentIndex, currentProperties) {
        if (currentIndex === 0 && initialValue === undefined) previousValue = currentGeometry;
        else previousValue = callback(previousValue, currentGeometry, currentIndex, currentProperties);
    });
    return previousValue;
}

/**
 * Callback for flattenEach
 *
 * @callback flattenEachCallback
 * @param {Feature} currentFeature The current flattened feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureSubIndex The subindex of the current element being processed in the
 * array. Starts at index 0 and increases if the flattened feature was a multi-geometry.
 */

/**
 * Iterate over flattened features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name flattenEach
 * @param {Geometry|FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex, featureSubIndex)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenEach(features, function (currentFeature, featureIndex, featureSubIndex) {
 *   //=currentFeature
 *   //=featureIndex
 *   //=featureSubIndex
 * });
 */
function flattenEach(geojson, callback) {
    geomEach(geojson, function (geometry, featureIndex, properties) {
        // Callback for single geometry
        var type = (geometry === null) ? null : geometry.type;
        switch (type) {
        case null:
        case 'Point':
        case 'LineString':
        case 'Polygon':
            callback(feature(geometry, properties), featureIndex, 0);
            return;
        }

        var geomType;

        // Callback for multi-geometry
        switch (type) {
        case 'MultiPoint':
            geomType = 'Point';
            break;
        case 'MultiLineString':
            geomType = 'LineString';
            break;
        case 'MultiPolygon':
            geomType = 'Polygon';
            break;
        }

        geometry.coordinates.forEach(function (coordinate, featureSubIndex) {
            var geom = {
                type: geomType,
                coordinates: coordinate
            };
            callback(feature(geom, properties), featureIndex, featureSubIndex);
        });

    });
}

/**
 * Callback for flattenReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback flattenReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureSubIndex The subindex of the current element being processed in the
 * array. Starts at index 0 and increases if the flattened feature was a multi-geometry.
 */

/**
 * Reduce flattened features in any GeoJSON object, similar to Array.reduce().
 *
 * @name flattenReduce
 * @param {Geometry|FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex, featureSubIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, featureSubIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   //=featureSubIndex
 *   return currentFeature
 * });
 */
function flattenReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    flattenEach(geojson, function (currentFeature, featureIndex, featureSubIndex) {
        if (featureIndex === 0 && featureSubIndex === 0 && initialValue === undefined) previousValue = currentFeature;
        else previousValue = callback(previousValue, currentFeature, featureIndex, featureSubIndex);
    });
    return previousValue;
}

/**
 * Callback for segmentEach
 *
 * @callback segmentEachCallback
 * @param {Feature<LineString>} currentSegment The current segment being processed.
 * @param {number} featureIndex The index of the current element being processed in the array, starts at index 0.
 * @param {number} featureSubIndex The subindex of the current element being processed in the
 * array. Starts at index 0 and increases for each iterating line segment.
 * @returns {void}
 */

/**
 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
 * @param {Function} callback a method that takes (currentSegment, featureIndex, featureSubIndex)
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentEach(polygon, function (currentSegment, featureIndex, featureSubIndex) {
 *   //= currentSegment
 *   //= featureIndex
 *   //= featureSubIndex
 * });
 *
 * // Calculate the total number of segments
 * var total = 0;
 * var initialValue = 0;
 * turf.segmentEach(polygon, function () {
 *     total++;
 * }, initialValue);
 */
function segmentEach(geojson, callback) {
    flattenEach(geojson, function (feature, featureIndex) {
        var featureSubIndex = 0;
        // Exclude null Geometries
        if (!feature.geometry) return;
        // (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
        var type = feature.geometry.type;
        if (type === 'Point' || type === 'MultiPoint') return;

        // Generate 2-vertex line segments
        coordReduce(feature, function (previousCoords, currentCoord) {
            var currentSegment = lineString([previousCoords, currentCoord], feature.properties);
            callback(currentSegment, featureIndex, featureSubIndex);
            featureSubIndex++;
            return currentCoord;
        });
    });
}

/**
 * Callback for segmentReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback segmentReduceCallback
 * @param {*} [previousValue] The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} [currentSegment] The current segment being processed.
 * @param {number} [currentIndex] The index of the current element being processed in the
 * array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} [currentSubIndex] The subindex of the current element being processed in the
 * array. Starts at index 0 and increases for each iterating line segment.
 */

/**
 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
 * @param {Function} callback a method that takes (previousValue, currentSegment, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentReduce(polygon, function (previousSegment, currentSegment, currentIndex, currentSubIndex) {
 *   //= previousSegment
 *   //= currentSegment
 *   //= currentIndex
 *   //= currentSubIndex
 *   return currentSegment
 * });
 *
 * // Calculate the total number of segments
 * var initialValue = 0
 * var total = turf.segmentReduce(polygon, function (previousValue) {
 *     previousValue++;
 *     return previousValue;
 * }, initialValue);
 */
function segmentReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    segmentEach(geojson, function (currentSegment, currentIndex, currentSubIndex) {
        if (currentIndex === 0 && initialValue === undefined) previousValue = currentSegment;
        else previousValue = callback(previousValue, currentSegment, currentIndex, currentSubIndex);
    });
    return previousValue;
}

/**
 * Create Feature
 *
 * @private
 * @param {Geometry} geometry GeoJSON Geometry
 * @param {Object} properties Properties
 * @returns {Feature} GeoJSON Feature
 */
function feature(geometry, properties) {
    if (geometry === undefined) throw new Error('No geometry passed');

    return {
        type: 'Feature',
        properties: properties || {},
        geometry: geometry
    };
}

/**
 * Create LineString
 *
 * @private
 * @param {Array<Array<number>>} coordinates Line Coordinates
 * @param {Object} properties Properties
 * @returns {Feature<LineString>} GeoJSON LineString Feature
 */
function lineString(coordinates, properties) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length < 2) throw new Error('Coordinates must be an array of two or more positions');

    return {
        type: 'Feature',
        properties: properties || {},
        geometry: {
            type: 'LineString',
            coordinates: coordinates
        }
    };
}

module.exports = {
    coordEach: coordEach,
    coordReduce: coordReduce,
    propEach: propEach,
    propReduce: propReduce,
    featureEach: featureEach,
    featureReduce: featureReduce,
    coordAll: coordAll,
    geomEach: geomEach,
    geomReduce: geomReduce,
    flattenEach: flattenEach,
    flattenReduce: flattenReduce,
    segmentEach: segmentEach,
    segmentReduce: segmentReduce
};

},{}],18:[function(require,module,exports){
/*!
* @license GNU Affero General Public License.
* Copyright (c) 2015, 2015 Ronny Lorenz <ronny@tbi.univie.ac.at>
* v. 1.2.0
* https://github.com/RaumZeit/MarchingSquares.js
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function() { return { isoBands : factory() }; })
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = { isoBands : factory() };
    } else {
        // Browser globals (root is window)
        root.MarchingSquaresJS = {
                                    isoBands : factory(),
                                    isoContours : (root.MarchingSquaresJS) ? root.MarchingSquaresJS.isoContours : null
                                 };
    }
}(this, function () {

  var defaultSettings = {
    successCallback:  null,
    verbose:          false,
    polygons:         false
  };
    
  var settings = {};
    
    /*
      Compute isobands(s) of a scalar 2D field given a certain
      threshold and a bandwidth by applying the Marching Squares
      Algorithm. The function returns a list of path coordinates
      either for individual polygons within each grid cell, or the
      outline of connected polygons.
    */
  function isoBands(data, minV, bandwidth, options){
    /* process options */
    options = options ? options : {};

    var optionKeys = Object.keys(defaultSettings);

    for(var i = 0; i < optionKeys.length; i++){
      var key = optionKeys[i];
      var val = options[key];
      val = ((typeof val !== 'undefined') && (val !== null)) ? val : defaultSettings[key];

      settings[key] = val;
    }

    if(settings.verbose)
      console.log("MarchingSquaresJS-isoBands: computing isobands for [" + minV + ":" + (minV + bandwidth) + "]");

    var grid = computeBandGrid(data, minV, bandwidth);

    var ret;
    if(settings.polygons){
      if (settings.verbose)
        console.log("MarchingSquaresJS-isoBands: returning single polygons for each grid cell");
      ret = BandGrid2Areas(grid);
    } else {
      if (settings.verbose)
        console.log("MarchingSquaresJS-isoBands: returning polygon paths for entire data grid");
      ret = BandGrid2AreaPaths(grid);
    }

    if(typeof settings.successCallback === 'function')
      settings.successCallback(ret);

    return ret;
  }

  /*
    Thats all for the public interface, below follows the actual
    implementation
  */

  /* Some private variables */
  var Node0 = 64,
      Node1 = 16,
      Node2 = 4,
      Node3 = 1;

  /*  For isoBands, each square is defined by the three states
      of its corner points. However, since computers use power-2
      values, we use 2bits per trit, i.e.:

      00 ... below minV
      01 ... between minV and maxV
      10 ... above maxV

      Hence we map the 4-trit configurations as follows:

      0000 => 0
      0001 => 1
      0002 => 2
      0010 => 4
      0011 => 5
      0012 => 6
      0020 => 8
      0021 => 9
      0022 => 10
      0100 => 16
      0101 => 17
      0102 => 18
      0110 => 20
      0111 => 21
      0112 => 22
      0120 => 24
      0121 => 25
      0122 => 26
      0200 => 32
      0201 => 33
      0202 => 34
      0210 => 36
      0211 => 37
      0212 => 38
      0220 => 40
      0221 => 41
      0222 => 42
      1000 => 64
      1001 => 65
      1002 => 66
      1010 => 68
      1011 => 69
      1012 => 70
      1020 => 72
      1021 => 73
      1022 => 74
      1100 => 80
      1101 => 81
      1102 => 82
      1110 => 84
      1111 => 85
      1112 => 86
      1120 => 88
      1121 => 89
      1122 => 90
      1200 => 96
      1201 => 97
      1202 => 98
      1210 => 100
      1211 => 101
      1212 => 102
      1220 => 104
      1221 => 105
      1222 => 106
      2000 => 128
      2001 => 129
      2002 => 130
      2010 => 132
      2011 => 133
      2012 => 134
      2020 => 136
      2021 => 137
      2022 => 138
      2100 => 144
      2101 => 145
      2102 => 146
      2110 => 148
      2111 => 149
      2112 => 150
      2120 => 152
      2121 => 153
      2122 => 154
      2200 => 160
      2201 => 161
      2202 => 162
      2210 => 164
      2211 => 165
      2212 => 166
      2220 => 168
      2221 => 169
      2222 => 170
  */

  /*
    The look-up tables for tracing back the contour path
    of isoBands
  */

  var isoBandNextXTL = [];
  var isoBandNextYTL = [];
  var isoBandNextOTL = [];

  var isoBandNextXTR = [];
  var isoBandNextYTR = [];
  var isoBandNextOTR = [];

  var isoBandNextXRT = [];
  var isoBandNextYRT = [];
  var isoBandNextORT = [];

  var isoBandNextXRB = [];
  var isoBandNextYRB = [];
  var isoBandNextORB = [];

  var isoBandNextXBL = [];
  var isoBandNextYBL = [];
  var isoBandNextOBL = [];

  var isoBandNextXBR = [];
  var isoBandNextYBR = [];
  var isoBandNextOBR = [];

  var isoBandNextXLT = [];
  var isoBandNextYLT = [];
  var isoBandNextOLT = [];

  var isoBandNextXLB = [];
  var isoBandNextYLB = [];
  var isoBandNextOLB = [];

  isoBandNextXRT[85] = isoBandNextXRB[85] = -1;
  isoBandNextYRT[85] = isoBandNextYRB[85] = 0;
  isoBandNextORT[85] = isoBandNextORB[85] = 1;
  isoBandNextXLT[85] = isoBandNextXLB[85] = 1;
  isoBandNextYLT[85] = isoBandNextYLB[85] = 0;
  isoBandNextOLT[85] = isoBandNextOLB[85] = 1;

  isoBandNextXTL[85] = isoBandNextXTR[85] = 0;
  isoBandNextYTL[85] = isoBandNextYTR[85] = -1;
  isoBandNextOTL[85] = isoBandNextOBL[85] = 0;
  isoBandNextXBR[85] = isoBandNextXBL[85] = 0;
  isoBandNextYBR[85] = isoBandNextYBL[85] = 1;
  isoBandNextOTR[85] = isoBandNextOBR[85] = 1;


  /* triangle cases */
  isoBandNextXLB[1] = isoBandNextXLB[169] = 0;
  isoBandNextYLB[1] = isoBandNextYLB[169] = -1;
  isoBandNextOLB[1] = isoBandNextOLB[169] = 0;
  isoBandNextXBL[1] = isoBandNextXBL[169] = -1;
  isoBandNextYBL[1] = isoBandNextYBL[169] = 0;
  isoBandNextOBL[1] = isoBandNextOBL[169] = 0;

  isoBandNextXRB[4] = isoBandNextXRB[166] = 0;
  isoBandNextYRB[4] = isoBandNextYRB[166] = -1;
  isoBandNextORB[4] = isoBandNextORB[166] = 1;
  isoBandNextXBR[4] = isoBandNextXBR[166] = 1;
  isoBandNextYBR[4] = isoBandNextYBR[166] = 0;
  isoBandNextOBR[4] = isoBandNextOBR[166] = 0;

  isoBandNextXRT[16] = isoBandNextXRT[154] = 0;
  isoBandNextYRT[16] = isoBandNextYRT[154] = 1;
  isoBandNextORT[16] = isoBandNextORT[154] = 1;
  isoBandNextXTR[16] = isoBandNextXTR[154] = 1;
  isoBandNextYTR[16] = isoBandNextYTR[154] = 0;
  isoBandNextOTR[16] = isoBandNextOTR[154] = 1;

  isoBandNextXLT[64] = isoBandNextXLT[106] = 0;
  isoBandNextYLT[64] = isoBandNextYLT[106] = 1;
  isoBandNextOLT[64] = isoBandNextOLT[106] = 0;
  isoBandNextXTL[64] = isoBandNextXTL[106] = -1;
  isoBandNextYTL[64] = isoBandNextYTL[106] = 0;
  isoBandNextOTL[64] = isoBandNextOTL[106] = 1;

  /* single trapezoid cases */
  isoBandNextXLT[2] = isoBandNextXLT[168] = 0;
  isoBandNextYLT[2] = isoBandNextYLT[168] = -1;
  isoBandNextOLT[2] = isoBandNextOLT[168] = 1;
  isoBandNextXLB[2] = isoBandNextXLB[168] = 0;
  isoBandNextYLB[2] = isoBandNextYLB[168] = -1;
  isoBandNextOLB[2] = isoBandNextOLB[168] = 0;
  isoBandNextXBL[2] = isoBandNextXBL[168] = -1;
  isoBandNextYBL[2] = isoBandNextYBL[168] = 0;
  isoBandNextOBL[2] = isoBandNextOBL[168] = 0;
  isoBandNextXBR[2] = isoBandNextXBR[168] = -1;
  isoBandNextYBR[2] = isoBandNextYBR[168] = 0;
  isoBandNextOBR[2] = isoBandNextOBR[168] = 1;

  isoBandNextXRT[8] = isoBandNextXRT[162] = 0;
  isoBandNextYRT[8] = isoBandNextYRT[162] = -1;
  isoBandNextORT[8] = isoBandNextORT[162] = 0;
  isoBandNextXRB[8] = isoBandNextXRB[162] = 0;
  isoBandNextYRB[8] = isoBandNextYRB[162] = -1;
  isoBandNextORB[8] = isoBandNextORB[162] = 1;
  isoBandNextXBL[8] = isoBandNextXBL[162] = 1;
  isoBandNextYBL[8] = isoBandNextYBL[162] = 0;
  isoBandNextOBL[8] = isoBandNextOBL[162] = 1;
  isoBandNextXBR[8] = isoBandNextXBR[162] = 1;
  isoBandNextYBR[8] = isoBandNextYBR[162] = 0;
  isoBandNextOBR[8] = isoBandNextOBR[162] = 0;

  isoBandNextXRT[32] = isoBandNextXRT[138] = 0;
  isoBandNextYRT[32] = isoBandNextYRT[138] = 1;
  isoBandNextORT[32] = isoBandNextORT[138] = 1;
  isoBandNextXRB[32] = isoBandNextXRB[138] = 0;
  isoBandNextYRB[32] = isoBandNextYRB[138] = 1;
  isoBandNextORB[32] = isoBandNextORB[138] = 0;
  isoBandNextXTL[32] = isoBandNextXTL[138] = 1;
  isoBandNextYTL[32] = isoBandNextYTL[138] = 0;
  isoBandNextOTL[32] = isoBandNextOTL[138] = 0;
  isoBandNextXTR[32] = isoBandNextXTR[138] = 1;
  isoBandNextYTR[32] = isoBandNextYTR[138] = 0;
  isoBandNextOTR[32] = isoBandNextOTR[138] = 1;

  isoBandNextXLB[128] = isoBandNextXLB[42] = 0;
  isoBandNextYLB[128] = isoBandNextYLB[42] = 1;
  isoBandNextOLB[128] = isoBandNextOLB[42] = 1;
  isoBandNextXLT[128] = isoBandNextXLT[42] = 0;
  isoBandNextYLT[128] = isoBandNextYLT[42] = 1;
  isoBandNextOLT[128] = isoBandNextOLT[42] = 0;
  isoBandNextXTL[128] = isoBandNextXTL[42] = -1;
  isoBandNextYTL[128] = isoBandNextYTL[42] = 0;
  isoBandNextOTL[128] = isoBandNextOTL[42] = 1;
  isoBandNextXTR[128] = isoBandNextXTR[42] = -1;
  isoBandNextYTR[128] = isoBandNextYTR[42] = 0;
  isoBandNextOTR[128] = isoBandNextOTR[42] = 0;

  /* single rectangle cases */
  isoBandNextXRB[5] = isoBandNextXRB[165] = -1;
  isoBandNextYRB[5] = isoBandNextYRB[165] = 0;
  isoBandNextORB[5] = isoBandNextORB[165] = 0;
  isoBandNextXLB[5] = isoBandNextXLB[165] = 1;
  isoBandNextYLB[5] = isoBandNextYLB[165] = 0;
  isoBandNextOLB[5] = isoBandNextOLB[165] = 0;

  isoBandNextXBR[20] = isoBandNextXBR[150] = 0;
  isoBandNextYBR[20] = isoBandNextYBR[150] = 1;
  isoBandNextOBR[20] = isoBandNextOBR[150] = 1;
  isoBandNextXTR[20] = isoBandNextXTR[150] = 0;
  isoBandNextYTR[20] = isoBandNextYTR[150] = -1;
  isoBandNextOTR[20] = isoBandNextOTR[150] = 1;

  isoBandNextXRT[80] = isoBandNextXRT[90] = -1;
  isoBandNextYRT[80] = isoBandNextYRT[90] = 0;
  isoBandNextORT[80] = isoBandNextORT[90] = 1;
  isoBandNextXLT[80] = isoBandNextXLT[90] = 1;
  isoBandNextYLT[80] = isoBandNextYLT[90] = 0;
  isoBandNextOLT[80] = isoBandNextOLT[90] = 1;

  isoBandNextXBL[65] = isoBandNextXBL[105] = 0;
  isoBandNextYBL[65] = isoBandNextYBL[105] = 1;
  isoBandNextOBL[65] = isoBandNextOBL[105] = 0;
  isoBandNextXTL[65] = isoBandNextXTL[105] = 0;
  isoBandNextYTL[65] = isoBandNextYTL[105] = -1;
  isoBandNextOTL[65] = isoBandNextOTL[105] = 0;

  isoBandNextXRT[160] = isoBandNextXRT[10] = -1;
  isoBandNextYRT[160] = isoBandNextYRT[10] = 0;
  isoBandNextORT[160] = isoBandNextORT[10] = 1;
  isoBandNextXRB[160] = isoBandNextXRB[10] = -1;
  isoBandNextYRB[160] = isoBandNextYRB[10] = 0;
  isoBandNextORB[160] = isoBandNextORB[10] = 0;
  isoBandNextXLB[160] = isoBandNextXLB[10] = 1;
  isoBandNextYLB[160] = isoBandNextYLB[10] = 0;
  isoBandNextOLB[160] = isoBandNextOLB[10] = 0;
  isoBandNextXLT[160] = isoBandNextXLT[10] = 1;
  isoBandNextYLT[160] = isoBandNextYLT[10] = 0;
  isoBandNextOLT[160] = isoBandNextOLT[10] = 1;

  isoBandNextXBR[130] = isoBandNextXBR[40] = 0;
  isoBandNextYBR[130] = isoBandNextYBR[40] = 1;
  isoBandNextOBR[130] = isoBandNextOBR[40] = 1;
  isoBandNextXBL[130] = isoBandNextXBL[40] = 0;
  isoBandNextYBL[130] = isoBandNextYBL[40] = 1;
  isoBandNextOBL[130] = isoBandNextOBL[40] = 0;
  isoBandNextXTL[130] = isoBandNextXTL[40] = 0;
  isoBandNextYTL[130] = isoBandNextYTL[40] = -1;
  isoBandNextOTL[130] = isoBandNextOTL[40] = 0;
  isoBandNextXTR[130] = isoBandNextXTR[40] = 0;
  isoBandNextYTR[130] = isoBandNextYTR[40] = -1;
  isoBandNextOTR[130] = isoBandNextOTR[40] = 1;

  /* single hexagon cases */
  isoBandNextXRB[37] = isoBandNextXRB[133] = 0;
  isoBandNextYRB[37] = isoBandNextYRB[133] = 1;
  isoBandNextORB[37] = isoBandNextORB[133] = 1;
  isoBandNextXLB[37] = isoBandNextXLB[133] = 0;
  isoBandNextYLB[37] = isoBandNextYLB[133] = 1;
  isoBandNextOLB[37] = isoBandNextOLB[133] = 0;
  isoBandNextXTL[37] = isoBandNextXTL[133] = -1;
  isoBandNextYTL[37] = isoBandNextYTL[133] = 0;
  isoBandNextOTL[37] = isoBandNextOTL[133] = 0;
  isoBandNextXTR[37] = isoBandNextXTR[133] = 1;
  isoBandNextYTR[37] = isoBandNextYTR[133] = 0;
  isoBandNextOTR[37] = isoBandNextOTR[133] = 0;

  isoBandNextXBR[148] = isoBandNextXBR[22] = -1;
  isoBandNextYBR[148] = isoBandNextYBR[22] = 0;
  isoBandNextOBR[148] = isoBandNextOBR[22] = 0;
  isoBandNextXLB[148] = isoBandNextXLB[22] = 0;
  isoBandNextYLB[148] = isoBandNextYLB[22] = -1;
  isoBandNextOLB[148] = isoBandNextOLB[22] = 1;
  isoBandNextXLT[148] = isoBandNextXLT[22] = 0;
  isoBandNextYLT[148] = isoBandNextYLT[22] = 1;
  isoBandNextOLT[148] = isoBandNextOLT[22] = 1;
  isoBandNextXTR[148] = isoBandNextXTR[22] = -1;
  isoBandNextYTR[148] = isoBandNextYTR[22] = 0;
  isoBandNextOTR[148] = isoBandNextOTR[22] = 1;

  isoBandNextXRT[82] = isoBandNextXRT[88] = 0;
  isoBandNextYRT[82] = isoBandNextYRT[88] = -1;
  isoBandNextORT[82] = isoBandNextORT[88] = 1;
  isoBandNextXBR[82] = isoBandNextXBR[88] = 1;
  isoBandNextYBR[82] = isoBandNextYBR[88] = 0;
  isoBandNextOBR[82] = isoBandNextOBR[88] = 1;
  isoBandNextXBL[82] = isoBandNextXBL[88] = -1;
  isoBandNextYBL[82] = isoBandNextYBL[88] = 0;
  isoBandNextOBL[82] = isoBandNextOBL[88] = 1;
  isoBandNextXLT[82] = isoBandNextXLT[88] = 0;
  isoBandNextYLT[82] = isoBandNextYLT[88] = -1;
  isoBandNextOLT[82] = isoBandNextOLT[88] = 0;

  isoBandNextXRT[73] = isoBandNextXRT[97] = 0;
  isoBandNextYRT[73] = isoBandNextYRT[97] = 1;
  isoBandNextORT[73] = isoBandNextORT[97] = 0;
  isoBandNextXRB[73] = isoBandNextXRB[97] = 0;
  isoBandNextYRB[73] = isoBandNextYRB[97] = -1;
  isoBandNextORB[73] = isoBandNextORB[97] = 0;
  isoBandNextXBL[73] = isoBandNextXBL[97] = 1;
  isoBandNextYBL[73] = isoBandNextYBL[97] = 0;
  isoBandNextOBL[73] = isoBandNextOBL[97] = 0;
  isoBandNextXTL[73] = isoBandNextXTL[97] = 1;
  isoBandNextYTL[73] = isoBandNextYTL[97] = 0;
  isoBandNextOTL[73] = isoBandNextOTL[97] = 1;

  isoBandNextXRT[145] = isoBandNextXRT[25] = 0;
  isoBandNextYRT[145] = isoBandNextYRT[25] = -1;
  isoBandNextORT[145] = isoBandNextORT[25] = 0;
  isoBandNextXBL[145] = isoBandNextXBL[25] = 1;
  isoBandNextYBL[145] = isoBandNextYBL[25] = 0;
  isoBandNextOBL[145] = isoBandNextOBL[25] = 1;
  isoBandNextXLB[145] = isoBandNextXLB[25] = 0;
  isoBandNextYLB[145] = isoBandNextYLB[25] = 1;
  isoBandNextOLB[145] = isoBandNextOLB[25] = 1;
  isoBandNextXTR[145] = isoBandNextXTR[25] = -1;
  isoBandNextYTR[145] = isoBandNextYTR[25] = 0;
  isoBandNextOTR[145] = isoBandNextOTR[25] = 0;

  isoBandNextXRB[70] = isoBandNextXRB[100] = 0;
  isoBandNextYRB[70] = isoBandNextYRB[100] = 1;
  isoBandNextORB[70] = isoBandNextORB[100] = 0;
  isoBandNextXBR[70] = isoBandNextXBR[100] = -1;
  isoBandNextYBR[70] = isoBandNextYBR[100] = 0;
  isoBandNextOBR[70] = isoBandNextOBR[100] = 1;
  isoBandNextXLT[70] = isoBandNextXLT[100] = 0;
  isoBandNextYLT[70] = isoBandNextYLT[100] = -1;
  isoBandNextOLT[70] = isoBandNextOLT[100] = 1;
  isoBandNextXTL[70] = isoBandNextXTL[100] = 1;
  isoBandNextYTL[70] = isoBandNextYTL[100] = 0;
  isoBandNextOTL[70] = isoBandNextOTL[100] = 0;

  /* single pentagon cases */
  isoBandNextXRB[101] = isoBandNextXRB[69] = 0;
  isoBandNextYRB[101] = isoBandNextYRB[69] = 1;
  isoBandNextORB[101] = isoBandNextORB[69] = 0;
  isoBandNextXTL[101] = isoBandNextXTL[69] = 1;
  isoBandNextYTL[101] = isoBandNextYTL[69] = 0;
  isoBandNextOTL[101] = isoBandNextOTL[69] = 0;

  isoBandNextXLB[149] = isoBandNextXLB[21] = 0;
  isoBandNextYLB[149] = isoBandNextYLB[21] = 1;
  isoBandNextOLB[149] = isoBandNextOLB[21] = 1;
  isoBandNextXTR[149] = isoBandNextXTR[21] = -1;
  isoBandNextYTR[149] = isoBandNextYTR[21] = 0;
  isoBandNextOTR[149] = isoBandNextOTR[21] = 0;

  isoBandNextXBR[86] = isoBandNextXBR[84] = -1;
  isoBandNextYBR[86] = isoBandNextYBR[84] = 0;
  isoBandNextOBR[86] = isoBandNextOBR[84] = 1;
  isoBandNextXLT[86] = isoBandNextXLT[84] = 0;
  isoBandNextYLT[86] = isoBandNextYLT[84] = -1;
  isoBandNextOLT[86] = isoBandNextOLT[84] = 1;

  isoBandNextXRT[89] = isoBandNextXRT[81] = 0;
  isoBandNextYRT[89] = isoBandNextYRT[81] = -1;
  isoBandNextORT[89] = isoBandNextORT[81] = 0;
  isoBandNextXBL[89] = isoBandNextXBL[81] = 1;
  isoBandNextYBL[89] = isoBandNextYBL[81] = 0;
  isoBandNextOBL[89] = isoBandNextOBL[81] = 1;

  isoBandNextXRT[96] = isoBandNextXRT[74] = 0;
  isoBandNextYRT[96] = isoBandNextYRT[74] = 1;
  isoBandNextORT[96] = isoBandNextORT[74] = 0;
  isoBandNextXRB[96] = isoBandNextXRB[74] = -1;
  isoBandNextYRB[96] = isoBandNextYRB[74] = 0;
  isoBandNextORB[96] = isoBandNextORB[74] = 1;
  isoBandNextXLT[96] = isoBandNextXLT[74] = 1;
  isoBandNextYLT[96] = isoBandNextYLT[74] = 0;
  isoBandNextOLT[96] = isoBandNextOLT[74] = 0;
  isoBandNextXTL[96] = isoBandNextXTL[74] = 1;
  isoBandNextYTL[96] = isoBandNextYTL[74] = 0;
  isoBandNextOTL[96] = isoBandNextOTL[74] = 1;

  isoBandNextXRT[24] = isoBandNextXRT[146] = 0;
  isoBandNextYRT[24] = isoBandNextYRT[146] = -1;
  isoBandNextORT[24] = isoBandNextORT[146] = 1;
  isoBandNextXBR[24] = isoBandNextXBR[146] = 1;
  isoBandNextYBR[24] = isoBandNextYBR[146] = 0;
  isoBandNextOBR[24] = isoBandNextOBR[146] = 1;
  isoBandNextXBL[24] = isoBandNextXBL[146] = 0;
  isoBandNextYBL[24] = isoBandNextYBL[146] = 1;
  isoBandNextOBL[24] = isoBandNextOBL[146] = 1;
  isoBandNextXTR[24] = isoBandNextXTR[146] = 0;
  isoBandNextYTR[24] = isoBandNextYTR[146] = -1;
  isoBandNextOTR[24] = isoBandNextOTR[146] = 0;

  isoBandNextXRB[6] = isoBandNextXRB[164] = -1;
  isoBandNextYRB[6] = isoBandNextYRB[164] = 0;
  isoBandNextORB[6] = isoBandNextORB[164] = 1;
  isoBandNextXBR[6] = isoBandNextXBR[164] = -1;
  isoBandNextYBR[6] = isoBandNextYBR[164] = 0;
  isoBandNextOBR[6] = isoBandNextOBR[164] = 0;
  isoBandNextXLB[6] = isoBandNextXLB[164] = 0;
  isoBandNextYLB[6] = isoBandNextYLB[164] = -1;
  isoBandNextOLB[6] = isoBandNextOLB[164] = 1;
  isoBandNextXLT[6] = isoBandNextXLT[164] = 1;
  isoBandNextYLT[6] = isoBandNextYLT[164] = 0;
  isoBandNextOLT[6] = isoBandNextOLT[164] = 0;

  isoBandNextXBL[129] = isoBandNextXBL[41] = 0;
  isoBandNextYBL[129] = isoBandNextYBL[41] = 1;
  isoBandNextOBL[129] = isoBandNextOBL[41] = 1;
  isoBandNextXLB[129] = isoBandNextXLB[41] = 0;
  isoBandNextYLB[129] = isoBandNextYLB[41] = 1;
  isoBandNextOLB[129] = isoBandNextOLB[41] = 0;
  isoBandNextXTL[129] = isoBandNextXTL[41] = -1;
  isoBandNextYTL[129] = isoBandNextYTL[41] = 0;
  isoBandNextOTL[129] = isoBandNextOTL[41] = 0;
  isoBandNextXTR[129] = isoBandNextXTR[41] = 0;
  isoBandNextYTR[129] = isoBandNextYTR[41] = -1;
  isoBandNextOTR[129] = isoBandNextOTR[41] = 0;

  isoBandNextXBR[66] = isoBandNextXBR[104] = 0;
  isoBandNextYBR[66] = isoBandNextYBR[104] = 1;
  isoBandNextOBR[66] = isoBandNextOBR[104] = 0;
  isoBandNextXBL[66] = isoBandNextXBL[104] = -1;
  isoBandNextYBL[66] = isoBandNextYBL[104] = 0;
  isoBandNextOBL[66] = isoBandNextOBL[104] = 1;
  isoBandNextXLT[66] = isoBandNextXLT[104] = 0;
  isoBandNextYLT[66] = isoBandNextYLT[104] = -1;
  isoBandNextOLT[66] = isoBandNextOLT[104] = 0;
  isoBandNextXTL[66] = isoBandNextXTL[104] = 0;
  isoBandNextYTL[66] = isoBandNextYTL[104] = -1;
  isoBandNextOTL[66] = isoBandNextOTL[104] = 1;

  isoBandNextXRT[144] = isoBandNextXRT[26] = -1;
  isoBandNextYRT[144] = isoBandNextYRT[26] = 0;
  isoBandNextORT[144] = isoBandNextORT[26] = 0;
  isoBandNextXLB[144] = isoBandNextXLB[26] = 1;
  isoBandNextYLB[144] = isoBandNextYLB[26] = 0;
  isoBandNextOLB[144] = isoBandNextOLB[26] = 1;
  isoBandNextXLT[144] = isoBandNextXLT[26] = 0;
  isoBandNextYLT[144] = isoBandNextYLT[26] = 1;
  isoBandNextOLT[144] = isoBandNextOLT[26] = 1;
  isoBandNextXTR[144] = isoBandNextXTR[26] = -1;
  isoBandNextYTR[144] = isoBandNextYTR[26] = 0;
  isoBandNextOTR[144] = isoBandNextOTR[26] = 1;

  isoBandNextXRB[36] = isoBandNextXRB[134] = 0;
  isoBandNextYRB[36] = isoBandNextYRB[134] = 1;
  isoBandNextORB[36] = isoBandNextORB[134] = 1;
  isoBandNextXBR[36] = isoBandNextXBR[134] = 0;
  isoBandNextYBR[36] = isoBandNextYBR[134] = 1;
  isoBandNextOBR[36] = isoBandNextOBR[134] = 0;
  isoBandNextXTL[36] = isoBandNextXTL[134] = 0;
  isoBandNextYTL[36] = isoBandNextYTL[134] = -1;
  isoBandNextOTL[36] = isoBandNextOTL[134] = 1;
  isoBandNextXTR[36] = isoBandNextXTR[134] = 1;
  isoBandNextYTR[36] = isoBandNextYTR[134] = 0;
  isoBandNextOTR[36] = isoBandNextOTR[134] = 0;

  isoBandNextXRT[9] = isoBandNextXRT[161] = -1;
  isoBandNextYRT[9] = isoBandNextYRT[161] = 0;
  isoBandNextORT[9] = isoBandNextORT[161] = 0;
  isoBandNextXRB[9] = isoBandNextXRB[161] = 0;
  isoBandNextYRB[9] = isoBandNextYRB[161] = -1;
  isoBandNextORB[9] = isoBandNextORB[161] = 0;
  isoBandNextXBL[9] = isoBandNextXBL[161] = 1;
  isoBandNextYBL[9] = isoBandNextYBL[161] = 0;
  isoBandNextOBL[9] = isoBandNextOBL[161] = 0;
  isoBandNextXLB[9] = isoBandNextXLB[161] = 1;
  isoBandNextYLB[9] = isoBandNextYLB[161] = 0;
  isoBandNextOLB[9] = isoBandNextOLB[161] = 1;

  /* 8-sided cases */
  isoBandNextXRT[136] = 0;
  isoBandNextYRT[136] = 1;
  isoBandNextORT[136] = 1;
  isoBandNextXRB[136] = 0;
  isoBandNextYRB[136] = 1;
  isoBandNextORB[136] = 0;
  isoBandNextXBR[136] = -1;
  isoBandNextYBR[136] = 0;
  isoBandNextOBR[136] = 1;
  isoBandNextXBL[136] = -1;
  isoBandNextYBL[136] = 0;
  isoBandNextOBL[136] = 0;
  isoBandNextXLB[136] = 0;
  isoBandNextYLB[136] = -1;
  isoBandNextOLB[136] = 0;
  isoBandNextXLT[136] = 0;
  isoBandNextYLT[136] = -1;
  isoBandNextOLT[136] = 1;
  isoBandNextXTL[136] = 1;
  isoBandNextYTL[136] = 0;
  isoBandNextOTL[136] = 0;
  isoBandNextXTR[136] = 1;
  isoBandNextYTR[136] = 0;
  isoBandNextOTR[136] = 1;

  isoBandNextXRT[34] = 0;
  isoBandNextYRT[34] = -1;
  isoBandNextORT[34] = 0;
  isoBandNextXRB[34] = 0;
  isoBandNextYRB[34] = -1;
  isoBandNextORB[34] = 1;
  isoBandNextXBR[34] = 1;
  isoBandNextYBR[34] = 0;
  isoBandNextOBR[34] = 0;
  isoBandNextXBL[34] = 1;
  isoBandNextYBL[34] = 0;
  isoBandNextOBL[34] = 1;
  isoBandNextXLB[34] = 0;
  isoBandNextYLB[34] = 1;
  isoBandNextOLB[34] = 1;
  isoBandNextXLT[34] = 0;
  isoBandNextYLT[34] = 1;
  isoBandNextOLT[34] = 0;
  isoBandNextXTL[34] = -1;
  isoBandNextYTL[34] = 0;
  isoBandNextOTL[34] = 1;
  isoBandNextXTR[34] = -1;
  isoBandNextYTR[34] = 0;
  isoBandNextOTR[34] = 0;

  isoBandNextXRT[35] = 0;
  isoBandNextYRT[35] = 1;
  isoBandNextORT[35] = 1;
  isoBandNextXRB[35] = 0;
  isoBandNextYRB[35] = -1;
  isoBandNextORB[35] = 1;
  isoBandNextXBR[35] = 1;
  isoBandNextYBR[35] = 0;
  isoBandNextOBR[35] = 0;
  isoBandNextXBL[35] = -1;
  isoBandNextYBL[35] = 0;
  isoBandNextOBL[35] = 0;
  isoBandNextXLB[35] = 0;
  isoBandNextYLB[35] = -1;
  isoBandNextOLB[35] = 0;
  isoBandNextXLT[35] = 0;
  isoBandNextYLT[35] = 1;
  isoBandNextOLT[35] = 0;
  isoBandNextXTL[35] = -1;
  isoBandNextYTL[35] = 0;
  isoBandNextOTL[35] = 1;
  isoBandNextXTR[35] = 1;
  isoBandNextYTR[35] = 0;
  isoBandNextOTR[35] = 1;

  /* 6-sided cases */
  isoBandNextXRT[153] = 0;
  isoBandNextYRT[153] = 1;
  isoBandNextORT[153] = 1;
  isoBandNextXBL[153] = -1;
  isoBandNextYBL[153] = 0;
  isoBandNextOBL[153] = 0;
  isoBandNextXLB[153] = 0;
  isoBandNextYLB[153] = -1;
  isoBandNextOLB[153] = 0;
  isoBandNextXTR[153] = 1;
  isoBandNextYTR[153] = 0;
  isoBandNextOTR[153] = 1;

  isoBandNextXRB[102] = 0;
  isoBandNextYRB[102] = -1;
  isoBandNextORB[102] = 1;
  isoBandNextXBR[102] = 1;
  isoBandNextYBR[102] = 0;
  isoBandNextOBR[102] = 0;
  isoBandNextXLT[102] = 0;
  isoBandNextYLT[102] = 1;
  isoBandNextOLT[102] = 0;
  isoBandNextXTL[102] = -1;
  isoBandNextYTL[102] = 0;
  isoBandNextOTL[102] = 1;

  isoBandNextXRT[155] = 0;
  isoBandNextYRT[155] = -1;
  isoBandNextORT[155] = 0;
  isoBandNextXBL[155] = 1;
  isoBandNextYBL[155] = 0;
  isoBandNextOBL[155] = 1;
  isoBandNextXLB[155] = 0;
  isoBandNextYLB[155] = 1;
  isoBandNextOLB[155] = 1;
  isoBandNextXTR[155] = -1;
  isoBandNextYTR[155] = 0;
  isoBandNextOTR[155] = 0;

  isoBandNextXRB[103] = 0;
  isoBandNextYRB[103] = 1;
  isoBandNextORB[103] = 0;
  isoBandNextXBR[103] = -1;
  isoBandNextYBR[103] = 0;
  isoBandNextOBR[103] = 1;
  isoBandNextXLT[103] = 0;
  isoBandNextYLT[103] = -1;
  isoBandNextOLT[103] = 1;
  isoBandNextXTL[103] = 1;
  isoBandNextYTL[103] = 0;
  isoBandNextOTL[103] = 0;

  /* 7-sided cases */
  isoBandNextXRT[152] = 0;
  isoBandNextYRT[152] = 1;
  isoBandNextORT[152] = 1;
  isoBandNextXBR[152] = -1;
  isoBandNextYBR[152] = 0;
  isoBandNextOBR[152] = 1;
  isoBandNextXBL[152] = -1;
  isoBandNextYBL[152] = 0;
  isoBandNextOBL[152] = 0;
  isoBandNextXLB[152] = 0;
  isoBandNextYLB[152] = -1;
  isoBandNextOLB[152] = 0;
  isoBandNextXLT[152] = 0;
  isoBandNextYLT[152] = -1;
  isoBandNextOLT[152] = 1;
  isoBandNextXTR[152] = 1;
  isoBandNextYTR[152] = 0;
  isoBandNextOTR[152] = 1;

  isoBandNextXRT[156] = 0;
  isoBandNextYRT[156] = -1;
  isoBandNextORT[156] = 1;
  isoBandNextXBR[156] = 1;
  isoBandNextYBR[156] = 0;
  isoBandNextOBR[156] = 1;
  isoBandNextXBL[156] = -1;
  isoBandNextYBL[156] = 0;
  isoBandNextOBL[156] = 0;
  isoBandNextXLB[156] = 0;
  isoBandNextYLB[156] = -1;
  isoBandNextOLB[156] = 0;
  isoBandNextXLT[156] = 0;
  isoBandNextYLT[156] = 1;
  isoBandNextOLT[156] = 1;
  isoBandNextXTR[156] = -1;
  isoBandNextYTR[156] = 0;
  isoBandNextOTR[156] = 1;

  isoBandNextXRT[137] = 0;
  isoBandNextYRT[137] = 1;
  isoBandNextORT[137] = 1;
  isoBandNextXRB[137] = 0;
  isoBandNextYRB[137] = 1;
  isoBandNextORB[137] = 0;
  isoBandNextXBL[137] = -1;
  isoBandNextYBL[137] = 0;
  isoBandNextOBL[137] = 0;
  isoBandNextXLB[137] = 0;
  isoBandNextYLB[137] = -1;
  isoBandNextOLB[137] = 0;
  isoBandNextXTL[137] = 1;
  isoBandNextYTL[137] = 0;
  isoBandNextOTL[137] = 0;
  isoBandNextXTR[137] = 1;
  isoBandNextYTR[137] = 0;
  isoBandNextOTR[137] = 1;

  isoBandNextXRT[139] = 0;
  isoBandNextYRT[139] = 1;
  isoBandNextORT[139] = 1;
  isoBandNextXRB[139] = 0;
  isoBandNextYRB[139] = -1;
  isoBandNextORB[139] = 0;
  isoBandNextXBL[139] = 1;
  isoBandNextYBL[139] = 0;
  isoBandNextOBL[139] = 0;
  isoBandNextXLB[139] = 0;
  isoBandNextYLB[139] = 1;
  isoBandNextOLB[139] = 0;
  isoBandNextXTL[139] = -1;
  isoBandNextYTL[139] = 0;
  isoBandNextOTL[139] = 0;
  isoBandNextXTR[139] = 1;
  isoBandNextYTR[139] = 0;
  isoBandNextOTR[139] = 1;

  isoBandNextXRT[98] = 0;
  isoBandNextYRT[98] = -1;
  isoBandNextORT[98] = 0;
  isoBandNextXRB[98] = 0;
  isoBandNextYRB[98] = -1;
  isoBandNextORB[98] = 1;
  isoBandNextXBR[98] = 1;
  isoBandNextYBR[98] = 0;
  isoBandNextOBR[98] = 0;
  isoBandNextXBL[98] = 1;
  isoBandNextYBL[98] = 0;
  isoBandNextOBL[98] = 1;
  isoBandNextXLT[98] = 0;
  isoBandNextYLT[98] = 1;
  isoBandNextOLT[98] = 0;
  isoBandNextXTL[98] = -1;
  isoBandNextYTL[98] = 0;
  isoBandNextOTL[98] = 1;

  isoBandNextXRT[99] = 0;
  isoBandNextYRT[99] = 1;
  isoBandNextORT[99] = 0;
  isoBandNextXRB[99] = 0;
  isoBandNextYRB[99] = -1;
  isoBandNextORB[99] = 1;
  isoBandNextXBR[99] = 1;
  isoBandNextYBR[99] = 0;
  isoBandNextOBR[99] = 0;
  isoBandNextXBL[99] = -1;
  isoBandNextYBL[99] = 0;
  isoBandNextOBL[99] = 1;
  isoBandNextXLT[99] = 0;
  isoBandNextYLT[99] = -1;
  isoBandNextOLT[99] = 0;
  isoBandNextXTL[99] = 1;
  isoBandNextYTL[99] = 0;
  isoBandNextOTL[99] = 1;

  isoBandNextXRB[38] = 0;
  isoBandNextYRB[38] = -1;
  isoBandNextORB[38] = 1;
  isoBandNextXBR[38] = 1;
  isoBandNextYBR[38] = 0;
  isoBandNextOBR[38] = 0;
  isoBandNextXLB[38] = 0;
  isoBandNextYLB[38] = 1;
  isoBandNextOLB[38] = 1;
  isoBandNextXLT[38] = 0;
  isoBandNextYLT[38] = 1;
  isoBandNextOLT[38] = 0;
  isoBandNextXTL[38] = -1;
  isoBandNextYTL[38] = 0;
  isoBandNextOTL[38] = 1;
  isoBandNextXTR[38] = -1;
  isoBandNextYTR[38] = 0;
  isoBandNextOTR[38] = 0;

  isoBandNextXRB[39] = 0;
  isoBandNextYRB[39] = 1;
  isoBandNextORB[39] = 1;
  isoBandNextXBR[39] = -1;
  isoBandNextYBR[39] = 0;
  isoBandNextOBR[39] = 0;
  isoBandNextXLB[39] = 0;
  isoBandNextYLB[39] = -1;
  isoBandNextOLB[39] = 1;
  isoBandNextXLT[39] = 0;
  isoBandNextYLT[39] = 1;
  isoBandNextOLT[39] = 0;
  isoBandNextXTL[39] = -1;
  isoBandNextYTL[39] = 0;
  isoBandNextOTL[39] = 1;
  isoBandNextXTR[39] = 1;
  isoBandNextYTR[39] = 0;
  isoBandNextOTR[39] = 0;


  /*
   Define helper functions for the polygon_table
   */

  /* triangle cases */
  var p00 = function (cell) {
    return [[cell.bottomleft, 0], [0, 0], [0, cell.leftbottom]];
  };
  var p01 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0]];
  };
  var p02 = function (cell) {
    return [[cell.topright, 1], [1, 1], [1, cell.righttop]];
  };
  var p03 = function (cell) {
    return [[0, cell.lefttop], [0, 1], [cell.topleft, 1]];
  };
  /* trapezoid cases */
  var p04 = function (cell) {
    return [[cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.leftbottom], [0, cell.lefttop]];
  };
  var p05 = function (cell) {
    return [[cell.bottomright, 0], [cell.bottomleft, 0], [1, cell.righttop], [1, cell.rightbottom]];
  };
  var p06 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.topleft, 1], [cell.topright, 1]];
  };
  var p07 = function (cell) {
    return [[0, cell.leftbottom], [0, cell.lefttop], [cell.topleft, 1], [cell.topright, 1]];
  };
  /* rectangle cases */
  var p08 = function (cell) {
    return [[0, 0], [0, cell.leftbottom], [1, cell.rightbottom], [1, 0]];
  };
  var p09 = function (cell) {
    return [[1, 0], [cell.bottomright, 0], [cell.topright, 1], [1, 1]];
  };
  var p10 = function (cell) {
    return [[1, 1], [1, cell.righttop], [0, cell.lefttop], [0, 1]];
  };
  var p11 = function (cell) {
    return [[cell.bottomleft, 0], [0, 0], [0, 1], [cell.topleft, 1]];
  };
  var p12 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [0, cell.leftbottom], [0, cell.lefttop]];
  };
  var p13 = function (cell) {
    return [[cell.topleft, 1], [cell.topright, 1], [cell.bottomright, 0], [cell.bottomleft, 0]];
  };
  /* square case */
  var p14 = function () {
    return [[0, 0], [0, 1], [1, 1], [1, 0]];
  };
  /* pentagon cases */
  var p15 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [0, 0], [0, 1], [cell.topleft, 1]];
  };
  /* 1211 || 1011 */
  var p16 = function (cell) {
    return [[cell.topright, 1], [1, 1], [1, 0], [0, 0], [0, cell.leftbottom]];
  };
  /* 2111 || 0111 */
  var p17 = function (cell) {
    return [[1, 0], [cell.bottomright, 0], [0, cell.lefttop], [0, 1], [1, 1]];
  };
  /* 1112 || 1110 */
  var p18 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomleft, 0], [0, 0], [0, 1]];
  };
  /* 1121 || 1101 */
  var p19 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [0, cell.lefttop], [0, 1], [cell.topleft, 1]];
  };
  /* 1200 || 1022 */
  var p20 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomright, 0], [cell.bottomleft, 0], [cell.topright, 1]];
  };
  /* 0120 || 2102 */
  var p21 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0], [0, cell.leftbottom], [0, cell.lefttop]];
  };
  /* 0012 || 2210 */
  var p22 = function (cell) {
    return [[cell.topright, 1], [cell.bottomleft, 0], [0, 0], [0, cell.leftbottom], [cell.topleft, 1]];
  };
  /* 2001 || 0221 */
  var p23 = function (cell) {
    return [[cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.lefttop], [0, 1], [cell.topleft, 1]];
  };
  /* 1002 || 1220 */
  var p24 = function (cell) {
    return [[1, 1], [1, cell.righttop], [0, cell.leftbottom], [0, cell.lefttop], [cell.topright, 1]];
  };
  /* 2100 || 0122 */
  var p25 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0], [cell.topleft, 1], [cell.topright, 1]];
  };
  /* 0210 || 2012 */
  var p26 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.bottomleft, 0], [0, 0], [0, cell.leftbottom]];
  };
  /* 0021 || 2201 */
  /*hexagon cases */
  var p27 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [0, 0], [0, cell.leftbottom], [cell.topleft, 1], [cell.topright, 1]];
  };
  /* 0211 || 2011 */
  var p28 = function (cell) {
    return [[1, 1], [1, 0], [cell.bottomright, 0], [0, cell.leftbottom], [0, cell.lefttop], [cell.topright, 1]];
  };
  /* 2110 || 0112 */
  var p29 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.lefttop], [0, 1]];
  };
  /* 1102 || 1120 */
  var p30 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.bottomleft, 0], [0, 0], [0, 1], [cell.topleft, 1]];
  };
  /* 1021 || 1201 */
  var p31 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomleft, 0], [0, 0], [0, cell.leftbottom], [cell.topright, 1]];
  };
  /* 2101 || 0121 */
  var p32 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0], [0, cell.lefttop], [0, 1], [cell.topleft, 1]];
  };
  /* 1012 || 1210 */
  /* 8-sided cases */
  var p33 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.leftbottom], [0, cell.lefttop], [cell.topleft, 1], [cell.topright, 1]];
  };
  /* flipped == 1 state for 0202 and 2020 */
  /* 6-sided cases */
  var p34 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomleft, 0], [0, 0], [0, cell.leftbottom], [cell.topright, 1]];
  };
  /* 0101 with flipped == 1 || 2121 with flipped == 1 */
  var p35 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0], [0, cell.lefttop], [0, 1], [cell.topleft, 1]];
  };
  /* 1010 with flipped == 1 || 1212 with flipped == 1 */
  /* 7-sided cases */
  var p36 = function (cell) {
    return [[1, 1], [1, cell.righttop], [cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.leftbottom], [0, cell.lefttop], [cell.topright, 1]];
  };
  /* 2120 with flipped == 1 || 0102 with flipped == 1 */
  var p37 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.bottomleft, 0], [0, 0], [0, cell.leftbottom], [cell.topleft, 1], [cell.topright, 1]];
  };
  /* 2021 with flipped == 1 || 0201 with flipped == 1 */
  var p38 = function (cell) {
    return [[1, cell.righttop], [1, cell.rightbottom], [cell.bottomright, 0], [cell.bottomleft, 0], [0, cell.lefttop], [0, 1], [cell.topleft, 1]];
  };
  /* 1202 with flipped == 1 || 1020 with flipped == 1 */
  var p39 = function (cell) {
    return [[1, cell.rightbottom], [1, 0], [cell.bottomright, 0], [0, cell.leftbottom], [0, cell.lefttop], [cell.topleft, 1], [cell.topright, 1]];
  };
  /* 0212 with flipped == 1 || 2010 with flipped == 1 */



  /*
    The lookup tables for edge number given the polygon
    is entered at a specific location
  */

  var isoBandEdgeRT = [];
  var isoBandEdgeRB = [];
  var isoBandEdgeBR = [];
  var isoBandEdgeBL = [];
  var isoBandEdgeLB = [];
  var isoBandEdgeLT = [];
  var isoBandEdgeTL = [];
  var isoBandEdgeTR = [];

  /* triangle cases */
  isoBandEdgeBL[1]    = isoBandEdgeLB[1]    = 18;
  isoBandEdgeBL[169]  = isoBandEdgeLB[169]  = 18;
  isoBandEdgeBR[4]    = isoBandEdgeRB[4]    = 12;
  isoBandEdgeBR[166]  = isoBandEdgeRB[166]  = 12;
  isoBandEdgeRT[16]   = isoBandEdgeTR[16]   = 4;
  isoBandEdgeRT[154]  = isoBandEdgeTR[154]  = 4;
  isoBandEdgeLT[64]   = isoBandEdgeTL[64]   = 22;
  isoBandEdgeLT[106]  = isoBandEdgeTL[106]  = 22;

  /* trapezoid cases */
  isoBandEdgeBR[2]    = isoBandEdgeLT[2]    = 17;
  isoBandEdgeBL[2]    = isoBandEdgeLB[2]    = 18;
  isoBandEdgeBR[168]  = isoBandEdgeLT[168]  = 17;
  isoBandEdgeBL[168]  = isoBandEdgeLB[168]  = 18;
  isoBandEdgeRT[8]    = isoBandEdgeBL[8]    = 9;
  isoBandEdgeRB[8]    = isoBandEdgeBR[8]    = 12;
  isoBandEdgeRT[162]  = isoBandEdgeBL[162]  = 9;
  isoBandEdgeRB[162]  = isoBandEdgeBR[162]  = 12;
  isoBandEdgeRT[32]   = isoBandEdgeTR[32]   = 4;
  isoBandEdgeRB[32]   = isoBandEdgeTL[32]   = 1;
  isoBandEdgeRT[138]  = isoBandEdgeTR[138]  = 4;
  isoBandEdgeRB[138]  = isoBandEdgeTL[138]  = 1;
  isoBandEdgeLB[128]  = isoBandEdgeTR[128]  = 21;
  isoBandEdgeLT[128]  = isoBandEdgeTL[128]  = 22;
  isoBandEdgeLB[42]   = isoBandEdgeTR[42]   = 21;
  isoBandEdgeLT[42]   = isoBandEdgeTL[42]   = 22;

  /* rectangle cases */
  isoBandEdgeRB[5] = isoBandEdgeLB[5] = 14;
  isoBandEdgeRB[165] = isoBandEdgeLB[165] = 14;
  isoBandEdgeBR[20] = isoBandEdgeTR[20] = 6;
  isoBandEdgeBR[150] = isoBandEdgeTR[150] = 6;
  isoBandEdgeRT[80] = isoBandEdgeLT[80] = 11;
  isoBandEdgeRT[90] = isoBandEdgeLT[90] = 11;
  isoBandEdgeBL[65] = isoBandEdgeTL[65] = 3;
  isoBandEdgeBL[105] = isoBandEdgeTL[105] = 3;
  isoBandEdgeRT[160] = isoBandEdgeLT[160] = 11;
  isoBandEdgeRB[160] = isoBandEdgeLB[160] = 14;
  isoBandEdgeRT[10] = isoBandEdgeLT[10] = 11;
  isoBandEdgeRB[10] = isoBandEdgeLB[10] = 14;
  isoBandEdgeBR[130] = isoBandEdgeTR[130] = 6;
  isoBandEdgeBL[130] = isoBandEdgeTL[130] = 3;
  isoBandEdgeBR[40] = isoBandEdgeTR[40] = 6;
  isoBandEdgeBL[40] = isoBandEdgeTL[40] = 3;

  /* pentagon cases */
  isoBandEdgeRB[101] = isoBandEdgeTL[101] = 1;
  isoBandEdgeRB[69] = isoBandEdgeTL[69] = 1;
  isoBandEdgeLB[149] = isoBandEdgeTR[149] = 21;
  isoBandEdgeLB[21] = isoBandEdgeTR[21] = 21;
  isoBandEdgeBR[86] = isoBandEdgeLT[86] = 17;
  isoBandEdgeBR[84] = isoBandEdgeLT[84] = 17;
  isoBandEdgeRT[89] = isoBandEdgeBL[89] = 9;
  isoBandEdgeRT[81] = isoBandEdgeBL[81] = 9;
  isoBandEdgeRT[96] = isoBandEdgeTL[96] = 0;
  isoBandEdgeRB[96] = isoBandEdgeLT[96] = 15;
  isoBandEdgeRT[74] = isoBandEdgeTL[74] = 0;
  isoBandEdgeRB[74] = isoBandEdgeLT[74] = 15;
  isoBandEdgeRT[24] = isoBandEdgeBR[24] = 8;
  isoBandEdgeBL[24] = isoBandEdgeTR[24] = 7;
  isoBandEdgeRT[146] = isoBandEdgeBR[146] = 8;
  isoBandEdgeBL[146] = isoBandEdgeTR[146] = 7;
  isoBandEdgeRB[6] = isoBandEdgeLT[6] = 15;
  isoBandEdgeBR[6] = isoBandEdgeLB[6] = 16;
  isoBandEdgeRB[164] = isoBandEdgeLT[164] = 15;
  isoBandEdgeBR[164] = isoBandEdgeLB[164] = 16;
  isoBandEdgeBL[129] = isoBandEdgeTR[129] = 7;
  isoBandEdgeLB[129] = isoBandEdgeTL[129] = 20;
  isoBandEdgeBL[41] = isoBandEdgeTR[41] = 7;
  isoBandEdgeLB[41] = isoBandEdgeTL[41] = 20;
  isoBandEdgeBR[66] = isoBandEdgeTL[66] = 2;
  isoBandEdgeBL[66] = isoBandEdgeLT[66] = 19;
  isoBandEdgeBR[104] = isoBandEdgeTL[104] = 2;
  isoBandEdgeBL[104] = isoBandEdgeLT[104] = 19;
  isoBandEdgeRT[144] = isoBandEdgeLB[144] = 10;
  isoBandEdgeLT[144] = isoBandEdgeTR[144] = 23;
  isoBandEdgeRT[26] = isoBandEdgeLB[26] = 10;
  isoBandEdgeLT[26] = isoBandEdgeTR[26] = 23;
  isoBandEdgeRB[36] = isoBandEdgeTR[36] = 5;
  isoBandEdgeBR[36] = isoBandEdgeTL[36] = 2;
  isoBandEdgeRB[134] = isoBandEdgeTR[134] = 5;
  isoBandEdgeBR[134] = isoBandEdgeTL[134] = 2;
  isoBandEdgeRT[9] = isoBandEdgeLB[9] = 10;
  isoBandEdgeRB[9] = isoBandEdgeBL[9] = 13;
  isoBandEdgeRT[161] = isoBandEdgeLB[161] = 10;
  isoBandEdgeRB[161] = isoBandEdgeBL[161] = 13;

  /* hexagon cases */
  isoBandEdgeRB[37] = isoBandEdgeTR[37] = 5;
  isoBandEdgeLB[37] = isoBandEdgeTL[37] = 20;
  isoBandEdgeRB[133] = isoBandEdgeTR[133] = 5;
  isoBandEdgeLB[133] = isoBandEdgeTL[133] = 20;
  isoBandEdgeBR[148] = isoBandEdgeLB[148] = 16;
  isoBandEdgeLT[148] = isoBandEdgeTR[148] = 23;
  isoBandEdgeBR[22] = isoBandEdgeLB[22] = 16;
  isoBandEdgeLT[22] = isoBandEdgeTR[22] = 23;
  isoBandEdgeRT[82] = isoBandEdgeBR[82] = 8;
  isoBandEdgeBL[82] = isoBandEdgeLT[82] = 19;
  isoBandEdgeRT[88] = isoBandEdgeBR[88] = 8;
  isoBandEdgeBL[88] = isoBandEdgeLT[88] = 19;
  isoBandEdgeRT[73] = isoBandEdgeTL[73] = 0;
  isoBandEdgeRB[73] = isoBandEdgeBL[73] = 13;
  isoBandEdgeRT[97] = isoBandEdgeTL[97] = 0;
  isoBandEdgeRB[97] = isoBandEdgeBL[97] = 13;
  isoBandEdgeRT[145] = isoBandEdgeBL[145] = 9;
  isoBandEdgeLB[145] = isoBandEdgeTR[145] = 21;
  isoBandEdgeRT[25] = isoBandEdgeBL[25] = 9;
  isoBandEdgeLB[25] = isoBandEdgeTR[25] = 21;
  isoBandEdgeRB[70] = isoBandEdgeTL[70] = 1;
  isoBandEdgeBR[70] = isoBandEdgeLT[70] = 17;
  isoBandEdgeRB[100] = isoBandEdgeTL[100] = 1;
  isoBandEdgeBR[100] = isoBandEdgeLT[100] = 17;

  /* 8-sided cases */
  isoBandEdgeRT[34] = isoBandEdgeBL[34] = 9;
  isoBandEdgeRB[34] = isoBandEdgeBR[34] = 12;
  isoBandEdgeLB[34] = isoBandEdgeTR[34] = 21;
  isoBandEdgeLT[34] = isoBandEdgeTL[34] = 22;
  isoBandEdgeRT[136] = isoBandEdgeTR[136] = 4;
  isoBandEdgeRB[136] = isoBandEdgeTL[136] = 1;
  isoBandEdgeBR[136] = isoBandEdgeLT[136] = 17;
  isoBandEdgeBL[136] = isoBandEdgeLB[136] = 18;
  isoBandEdgeRT[35] = isoBandEdgeTR[35] = 4;
  isoBandEdgeRB[35] = isoBandEdgeBR[35] = 12;
  isoBandEdgeBL[35] = isoBandEdgeLB[35] = 18;
  isoBandEdgeLT[35] = isoBandEdgeTL[35] = 22;

  /* 6-sided cases */
  isoBandEdgeRT[153] = isoBandEdgeTR[153] = 4;
  isoBandEdgeBL[153] = isoBandEdgeLB[153] = 18;
  isoBandEdgeRB[102] = isoBandEdgeBR[102] = 12;
  isoBandEdgeLT[102] = isoBandEdgeTL[102] = 22;
  isoBandEdgeRT[155] = isoBandEdgeBL[155] = 9;
  isoBandEdgeLB[155] = isoBandEdgeTR[155] = 23;
  isoBandEdgeRB[103] = isoBandEdgeTL[103] = 1;
  isoBandEdgeBR[103] = isoBandEdgeLT[103] = 17;

  /* 7-sided cases */
  isoBandEdgeRT[152] = isoBandEdgeTR[152] = 4;
  isoBandEdgeBR[152] = isoBandEdgeLT[152] = 17;
  isoBandEdgeBL[152] = isoBandEdgeLB[152] = 18;
  isoBandEdgeRT[156] = isoBandEdgeBR[156] = 8;
  isoBandEdgeBL[156] = isoBandEdgeLB[156] = 18;
  isoBandEdgeLT[156] = isoBandEdgeTR[156] = 23;
  isoBandEdgeRT[137] = isoBandEdgeTR[137] = 4;
  isoBandEdgeRB[137] = isoBandEdgeTL[137] = 1;
  isoBandEdgeBL[137] = isoBandEdgeLB[137] = 18;
  isoBandEdgeRT[139] = isoBandEdgeTR[139] = 4;
  isoBandEdgeRB[139] = isoBandEdgeBL[139] = 13;
  isoBandEdgeLB[139] = isoBandEdgeTL[139] = 20;
  isoBandEdgeRT[98] = isoBandEdgeBL[98] = 9;
  isoBandEdgeRB[98] = isoBandEdgeBR[98] = 12;
  isoBandEdgeLT[98] = isoBandEdgeTL[98] = 22;
  isoBandEdgeRT[99] = isoBandEdgeTL[99] = 0;
  isoBandEdgeRB[99] = isoBandEdgeBR[99] = 12;
  isoBandEdgeBL[99] = isoBandEdgeLT[99] = 19;
  isoBandEdgeRB[38] = isoBandEdgeBR[38] = 12;
  isoBandEdgeLB[38] = isoBandEdgeTR[38] = 21;
  isoBandEdgeLT[38] = isoBandEdgeTL[38] = 22;
  isoBandEdgeRB[39] = isoBandEdgeTR[39] = 5;
  isoBandEdgeBR[39] = isoBandEdgeLB[39] = 16;
  isoBandEdgeLT[39] = isoBandEdgeTL[39] = 22;

  /*
    The lookup tables for all different polygons that
    may appear within a grid cell
  */

  var polygon_table = [];

  /* triangle cases */
  polygon_table[1] = polygon_table[169] = p00; /* 2221 || 0001 */
  polygon_table[4] = polygon_table[166] = p01; /* 2212 || 0010 */
  polygon_table[16] = polygon_table[154] = p02; /* 2122 || 0100 */
  polygon_table[64] = polygon_table[106] = p03; /* 1222 || 1000 */

  /* trapezoid cases */
  polygon_table[168] = polygon_table[2] = p04; /* 2220 || 0002 */
  polygon_table[162] = polygon_table[8] = p05; /* 2202 || 0020 */
  polygon_table[138] = polygon_table[32] = p06; /* 2022 || 0200 */
  polygon_table[42] = polygon_table[128] = p07; /* 0222 || 2000 */

  /* rectangle cases */
  polygon_table[5] = polygon_table[165] = p08; /* 0011 || 2211 */
  polygon_table[20] = polygon_table[150] = p09; /* 0110 || 2112 */
  polygon_table[80] = polygon_table[90] = p10; /* 1100 || 1122 */
  polygon_table[65] = polygon_table[105] = p11; /* 1001 || 1221 */
  polygon_table[160] = polygon_table[10] = p12; /* 2200 || 0022 */
  polygon_table[130] = polygon_table[40] = p13; /* 2002 || 0220 */

  /* square case */
  polygon_table[85] = p14; /* 1111 */

  /* pentagon cases */
  polygon_table[101] = polygon_table[69] = p15; /* 1211 || 1011 */
  polygon_table[149] = polygon_table[21] = p16; /* 2111 || 0111 */
  polygon_table[86] = polygon_table[84] = p17; /* 1112 || 1110 */
  polygon_table[89] = polygon_table[81] = p18; /* 1121 || 1101 */
  polygon_table[96] = polygon_table[74] = p19; /* 1200 || 1022 */
  polygon_table[24] = polygon_table[146] = p20; /* 0120 || 2102 */
  polygon_table[6] = polygon_table[164] = p21; /* 0012 || 2210 */
  polygon_table[129] = polygon_table[41] = p22; /* 2001 || 0221 */
  polygon_table[66] = polygon_table[104] = p23; /* 1002 || 1220 */
  polygon_table[144] = polygon_table[26] = p24; /* 2100 || 0122 */
  polygon_table[36] = polygon_table[134] = p25; /* 0210 || 2012 */
  polygon_table[9] = polygon_table[161] = p26; /* 0021 || 2201 */

  /* hexagon cases */
  polygon_table[37] = polygon_table[133] = p27; /* 0211 || 2011 */
  polygon_table[148] = polygon_table[22] = p28; /* 2110 || 0112 */
  polygon_table[82] = polygon_table[88] = p29; /* 1102 || 1120 */
  polygon_table[73] = polygon_table[97] = p30; /* 1021 || 1201 */
  polygon_table[145] = polygon_table[25] = p31; /* 2101 || 0121 */
  polygon_table[70] = polygon_table[100] = p32; /* 1012 || 1210 */

  /* 8-sided cases */
  polygon_table[34] = function(c){ return [ p07(c), p05(c) ];}; /* 0202 || 2020 with flipped == 0 */
  polygon_table[35] = p33; /* flipped == 1 state for 0202 and 2020 */
  polygon_table[136] = function(c){ return [ p06(c), p04(c) ];}; /* 2020 || 0202 with flipped == 0 */

  /* 6-sided cases */
  polygon_table[153] = function(c){ return [ p02(c), p00(c) ];}; /* 0101 with flipped == 0 || 2121 with flipped == 2 */
  polygon_table[102] = function(c){ return [ p01(c), p03(c) ];}; /* 1010 with flipped == 0 || 1212 with flipped == 2 */
  polygon_table[155] = p34; /* 0101 with flipped == 1 || 2121 with flipped == 1 */
  polygon_table[103] = p35; /* 1010 with flipped == 1 || 1212 with flipped == 1 */

  /* 7-sided cases */
  polygon_table[152] = function(c){ return [ p02(c), p04(c) ];}; /* 2120 with flipped == 2 || 0102 with flipped == 0 */
  polygon_table[156] = p36; /* 2120 with flipped == 1 || 0102 with flipped == 1 */
  polygon_table[137] = function(c){ return [ p06(c), p00(c) ];}; /* 2021 with flipped == 2 || 0201 with flipped == 0 */
  polygon_table[139] = p37; /* 2021 with flipped == 1 || 0201 with flipped == 1 */
  polygon_table[98] = function(c){ return [ p05(c), p03(c) ];}; /* 1202 with flipped == 2 || 1020 with flipped == 0 */
  polygon_table[99] = p38; /* 1202 with flipped == 1 || 1020 with flipped == 1 */
  polygon_table[38] = function(c){ return [ p01(c), p07(c) ];}; /* 0212 with flipped == 2 || 2010 with flipped == 0 */
  polygon_table[39] = p39; /* 0212 with flipped == 1 || 2010 with flipped == 1 */
  
  
  /*
  ####################################
  Some small helper functions
  ####################################
  */

  /* assume that x1 == 1 &&  x0 == 0 */
  function interpolateX(y, y0, y1){
    return (y - y0) / (y1 - y0);
  }

  function isArray(myArray) {
    return myArray.constructor.toString().indexOf("Array") > -1;
  }

  /*
  ####################################
  Below is the actual Marching Squares implementation
  ####################################
  */

  function computeBandGrid(data, minV, bandwidth){
    var rows = data.length - 1;
    var cols = data[0].length - 1;
    var BandGrid = { rows: rows, cols: cols, cells: [] };

    var maxV = minV + Math.abs(bandwidth);

    for(var j = 0; j < rows; ++j){
      BandGrid.cells[j] = [];
      for(var i = 0; i < cols; ++i){
        /*  compose the 4-trit corner representation */
        var cval = 0;

        var tl = data[j+1][i];
        var tr = data[j+1][i+1];
        var br = data[j][i+1];
        var bl = data[j][i];

        if(isNaN(tl) || isNaN(tr) || isNaN(br) || isNaN(bl)){
          continue;
        }

        cval |= (tl < minV) ? 0 : (tl > maxV) ? 128 : 64;
        cval |= (tr < minV) ? 0 : (tr > maxV) ? 32 : 16;
        cval |= (br < minV) ? 0 : (br > maxV) ? 8 : 4;
        cval |= (bl < minV) ? 0 : (bl > maxV) ? 2 : 1;

        var cval_real = +cval;

        /* resolve ambiguity via averaging */
        var flipped = 0;
        if(     (cval === 17) /* 0101 */
            ||  (cval === 18) /* 0102 */
            ||  (cval === 33) /* 0201 */
            ||  (cval === 34) /* 0202 */
            ||  (cval === 38) /* 0212 */
            ||  (cval === 68) /* 1010 */
            ||  (cval === 72) /* 1020 */
            ||  (cval === 98) /* 1202 */
            ||  (cval === 102) /* 1212 */
            ||  (cval === 132) /* 2010 */
            ||  (cval === 136) /* 2020 */
            ||  (cval === 137) /* 2021 */
            ||  (cval === 152) /* 2120 */
            ||  (cval === 153) /* 2121 */
        ){
          var average = (tl + tr + br + bl) / 4;
          /* set flipped state */
          flipped = (average > maxV) ? 2 : (average < minV) ? 0 : 1;

          /* adjust cval for flipped cases */

          /* 8-sided cases */
          if(cval === 34){
            if(flipped === 1){
              cval = 35;
            } else if(flipped === 0){
              cval = 136;
            }
          } else if(cval === 136){
            if(flipped === 1){
              cval = 35;
              flipped = 4;
            } else if(flipped === 0){
              cval = 34;
            }
          }

          /* 6-sided polygon cases */
          else if(cval === 17){
            if(flipped === 1){
              cval = 155;
              flipped = 4;
            } else if(flipped === 0){
              cval = 153;
            }
          } else if(cval === 68){
            if(flipped === 1){
              cval = 103;
              flipped = 4;
            } else if(flipped === 0){
              cval = 102;
            }
          } else if(cval === 153){
            if(flipped === 1)
              cval = 155;
          } else if(cval === 102){
            if(flipped === 1)
              cval = 103;
          }

          /* 7-sided polygon cases */
          else if(cval === 152){
            if(flipped < 2){
              cval    = 156;
              flipped = 1;
            }
          } else if(cval === 137){
            if(flipped < 2){
              cval = 139;
              flipped = 1;
            }
          } else if(cval === 98){
            if(flipped < 2){
              cval    = 99;
              flipped = 1;
            }
          } else if(cval === 38){
            if(flipped < 2){
              cval    = 39;
              flipped = 1;
            }
          } else if(cval === 18){
            if(flipped > 0){
              cval = 156;
              flipped = 4;
            } else {
              cval = 152;
            }
          } else if(cval === 33){
            if(flipped > 0){
              cval = 139;
              flipped = 4;
            } else {
              cval = 137;
            }
          } else if(cval === 72){
            if(flipped > 0){
              cval = 99;
              flipped = 4;
            } else {
              cval = 98;
            }
          } else if(cval === 132){
            if(flipped > 0){
              cval = 39;
              flipped = 4;
            } else {
              cval = 38;
            }
          }
        }

        /* add cell to BandGrid if it contains at least one polygon-side */
        if((cval != 0) && (cval != 170)){
          var topleft, topright, bottomleft, bottomright,
              righttop, rightbottom, lefttop, leftbottom;

          topleft = topright = bottomleft = bottomright = righttop
                  = rightbottom = lefttop = leftbottom = 0.5;

          var edges = [];

          /* do interpolation here */
          /* 1st Triangles */
          if(cval === 1){ /* 0001 */
            bottomleft = 1 - interpolateX(minV, br, bl);
            leftbottom = 1 - interpolateX(minV, tl, bl);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 169){ /* 2221 */
            bottomleft = interpolateX(maxV, bl, br);
            leftbottom = interpolateX(maxV, bl, tl);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 4){ /* 0010 */
            rightbottom = 1 - interpolateX(minV, tr, br);
            bottomright = interpolateX(minV, bl, br);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 166){ /* 2212 */
            rightbottom = interpolateX(maxV, br, tr);
            bottomright = 1 - interpolateX(maxV, br, bl);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 16){ /* 0100 */
            righttop = interpolateX(minV, br, tr);
            topright = interpolateX(minV, tl, tr);
            edges.push(isoBandEdgeRT[cval]);
          } else if(cval === 154){ /* 2122 */
            righttop = 1 - interpolateX(maxV, tr, br);
            topright = 1 - interpolateX(maxV, tr, tl);
            edges.push(isoBandEdgeRT[cval]);
          } else if(cval === 64){ /* 1000 */
            lefttop = interpolateX(minV, bl, tl);
            topleft = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 106){ /* 1222 */
            lefttop = 1 - interpolateX(maxV, tl, bl);
            topleft = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeLT[cval]);
          }
          /* 2nd Trapezoids */
          else if(cval === 168){ /* 2220 */
            bottomright = interpolateX(maxV, bl, br);
            bottomleft = interpolateX(minV, bl, br);
            leftbottom = interpolateX(minV, bl, tl);
            lefttop = interpolateX(maxV, bl, tl);
            edges.push(isoBandEdgeBR[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 2){ /* 0002 */
            bottomright = 1 - interpolateX(minV, br, bl);
            bottomleft = 1 - interpolateX(maxV, br, bl);
            leftbottom = 1 - interpolateX(maxV, tl, bl);
            lefttop = 1 - interpolateX(minV, tl, bl);
            edges.push(isoBandEdgeBR[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 162){ /* 2202 */
            righttop = interpolateX(maxV, br, tr);
            rightbottom = interpolateX(minV, br, tr);
            bottomright = 1 - interpolateX(minV, br, bl);
            bottomleft = 1 - interpolateX(maxV, br, bl);
            edges.push(isoBandEdgeBR[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 8){ /* 0020 */
            righttop = 1 - interpolateX(minV, tr, br);
            rightbottom = 1 - interpolateX(maxV, tr, br);
            bottomright = interpolateX(maxV, bl, br);
            bottomleft = interpolateX(minV, bl, br);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 138){ /* 2022 */
            righttop = 1 - interpolateX(minV, tr, br);
            rightbottom = 1 - interpolateX(maxV, tr, br);
            topleft = 1 - interpolateX(maxV, tr, tl);
            topright = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 32){ /* 0200 */
            righttop = interpolateX(maxV, br, tr);
            rightbottom = interpolateX(minV, br, tr);
            topleft = interpolateX(minV, tl, tr);
            topright = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 42){ /* 0222 */
            leftbottom = 1 - interpolateX(maxV, tl, bl);
            lefttop = 1 - interpolateX(minV, tl, bl);
            topleft = interpolateX(minV, tl, tr);
            topright = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeLB[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 128){ /* 2000 */
            leftbottom = interpolateX(minV, bl, tl);
            lefttop = interpolateX(maxV, bl, tl);
            topleft = 1 - interpolateX(maxV, tr, tl);
            topright = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeLB[cval]);
            edges.push(isoBandEdgeLT[cval]);
          }

          /* 3rd rectangle cases */
          if(cval === 5){ /* 0011 */
            rightbottom = 1 - interpolateX(minV, tr, br);
            leftbottom = 1 - interpolateX(minV, tl, bl);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 165){ /* 2211 */
            rightbottom = interpolateX(maxV, br, tr);
            leftbottom = interpolateX(maxV, bl, tl);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 20){ /* 0110 */
            bottomright = interpolateX(minV, bl, br);
            topright = interpolateX(minV, tl, tr);
            edges.push(isoBandEdgeBR[cval]);
          } else if(cval === 150){ /* 2112 */
            bottomright = 1 - interpolateX(maxV, br, bl);
            topright = 1 - interpolateX(maxV, tr, tl);
            edges.push(isoBandEdgeBR[cval]);
          } else if(cval === 80){ /* 1100 */
            righttop = interpolateX(minV, br, tr);
            lefttop = interpolateX(minV, bl, tl);
            edges.push(isoBandEdgeRT[cval]);
          } else if(cval === 90){ /* 1122 */
            righttop = 1 - interpolateX(maxV, tr, br);
            lefttop = 1 - interpolateX(maxV, tl, bl);
            edges.push(isoBandEdgeRT[cval]);
          } else if(cval === 65){ /* 1001 */
            bottomleft = 1 - interpolateX(minV, br, bl);
            topleft = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 105){ /* 1221 */
            bottomleft = interpolateX(maxV, bl, br);
            topleft = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 160){ /* 2200 */
            righttop = interpolateX(maxV, br, tr);
            rightbottom = interpolateX(minV, br, tr);
            leftbottom = interpolateX(minV, bl, tl);
            lefttop = interpolateX(maxV, bl, tl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 10){ /* 0022 */
            righttop = 1 - interpolateX(minV, tr, br);
            rightbottom = 1 - interpolateX(maxV, tr, br);
            leftbottom = 1 - interpolateX(maxV, tl, bl);
            lefttop = 1 - interpolateX(minV, tl, bl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 130){ /* 2002 */
            bottomright = 1 - interpolateX(minV, br, bl);
            bottomleft = 1 - interpolateX(maxV, br, bl);
            topleft = 1 - interpolateX(maxV, tr, tl);
            topright = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeBR[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 40){ /* 0220 */
            bottomright = interpolateX(maxV, bl, br);
            bottomleft = interpolateX(minV, bl, br);
            topleft = interpolateX(minV, tl, tr);
            topright = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeBR[cval]);
            edges.push(isoBandEdgeBL[cval]);
          }

          /* 4th single pentagon cases */
          else if(cval === 101){ /* 1211 */
            rightbottom = interpolateX(maxV, br, tr);
            topleft = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 69){ /* 1011 */
            rightbottom = 1 - interpolateX(minV, tr, br);
            topleft = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 149){ /* 2111 */
            leftbottom = interpolateX(maxV, bl, tl);
            topright = 1 - interpolateX(maxV, tr, tl);
            edges.push(isoBandEdgeLB[cval]);
          } else if(cval === 21){ /* 0111 */
            leftbottom = 1 - interpolateX(minV, tl, bl);
            topright = interpolateX(minV, tl, tr);
            edges.push(isoBandEdgeLB[cval]);
          } else if(cval === 86){ /* 1112 */
            bottomright = 1 - interpolateX(maxV, br, bl);
            lefttop = 1 - interpolateX(maxV, tl, bl);
            edges.push(isoBandEdgeBR[cval]);
          } else if(cval === 84){ /* 1110 */
            bottomright = interpolateX(minV, bl, br);
            lefttop = interpolateX(minV, bl, tl);
            edges.push(isoBandEdgeBR[cval]);
          } else if(cval === 89){ /* 1121 */
            righttop = 1 - interpolateX(maxV, tr, br);
            bottomleft = interpolateX(maxV, bl, br);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 81){ /* 1101 */
            righttop = interpolateX(minV, br, tr);
            bottomleft = 1 - interpolateX(minV, br, bl);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 96){ /* 1200 */
            righttop = interpolateX(maxV, br, tr);
            rightbottom = interpolateX(minV, br, tr);
            lefttop = interpolateX(minV, bl, tl);
            topleft = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 74){ /* 1022 */
            righttop = 1 - interpolateX(minV, tr, br);
            rightbottom = 1- interpolateX(maxV, tr, br);
            lefttop = 1 - interpolateX(maxV, tl, bl);
            topleft = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 24){ /* 0120 */
            righttop = 1 - interpolateX(maxV, tr, br);
            bottomright = interpolateX(maxV, bl, br);
            bottomleft = interpolateX(minV, bl, br);
            topright = interpolateX(minV, tl, tr);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 146){ /* 2102 */
            righttop = interpolateX(minV, br, tr);
            bottomright = 1 - interpolateX(minV, br, bl);
            bottomleft = 1 - interpolateX(maxV, br, bl);
            topright = 1 - interpolateX(maxV, tr, tl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 6){ /* 0012 */
            rightbottom = 1 - interpolateX(minV, tr, br);
            bottomright = 1 - interpolateX(maxV, br, bl);
            leftbottom = 1 - interpolateX(maxV, tl, bl);
            lefttop = 1 - interpolateX(minV, tl, bl);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBR[cval]);
          } else if(cval === 164){ /* 2210 */
            rightbottom = interpolateX(maxV, br, tr);
            bottomright = interpolateX(minV, bl, br);
            leftbottom = interpolateX(minV, bl, tl);
            lefttop = interpolateX(maxV, bl, tl);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBR[cval]);
          } else if(cval === 129){ /* 2001 */
            bottomleft = 1 - interpolateX(minV, br, bl);
            leftbottom = interpolateX(maxV, bl, tl);
            topleft = 1 - interpolateX(maxV, tr, tl);
            topright = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeBL[cval]);
            edges.push(isoBandEdgeLB[cval]);
          } else if(cval === 41){ /* 0221 */
            bottomleft = interpolateX(maxV, bl, br);
            leftbottom = 1 - interpolateX(minV, tl, bl);
            topleft = interpolateX(minV, tl, tr);
            topright = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeBL[cval]);
            edges.push(isoBandEdgeLB[cval]);
          } else if(cval === 66){ /* 1002 */
            bottomright = 1 - interpolateX(minV, br, bl);
            bottomleft = 1 - interpolateX(maxV, br, bl);
            lefttop = 1 - interpolateX(maxV, tl, bl);
            topleft = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeBR[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 104){ /* 1220 */
            bottomright = interpolateX(maxV, bl, br);
            bottomleft = interpolateX(minV, bl, br);
            lefttop = interpolateX(minV, bl, tl);
            topleft = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeBL[cval]);
            edges.push(isoBandEdgeTL[cval]);
          } else if(cval === 144){ /* 2100 */
            righttop = interpolateX(minV, br, tr);
            leftbottom = interpolateX(minV, bl, tl);
            lefttop = interpolateX(maxV, bl, tl);
            topright = 1 - interpolateX(maxV, tr, tl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 26){ /* 0122 */
            righttop = 1 - interpolateX(maxV, tr, br);
            leftbottom = 1 - interpolateX(maxV, tl, bl);
            lefttop = 1 - interpolateX(minV, tl, bl);
            topright = interpolateX(minV, tl, tr);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 36){ /* 0210 */
            rightbottom = interpolateX(maxV, br, tr);
            bottomright = interpolateX(minV, bl, br);
            topleft = interpolateX(minV, tl, tr);
            topright = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBR[cval]);
          } else if(cval === 134){ /* 2012 */
            rightbottom = 1 - interpolateX(minV, tr, br);
            bottomright = 1 - interpolateX(maxV, br, bl);
            topleft = 1 - interpolateX(maxV, tr, tl);
            topright = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBR[cval]);
          } else if(cval === 9){ /* 0021 */
            righttop = 1 - interpolateX(minV, tr, br);
            rightbottom = 1 - interpolateX(maxV, tr, br);
            bottomleft = interpolateX(maxV, bl, br);
            leftbottom = 1 - interpolateX(minV, tl, bl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 161){ /* 2201 */
            righttop = interpolateX(maxV, br, tr);
            rightbottom = interpolateX(minV, br, tr);
            bottomleft = 1 - interpolateX(minV, br, bl);
            leftbottom = interpolateX(maxV, bl, tl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          }

          /* 5th single hexagon cases */
          else if(cval === 37){ /* 0211 */
            rightbottom = interpolateX(maxV, br, tr);
            leftbottom = 1- interpolateX(minV, tl, bl);
            topleft = interpolateX(minV, tl, tr);
            topright = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeLB[cval]);
          } else if(cval === 133){ /* 2011 */
            rightbottom = 1 - interpolateX(minV, tr, br);
            leftbottom = interpolateX(maxV, bl, tl);
            topleft = 1 - interpolateX(maxV, tr, tl);
            topright = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeLB[cval]);
          } else if(cval === 148){ /* 2110 */
            bottomright = interpolateX(minV, bl, br);
            leftbottom = interpolateX(minV, bl, tl);
            lefttop = interpolateX(maxV, bl, tl);
            topright = 1 - interpolateX(maxV, tr, tl);
            edges.push(isoBandEdgeBR[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 22){ /* 0112 */
            bottomright = 1 - interpolateX(maxV, br, bl);
            leftbottom = 1 - interpolateX(maxV, tl, bl);
            lefttop = 1 - interpolateX(minV, tl, bl);
            topright = interpolateX(minV, tl, tr);
            edges.push(isoBandEdgeBR[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 82){ /* 1102 */
            righttop = interpolateX(minV, br, tr);
            bottomright = 1- interpolateX(minV, br, bl);
            bottomleft = 1 - interpolateX(maxV, br, bl);
            lefttop = 1 - interpolateX(maxV, tl, bl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 88){ /* 1120 */
            righttop = 1 - interpolateX(maxV, tr, br);
            bottomright = interpolateX(maxV, bl, br);
            bottomleft = interpolateX(minV, bl, br);
            lefttop = interpolateX(minV, bl, tl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 73){ /* 1021 */
            righttop = 1 - interpolateX(minV, tr, br);
            rightbottom = 1 - interpolateX(maxV, tr, br);
            bottomleft = interpolateX(maxV, bl, br);
            topleft = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 97){ /* 1201 */
            righttop = interpolateX(maxV, br, tr);
            rightbottom = interpolateX(minV, br, tr);
            bottomleft = 1 - interpolateX(minV, br, bl);
            topleft = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
          } else if(cval === 145){ /* 2101 */
            righttop = interpolateX(minV, br, tr);
            bottomleft = 1 - interpolateX(minV, br, bl);
            leftbottom = interpolateX(maxV, bl, tl);
            topright = 1 - interpolateX(maxV, tr, tl);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeLB[cval]);
          } else if(cval === 25){ /* 0121 */
            righttop = 1 - interpolateX(maxV, tr, br);
            bottomleft = interpolateX(maxV, bl, br);
            leftbottom = 1 - interpolateX(minV, tl, bl);
            topright = interpolateX(minV, tl, tr);
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeLB[cval]);
          } else if(cval === 70){ /* 1012 */
            rightbottom = 1 - interpolateX(minV, tr, br);
            bottomright = 1 - interpolateX(maxV, br, bl);
            lefttop = 1 - interpolateX(maxV, tl, bl);
            topleft = 1 - interpolateX(minV, tr, tl);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBR[cval]);
          } else if(cval === 100){ /* 1210 */
            rightbottom = interpolateX(maxV, br, tr);
            bottomright = interpolateX(minV, bl, br);
            lefttop = interpolateX(minV, bl, tl);
            topleft = interpolateX(maxV, tl, tr);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBR[cval]);
          }

          /* 8-sided cases */
          else if(cval === 34){ /* 0202 || 2020 with flipped == 0 */
            if(flipped === 0){
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
            } else {
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeLB[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 35){ /* flipped == 1 state for 0202, and 2020 with flipped == 4*/
            if(flipped === 4){
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
            } else {
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBL[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 136){ /* 2020 || 0202 with flipped == 0 */
            if(flipped === 0){
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
            } else {
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeLB[cval]);
            edges.push(isoBandEdgeLT[cval]);
          }

          /* 6-sided polygon cases */
          else if(cval === 153){ /* 0101 with flipped == 0 || 2121 with flipped == 2 */
            if(flipped === 0){
              righttop = interpolateX(minV, br, tr);
              bottomleft = 1 - interpolateX(minV, br, bl);
              leftbottom = 1 - interpolateX(minV, tl, bl);
              topright = interpolateX(minV, tl, tr);
            } else {
              righttop = 1 - interpolateX(maxV, tr, br);
              bottomleft = interpolateX(maxV, bl, br);
              leftbottom = interpolateX(maxV, bl, tl);
              topright = 1 - interpolateX(maxV, tr, tl);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 102){ /* 1010 with flipped == 0 || 1212 with flipped == 2 */
            if(flipped === 0){
              rightbottom = 1 - interpolateX(minV, tr, br);
              bottomright = interpolateX(minV, bl, br);
              lefttop = interpolateX(minV, bl, tl);
              topleft = 1 - interpolateX(minV, tr, tl);
            } else {
              rightbottom = interpolateX(maxV, br, tr);
              bottomright = 1 - interpolateX(maxV, br, bl);
              lefttop = 1 - interpolateX(maxV, tl, bl);
              topleft = interpolateX(maxV, tl, tr);
            }
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 155){ /* 0101 with flipped == 4 || 2121 with flipped == 1 */
            if(flipped === 4){
              righttop = interpolateX(minV, br, tr);
              bottomleft = 1 - interpolateX(minV, br, bl);
              leftbottom = 1 - interpolateX(minV, tl, bl);
              topright = interpolateX(minV, tl, tr);
            } else {
              righttop = 1 - interpolateX(maxV, tr, br);
              bottomleft = interpolateX(maxV, bl, br);
              leftbottom = interpolateX(maxV, bl, tl);
              topright = 1 - interpolateX(maxV, tr, tl);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeLB[cval]);
          } else if(cval === 103){ /* 1010 with flipped == 4 || 1212 with flipped == 1 */
            if(flipped === 4){
              rightbottom = 1 - interpolateX(minV, tr, br);
              bottomright = interpolateX(minV, bl, br);
              lefttop = interpolateX(minV, bl, tl);
              topleft = 1 - interpolateX(minV, tr, tl);
            } else {
              rightbottom = interpolateX(maxV, br, tr);
              bottomright = 1 - interpolateX(maxV, br, bl);
              lefttop = 1 - interpolateX(maxV, tl, bl);
              topleft = interpolateX(maxV, tl, tr);
            }
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBR[cval]);
          }

          /* 7-sided polygon cases */
          else if(cval === 152){ /* 2120 with flipped == 2 || 0102 with flipped == 0 */
            if(flipped === 0){
              righttop = interpolateX(minV, br, tr);
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              topright = interpolateX(minV, tl, tr);
            } else {
              righttop = 1 - interpolateX(maxV, tr, br);
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              topright = 1 - interpolateX(maxV, tr, tl);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeBR[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 156){ /* 2120 with flipped == 1 || 0102 with flipped == 4 */
            if(flipped === 4){
              righttop = interpolateX(minV, br, tr);
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              topright = interpolateX(minV, tl, tr);
            } else {
              righttop = 1 - interpolateX(maxV, tr, br);
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              topright = 1 - interpolateX(maxV, tr, tl);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeBL[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 137){ /* 2021 with flipped == 2 || 0201 with flipped == 0 */
            if(flipped === 0){
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              bottomleft = 1 - interpolateX(minV, br, bl);
              leftbottom = 1 - interpolateX(minV, tl, bl);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
            } else {
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              bottomleft = interpolateX(maxV, bl, br);
              leftbottom = interpolateX(maxV, bl, tl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 139){ /* 2021 with flipped == 1 || 0201 with flipped == 4 */
            if(flipped === 4){
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              bottomleft = 1 - interpolateX(minV, br, bl);
              leftbottom = 1 - interpolateX(minV, tl, bl);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
            } else {
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              bottomleft = interpolateX(maxV, bl, br);
              leftbottom = interpolateX(maxV, bl, tl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeLB[cval]);
          } else if(cval === 98){ /* 1202 with flipped == 2 || 1020 with flipped == 0 */
            if(flipped === 0){
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              lefttop = interpolateX(minV, bl, tl);
              topleft = 1 - interpolateX(minV, tr, tl);
            } else {
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              lefttop = 1 - interpolateX(maxV, tl, bl);
              topleft = interpolateX(maxV, tl, tr);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 99){ /* 1202 with flipped == 1 || 1020 with flipped == 4 */
            if(flipped === 4){
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              lefttop = interpolateX(minV, bl, tl);
              topleft = 1 - interpolateX(minV, tr, tl);
            } else {
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              lefttop = 1 - interpolateX(maxV, tl, bl);
              topleft = interpolateX(maxV, tl, tr);
            }
            edges.push(isoBandEdgeRT[cval]);
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBL[cval]);
          } else if(cval === 38){ /* 0212 with flipped == 2 || 2010 with flipped == 0 */
            if(flipped === 0){
              rightbottom = 1 - interpolateX(minV, tr, br);
              bottomright = interpolateX(minV, bl, br);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
            } else {
              rightbottom = interpolateX(maxV, br, tr);
              bottomright = 1 - interpolateX(maxV, br, bl);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
            }
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeLB[cval]);
            edges.push(isoBandEdgeLT[cval]);
          } else if(cval === 39){ /* 0212 with flipped == 1 || 2010 with flipped == 4 */
            if(flipped === 4){
              rightbottom = 1 - interpolateX(minV, tr, br);
              bottomright = interpolateX(minV, bl, br);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
            } else {
              rightbottom = interpolateX(maxV, br, tr);
              bottomright = 1 - interpolateX(maxV, br, bl);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
            }
            edges.push(isoBandEdgeRB[cval]);
            edges.push(isoBandEdgeBR[cval]);
            edges.push(isoBandEdgeLT[cval]);
          }

          else if(cval === 85){
            righttop = 1;
            rightbottom = 0;
            bottomright = 1;
            bottomleft = 0;
            leftbottom = 0;
            lefttop = 1;
            topleft = 0;
            topright = 1;
          }

          if(topleft < 0 || topleft > 1 || topright < 0 || topright > 1 || righttop < 0 || righttop > 1 || bottomright < 0 || bottomright > 1 || leftbottom < 0 || leftbottom > 1 || lefttop < 0 || lefttop > 1){
            console.log("MarchingSquaresJS-isoBands: " + cval + " " + cval_real + " " + tl + "," + tr + "," + br + "," + bl + " " + flipped + " " + topleft + " " + topright + " " + righttop + " " + rightbottom + " " + bottomright + " " + bottomleft + " " + leftbottom + " " + lefttop);
          }

          BandGrid.cells[j][i] = {
                                    cval:         cval,
                                    cval_real:    cval_real,
                                    flipped:      flipped,
                                    topleft:      topleft,
                                    topright:     topright,
                                    righttop:     righttop,
                                    rightbottom:  rightbottom,
                                    bottomright:  bottomright,
                                    bottomleft:   bottomleft,
                                    leftbottom:   leftbottom,
                                    lefttop:      lefttop,
                                    edges:        edges
                                };
        }
      }
    }

    return BandGrid;
  }

  function BandGrid2AreaPaths(grid){
    var areas = [];
    var rows = grid.rows;
    var cols = grid.cols;
    var currentPolygon = [];

    for(var j = 0; j < rows; j++){
      for(var i = 0; i < cols; i++){
        if((typeof grid.cells[j][i] !== 'undefined') && (grid.cells[j][i].edges.length > 0)){
          /* trace back polygon path starting from this cell */

          var cell = grid.cells[j][i];

          /* get start coordinates */

          var prev  = getStartXY(cell),
              next  = null,
              p     = i,
              q     = j;

          if(prev !== null){
            currentPolygon.push([ prev.p[0] + p, prev.p[1] + q ]);
            //console.log(cell);
            //console.log("coords: " + (prev.p[0] + p) + " " + (prev.p[1] + q));
          }

          do{
            //console.log(p + "," + q);
            //console.log(grid.cells[q][p]);
            //console.log(grid.cells[q][p].edges);
            //console.log("from : " + prev.x + " " + prev.y + " " + prev.o);

            next = getExitXY(grid.cells[q][p], prev.x, prev.y, prev.o);
            if(next !== null){
              //console.log("coords: " + (next.p[0] + p) + " " + (next.p[1] + q));
              currentPolygon.push([ next.p[0] + p, next.p[1] + q ]);
              p += next.x;
              q += next.y;
              prev = next;
            } else {
              //console.log("getExitXY() returned null!");
              break;
            }
            //console.log("to : " + next.x + " " + next.y + " " + next.o);
            /* special case, where we've reached the grid boundaries */
            if((q < 0) || (q >= rows) || (p < 0) || (p >= cols) || (typeof grid.cells[q][p] === 'undefined')){
              /* to create a closed path, we need to trace our way
                  arround the missing data, until we find an entry
                  point again
              */

              /* set back coordinates of current cell */
              p -= next.x;
              q -= next.y;

              //console.log("reached boundary at " + p + " " + q);

              var missing = traceOutOfGridPath(grid, p, q, next.x, next.y, next.o);
              if(missing !== null){
                missing.path.forEach(function(pp){
                  //console.log("coords: " + (pp[0]) + " " + (pp[1]));
                  currentPolygon.push(pp);
                });
                p = missing.i;
                q = missing.j;
                prev = missing;
              } else {
                break;
              }
              //console.log(grid.cells[q][p]);
            }
          } while(    (typeof grid.cells[q][p] !== 'undefined')
                   && (grid.cells[q][p].edges.length > 0));

          areas.push(currentPolygon);
          //console.log("next polygon");
          //console.log(currentPolygon);
          currentPolygon = [];
          if(grid.cells[j][i].edges.length > 0)
            i--;
        }
      }
    }
    return areas;
  }

  function traceOutOfGridPath(grid, i, j, d_x, d_y, d_o){
    var cell = grid.cells[j][i];
    var cval = cell.cval_real;
    var p = i + d_x,
        q = j + d_y;
    var path = [];
    var closed = false;

    while(!closed){
      //console.log("processing cell " + p + "," + q + " " + d_x + " " + d_y + " " + d_o);
      if((typeof grid.cells[q] === 'undefined') || (typeof grid.cells[q][p] === 'undefined')){
        //console.log("which is undefined");
        /* we can't move on, so we have to change direction to proceed further */

        /* go back to previous cell */
        q -= d_y;
        p -= d_x;
        cell = grid.cells[q][p];
        cval = cell.cval_real;

        /* check where we've left defined cells of the grid... */
        if(d_y === -1){ /* we came from top */
          if(d_o === 0){  /* exit left */
            if(cval & Node3){ /* lower left node is within range, so we move left */
              path.push([p, q]);
              d_x = -1;
              d_y = 0;
              d_o = 0;
            } else if(cval & Node2){ /* lower right node is within range, so we move right */
              path.push([p + 1, q]);
              d_x = 1;
              d_y = 0;
              d_o = 0;
            } else { /* close the path */
              path.push([p + cell.bottomright, q]);
              d_x = 0;
              d_y = 1;
              d_o = 1;
              closed = true;
              break;
            }
          } else {
            if(cval & Node3){
              path.push([p, q]);
              d_x = -1;
              d_y = 0;
              d_o = 0;
            } else if(cval & Node2){
              path.push([p + cell.bottomright, q]);
              d_x = 0;
              d_y = 1;
              d_o = 1;
              closed = true;
              break;
            } else {
              path.push([p + cell.bottomleft, q]);
              d_x = 0;
              d_y = 1;
              d_o = 0;
              closed = true;
              break;
            }
          }
        } else if(d_y === 1){ /* we came from bottom */
          //console.log("we came from bottom and hit a non-existing cell " + (p + d_x) + "," + (q + d_y) + "!");
          if(d_o === 0){ /* exit left */
            if(cval & Node1){ /* top right node is within range, so we move right */
              path.push([p+1,q+1]);
              d_x = 1;
              d_y = 0;
              d_o = 1;
            } else if(!(cval & Node0)){ /* found entry within same cell */
              path.push([p + cell.topright, q + 1]);
              d_x = 0;
              d_y = -1;
              d_o = 1;
              closed = true;
              //console.log("found entry from bottom at " + p + "," + q);
              break;
            } else {
              path.push([p + cell.topleft, q + 1]);
              d_x = 0;
              d_y = -1;
              d_o = 0;
              closed = true;
              break;
            }
          } else {
            if(cval & Node1){
              path.push([p+1, q+1]);
              d_x = 1;
              d_y = 0;
              d_o = 1;
            } else { /* move right */
              path.push([p+1, q+1]);
              d_x = 1;
              d_y = 0;
              d_o = 1;
              //console.log("wtf");
              //break;
            }
          }
        } else if(d_x === -1){ /* we came from right */
          //console.log("we came from right and hit a non-existing cell at " + (p + d_x) + "," + (q + d_y) + "!");
          if(d_o === 0){
            //console.log("continue at bottom");
            if(cval & Node0){
              path.push([p,q+1]);
              d_x = 0;
              d_y = 1;
              d_o = 0;
              //console.log("moving upwards to " + (p + d_x) + "," + (q + d_y) + "!");
            } else if(!(cval & Node3)){ /* there has to be an entry into the regular grid again! */
              //console.log("exiting top");
              path.push([p, q + cell.lefttop]);
              d_x = 1;
              d_y = 0;
              d_o = 1;
              closed = true;
              break;
            } else {
              //console.log("exiting bottom");
              path.push([p, q + cell.leftbottom]);
              d_x = 1;
              d_y = 0;
              d_o = 0;
              closed = true;
              break;
            }
          } else {
            //console.log("continue at top");
            if(cval & Node0){
              path.push([p,q+1]);
              d_x = 0;
              d_y = 1;
              d_o = 0;
              //console.log("moving upwards to " + (p + d_x) + "," + (q + d_y) + "!");
            } else { /* */
              console.log("MarchingSquaresJS-isoBands: wtf");
              break;
            }
          }
        } else if(d_x === 1){ /* we came from left */
          //console.log("we came from left and hit a non-existing cell " + (p + d_x) + "," + (q + d_y) + "!");
          if(d_o === 0){ /* exit bottom */
            if(cval & Node2){
              path.push([p+1,q]);
              d_x = 0;
              d_y = -1;
              d_o = 1;
            } else {
              path.push([p+1,q+cell.rightbottom]);
              d_x = -1;
              d_y = 0;
              d_o = 0;
              closed = true;
              break;
            }
          } else { /* exit top */
            if(cval & Node2){
              path.push([p+1,q]);
              d_x = 0;
              d_y = -1;
              d_o = 1;
            } else if(!(cval & Node1)){
              path.push([p + 1, q + cell.rightbottom]);
              d_x = -1;
              d_y = 0;
              d_o = 0;
              closed = true;
              break;
            } else {
              path.push([p+1,q+cell.righttop]);
              d_x = -1;
              d_y = 0;
              d_o = 1;
              break;
            }
          }
        } else { /* we came from the same cell */
          console.log("MarchingSquaresJS-isoBands: we came from nowhere!");
          break;
        }

      } else { /* try to find an entry into the regular grid again! */
        cell = grid.cells[q][p];
        cval = cell.cval_real;
        //console.log("which is defined");

        if(d_x === -1){
          if(d_o === 0){
            /* try to go downwards */
            if((typeof grid.cells[q - 1] !== 'undefined') && (typeof grid.cells[q - 1][p] !== 'undefined')){
              d_x = 0;
              d_y = -1;
              d_o = 1;
            } else if(cval & Node3){ /* proceed searching in x-direction */
              //console.log("proceeding in x-direction!");
              path.push([p, q]);
            } else { /* we must have found an entry into the regular grid */
              path.push([p + cell.bottomright, q]);
              d_x = 0;
              d_y = 1;
              d_o = 1;
              closed = true;
              //console.log("found entry from bottom at " + p + "," + q);
              break;
            }
          } else {
            if(cval & Node0) { /* proceed searchin in x-direction */
              console.log("MarchingSquaresJS-isoBands: proceeding in x-direction!");
            } else { /* we must have found an entry into the regular grid */
              console.log("MarchingSquaresJS-isoBands: found entry from top at " + p + "," + q);
              break;
            }
          }
        } else if(d_x === 1){
          if(d_o === 0){
            console.log("MarchingSquaresJS-isoBands: wtf");
            break;
          } else {
            /* try to go upwards */
            if((typeof grid.cells[q+1] !== 'undefined') && (typeof grid.cells[q+1][p] !== 'undefined')){
              d_x = 0;
              d_y = 1;
              d_o = 0;
            } else if(cval & Node1){
              path.push([p+1,q+1]);
              d_x = 1;
              d_y = 0;
              d_o = 1;
            } else { /* found an entry point into regular grid! */
              path.push([p+cell.topleft, q + 1]);
              d_x = 0;
              d_y = -1;
              d_o = 0;
              closed = true;
              //console.log("found entry from bottom at " + p + "," + q);
              break;
            }
          }
        } else if(d_y === -1){
          if(d_o === 1){
            /* try to go right */
            if(typeof grid.cells[q][p+1] !== 'undefined'){
              d_x = 1;
              d_y = 0;
              d_o = 1;
            } else if(cval & Node2){
              path.push([p+1,q]);
              d_x = 0;
              d_y = -1;
              d_o = 1;
            } else { /* found entry into regular grid! */
              path.push([p+1, q + cell.righttop]);
              d_x = -1;
              d_y = 0;
              d_o = 1;
              closed = true;
              //console.log("found entry from top at " + p + "," + q);
              break;
            }
          } else {
            console.log("MarchingSquaresJS-isoBands: wtf");
            break;
          }
        } else if(d_y === 1){
          if(d_o === 0){
            //console.log("we came from bottom left and proceed to the left");
            /* try to go left */
            if(typeof grid.cells[q][p - 1] !== 'undefined'){
              d_x = -1;
              d_y = 0;
              d_o = 0;
            } else if(cval & Node0){
              path.push([p,q+1]);
              d_x = 0;
              d_y = 1;
              d_o = 0;
            } else { /* found an entry point into regular grid! */
              path.push([p, q + cell.leftbottom]);
              d_x = 1;
              d_y = 0;
              d_o = 0;
              closed = true;
              //console.log("found entry from bottom at " + p + "," + q);
              break;
            }
          } else {
            //console.log("we came from bottom right and proceed to the right");
            console.log("MarchingSquaresJS-isoBands: wtf");
            break;
          }
        } else {
          console.log("MarchingSquaresJS-isoBands: where did we came from???");
          break;
        }

      }

      p += d_x;
      q += d_y;
      //console.log("going on to  " + p + "," + q + " via " + d_x + " " + d_y + " " + d_o);

      if((p === i) && (q === j)){ /* bail out, once we've closed a circle path */
        break;
      }

    }

    //console.log("exit with " + p + "," + q + " " + d_x + " " + d_y + " " + d_o);
    return { path: path, i: p, j: q, x: d_x, y: d_y, o: d_o };
  }

  function deleteEdge(cell, edgeIdx){
    delete cell.edges[edgeIdx];
    for(var k = edgeIdx + 1; k < cell.edges.length; k++){
      cell.edges[k-1] = cell.edges[k];
    }
    cell.edges.pop();
  }

  function getStartXY(cell){

    if(cell.edges.length > 0){
      var e = cell.edges[cell.edges.length - 1];
      //console.log("starting with edge " + e);
      var cval = cell.cval_real;
      switch(e){
        case 0:   if(cval & Node1){ /* node 1 within range */
                    return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                  } else { /* node 1 below or above threshold */
                    return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                  }
        case 1:   if(cval & Node2){
                    return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                  } else {
                    return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                  }
        case 2:   if(cval & Node2){
                    return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                  } else {
                    return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                  }
        case 3:   if(cval & Node3){
                    return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                  } else {
                    return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                  }
        case 4:   if(cval & Node1){
                    return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                  } else {
                    return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                  }
        case 5:   if(cval & Node2){
                    return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                  } else {
                    return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                  }
        case 6:   if(cval & Node2){
                    return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                  } else {
                    return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                  }
        case 7:   if(cval & Node3){
                    return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                  } else {
                    return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                  }
        case 8:   if(cval & Node2){
                    return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                  } else {
                    return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                  }
        case 9:   if(cval & Node3){
                    return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                  } else {
                    return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                  }
        case 10:  if(cval & Node3){
                    return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                  } else {
                    return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                  }
        case 11:  if(cval & Node0){
                    return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                  } else {
                    return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                  }
        case 12:  if(cval & Node2){
                    return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                  } else {
                    return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                  }
        case 13:  if(cval & Node3){
                    return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                  } else {
                    return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                  }
        case 14:  if(cval & Node3){
                    return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                  } else {
                    return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                  }
        case 15:  if(cval & Node0){
                    return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                  } else {
                    return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                  }
        case 16:  if(cval & Node2){
                    return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                  } else {
                    return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                  }
        case 17:  if(cval & Node0){
                    return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                  } else {
                    return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                  }
        case 18:  if(cval & Node3){
                    return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                  } else {
                    return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                  }
        case 19:  if(cval & Node0){
                    return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                  } else {
                    return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                  }
        case 20:  if(cval & Node0){
                    return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                  } else {
                    return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                  }
        case 21:  if(cval & Node1){
                    return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                  } else {
                    return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                  }
        case 22:  if(cval & Node0){
                    return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                  } else {
                    return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                  }
        case 23:  if(cval & Node1){
                    return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                  } else {
                    return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                  }
        default:  console.log("MarchingSquaresJS-isoBands: edge index out of range!");
                  console.log(cell);
                  break;
      }
    }

    return null;
  }

  function getExitXY(cell, x, y, o){

    var e, id_x, d_x, d_y, cval = cell.cval;
    var d_o;

    switch(x){
      case -1:  switch(o){
                  case 0:   e = isoBandEdgeRB[cval];
                            d_x = isoBandNextXRB[cval];
                            d_y = isoBandNextYRB[cval];
                            d_o = isoBandNextORB[cval];
                            break;
                  default:  e = isoBandEdgeRT[cval];
                            d_x = isoBandNextXRT[cval];
                            d_y = isoBandNextYRT[cval];
                            d_o = isoBandNextORT[cval];
                            break;
                }
                break;
      case 1:   switch(o){
                  case 0:   e = isoBandEdgeLB[cval];
                            d_x = isoBandNextXLB[cval];
                            d_y = isoBandNextYLB[cval];
                            d_o = isoBandNextOLB[cval];
                            break;
                  default:  e = isoBandEdgeLT[cval];
                            d_x = isoBandNextXLT[cval];
                            d_y = isoBandNextYLT[cval];
                            d_o = isoBandNextOLT[cval];
                            break;
                }
                break;
      default:  switch(y){
                  case -1:  switch(o){
                              case 0:   e = isoBandEdgeTL[cval];
                                        d_x = isoBandNextXTL[cval];
                                        d_y = isoBandNextYTL[cval];
                                        d_o = isoBandNextOTL[cval];
                                        break;
                              default:  e = isoBandEdgeTR[cval];
                                        d_x = isoBandNextXTR[cval];
                                        d_y = isoBandNextYTR[cval];
                                        d_o = isoBandNextOTR[cval];
                                        break;
                            }
                            break;
                  case 1:   switch(o){
                              case 0:   e = isoBandEdgeBL[cval];
                                        d_x = isoBandNextXBL[cval];
                                        d_y = isoBandNextYBL[cval];
                                        d_o = isoBandNextOBL[cval];
                                        break;
                              default:  e = isoBandEdgeBR[cval];
                                        d_x = isoBandNextXBR[cval];
                                        d_y = isoBandNextYBR[cval];
                                        d_o = isoBandNextOBR[cval];
                                        break;
                            }
                            break;
                  default:  break;
                }
                break;
    }

    id_x = cell.edges.indexOf(e);
    if(typeof cell.edges[id_x] !== 'undefined'){
      deleteEdge(cell, id_x);
    } else {
      //console.log("wrong edges...");
      //console.log(x + " " + y + " " + o);
      //console.log(cell);
      return null;
    }

    cval = cell.cval_real;

    switch(e){
        case 0:   if(cval & Node1){ /* node 1 within range */
                    x = cell.topleft;
                    y = 1;
                  } else { /* node 1 below or above threshold */
                    x = 1;
                    y = cell.righttop;
                  }
                  break;
        case 1:   if(cval & Node2){
                    x = 1;
                    y = cell.rightbottom;
                  } else {
                    x = cell.topleft;
                    y = 1;
                  }
                  break;
        case 2:   if(cval & Node2){
                    x = cell.topleft;
                    y = 1;
                  } else {
                    x = cell.bottomright;
                    y = 0;
                  }
                  break;
        case 3:   if(cval & Node3){
                    x = cell.bottomleft;
                    y = 0;
                  } else {
                    x = cell.topleft;
                    y = 1;
                  }
                  break;
        case 4:   if(cval & Node1){
                    x = cell.topright;
                    y = 1;
                  } else {
                    x = 1;
                    y = cell.righttop;
                  }
                  break;
        case 5:   if(cval & Node2){
                    x = 1;
                    y = cell.rightbottom;
                  } else {
                    x = cell.topright;
                    y = 1;
                  }
                  break;
        case 6:   if(cval & Node2){
                    x = cell.topright;
                    y = 1;
                  } else {
                    x = cell.bottomright;
                    y = 0;
                  }
                  break;
        case 7:   if(cval & Node3){
                    x = cell.bottomleft;
                    y = 0;
                  } else {
                    x = cell.topright;
                    y = 1;
                  }
                  break;
        case 8:   if(cval & Node2){
                    x = 1;
                    y = cell.righttop;
                  } else {
                    x = cell.bottomright;
                    y = 0;
                  }
                  break;
        case 9:   if(cval & Node3){
                    x = cell.bottomleft;
                    y = 0;
                  } else {
                    x = 1;
                    y = cell.righttop;
                  }
                  break;
        case 10:  if(cval & Node3){
                    x = 1;
                    y = cell.righttop;
                  } else {
                    x = 0;
                    y = cell.leftbottom;
                  }
                  break;
        case 11:  if(cval & Node0){
                    x = 0;
                    y = cell.lefttop;
                  } else {
                    x = 1;
                    y = cell.righttop;
                  }
                  break;
        case 12:  if(cval & Node2){
                    x = 1;
                    y = cell.rightbottom;
                  } else {
                    x = cell.bottomright;
                    y = 0;
                  }
                  break;
        case 13:  if(cval & Node3){
                    x = cell.bottomleft;
                    y = 0;
                  } else {
                    x = 1;
                    y = cell.rightbottom;
                  }
                  break;
        case 14:  if(cval & Node3){
                    x = 1;
                    y = cell.rightbottom;
                  } else {
                    x = 0;
                    y = cell.leftbottom;
                  }
                  break;
        case 15:  if(cval & Node0){
                    x = 0;
                    y = cell.lefttop;
                  } else {
                    x = 1;
                    y = cell.rightbottom;
                  }
                  break;
        case 16:  if(cval & Node2){
                    x = 0;
                    y = cell.leftbottom;
                  } else {
                    x = cell.bottomright;
                    y = 0;
                  }
                  break;
        case 17:  if(cval & Node0){
                    x = 0;
                    y = cell.lefttop;
                  } else {
                    x = cell.bottomright;
                    y = 0;
                  }
                  break;
        case 18:  if(cval & Node3){
                    x = cell.bottomleft;
                    y = 0;
                  } else {
                    x = 0;
                    y = cell.leftbottom;
                  }
                  break;
        case 19:  if(cval & Node0){
                    x = 0;
                    y = cell.lefttop;
                  } else {
                    x = cell.bottomleft;
                    y = 0;
                  }
                  break;
        case 20:  if(cval & Node0){
                    x = 0;
                    y = cell.leftbottom;
                  } else {
                    x = cell.topleft;
                    y = 1;
                  }
                  break;
        case 21:  if(cval & Node1){
                    x = cell.topright;
                    y = 1;
                  } else {
                    x = 0;
                    y = cell.leftbottom;
                  }
                  break;
        case 22:  if(cval & Node0){
                    x = 0;
                    y = cell.lefttop;
                  } else {
                    x = cell.topleft;
                    y = 1;
                  }
                  break;
        case 23:  if(cval & Node1){
                    x = cell.topright;
                    y = 1;
                  } else {
                    x = 0;
                    y = cell.lefttop;
                  }
                  break;
        default:  console.log("MarchingSquaresJS-isoBands: edge index out of range!");
                  console.log(cell);
                  return null;
    }

    if((typeof x === 'undefined') || (typeof y === 'undefined') ||
        (typeof d_x === 'undefined') || (typeof d_y === 'undefined') ||
        (typeof d_o === 'undefined')){
      console.log("MarchingSquaresJS-isoBands: undefined value!");
      console.log(cell);
      console.log(x + " " + y + " " + d_x + " " + d_y + " " + d_o);
    }
    return {p: [x, y], x: d_x, y: d_y, o: d_o};
  }

  function BandGrid2Areas(grid){
    var areas = [];
    var area_idx = 0;

    grid.cells.forEach(function(g, j){
      g.forEach(function(gg, i){
        if(typeof gg !== 'undefined'){
          var a = polygon_table[gg.cval](gg);
          if((typeof a === 'object') && isArray(a)){
            if((typeof a[0] === 'object') && isArray(a[0])){
              if((typeof a[0][0] === 'object') && isArray(a[0][0])){
                a.forEach(function(aa){
                  aa.forEach(function(aaa){
                    aaa[0] += i;
                    aaa[1] += j;
                  });
                  areas[area_idx++] = aa;
                });
              } else {
                a.forEach(function(aa){
                  aa[0] += i;
                  aa[1] += j;
                });
                areas[area_idx++] = a;
              }
            } else {
              console.log("MarchingSquaresJS-isoBands: bandcell polygon with malformed coordinates");
            }
          } else {
            console.log("MarchingSquaresJS-isoBands: bandcell polygon with null coordinates");
          }
        }
      });
    });

    return areas;
  }

  return isoBands;

}));

},{}],19:[function(require,module,exports){
/*!
* @license GNU Affero General Public License.
* Copyright (c) 2015, 2015 Ronny Lorenz <ronny@tbi.univie.ac.at>
* v. 1.2.0
* https://github.com/RaumZeit/MarchingSquares.js
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function() { return { isoContours : factory() }; })
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = { isoContours : factory() };
    } else {
        // Browser globals (root is window)
        root.MarchingSquaresJS = {
                                    isoContours : factory(),
                                    isoBands : (root.MarchingSquaresJS) ? root.MarchingSquaresJS.isoBands : null
                                 };
    }
}(this, function () {

  /*
    Compute the isocontour(s) of a scalar 2D field given
    a certain threshold by applying the Marching Squares
    Algorithm. The function returns a list of path coordinates
  */
  var defaultSettings = {
    successCallback:  null,
    verbose:          false
  };

  var settings = {};

  function isoContours(data, threshold, options){
    /* process options */
    options = options ? options : {};

    var optionKeys = Object.keys(defaultSettings);

    for(var i = 0; i < optionKeys.length; i++){
      var key = optionKeys[i];
      var val = options[key];
      val = ((typeof val !== 'undefined') && (val !== null)) ? val : defaultSettings[key];

      settings[key] = val;
    }

    if(settings.verbose)
      console.log("MarchingSquaresJS-isoContours: computing isocontour for " + threshold);

    var ret = ContourGrid2Paths(computeContourGrid(data, threshold));

    if(typeof settings.successCallback === 'function')
      settings.successCallback(ret);

    return ret;
  }

  /*
    Thats all for the public interface, below follows the actual
    implementation
  */

  /*
  ################################
  Isocontour implementation below
  ################################
  */

  /* assume that x1 == 1 &&  x0 == 0 */
  function interpolateX(y, y0, y1){
    return (y - y0) / (y1 - y0);
  }

  /* compute the isocontour 4-bit grid */
  function computeContourGrid(data, threshold){
    var rows = data.length - 1;
    var cols = data[0].length - 1;
    var ContourGrid = { rows: rows, cols: cols, cells: [] };

    for(var j = 0; j < rows; ++j){
      ContourGrid.cells[j] = [];
      for(var i = 0; i < cols; ++i){
        /* compose the 4-bit corner representation */
        var cval = 0;

        var tl = data[j+1][i];
        var tr = data[j+1][i+1];
        var br = data[j][i+1];
        var bl = data[j][i];

        if(isNaN(tl) || isNaN(tr) || isNaN(br) || isNaN(bl)){
          continue;
        }
        cval |= ((tl >= threshold) ? 8 : 0);
        cval |= ((tr >= threshold) ? 4 : 0);
        cval |= ((br >= threshold) ? 2 : 0);
        cval |= ((bl >= threshold) ? 1 : 0);

        /* resolve ambiguity for cval == 5 || 10 via averaging */
        var flipped = false;
        if(cval === 5 || cval === 10){
          var average = (tl + tr + br + bl) / 4;
          if(cval === 5 && (average < threshold)){
            cval = 10;
            flipped = true;
          } else if(cval === 10 && (average < threshold)){
            cval = 5;
            flipped = true;
          }
        }

        /* add cell to ContourGrid if it contains edges */
        if(cval != 0 && cval != 15){
          var top, bottom, left, right;
          top = bottom = left = right = 0.5;
          /* interpolate edges of cell */
          if(cval === 1){
            left    = 1 - interpolateX(threshold, tl, bl);
            bottom  = 1 - interpolateX(threshold, br, bl);
          } else if(cval === 2){
            bottom  = interpolateX(threshold, bl, br);
            right   = 1 - interpolateX(threshold, tr, br);
          } else if(cval === 3){
            left    = 1 - interpolateX(threshold, tl, bl);
            right   = 1 - interpolateX(threshold, tr, br);
          } else if(cval === 4){
            top     = interpolateX(threshold, tl, tr);
            right   = interpolateX(threshold, br, tr);
          } else if(cval === 5){
            top     = interpolateX(threshold, tl, tr);
            right   = interpolateX(threshold, br, tr);
            bottom  = 1 - interpolateX(threshold, br, bl);
            left    = 1 - interpolateX(threshold, tl, bl);
          } else if(cval === 6){
            bottom  = interpolateX(threshold, bl, br);
            top     = interpolateX(threshold, tl, tr);
          } else if(cval === 7){
            left    = 1 - interpolateX(threshold, tl, bl);
            top     = interpolateX(threshold, tl, tr);
          } else if(cval === 8){
            left    = interpolateX(threshold, bl, tl);
            top     = 1 - interpolateX(threshold, tr, tl);
          } else if(cval === 9){
            bottom  = 1 - interpolateX(threshold, br, bl);
            top     = 1 - interpolateX(threshold, tr, tl);
          } else if(cval === 10){
            top     = 1 - interpolateX(threshold, tr, tl);
            right   = 1 - interpolateX(threshold, tr, br);
            bottom  = interpolateX(threshold, bl, br);
            left    = interpolateX(threshold, bl, tl);
          } else if(cval === 11){
            top     = 1 - interpolateX(threshold, tr, tl);
            right   = 1 - interpolateX(threshold, tr, br);
          } else if(cval === 12){
            left    = interpolateX(threshold, bl, tl);
            right   = interpolateX(threshold, br, tr);
          } else if(cval === 13){
            bottom  = 1 - interpolateX(threshold, br, bl);
            right   = interpolateX(threshold, br, tr);
          } else if(cval === 14){
            left    = interpolateX(threshold, bl, tl);
            bottom  = interpolateX(threshold, bl, br);
          } else {
            console.log("MarchingSquaresJS-isoContours: Illegal cval detected: " + cval);
          }
          ContourGrid.cells[j][i] = {
                                      cval:     cval,
                                      flipped:  flipped,
                                      top:      top,
                                      right:    right,
                                      bottom:   bottom,
                                      left:     left
                                    };
        }

      }
    }

    return ContourGrid;
  }

  function isSaddle(cell){
    return cell.cval === 5 || cell.cval === 10;
  }

  function isTrivial(cell){
    return cell.cval === 0 || cell.cval === 15;
  }

  function clearCell(cell){
    if((!isTrivial(cell)) && (cell.cval !== 5) && (cell.cval !== 10)){
      cell.cval = 15;
    }
  }

  function getXY(cell, edge){
    if(edge === "top"){
      return [cell.top, 1.0];
    } else if(edge === "bottom"){
      return [cell.bottom, 0.0];
    } else if(edge === "right"){
      return [1.0, cell.right];
    } else if(edge === "left"){
      return [0.0, cell.left];
    }
  }

  function ContourGrid2Paths(grid){
    var paths = [];
    var path_idx = 0;
    var rows = grid.rows;
    var cols = grid.cols;
    var epsilon = 1e-7;

    grid.cells.forEach(function(g, j){
      g.forEach(function(gg, i){
        if((typeof gg !== 'undefined') && (!isSaddle(gg)) && (!isTrivial(gg))){
          var p = tracePath(grid.cells, j, i);
          var merged = false;
          /* we may try to merge paths at this point */
          if(p.info === "mergeable"){
            /*
              search backwards through the path array to find an entry
              that starts with where the current path ends...
            */
            var x = p.path[p.path.length - 1][0],
                y = p.path[p.path.length - 1][1];

            for(var k = path_idx - 1; k >= 0; k--){
              if((Math.abs(paths[k][0][0] - x) <= epsilon) && (Math.abs(paths[k][0][1] - y) <= epsilon)){
                for(var l = p.path.length - 2; l >= 0; --l){
                  paths[k].unshift(p.path[l]);
                }
                merged = true;
                break;
              }
            }
          }
          if(!merged)
            paths[path_idx++] = p.path;
        }
      });
    });

    return paths;
  }

  /*
    construct consecutive line segments from starting cell by
    walking arround the enclosed area clock-wise
   */
  function tracePath(grid, j, i){
    var maxj = grid.length;
    var p = [];
    var dxContour = [0, 0, 1, 1, 0, 0, 0, 0, -1, 0, 1, 1, -1, 0, -1, 0];
    var dyContour = [0, -1, 0, 0, 1, 1, 1, 1, 0, -1, 0, 0, 0, -1, 0, 0];
    var dx, dy;
    var startEdge = ["none", "left", "bottom", "left", "right", "none", "bottom", "left", "top", "top", "none", "top", "right", "right", "bottom", "none"];
    var nextEdge  = ["none", "bottom", "right", "right", "top", "top", "top", "top", "left", "bottom", "right", "right", "left", "bottom", "left", "none"];
    var edge;

    var startCell   = grid[j][i];
    var currentCell = grid[j][i];

    var cval = currentCell.cval;
    var edge = startEdge[cval];

    var pt = getXY(currentCell, edge);

    /* push initial segment */
    p.push([i + pt[0], j + pt[1]]);
    edge = nextEdge[cval];
    pt = getXY(currentCell, edge);
    p.push([i + pt[0], j + pt[1]]);
    clearCell(currentCell);

    /* now walk arround the enclosed area in clockwise-direction */
    var k = i + dxContour[cval];
    var l = j + dyContour[cval];
    var prev_cval = cval;

    while((k >= 0) && (l >= 0) && (l < maxj) && ((k != i) || (l != j))){
      currentCell = grid[l][k];
      if(typeof currentCell === 'undefined'){ /* path ends here */
        //console.log(k + " " + l + " is undefined, stopping path!");
        break;
      }
      cval = currentCell.cval;
      if((cval === 0) || (cval === 15)){
        return { path: p, info: "mergeable" };
      }
      edge  = nextEdge[cval];
      dx    = dxContour[cval];
      dy    = dyContour[cval];
      if((cval === 5) || (cval === 10)){
        /* select upper or lower band, depending on previous cells cval */
        if(cval === 5){
          if(currentCell.flipped){ /* this is actually a flipped case 10 */
            if(dyContour[prev_cval] === -1){
              edge  = "left";
              dx    = -1;
              dy    = 0;
            } else {
              edge  = "right";
              dx    = 1;
              dy    = 0;
            }
          } else { /* real case 5 */
            if(dxContour[prev_cval] === -1){
              edge  = "bottom";
              dx    = 0;
              dy    = -1;
            }
          }
        } else if(cval === 10){
          if(currentCell.flipped){ /* this is actually a flipped case 5 */
            if(dxContour[prev_cval] === -1){
              edge  = "top";
              dx    = 0;
              dy    = 1;
            } else {
              edge  = "bottom";
              dx    = 0;
              dy    = -1;
            }
          } else {  /* real case 10 */
            if(dyContour[prev_cval] === 1){
              edge  = "left";
              dx    = -1;
              dy    = 0;
            }
          }
        }
      }
      pt = getXY(currentCell, edge);
      p.push([k + pt[0], l + pt[1]]);
      clearCell(currentCell);
      k += dx;
      l += dy;
      prev_cval = cval;
    }

    return { path: p, info: "closed" };
  }

  return isoContours;

}));

},{}],20:[function(require,module,exports){
/*!
* @license GNU Affero General Public License.
* Copyright (c) 2015, 2015 Ronny Lorenz <ronny@tbi.univie.ac.at>
* v. 1.2.0
* https://github.com/RaumZeit/MarchingSquares.js
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./marchingsquares-isobands', './marchingsquares-isocontours'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./marchingsquares-isobands'),require('./marchingsquares-isocontours'));
    } else {
        // Browser globals (root is window)
        root.MarchingSquaresJS = factory(
                                    (root.MarchingSquaresJS) ? root.MarchingSquaresJS.isoBands : null,
                                    (root.MarchingSquaresJS) ? root.MarchingSquaresJS.isoContours : null
                                  );
    }
}(this, function (isoBands, isoContours) {
  return {
      isoBands : (typeof isoBands === 'function') ? isoBands : (((typeof isoBands === 'object') && (typeof isoBands.isoBands === 'function')) ? isoBands.isoBands : null),
      isoContours: (typeof isoContours === 'function') ? isoContours : (((typeof isoContours === 'object') && (typeof isoContours.isoContours === 'function')) ? isoContours.isoContours : null)
  };
}));

},{"./marchingsquares-isobands":18,"./marchingsquares-isocontours":19}],21:[function(require,module,exports){
var distance = require('@turf/distance');
var turfBBox = require('@turf/bbox');
var helpers = require('@turf/helpers');
var inside = require('@turf/inside');
var invariant = require('@turf/invariant');
var getGeomType = invariant.getGeomType;
var point = helpers.point;
var featureCollection = helpers.featureCollection;

/**
 * Creates a {@link Point} grid from a bounding box, {@link FeatureCollection} or {@link Feature}.
 *
 * @name pointGrid
 * @param {Array<number>|FeatureCollection|Feature<any>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide the distance between points
 * @param {string} [units=kilometers] used in calculating cellSide, can be degrees, radians, miles, or kilometers
 * @param {boolean} [centered=true] adjust points position to center the grid into bbox. **This parameter is going to be removed** in the next major release, having the output always centered into bbox.
 * @param {boolean} [bboxIsMask=false] if true, and bbox is a Polygon or MultiPolygon, the grid Point will be created
 * only if inside the bbox Polygon(s)
 * @returns {FeatureCollection<Point>} grid of points
 * @example
 * var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * var cellSide = 3;
 * var units = 'miles';
 *
 * var grid = turf.pointGrid(extent, cellSide, units);
 *
 * //addToMap
 * var addToMap = [grid];
 */
module.exports = function (bbox, cellSide, units, centered, bboxIsMask) {
      var results = [];

    var bboxMask = bbox;
    // validation
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) bbox = turfBBox(bbox); // Convert GeoJSON to bbox
    if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');

    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];
/*
    var xFraction = cellSide / (distance(point([west, south]), point([east, south]), units));
    var cellWidth = xFraction * (east - west);
    var yFraction = cellSide / (distance(point([west, south]), point([west, north]), units));
    var cellHeight = yFraction * (north - south);

    if (centered !== false) {
        var bboxHorizontalSide = (east - west);
        var bboxVerticalSide = (north - south);
        var columns = Math.floor(bboxHorizontalSide / cellWidth);
        var rows = Math.floor(bboxVerticalSide / cellHeight);
        // adjust origin of the grid
        var deltaX = (bboxHorizontalSide - columns * cellWidth) / 2;
        var deltaY = (bboxVerticalSide - rows * cellHeight) / 2;
    }

    var isPoly = !Array.isArray(bboxMask) && (getGeomType(bboxMask) === 'Polygon' || getGeomType(bboxMask) === 'MultiPolygon');
*/
    var currentX = west;
    //currentX += cellSide;
    while (currentX < east) {
        var currentY = south;
       //  currentY += cellSide;
        while (currentY <north) {
            var pt = point([currentX, currentY]);

                results.push(pt);
            
            currentY += cellSide;
        }
        currentX += cellSide;
    }

    return featureCollection(results);
};

},{"@turf/bbox":22,"@turf/distance":24,"@turf/helpers":25,"@turf/inside":26,"@turf/invariant":27}],22:[function(require,module,exports){
var coordEach = require('@turf/meta').coordEach;

/**
 * Takes a set of features, calculates the bbox of all input features, and returns a bounding box.
 *
 * @name bbox
 * @param {FeatureCollection|Feature<any>} geojson input features
 * @returns {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @example
 * var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]]);
 * var bbox = turf.bbox(line);
 * var bboxPolygon = turf.bboxPolygon(bbox);
 *
 * //addToMap
 * var addToMap = [line, bboxPolygon]
 */
module.exports = function (geojson) {
    var bbox = [Infinity, Infinity, -Infinity, -Infinity];
    coordEach(geojson, function (coord) {
        if (bbox[0] > coord[0]) bbox[0] = coord[0];
        if (bbox[1] > coord[1]) bbox[1] = coord[1];
        if (bbox[2] < coord[0]) bbox[2] = coord[0];
        if (bbox[3] < coord[1]) bbox[3] = coord[1];
    });
    return bbox;
};

},{"@turf/meta":23}],23:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],24:[function(require,module,exports){
var getCoord = require('@turf/invariant').getCoord;
var radiansToDistance = require('@turf/helpers').radiansToDistance;
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

/**
 * Calculates the distance between two {@link Point|points} in degrees, radians,
 * miles, or kilometers. This uses the
 * [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula)
 * to account for global curvature.
 *
 * @name distance
 * @param {Geometry|Feature<Point>|Array<number>} from origin point
 * @param {Geometry|Feature<Point>|Array<number>} to destination point
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @returns {number} distance between the two points
 * @example
 * var from = turf.point([-75.343, 39.984]);
 * var to = turf.point([-75.534, 39.123]);
 *
 * var distance = turf.distance(from, to, "miles");
 *
 * //addToMap
 * var addToMap = [from, to];
 * from.properties.distance = distance;
 * to.properties.distance = distance;
 */
module.exports = function (from, to, units) {
    var degrees2radians = Math.PI / 180;
    var coordinates1 = getCoord(from);
    var coordinates2 = getCoord(to);
    var dLat = degrees2radians * (coordinates2[1] - coordinates1[1]);
    var dLon = degrees2radians * (coordinates2[0] - coordinates1[0]);
    var lat1 = degrees2radians * coordinates1[1];
    var lat2 = degrees2radians * coordinates2[1];

    var a = Math.pow(Math.sin(dLat / 2), 2) +
          Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

    return radiansToDistance(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), units);
};

},{"@turf/helpers":25,"@turf/invariant":27}],25:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],26:[function(require,module,exports){
var invariant = require('@turf/invariant');
var getCoord = invariant.getCoord;
var getCoords = invariant.getCoords;

// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

/**
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point resides inside the polygon. The polygon can
 * be convex or concave. The function accounts for holes.
 *
 * @name inside
 * @param {Feature<Point>} point input point
 * @param {Feature<Polygon|MultiPolygon>} polygon input polygon or multipolygon
 * @param {boolean} [ignoreBoundary=false] True if polygon boundary should be ignored when determining if the point is inside the polygon otherwise false.
 * @returns {boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 * @example
 * var pt = turf.point([-77, 44]);
 * var poly = turf.polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]]);
 *
 * turf.inside(pt, poly);
 * //= true
 */
module.exports = function (point, polygon, ignoreBoundary) {
    // validation
    if (!point) throw new Error('point is required');
    if (!polygon) throw new Error('polygon is required');

    var pt = getCoord(point);
    var polys = getCoords(polygon);
    var type = (polygon.geometry) ? polygon.geometry.type : polygon.type;
    var bbox = polygon.bbox;

    // Quick elimination if point is not inside bbox
    if (bbox && inBBox(pt, bbox) === false) return false;

    // normalize to multipolygon
    if (type === 'Polygon') polys = [polys];

    for (var i = 0, insidePoly = false; i < polys.length && !insidePoly; i++) {
        // check if it is in the outer ring first
        if (inRing(pt, polys[i][0], ignoreBoundary)) {
            var inHole = false;
            var k = 1;
            // check for the point in any of the holes
            while (k < polys[i].length && !inHole) {
                if (inRing(pt, polys[i][k], !ignoreBoundary)) {
                    inHole = true;
                }
                k++;
            }
            if (!inHole) insidePoly = true;
        }
    }
    return insidePoly;
};

/**
 * inRing
 *
 * @private
 * @param {[number, number]} pt [x,y]
 * @param {Array<[number, number]>} ring [[x,y], [x,y],..]
 * @param {boolean} ignoreBoundary ignoreBoundary
 * @returns {boolean} inRing
 */
function inRing(pt, ring, ignoreBoundary) {
    var isInside = false;
    if (ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]) ring = ring.slice(0, ring.length - 1);

    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0], yi = ring[i][1];
        var xj = ring[j][0], yj = ring[j][1];
        var onBoundary = (pt[1] * (xi - xj) + yi * (xj - pt[0]) + yj * (pt[0] - xi) === 0) &&
            ((xi - pt[0]) * (xj - pt[0]) <= 0) && ((yi - pt[1]) * (yj - pt[1]) <= 0);
        if (onBoundary) return !ignoreBoundary;
        var intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
}

/**
 * inBBox
 *
 * @private
 * @param {[number, number]} pt point [x,y]
 * @param {[number, number, number, number]} bbox BBox [west, south, east, north]
 * @returns {boolean} true/false if point is inside BBox
 */
function inBBox(pt, bbox) {
    return bbox[0] <= pt[0] &&
           bbox[1] <= pt[1] &&
           bbox[2] >= pt[0] &&
           bbox[3] >= pt[1];
}

},{"@turf/invariant":27}],27:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],28:[function(require,module,exports){
var inside = require('@turf/inside');
var featureCollection = require('@turf/helpers').featureCollection;

/**
 * Takes a set of {@link Point|points} and a set of {@link Polygon|polygons} and returns the points that fall within the polygons.
 *
 * @name within
 * @param {FeatureCollection<Point>} points input points
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @returns {FeatureCollection<Point>} points that land within at least one polygon
 * @example
 * var searchWithin = turf.featureCollection([
 *     turf.polygon([[
 *         [-46.653,-23.543],
 *         [-46.634,-23.5346],
 *         [-46.613,-23.543],
 *         [-46.614,-23.559],
 *         [-46.631,-23.567],
 *         [-46.653,-23.560],
 *         [-46.653,-23.543]
 *     ]])
 * ]);
 * var points = turf.featureCollection([
 *     turf.point([-46.6318, -23.5523]),
 *     turf.point([-46.6246, -23.5325]),
 *     turf.point([-46.6062, -23.5513]),
 *     turf.point([-46.663, -23.554]),
 *     turf.point([-46.643, -23.557])
 * ]);
 *
 * var ptsWithin = turf.within(points, searchWithin);
 *
 * //addToMap
 * var addToMap = [points, searchWithin, ptsWithin]
 * turf.featureEach(ptsWithin, function (currentFeature) {
 *   currentFeature.properties['marker-size'] = 'large';
 *   currentFeature.properties['marker-color'] = '#000';
 * });
 */
module.exports = function (points, polygons) {
    var pointsWithin = featureCollection([]);
    for (var i = 0; i < polygons.features.length; i++) {
        for (var j = 0; j < points.features.length; j++) {
            var isInside = inside(points.features[j], polygons.features[i]);
            if (isInside) {
                pointsWithin.features.push(points.features[j]);
            }
        }
    }
    return pointsWithin;
};

},{"@turf/helpers":29,"@turf/inside":30}],29:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],30:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"@turf/invariant":31,"dup":26}],31:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}]},{},[1])(1)
});