/*
 Route360° JavaScript API v0.0.9 (47f315f), a JS library for leaflet maps. http://route360.net
 (c) 2014 Henning Hollburg and Daniel Gerber, (c) 2014 Motion Intelligence GmbH
*/
(function (window, document, undefined) {
var r360 = {
	version: 'v0.0.9'
};

function expose() {
	var oldr360 = window.r360;

	r360.noConflict = function () {
		window.r360 = oldr360;
		return this;
	};

	window.r360 = r360;
}

// define r360 for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') 
	module.exports = r360;

// define r360 as an AMD module
else if (typeof define === 'function' && define.amd) define(r360);

// define r360 as a global r360 variable, saving the original r360 to restore later if needed
else expose();


/*
* IE 8 does not get the bind function. This is a workaround...
*/
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

proj4.defs('EPSG:32630', '+proj=utm +zone=30 +ellps=GRS80 +datum=WGS84 +units=m +no_defs');
proj4.defs('EPSG:32633', '+proj=utm +zone=33 +ellps=GRS80 +datum=WGS84 +units=m +no_defs');

r360.config = {

    // serviceUrl      : 'http://localhost:8080/api/',
    serviceUrl      : 'http://144.76.246.52/api/',
    nominatimUrl    : 'http://geocode.route360.net/',
    serviceVersion  : 'v1',
    pathSerializer  : 'compact',
    maxRoutingTime  : 3600,
    bikeSpeed       : 15,
    bikeUphill      : 20,
    bikeDownhill    : -10,
    walkSpeed       : 5,
    walkUphill      : 10,
    walkDownhill    : 0,
    travelTimes     : [300, 600, 900, 1200, 1500, 1800],
    travelType      : "walk",
    logging         : false,
    utm             : true,
    crs             : new L.Proj.CRS('urn:ogc:def:crs:EPSG::32630'),

    // options for the travel time slider; colors and lengths etc.
    defaultTravelTimeControlOptions : {
        travelTimes     : [
            { time : 300  , color : "#006837"},
            { time : 600  , color : "#39B54A"},
            { time : 900  , color : "#8CC63F"},
            { time : 1200 , color : "#F7931E"},
            { time : 1500 , color : "#F15A24"},
            { time : 1800 , color : "#C1272D"},
            { time : 5400 , color : "#C1272D"},
            { time : 7200 , color : "#C1272D"}
        ],
        position : 'topright',
        label: 'travel time',
        initValue: 30
    },

    routeTypes  : [

        // non transit
        { routeType : 'WALK'     , color : "#558D54"},
        { routeType : 'BIKE'     , color : "#558D54"},
        { routeType : 'CAR'      , color : "#558D54"},
        { routeType : 'TRANSFER' , color : "#558D54"},

        // berlin
        { routeType : 102        , color : "#006837"},
        { routeType : 400        , color : "#156ab8"},
        { routeType : 900        , color : "red"},
        { routeType : 700        , color : "#A3007C"},
        { routeType : 1000       , color : "blue"},
        { routeType : 109        , color : "#006F35"},
        { routeType : 100        , color : "red"},
        // new york      
        { routeType : 1          , color : "red"},
        { routeType : 2          , color : "blue"},
        { routeType : 3          , color : "yellow"},
        { routeType : 0          , color : "green"},
        { routeType : 4          , color : "orange"},
        { routeType : 5          , color : "red"},
        { routeType : 6          , color : "blue"},
        { routeType : 7          , color : "yellow"}
    ],

    defaultPlaceAutoCompleteOptions : {
        serviceUrl : "http://geocode.route360.net/solr/select?",
        position : 'topleft',
        reset : false,
        reverse : false,
        placeholder : 'Select source',
        maxRows : 5,
        width : 300
    },

    defaultRadioOptions: {
       position : 'topright',
    },

    // configuration for the Route360PolygonLayer
    defaultPolygonLayerOptions:{
        opacity : 0.4,
        strokeWidth: 15
    },

    i18n : {

        language            : 'de',
        departure           : { en : 'Departure',       de : 'Abfahrt' },
        line                : { en : 'Line',            de : 'Linie' },
        arrival             : { en : 'Arrival',         de : 'Ankunft' },
        from                : { en : 'From',            de : 'Von' },
        to                  : { en : 'To',              de : 'Nach' },
        travelTime          : { en : 'Travel time',     de : 'Reisezeit' },
        totalTime           : { en : 'Total time',      de : 'Gesamtzeit' },
        distance            : { en : 'Distance',        de : 'Distanz' },
        wait                : { en : 'Please wait!',    de : 'Bitte warten!' },
        elevation           : { en : 'Elevation',       de : 'Höhenunterschied' },
        timeFormat          : { en : 'a.m.',            de : 'Uhr' },
        reset               : { en : 'Reset input',     de : 'Eingeben löschen' },
        reverse             : { en : 'Switch source and target',   de : 'Start und Ziel tauschen' },
        noRouteFound        : { en : 'No route found!', de : 'Keine Route gefunden!' },
        monthNames          : { de : ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'] },
        dayNames            : { de : ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag','Samstag'] },
        dayNamesMin         : { de : ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] },
        get : function(key){

            var translation;
            _.each(_.keys(r360.config.i18n), function(aKey){
                if ( key == aKey ) translation = r360.config.i18n[key][r360.config.i18n.language];
            })

            return translation;
        }
    }
}

/*
 *
 */
r360.Util = {

    /* 
     * This method returns the current time, at the time this method is executed,
     * in seconds. This means that the current hours, minutes and seconds of the current
     * time are added up, e.g.: 12:11:15 pm: 
     *
     *      -> (12 * 3600) + (11 * 60) + 15 = 43875
     * 
     * @method getTimeInSeconds
     * 
     * @returns {Number} The current time in seconds
     */
    getTimeInSeconds : function() {

        var now = new Date();
        return (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
    },

    /* 
     * This method returns the current time, at the time this method is executed,
     * in seconds. This means that the current hours, minutes and seconds of the current
     * time are added up, e.g.: 12:11 pm: 
     *
     *      -> (12 * 3600) + (11 * 60) = 43875
     * 
     * @method getHoursAndMinutesInSeconds
     * 
     * @returns {Number} The current time in seconds
     */
    getHoursAndMinutesInSeconds : function() {

        var now = new Date();
        return (now.getHours() * 3600) + (now.getMinutes() * 60);
    },

    /*
      * Returns the current date in the form 20140508 (YYYYMMDD). Note that month is 
      * not zero but 1 based, which means 6 == June.
      *
      * @method getCurrentDate
      * 
      * @return {String} the date object in string representation YYYYMMDD
      */
    getCurrentDate : function() {

        var date  = new Date();
        var year  = date.getFullYear();
        var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); 
        var day   = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); 
        
        return year + "" + month + "" + day;
    },

    getTimeFormat : function(seconds) {

        var i18n = r360.config.i18n;
        if ( i18n.language == 'en' ) if ( seconds >= 43200 ) return 'p.m.';
        return i18n.get('timeFormat');
    },

    /*
     * Transforms the given seconds to a hour and minuten view. This means
     * that for example 10:15 (one hour and 15 minutes) is translates to the string:
     *      -> 10h 15min
     *
     * Note that no trailing zeros are returned. Also if hours < 1 only minute values will be returned.
     * 
     * @method secondsToHoursAndMinutes
     * @returns {String} the transformed seconds in "xh ymin"
     */
    secondsToHoursAndMinutes : function(seconds) {

        var minutes = (seconds / 60).toFixed(0);
        var hours = Math.floor(minutes / 60);

        minutes = minutes - hours * 60;
        var timeString = "";

        if (hours != 0) timeString += (hours + "h "); 
        timeString += (minutes + "min");

        return timeString;
    },

    /*
     * This methods transforms a given time in seconds to a format like:
     *      43200 -> 12:00:00
     * 
     * @method secondsToTimeOfDay
     * @returns {String} the formated time string in the format HH:MM:ss
     */
    secondsToTimeOfDay : function(seconds){

        var hours   = Math.floor(seconds/3600);
        var minutes = Math.floor(seconds/60)-hours*60;
        seconds     = seconds - (hours * 3600) - (minutes *60);
        return hours+":"+ ("0" + minutes).slice(-2) +":"+ ("0" + seconds).slice(-2);
    },

    /*
     * This methods generates a unique ID with the given length or 10 if no length was given.
     * The method uses all characters from [A-z0-9] but does not guarantuee a unique string.
     * It's more a pseudo random string. 
     * 
     * @method generateId
     * @param the length of the returnd pseudo random string
     * @return a random string with the given length
     */
    generateId : function(length) {
        
        var id       = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        _.each(_.range(length ? length : 10), function(){
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        })

        return id;
    },

    /*
     *
     */
    parseLatLonArray : function(latlngs) {

        var coordinates = new Array();

        if( r360.config.utm)
            _.each(latlngs, function (latlng) {
                coordinates.push(L.latLng(r360.config.crs.projection.unproject(new L.Point(latlng[1], latlng[0]))));
            });

        else
            _.each(latlngs, function (latlng) {
                coordinates.push(L.latLng(latlng[0], latlng[1]));
            });

        return coordinates;
    },

    /*
     *
     */
    routeToLeafletPolylines : function(route, options) {

        options = typeof options !== 'undefined' ? options : {};

        var polylines = [];

        _.each(route.getSegments(), function(segment, index){

            if ( segment.getType() == "TRANSFER" ) return;

            var polylineOptions         = {};
            polylineOptions.color       = _.has(options, 'color') ? options.color : segment.getColor();

            var polylineHaloOptions     = {};
            polylineHaloOptions.weight  = 7;
            polylineHaloOptions.color   = "white";
            
            // the first and the last segment is walking so we need to dotted lines
            if ( index == 0 || index == (route.getLength() - 1) ) polylineOptions.dashArray = "1, 8";

            var halo = L.polyline(segment.getPoints(), polylineHaloOptions);
            var line = L.polyline(segment.getPoints(), polylineOptions);

            polylines.push([halo, line]);
        });

        return polylines;
    },

    /*
     * This methods uses the Rotue360° geocoding service to return
     * a street address for a given latitude/longitude coordinate pair.
     * This functionality is typically called reverse geocoding.
     * 
     * @method getAddressByCoordinates
     * @param {Object} [latlon] The coordinate
     * @param {Number} [latlon.lat] The latitude of the coordinate.
     * @param {Number} [latlon.lng] The longitude of the coordinate.
     * @param {String} [language] The country code, 'nb' for norway, 'de' for germany. 
     * @param {Function} [callback] The callback methods which processes the returned data.
     */
    getAddressByCoordinates : function(latlng, language, callback){

        $.getJSON(r360.config.nominatimUrl + 'reverse.php?&format=json&lat=' + latlng.lat + '&accept-language=' + language + '&lon=' + latlng.lng + '&json_callback=?', callback);
    },

    /* 
     * This method takes a result from the nominatim reverse geocoder and formats
     * it to a readable and displayable string. It builds up an address like this:
     *      'STREETNAME STREETNUMBER, POSTALCODE, CITY'
     * In case any of these values are undefined, they get removed from returned string.
     * In case all values are undefined, the 'display_name' property of the returned 
     * json (from nominatim) is used to generate the output value.
     * @return {String} a string representing the geocoordinates in human readable form
     */
    formatReverseGeocoding : function(json) {

        var streetAdress = [];
        if ( _.has(json.address, 'road') )          streetAdress.push(json.address.road);
        if ( _.has(json.address, 'house_number') )  streetAdress.push(json.address.house_number);

        var city = [];
        if ( _.has(json.address, 'postcode') )      city.push(json.address.postcode);
        if ( _.has(json.address, 'city') )          city.push(json.address.city);

        var address = [];
        if ( streetAdress.length > 0 )  address.push(streetAdress.join(' '));
        if ( city.length > 0)           address.push(city.join(', '));

        if ( streetAdress.length == 0 && city.length == 0 ) address.push(json.display_name);

        return address.join(', ');
    },

    /*
     *
     */
    parsePolygons : function(polygonsJson) {
               
        if ( polygonsJson.error ) return errorMessage;

        if(r360.config.logging) var start   = new Date().getTime();

        var polygonList = Array();

        _.each(polygonsJson, function(source){

            var sourcePolygons = { id : source.id , polygons : [] };

            _.each(source.polygons, function (polygonJson) {

                var polygon = r360.polygon();
                polygon.setTravelTime(polygonJson.travelTime);
                polygon.setColor(_.findWhere(r360.config.defaultTravelTimeControlOptions.travelTimes, { time : polygon.getTravelTime() }).color);
                polygon.setOuterBoundary(r360.Util.parseLatLonArray(polygonJson.outerBoundary));
                polygon.setBoundingBox();

                _.each(polygonJson.innerBoundary, function (innerBoundary) {
                    polygon.addInnerBoundary(r360.Util.parseLatLonArray(innerBoundary));
                });
            
                sourcePolygons.polygons.push(polygon);
            });

            polygonList.push(sourcePolygons);
        });

        if ( r360.config.logging )
            console.log("Polygon parsing took: " + (new Date().getTime() - start) + "ms");

        return polygonList;
    },

    /*
     * This method parses the JSON returned from the Route360 Webservice and generates
     * java script objects representing the values.
     */
    parseRoutes : function(json){

        var routes = new Array();

        _.each(json.routes, function(jsonRoute){

            var route = r360.route(jsonRoute.travelTime);

            _.each(jsonRoute.segments, function(segment){                

                route.addRouteSegment(r360.routeSegment(segment));
            });

            routes.push(route);
        });

        return routes;
    },

    /*
     * Convenients method to generate a Leaflet marker with the 
     * specified marker color. For available colors look at 'dist/images'
     * 
     * @method getMarker
     * @param {Object} [latlon] The coordinate
     * @param {Number} [latlon.lat] The latitude of the coordinate.
     * @param {Number} [latlon.lng] The longitude of the coordinate.
     * @param {Object} [options] The options for the marker
     * @param {Number} [options.color] The color for the marker icon.
     */
    getMarker : function(latlng, options){

        var color = _.has(options, 'color') ? '-' + options.color : '-blue';

        options.icon = L.icon({
            iconSize     : [25, 41], // size of the icon
            iconUrl      : options.iconPath + 'marker-icon' + color + '.png',
            iconAnchor   : [12, 41], // point of the icon which will correspond to marker's location
            
            shadowSize   : [41, 41], // size of the shadow
            shadowUrl    : options.iconPath + 'marker-shadow.png',
            shadowAnchor : [41 / 3, 41], // point of the shadow which will correspond to marker's location
            
            popupAnchor  : [0, -35]  // point from which the popup should open relative to the iconAnchor
        });

        return L.marker(latlng, options);
    }
};

/*
 *
 */
r360.TravelOptions = function(){

    this.sources          = [];
    this.targets          = [];
    this.service;

    this.bikeSpeed        = 15;
    this.bikeUphill       = 20;
    this.bikeDownhill     = -10;
    this.walkSpeed        = 5;
    this.walkUphill       = 10;
    this.walkDownhill     = 0;

    this.travelTimes      = [300, 600, 900, 1200, 1500, 1800];
    this.travelType       = "walk";

    this.time             = r360.Util.getTimeInSeconds();
    this.date             = r360.Util.getCurrentDate();
    this.errors           = [];

    this.intersectionMode = 'union';
    this.pathSerializer   = r360.config.pathSerializer;
    this.maxRoutingTime   = r360.config.maxRoutingTime;
    this.waitControl;

    this.isValidPolygonServiceOptions = function(){

        // reset errors
        this.errors = [];

        // check if sources are of type array
        if ( Object.prototype.toString.call(this.getSources()) === '[object Array]' ) {

            if ( this.getSources().length == 0 ) this.getErrors().push('Sources do not contain any points!');
            else {

                // validate each source
                _.each(this.getSources(), function(source){

                    if ( !_.has(source, 'lat') ) this.getErrors().push('Sources contains source with undefined latitude!');
                    if ( !_.has(source, 'lon') ) this.getErrors().push('Sources contains source with undefined longitude!');
                });
            }
        }
        else this.getErrors().push('Sources are not of type array!');

        // is the given travel type supported
        if ( !_.contains(['bike', 'transit', 'walk', 'car'], this.getTravelType() ) )
            this.getErrors().push('Not supported travel type given: ' + this.getTravelType() );
        else {

            if ( this.getTravelType() == 'car' ) ; // nothing to do
            else if ( this.getTravelType() == 'bike' ) {

                // validate downhill/uphill penalties
                if ( this.getBikeUphill() < 0 || this.getBikeDownhill() > 0 || this.getBikeUphill() < -(this.getBikeDownhill()) )  
                    this.getErrors().push("Uphill cycle speed has to be larger then 0. Downhill cycle speed has to be smaller then 0. \
                        Absolute value of downhill cycle speed needs to be smaller then uphill cycle speed.");

                // we need to have a positiv speeds
                if ( this.getBikeSpeed() <= 0 ) this.getErrors().push("Bike speed needs to be larger then 0.");
            }
            else if ( this.getTravelType() == 'walk' ) {

                // validate downhill/uphill penalties
                if ( this.getWalkUphill() < 0 || this.getWalkDownhill() > 0 || this.getWalkUphill() < -(this.getWalkDownhill()) )  
                    this.getErrors().push("Uphill walking speed has to be larger then 0. Downhill walking speed has to be smaller then 0. \
                        Absolute value of downhill walking speed needs to be smaller then uphill walking speed.");

                // we need to have a positiv speeds
                if ( this.getWalkSpeed() <= 0 ) this.getErrors().push("Walk speed needs to be larger then 0.");
            }
            else if ( this.getTravelType() == 'transit' ) {

                if ( this.getTime() < 0 ) this.getErrors().push("Start time for transit routing needs to larger than 0: " + this.getTime());
                if ( this.getDate().length != 8 ) this.getErrors().push("Date has to have format YYYYMMDD: " + this.getDate());
            }
        }

        // travel times needs to be an array
        if ( Object.prototype.toString.call(this.getTravelTimes()) !== '[object Array]' ) {
            this.getErrors().push('Travel times have to be an array!');
        }
        else {

            if ( _.reject(this.getTravelTimes(), function(entry){ return typeof entry == 'number'; }).length > 0 )
                this.getErrors().push('Travel times contain non number entries: ' + this.getTravelTimes());
        }

        // only let valid intersections mode pass
        if ( !_.contains(['union', 'average', 'intersection', 'none'], this.getIntersectionMode() ) )
            this.getErrors().push('Not supported intersection mode given: ' + this.getIntersectionMode() );

        // false if we found errors
        return this.errors.length == 0;
    }

    /*
     *
     *
     *
     */
    this.isValidRouteServiceOptions = function(){

        this.isValidPolygonServiceOptions();

        // check if targets are of type array
        if ( Object.prototype.toString.call(this.getTargets()) === '[object Array]' ) {

            if ( this.getTargets().length == 0 ) this.getErrors().push('Sources do not contain any points!');
            else {

                // validate each source
                _.each(this.getTargets(), function(target){

                    if ( !_.has(target, 'lat') ) this.getErrors().push('Targets contains target with undefined latitude!');
                    if ( !_.has(target, 'lon') ) this.getErrors().push('Targets contains target with undefined longitude!');
                });
            }
        }
        else this.getErrors().push('Targets are not of type array!');

        // is the given path serializer supported
        if ( !_.contains(['travelTime', 'compact', 'detailed'], this.getPathSerializer() ) )
            this.getErrors().push('Path serializer not supported: ' + this.getPathSerializer() );

        // false if we found errors
        return this.errors.length == 0;
    }

    /*
     *
     *
     *
     */
    this.isValidTimeServiceOptions = function(){

        this.isValidRouteServiceOptions();

        // is the given path serializer supported
        if ( !_.contains(['travelTime', 'compact', 'detailed'], this.getPathSerializer() ) )
            this.getErrors().push('Path serializer not supported: ' + this.getPathSerializer() );

        // false if we found errors
        return this.errors.length == 0;
    }

    /*
     *
     *
     *
     */
    this.getErrors = function(){

        return this.errors;
    }

    /*
     *
     *
     *
     */
    this.getSources = function(){

        return this.sources;
    }

    /*
     *
     *
     *
     */
    this.addSource = function(source){

        this.sources.push(source);
    }

    /*
     *
     *
     *
     */
    this.addTarget = function(target){

        this.targets.push(target);
    }

    /*
     *
     *
     *
     */
    this.getTargets = function(){

        return this.targets;
    }

    /*
     *
     *
     *
     */
    this.getBikeSpeed = function(){

        return this.bikeSpeed;
    }
    
    /*
     *
     *
     *
     */
    this.getBikeUphill = function(){

        return this.bikeUphill;
    }
    
    /*
     *
     *
     *
     */
    this.getBikeDownhill = function(){

        return this.bikeDownhill;
    }
    
    /*
     *
     *
     *
     */
    this.getWalkSpeed = function(){

        return this.walkSpeed;
    }
    
    /*
     *
     *
     *
     */
    this.getWalkUphill = function(){

        return this.walkUphill;
    }
    
    /*
     *
     *
     *
     */
    this.getWalkDownhill = function(){

        return this.walkDownhill;
    }
    
    /*
     *
     *
     *
     */
    this.getTravelTimes = function(){

        return this.travelTimes;
    }
    
    /*
     *
     *
     *
     */
    this.getTravelType = function(){

        return this.travelType;
    }
    
    /*
     *
     *
     *
     */
    this.getTime = function(){

        return this.time;
    }
    
    /*
     *
     *
     *
     */
    this.getDate = function(){

        return this.date;
    }
    
    /*
     *
     *
     *
     */
    this.getWaitControl = function(){

        return this.waitControl;
    }


    /*
     *
     *
     *
     */
    this.getService = function(){

        return this.service;
    }

    /*
     *
     *
     *
     */
    this.getPathSerializer = function(){

        return this.pathSerializer;
    }

    /*
     *
     *
     *
     */
    this.getMaxRoutingTime = function(){

        return this.maxRoutingTime;
    }

    /*
     *
     *
     *
     */
    this.getIntersectionMode = function(){

        return this.intersectionMode;
    }
    
    /*
     *
     *
     *
     */
    this.setIntersectionMode = function(intersectionMode){

        this.intersectionMode = intersectionMode;
    }
    
    /*
     *
     *
     *
     */
    this.setMaxRoutingTime = function(maxRoutingTime){

        this.maxRoutingTime = maxRoutingTime;
    }
    
    /*
     *
     *
     *
     */
    this.setPathSerializer = function(pathSerializer){

        this.pathSerializer = pathSerializer;
    }

    
    /*
     *
     *
     *
     */
    this.setService = function(service){

        this.service = service;
    }
    
    /*
     *
     *
     *
     */
    this.setSources = function(sources){

        this.sources = sources;
    }
    
    /*
     *
     *
     *
     */
    this.setTargets = function(targets){

        this.targets = targets;
    }
    
    /*
     *
     *
     *
     */
    this.setBikeSpeed = function(bikeSpeed){

        this.bikeSpeed = bikeSpeed;
    }
    
    /*
     *
     *
     *
     */
    this.setBikeUphill = function(bikeUphill){

        this.bikeUphill = bikeUphill;
    }
    
    /*
     *
     *
     *
     */
    this.setBikeDownhill = function(bikeDownhill){

        this.bikeDownhill = bikeDownhill;
    }
    
    /*
     *
     *
     *
     */
    this.setWalkSpeed = function(walkSpeed){

        this.walkSpeed = walkSpeed;
    }
    
    /*
     *
     *
     *
     */
    this.setWalkUphill = function(walkUphill){

        this.walkUphill = walkUphill;
    }
    
    /*
     *
     *
     *
     */
    this.setWalkDownhill = function(walkDownhill){

        this.walkDownhill = walkDownhill;
    }
    
    /*
     *
     *
     *
     */
    this.setTravelTimes = function(travelTimes){

        this.travelTimes = travelTimes;
    }
    
    /*
     *
     *
     *
     */
    this.setTravelType = function(travelType){

        this.travelType = travelType;
    }
    
    /*
     *
     *
     *
     */
    this.setTime = function(time){

        this.time = time;
    }
    
    /*
     *
     *
     *
     */
    this.setDate = function(date){

        this.date = date;
    }
    
    /*
     *
     *
     *
     */
    this.setWaitControl = function(waitControl){

        this.waitControl = waitControl;
    }
};

r360.travelOptions = function () { 
    return new r360.TravelOptions();
};


r360.PolygonService = {

    cache : {},

    /*
     *
     */
    getTravelTimePolygons : function(travelOptions, callback) {

        // only make the request if we have a valid configuration
        if ( travelOptions.isValidPolygonServiceOptions() ) {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().show();

            // we only need the source points for the polygonizing and the polygon travel times
            var cfg = {
                polygon          : { 
                    values           : travelOptions.getTravelTimes(), 
                    intersectionMode : travelOptions.getIntersectionMode() 
                },
                sources          : []
            };

            // add each source point and it's travel configuration to the cfg
            _.each(travelOptions.getSources(), function(source){
                
                var src = {
                    lat : _.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                    lon : _.has(source, 'lon') ? source.lon : source.getLatLng().lng,
                    id  : _.has(source, 'id')  ? source.id  : source.lat + ';' + source.lon,
                    tm  : {}
                };

                var travelType = _.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

                src.tm[travelType] = {};

                // set special routing parameters depending on the travel type
                if ( travelType == 'transit' ) {
                    
                    src.tm.transit.frame = {
                        time : travelOptions.getTime(),
                        date : travelOptions.getDate()
                    };
                }
                if ( travelType == 'bike' ) {
                    
                    src.tm.bike = {
                        speed       : travelOptions.getBikeSpeed(),
                        uphill      : travelOptions.getBikeUphill(),
                        downhill    : travelOptions.getBikeDownhill()
                    };
                }
                if ( travelType == 'walk') {
                    
                    src.tm.walk = {
                        speed       : travelOptions.getWalkSpeed(),
                        uphill      : travelOptions.getWalkUphill(),
                        downhill    : travelOptions.getWalkDownhill()
                    };
                }

                cfg.sources.push(src);
            });

            if ( !_.has(r360.PolygonService.cache, JSON.stringify(cfg)) ) {

                // make the request to the Route360° backend 
                $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/polygon?cfg=' + 
                    encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+r360.config.serviceKey, 
                        function(result){

                            // cache the result
                            r360.PolygonService.cache[JSON.stringify(cfg)] = result;
                            // hide the please wait control
                            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                            // call callback with returned results
                            callback(r360.Util.parsePolygons(result));
                        });
            }
            else { 

                // hide the please wait control
                if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                // call callback with returned results
                callback(r360.Util.parsePolygons(r360.PolygonService.cache[JSON.stringify(cfg)]));
            }
        }
        else {

            alert('Travel options are not valid!')
            console.log(travelOptions.getErrors());
        }
    }
}


r360.RouteService = {

    cache : {},

    /*
     *
     */
    getRoutes : function(travelOptions, callback) {

        // only make the request if we have a valid configuration
        if ( travelOptions.isValidRouteServiceOptions() ) {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().show();

            var cfg = { sources : [], targets : [], pathSerializer : travelOptions.getPathSerializer() };
            
            _.each(travelOptions.getSources(), function(source){

                // set the basic information for this source
                var src = {
                    lat : _.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                    lon : _.has(source, 'lon') ? source.lon : source.getLatLng().lng,
                    id  : _.has(source, 'id')  ? source.id  : source.lat + ';' + source.lon,
                    tm  : {}
                };

                var travelType = _.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();
                
                src.tm[travelType] = {};

                // set special routing parameters depending on the travel mode
                if ( travelType == "transit" ) {
                    
                    src.tm.transit.frame = {
                        time : travelOptions.getTime(),
                        date : travelOptions.getDate()
                    };
                }
                if ( travelType == "bike" ) {
                    
                    src.tm.bike = {
                        speed       : travelOptions.getBikeSpeed(),
                        uphill      : travelOptions.getBikeUphill(),
                        downhill    : travelOptions.getBikeDownhill()
                    };
                }
                if ( travelType == "walk") {
                    
                    src.tm.walk = {
                        speed       : travelOptions.getWalkSpeed(),
                        uphill      : travelOptions.getWalkUphill(),
                        downhill    : travelOptions.getWalkDownhill()
                    };
                }

                // add it to the list of sources
                cfg.sources.push(src);
            });

            cfg.targets = [];
            _.each(travelOptions.getTargets(), function(target){

                 cfg.targets.push({

                    lat : _.has(target, 'lat') ? target.lat : target.getLatLng().lat,
                    lon : _.has(target, 'lon') ? target.lon : target.getLatLng().lng,
                    id  : _.has(target, 'id')  ? target.id  : target.lat + ';' + target.lon,
                });
            });

            if ( !_.has(r360.RouteService.cache, JSON.stringify(cfg)) ) {

                $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/route?cfg=' +  
                encodeURIComponent(JSON.stringify(cfg)) + "&cb=?&key="+r360.config.serviceKey, 
                    function(result){

                        // cache the result
                        r360.RouteService.cache[JSON.stringify(cfg)] = result;
                        // hide the please wait control
                        if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                        // call callback with returned results
                        callback(r360.Util.parseRoutes(result)); 
                    });
            }
            else { 

                // hide the please wait control
                if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                // call callback with returned results
                callback(r360.Util.parseRoutes(r360.RouteService.cache[JSON.stringify(cfg)])); 
            }
        }
        else {

            alert("Travel options are not valid!")
            console.log(travelOptions.getErrors());
        }
    }
};

r360.TimeService = {

    cache : {},

    getRouteTime : function(travelOptions, callback) {

        // only make the request if we have a valid configuration
        if ( travelOptions.isValidTimeServiceOptions() ) {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().show();

            var cfg = { 
                sources : [], targets : [],
                pathSerializer : travelOptions.getPathSerializer(), 
                maxRoutingTime : travelOptions.getMaxRoutingTime()
            };

            // configure sources
            _.each(travelOptions.getSources(), function(source){

                console.log(source);

                // set the basic information for this source
                var src = {
                    lat : _.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                    lon : _.has(source, 'lon') ? source.lon : source.getLatLng().lng,
                    id  : _.has(source, 'id')  ? source.id  : source.lat + ';' + source.lon,
                    tm  : {}
                };

                var travelType = _.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

                src.tm[travelType] = {};

                // set special routing parameters depending on the travel mode
                if ( travelType == "transit" ) {
                    
                    src.tm.transit.frame = {
                        time : travelOptions.getTime(),
                        date : travelOptions.getDate()
                    };
                }
                if ( travelType == "bike" ) {
                    
                    src.tm.bike = {
                        speed       : travelOptions.getBikeSpeed(),
                        uphill      : travelOptions.getBikeUphill(),
                        downhill    : travelOptions.getBikeDownhill()
                    };
                }
                if ( travelType == "walk") {
                    
                    src.tm.walk = {
                        speed       : travelOptions.getWalkSpeed(),
                        uphill      : travelOptions.getWalkUphill(),
                        downhill    : travelOptions.getWalkDownhill()
                    };
                }
                
                // add to list of sources
                cfg.sources.push(src);
            });
            
            // configure targets for routing
            _.each(travelOptions.getTargets(), function(target){

                cfg.targets.push({

                    lat : _.has(target, 'lat') ? target.lat : target.getLatLng().lat,
                    lon : _.has(target, 'lon') ? target.lon : target.getLatLng().lng,
                    id  : _.has(target, 'id')  ? target.id  : target.lat + ';' + target.lon,
                });
            });

            if ( !_.has(r360.TimeService.cache, JSON.stringify(cfg)) ) {

                // execute routing time service and call callback with results
                $.ajax({
                    url:         r360.config.serviceUrl + r360.config.serviceVersion + '/time?key=' +r360.config.serviceKey,
                    type:        "POST",
                    data:        JSON.stringify(cfg) ,
                    contentType: "application/json",
                    dataType:    "json",
                    success: function (result) {
                        // cache the request
                        r360.TimeService.cache[JSON.stringify(cfg)] = result;
                        // hide the please wait control
                        if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                        // return the results
                        callback(result);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                });
            }
            else { 

                // hide the please wait control
                if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                // call callback with returned results
                callback(r360.TimeService.cache[JSON.stringify(cfg)]); 
            }
        }
        else {

            alert("Travel options are not valid!")
            console.log(travelOptions.getErrors());
        }
    }
};

r360.placeAutoCompleteControl = function (options) {
    return new r360.PlaceAutoCompleteControl(options);
};

r360.PlaceAutoCompleteControl = L.Control.extend({

    initialize: function(options){

        this.options = JSON.parse(JSON.stringify(r360.config.defaultPlaceAutoCompleteOptions));

        if ( typeof options !== "undefined" ) {
            
            if ( _.has(options, 'position'))    this.options.position    = options.position;
            if ( _.has(options, 'label'))       this.options.label       = options.label;
            if ( _.has(options, 'country'))     this.options.country     = options.country;
            if ( _.has(options, 'reset'))       this.options.reset       = options.reset;
            if ( _.has(options, 'reverse'))     this.options.reverse     = options.reverse;
            if ( _.has(options, 'placeholder')) this.options.placeholder = options.placeholder;
            if ( _.has(options, 'width'))       this.options.width       = options.width;
            if ( _.has(options, 'maxRows'))     this.options.maxRows     = options.maxRows;
            if ( _.has(options, 'image'))       this.options.image       = options.image;
            if ( _.has(options, 'options')) {

                 this.options.options    = options.options;
                 this.options.travelType = _.has(this.options.options, 'init') ? this.options.options.init : 'walk';
            }   
        }
    },

    onAdd: function(map){
        
        var that = this;
        var i18n            = r360.config.i18n;   
        var countrySelector =  "";
        var nameContainer   = L.DomUtil.create('div', that._container);
        that.options.map    = map;
        that.options.id     = $(map._container).attr("id") + r360.Util.generateId(10);

        map.on("resize", that.onResize.bind(that));          

        // calculate the width in dependency to the number of buttons attached to the field
        var width = that.options.width;
        if ( that.options.reset ) width += 44;
        if ( that.options.reverse ) width += 37;
        var style = 'style="width:'+ width +'px;"';

        that.options.input = 
            '<div class="input-group autocomplete" '+style+'> \
                <input id="autocomplete-'+that.options.id+'" style="color: black;width:'+width+'" \
                type="text" class="form-control r360-autocomplete" placeholder="' + that.options.placeholder + '" onclick="this.select()">';

        if ( that.options.image ) {

            that.options.input += 
                '<span id="'+that.options.id+'-image" class="input-group-addon btn-autocomplete-marker"> \
                    <img style="height:25px;" src="'+that.options.image+'"> \
                 </span>';
        }

        var optionsHtml = [];
        if ( that.options.options ) {

            that.options.input += 
                '<span id="'+that.options.id+'-options-button" class="input-group-btn travel-type-buttons"> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('settings') + '"><i class="fa fa-cog"></i></button> \
                </span>';

            optionsHtml.push('<div id="'+that.options.id+'-options" class="text-center" style="color: black;width:'+width+'; display: none;">');
            optionsHtml.push('  <div class="btn-group text-center">');

            if (that.options.options.walk ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button ' 
                    + (this.options.travelType == 'walk' ? 'active' : '') + 
                    '" travel-type="walk"><span class="map-icon-walking travel-type-icon"></span> <span lang="en">Walk</span><span lang="de">zu Fuß</span></button>');
            
            if (that.options.options.bike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'bike' ? 'active' : '') + 
                    '" travel-type="bike"><span class="map-icon-bicycling travel-type-icon"></span> <span lang="en">Bike</span><span lang="de">Fahrrad</span></button>');
            
            if (that.options.options.transit ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'transit' ? 'active' : '') + 
                    '" travel-type="transit"><span class="map-icon-train-station travel-type-icon"></span> <span lang="en">Transit</span><span lang="de">ÖPNV</span></button>');
            
            if (that.options.options.car ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'car' ? 'active' : '') + 
                    '" travel-type="car"><span class="fa fa-car"></span> <span lang="en">Car</span><span lang="de">Auto</span></button>');
            
            optionsHtml.push('  </div>');
            optionsHtml.push('</div>');
        }

        // add a reset button to the input field
        if ( that.options.reset ) {

            that.options.input += 
                '<span id="'+that.options.id+'-reset" class="input-group-btn"> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('reset') + '"><i class="fa fa-times"></i></button> \
                </span>';
        }
        if ( that.options.reverse ) {

            that.options.input += 
                '<span id="'+that.options.id+'-reverse" class="input-group-btn"> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('reverse') + '"><i class="fa fa-arrows-v"></i></button> \
                </span>';
        }

        that.options.input += '</div>';
        if ( that.options.options ) that.options.input += optionsHtml.join('');

        // add the control to the map
        $(nameContainer).append(that.options.input);

        $(nameContainer).find('#' + that.options.id + '-reset').click(function(){ that.options.onReset(); });
        $(nameContainer).find('#' + that.options.id + '-reverse').click(function(){ that.options.onReverse(); });
        $(nameContainer).find('#' + that.options.id + '-options-button').click(
            function(){ 
                // slide in or out on the click of the options button
                $('#' + that.options.id + '-options').slideToggle();
            });

        $(nameContainer).find('.travel-type-button').click(function(){

            $(nameContainer).find('.travel-type-button').removeClass('active');
            $(this).addClass('active');

            setTimeout(function() {
                  $('#' + that.options.id + '-options').slideToggle();
            }, 300);

            that.options.travelType = $(this).attr('travel-type');
            that.options.onTravelTypeChange();
        });

        // no click on the map, if click on container        
        L.DomEvent.disableClickPropagation(nameContainer);      

        if ( _.has(that.options, 'country' ) ) countrySelector += " AND country:" + that.options.country;

        $(nameContainer).find("#autocomplete-" + that.options.id).autocomplete({

            source: function( request, response ) {

                that.source = this;

                var requestElements = request.term.split(" ");
                var numbers = new Array();
                var requestString = "";
                var numberString = "";
                    
                for(var i = 0; i < requestElements.length; i++){
                    
                    if(requestElements[i].search(".*[0-9].*") != -1)
                        numbers.push(requestElements[i]);
                    else
                        requestString += requestElements[i] + " ";
                }

                if ( numbers.length > 0 ) {
                    numberString += " OR ";
                    
                    for(var j = 0; j < numbers.length; j++){
                        var n = "(postcode : " + numbers[j] + " OR housenumber : " + numbers[j] + " OR street : " + numbers[j] + ") ";
                        numberString +=  n;
                    }
                }

                // delay: 150,

                $.ajax({
                    url: that.options.serviceUrl, 
                    dataType: "jsonp",
                    jsonp: 'json.wrf',
                    async: false,
                    data: {
                      wt:'json',
                      indent : true,
                      rows: that.options.maxRows,
                      qt: 'en',
                      q:  "(" + requestString + numberString + ")" + countrySelector
                    }, 
                    success: function( data ) {

                        var places = new Array();
                        response( $.map( data.response.docs, function( item ) {

                            if ( item.osm_key == "boundary" ) return;

                            var latlng = item.coordinate.split(',');
                            var place           = {};
                            var firstRow        = [];
                            var secondRow       = [];
                            place.name          = item.name;
                            place.city          = item.city;
                            place.street        = item.street;
                            place.housenumber   = item.housenumber;
                            place.country       = item.country;
                            place.postalCode    = item.postcode;
                            if (place.name)       firstRow.push(place.name);
                            if (place.city)       firstRow.push(place.city);
                            if (place.street)     secondRow.push(place.street);
                            if (place.housenumber) secondRow.push(place.housenumber);
                            if (place.postalCode) secondRow.push(place.postalCode);
                            if (place.city)       secondRow.push(place.city);

                            // only show country if undefined
                            if ( !_.has(that.options, 'country') && place.country ) secondRow.push(place.country);

                            // if same looking object is in list already: return 
                            if ( _.contains(places, firstRow.join() + secondRow.join()) ) return; 
                            else places.push(firstRow.join() + secondRow.join());

                            return {
                                label       : firstRow.join(", "),
                                value       : firstRow.join(", "),
                                firstRow    : firstRow.join(", "),
                                secondRow   : secondRow.join(" "),
                                term        : request.term,
                                latlng      : new L.LatLng(latlng[0], latlng[1])
                            }
                        }));
                    }
                });
            },
            minLength: 2,
              
            select: function( event, ui ) {
                that.options.value = ui.item;
                that.options.onSelect(ui.item);
            }
        })
        .data("ui-autocomplete")._renderItem = function( ul, item ) {

            // this has been copied from here: https://github.com/angular-ui/bootstrap/blob/master/src/typeahead/typeahead.js
            // thank you angular bootstrap team
            function escapeRegexp(queryToEscape) {
                return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
            }

            var highlightedFirstRow = 
                item.term ? (item.firstRow).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : item.firstRow;

            var highlightedSecondRow = 
                item.term ? (item.secondRow).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : item.secondRow;

            var html = "<a><span class='address-row1'>"+ highlightedFirstRow + "</span><br/><span class='address-row2'>  " + highlightedSecondRow + "</span></a>";

            return $( "<li>" ).append(html).appendTo(ul);
        };
        
        this.onResize();     

        return nameContainer;
    },

    onSelect: function(onSelect){

        this.options.onSelect = onSelect;
    },

    onReset: function(onReset){

        this.options.onReset = onReset;
    },

    onReverse: function(onReverse){
       
       this.options.onReverse = onReverse;
    },

    onTravelTypeChange: function(onTravelTypeChange){

        this.options.onTravelTypeChange = onTravelTypeChange;
    },

    reset : function(){

        this.options.value = {};
        this.setFieldValue("");
    },

    update : function(latLng, fieldValue) {

        this.setLatLng(latLng);
        this.setFieldValue(fieldValue);
    },

    setLatLng : function(latLng) {

        this.options.value.latlng = latLng
    },

    setFieldValue : function(value){

        var that = this;
        $("#autocomplete-" + that.options.id).val(value);
    },

    getFieldValue : function(){

        var that = this;
        return $("#autocomplete-" + that.options.id).val();
    },

    getTravelType : function(){

        return this.options.travelType;
    },

    setValue : function(value){
        this.options.value = value;
    },

    getValue : function(){
        return this.options.value;
    },

    onResize: function(){
        
        var that = this;
        if ( this.options.map.getSize().x < 550) $(that.options.input).css({'width':'45px'});
        else $(that.options.input).css({'width':''});
    }
})

/*
 *
 */
r360.TravelStartDateControl = L.Control.extend({
    
    options: {
        position: 'topright',
        dateFormat: "yy-mm-dd",
        minDate: 0
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onChange: function (func){
        this.options.onChange = func;
    },

    onAdd: function (map) {
        var that = this;
        that.options.map = map;
       
        var dateContainer = L.DomUtil.create('div', 'startDatePicker', this._container);

        that.datepicker = $('<div/>');

        $(dateContainer).append(that.datepicker);

        var options = {

            onSelect: function() { that.options.onChange(that.getValue()); },
            firstDay: 1
        }

        var i18n = r360.config.i18n;

        if ( i18n.language != 'en' ) {

            options.monthNames  = i18n.monthNames[i18n.language];
            options.dayNames    = i18n.dayNames[i18n.language];
            options.dayNamesMin = i18n.dayNamesMin[i18n.language];
        }

        $(that.datepicker).datepicker(options);    

        L.DomEvent.disableClickPropagation(dateContainer);         
       
        return dateContainer;
    },

    getValue : function() {   
        var that = this;
        var date = $(that.datepicker).datepicker({ dateFormat: 'dd-mm-yy' }).val()
        var splitDate = date.split('/');
        var yyyymmdd = splitDate[2] + '' + splitDate[0] + '' + splitDate[1];
        return yyyymmdd;
    }
});

r360.travelStartDateControl = function () {
    return new r360.TravelStartDateControl();
};

/*
 *
 */
r360.TravelStartTimeControl = L.Control.extend({
    options: {
        position    : 'topright',
        range       : false,
        min         : 0,
        max         : 1440 * 60, // start time is now in seconds
        step        : 10 * 60, // start time is now in seconds
        initValue   : 480 * 60, // start time is now in seconds
        value       : 0
    },

    /*
     *
     */
    initialize: function (options) {

        this.options.value = r360.Util.getHoursAndMinutesInSeconds();
        L.Util.setOptions(this, options);
    },

    /*
     *
     */
    onSlideStop: function (func){

        this.options.slideStop = func;
    },

    /*
     *
     */
    minToString: function(minutes){

        minutes = minutes / 60;
        var hours = Math.floor(minutes / 60);
        var min = minutes - (hours * 60);
        if ( hours > 24 ) hours -= 24;
        if ( hours < 10 ) hours = '0' + hours;
        if ( min < 10 ) min = '0' + min;
        if ( min == 0 ) min = '00';
        return ( hours + ':' + min);
    },

    /*
     *
     */
    onAdd: function (map) {

        var that = this;

        that.options.map = map;
        that.options.mapId = $(map._container).attr("id");

        map.on("resize", this.onResize.bind(this));
        // Create a control sliderContainer with a jquery ui slider
        var sliderContainer = L.DomUtil.create('div', 'startTimeSlider', this._container);

        that.miBox = $('<div/>', {"class" : "mi-box"});
        that.startTimeInfo = $('<div/>');
        that.label = $('<span/>');
        that.slider = $('<div/>');

        $(sliderContainer).append(that.miBox.append(that.startTimeInfo.append(that.label)).append(that.slider))

        $(that.label).text(r360.config.i18n.get('departure') + ': '+ 
            that.minToString(this.options.value) + ' ' + r360.Util.getTimeFormat(that.options.value));

        $(that.slider).slider({
            range:  that.options.range,
            value:  that.options.value,
            min:    that.options.min,
            max:    that.options.max,
            step:   that.options.step,
            
            slide: function (e, ui) {

                $(that.label).text(r360.config.i18n.get('departure') + ': ' +
                    that.minToString(ui.value) + ' ' + r360.Util.getTimeFormat(ui.value));
                
                that.options.value = ui.value;
            },
            stop: function(e, ui){

                that.options.slideStop(ui.value);
            }
        });
    
        this.onResize();
       /*
        prevent map click when clicking on slider
        */
        L.DomEvent.disableClickPropagation(sliderContainer);  

        return sliderContainer;
    },

    /*
     *
     */
    onResize: function(){

        if ( this.options.map.getSize().x < 550 ) {

            this.removeAndAddClass(this.miBox, 'leaflet-traveltime-slider-container-max', 'leaflet-traveltime-slider-container-min');
            this.removeAndAddClass(this.startTimeInfo, 'travel-time-info-max', 'travel-time-info-min');
            this.removeAndAddClass(this.slider, 'leaflet-traveltime-slider-max', 'leaflet-traveltime-slider-min');
        }
        else {
            this.removeAndAddClass(this.miBox, 'leaflet-traveltime-slider-container-min', 'leaflet-traveltime-slider-container-max');
            this.removeAndAddClass(this.startTimeInfo, 'travel-time-info-min', 'travel-time-info-max');
            this.removeAndAddClass(this.slider, 'leaflet-traveltime-slider-min', 'leaflet-traveltime-slider-max');
        }
    },

    /*
     *
     */
    removeAndAddClass: function(id,oldClass,newClass){

        $(id).addClass(newClass);
        $(id).removeClass(oldClass);
    },

    /*
     *
     */
    getValue : function() {    
        return this.options.value;
    }
});

r360.travelStartTimeControl = function () {
    return new r360.TravelStartTimeControl();
};

/*
 *
 */
r360.TravelTimeControl = L.Control.extend({
   
    /**
      * ...
      * 
      * @param {Object} [options] The typical JS options array.
      * @param {Number} [options.position] 
      * @param {Number} [options.initValue] 
      * @param {Number} [options.label] 
      * @param {Array}  [options.travelTimes] Each element of this arrays has to contain a "time" and a "color" field.
      *     An example would be: { time : 600  , color : "#006837"}. The color needs to be specified in HEX notation.
      * @param {Number} [options.icon] 
      */
    initialize: function (travelTimeControlOptions) {
        
        // use the default options
        this.options = JSON.parse(JSON.stringify(r360.config.defaultTravelTimeControlOptions));

        // overwrite default options if possible
        if ( typeof travelTimeControlOptions !== "undefined" ) {
            
            if ( _.has(travelTimeControlOptions, "position") )    this.options.position     = travelTimeControlOptions.position;
            if ( _.has(travelTimeControlOptions, "initValue") )   this.options.initValue    = travelTimeControlOptions.initValue;
            if ( _.has(travelTimeControlOptions, "label") )       this.options.label        = travelTimeControlOptions.label;
            if ( _.has(travelTimeControlOptions, "travelTimes") ) this.options.travelTimes  = travelTimeControlOptions.travelTimes;
            if ( _.has(travelTimeControlOptions, "icon") )        this.options.icon         = travelTimeControlOptions.icon;
        }

        this.options.maxValue   = _.max(this.options.travelTimes, function(travelTime){ return travelTime.time; }).time / 60;
        this.options.step       = (this.options.travelTimes[1].time - this.options.travelTimes[0].time)/60;
    },

    /*
     *
     */
    onAdd: function (map) {
        var that = this;
        this.options.map = map;
        map.on("resize", this.onResize.bind(this));          

        var sliderColors = "";
        var percent = 100 / this.options.travelTimes.length;
        for(var i = 0; i < this.options.travelTimes.length; i++){
            if(i == 0)
                sliderColors += '<div style="position: absolute; top: 0; bottom: 0; left: ' + i * percent + '%; right: ' + (100 - (i + 1)* percent )+ '%; background-color: ' + this.options.travelTimes[i].color + '; -moz-border-top-left-radius: 8px;-webkit-border-radius-topleft: 8px; border-top-left-radius: 8px; -moz-border-bottom-left-radius: 8px;-webkit-border-radius-bottomleft: 8px; border-bottom-left-radius: 8px;"></div>';
            else if(i < this.options.travelTimes.length -1)
                sliderColors += '<div style="position: absolute; top: 0; bottom: 0; left: ' + i * percent + '%; right: ' + (100 - (i + 1)* percent )+ '%; background-color: ' + this.options.travelTimes[i].color + ';"></div>';
            else if(i == this.options.travelTimes.length -1)
                sliderColors += '<div style="position: absolute; top: 0; bottom: 0; left: ' + i * percent + '%; right: ' + (100 - (i + 1)* percent )+ '%; background-color: ' + this.options.travelTimes[i].color + '; -moz-border-top-right-radius: 8px;-webkit-border-radius-topright: 8px; border-top-right-radius: 8px; -moz-border-bottom-right-radius: 8px;-webkit-border-radius-bottomright: 8px; border-bottom-right-radius: 8px;"></div>';
        }

        // started to remove jQuery dependency here
        // this.options.miBox = L.DomUtil.create("r360-box", "mi-box");
        // this.options.travelTimeInfo = L.DomUtil.create("travelTimeInfo");
        // this.options.travelTimeControl = L.DomUtil.create("travelTimeControl", "no-border");
        // this.options.travelTimeControlHandle = L.DomUtil.create("travelTimeControlHandle", "ui-slider-handle");

        // this.options.labelSpan = L.DomUtil.create("labelSpan");
        // this.options.labelSpan.innerHTML = this.options.label;

        // if ( this.options.icon != 'undefined' ) {

        //     this.options.iconHTML = new Image;
        //     this.options.iconHTML.src = "picture.gif";
        // }

        // this.options.travelTimeSpan = L.DomUtil.create("travelTimeSpan");
        // this.options.travelTimeSpan.innerHTML = this.options.initValue;
        // var unitSpan = L.DomUtil.create("unitSpan");
        // unitSpan.innerHTML = "min";


        // this.options.sliderContainer.innerHTML += this.options.miBox;
        // this.options.miBox.innerHTML += this.options.travelTimeInfo;
        // this.options.miBox.innerHTML += this.options.travelTimeControl;
        // this.options.travelTimeControl.innerHTML =+ travelTimeControlHandle;

        // Create a control sliderContainer with a jquery ui slider
        this.options.sliderContainer = L.DomUtil.create('div', this._container);

        this.options.miBox = $('<div/>', {"class" : "mi-box"});
        this.options.travelTimeInfo = $('<div/>');
        this.options.travelTimeSlider = $('<div/>', {"class" : "no-border"}).append(sliderColors);
        var travelTimeSliderHandle = $('<div/>', {"class" : "ui-slider-handle"});
        this.options.labelSpan = '<span lang="en">Traveltime</span><span lang="de">Reisezeit</span>: ';

        if ( this.options.icon != 'undefined' ) this.options.iconHTML = $('<img/>', {"src" : this.options.icon})

        this.options.travelTimeSpan = $('<span/>', {"text" : this.options.initValue });
        var unitSpan = $('<span/>', {"text" : "min"});

        $(this.options.sliderContainer).append(this.options.miBox);
        this.options.miBox.append(this.options.travelTimeInfo);
        this.options.miBox.append(this.options.travelTimeSlider);
        this.options.travelTimeSlider.append(travelTimeSliderHandle);
        this.options.travelTimeInfo.append(this.options.iconHTML).append(this.options.labelSpan).append(this.options.travelTimeSpan).append(unitSpan);

        $(this.options.travelTimeSlider).slider({
            range:  false,
            value:  that.options.initValue,
            min:    0,
            max:    that.options.maxValue,
            step:   that.options.step,
            
            slide: function (e, ui) {
                if ( ui.value == 0) return false;
                $(that.options.travelTimeSpan).text(ui.value);
            },
            stop: function(e, ui){
                var travelTimes = new Array()
                for(var i = 0; i < ui.value; i+= that.options.step)
                    travelTimes.push(that.options.travelTimes[i/that.options.step]);
                that.options.onSlideStop(travelTimes);
            }
        });
        this.onResize();

        /*
        prevent map click when clicking on slider
        */
        L.DomEvent.disableClickPropagation(this.options.sliderContainer);  

        return this.options.sliderContainer;
    },

    /*
     *
     */
    onResize: function(){
        
        if ( this.options.map.getSize().x < 550 ){
            this.removeAndAddClass(this.options.miBox, 'leaflet-traveltime-slider-container-max', 'leaflet-traveltime-slider-container-min');
            this.removeAndAddClass(this.options.travelTimeInfo, 'travel-time-info-max', 'travel-time-info-min');
            this.removeAndAddClass(this.options.travelTimeSlider, 'leaflet-traveltime-slider-max', 'leaflet-traveltime-slider-min');
        }
        else {

            this.removeAndAddClass(this.options.miBox, 'leaflet-traveltime-slider-container-min', 'leaflet-traveltime-slider-container-max');
            this.removeAndAddClass(this.options.travelTimeInfo, 'travel-time-info-min', 'travel-time-info-max');
            this.removeAndAddClass(this.options.travelTimeSlider, 'leaflet-traveltime-slider-min', 'leaflet-traveltime-slider-max');
        }
    },

    /*
     *
     */
    removeAndAddClass: function(id,oldClass,newClass){
        $(id).addClass(newClass);
        $(id).removeClass(oldClass);
    },

    /*
     *
     */
    onSlideStop: function (onSlideStop) {
        var options = this.options;
        options.onSlideStop = onSlideStop;  
    },

    /**
     * [setValue description]
     * @param {[type]} value [description]
     */
    setValue: function(value) {

        $(this.options.travelTimeSlider).slider('value', value);
        $(this.options.travelTimeSpan).text(value);
    },

    /*
     *
     */
    getValues : function() {
        var options = this.options;
        var travelTimes = new Array()

        for(var i = 0; i < $(this.options.travelTimeSlider).slider("value"); i+= options.step) 
            travelTimes.push(options.travelTimes[i/options.step].time);
            
        return travelTimes;
    },

    /**
     * [getMaxValue Returns the maximum selected value in seconds, 
     *              internally it used the getValues method and returns the maximum.]
     *              
     * @return {[Number]}
     */ 
    getMaxValue : function() {

        return _.max(this.getValues());
    }
});

r360.travelTimeControl = function (options) {
    return new r360.TravelTimeControl(options);
};

r360.waitControl = function (options) {
    return new L.Control.WaitControl(options);
};

L.Control.WaitControl = L.Control.extend({
    
    options: {
        position: 'topleft',
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this.options.map = map;
        this.options.mapId = $(map._container).attr("id");
        console.log(this.options.mapId);
       
        var waitContainer = L.DomUtil.create('div', 'leaflet-control-wait');
        $(waitContainer).append(
            '<div id="wait-control-'+this.options.mapId+'" class="mi-box waitControl"> \
                <i class="fa fa-spinner fa-spin"></i> '+ r360.config.i18n.get('wait') +  '\
            </div>');

        return waitContainer;
    },

    show : function(){

        $('#wait-control-'+this.options.mapId).show();
    },

    hide : function(){
        
        $('#wait-control-'+this.options.mapId).hide();  
    }
});

r360.htmlControl = function (options) {
    return new L.Control.HtmlControl(options);
};

L.Control.HtmlControl = L.Control.extend({
    
    options: {
        position: 'topleft',
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {

        // in case of multiple maps per page
        this.options.id  = $(map._container).attr("id") + r360.Util.generateId();
       
        var htmlContainer = L.DomUtil.create('div', 'leaflet-control-html');
        $(htmlContainer).append('<div id="html-control-'+this.options.id+'" class="html-control '+ this.options.classes +'"></div>');

        $(htmlContainer).on('mouseover', function(){ map.scrollWheelZoom.disable(); });
        $(htmlContainer).on('mouseout' , function(){ map.scrollWheelZoom.enable(); });      

        return htmlContainer;
    },

    setHtml : function(html) {
        $('#html-control-'+this.options.id).html(html);        
    },

    show : function(){

        $('#html-control-'+this.options.id).show();
    },

    hide : function(){
        
        $('#html-control-'+this.options.id).hide();  
    },

    toggle : function(){
        
        $('#html-control-'+this.options.id).toggle();  
    }
});

r360.RadioButtonControl = L.Control.extend({

    initialize: function (options) {

        this.options = JSON.parse(JSON.stringify(r360.config.defaultRadioOptions));

        if ( typeof options !== 'undefined') { 
            
            if ( typeof options.position !== 'undefined' ) this.options.position = options.position;
            if ( typeof options.buttons  !== 'undefined' ) this.options.buttons  = options.buttons;
            else alert("No buttons supplied!");
        }
    },

    onAdd: function (map) {

        var that = this;

        this.options.map    = map;
        var buttonContainer = L.DomUtil.create('div', this._container);
        this.options.input  = this.getRadioButtonHTML();
        $(buttonContainer).append(this.options.input);

        $(this.options.input).buttonset({}).change(function(){

            that.options.checked = $("input[name='r360_radiobuttongroup_" + that.options.buttonGroupId + "']:checked").attr("key");
            that.options.onChange(that.options.checked);
        });  


        $(this.options.input).each(function(){

            $(this).tooltip({
                position: {
                    my: "center top+10",
                    at: "center bottom",
                    using: function( position, feedback ) {
                        $( this ).css( position );
                        $( "<div>" )
                        .addClass( "arrow top" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                    }
                }
            });
        }); 

        // prevent map click when clicking on slider
        L.DomEvent.addListener(buttonContainer, 'click', L.DomEvent.stopPropagation);

        return buttonContainer;
    },

    onChange: function (func){

        this.options.onChange = func;      
    },

    getValue: function(){

        return this.options.checked;
    },

    getRadioButtonHTML: function(){

        var that = this; 

        // generate an ID for the complete button group
        that.options.buttonGroupId = r360.Util.generateId(5);

        var div = $('<div/>', { id : that.options.buttonGroupId });

        // add each button to the group
        _.each(that.options.buttons, function(button){

            // generate a unique id for each button
            var id = r360.Util.generateId();

            var input = $('<input/>', { 
                "type" : 'radio', 
                "id"   : 'r360_' + id, 
                "value": button.key, 
                "key"  : button.key, 
                "name" : 'r360_radiobuttongroup_' + that.options.buttonGroupId
            });

            var label = $('<label/>', { 
                "for"  : 'r360_' + id, 
                "html" : button.label
            });

            // make the button selected (default buttin)
            if ( button.checked ) {

                that.options.checked = button.key;
                input.attr({"checked" : "checked"})
            };
            // add a tooltip if one was provided
            if ( typeof button.tooltip != 'undefined' ) label.attr({"title" : button.tooltip});

            div.append(input);
            div.append(label);
        });

        return div;
    },
});

r360.radioButtonControl = function (options) {
    return new r360.RadioButtonControl(options);
};

/*
 *
 */
r360.Polygon = function(traveltime, outerBoundary) {

    var that = this;
    
    // default min/max values
    that.topRight         = new L.latLng(-90,-180);
    that.bottomLeft       = new L.latLng(90, 180);
    that.centerPoint      = new L.latLng(0,0);

    that.travelTime       = traveltime;
    that.color;
    that.outerBoundary    = outerBoundary;
    that.innerBoundaries  = new Array();

    /**
     *
     */
    that.setOuterBoundary = function(outerBoundary){
        that.outerBoundary = outerBoundary;
    }

    that.projectOuterBoundary = function(map){
        that.outerProjectedBoundary = new Array();
        for(var i = 0; i < that.outerBoundary.length; i++){
            that.outerProjectedBoundary.push(map.project(that.outerBoundary[i],0))
        }
    }

    that.projectInnerBoundaries = function(map){
        that.innerProjectedBoundaries = new Array();
        for(var i = 0; i < that.innerBoundaries.length; i++){
            var innerProjectedBoundary = new Array();
            that.innerProjectedBoundaries.push(innerProjectedBoundary);
            for(var j = 0; j < that.innerBoundaries[i].length; j++){
                innerProjectedBoundary.push(map.project(that.innerBoundaries[i][j], 0))
            }
        }
    }

    that.project = function(map){
        that.projectOuterBoundary(map);
        that.projectInnerBoundaries(map);
    }

    /**
     *
     */  
    that.addInnerBoundary = function(innerBoundary){
        that.innerBoundaries.push(innerBoundary);
    }

    /**
     * @return {LatLngBounds} the leaflet bounding box
     * @author Daniel Gerber <daniel.gerber@icloud.com>
     * @author Henning Hollburg <henning.hollburg@gmail.com>
     */
    that.getBoundingBox = function(){

        return new L.LatLngBounds(this._bottomLeft, this._topRight)
    }

    /**
     *
     */
    that.setBoundingBox = function() { 

        // calculate the bounding box
        _.each(this.outerBoundary, function(coordinate){

            if ( coordinate.lat > that.topRight.lat )   that.topRight.lat   = coordinate.lat;
            if ( coordinate.lat < that.bottomLeft.lat ) that.bottomLeft.lat = coordinate.lat;
            if ( coordinate.lng > that.topRight.lng )   that.topRight.lng   = coordinate.lng;
            if ( coordinate.lng < that.bottomLeft.lng ) that.bottomLeft.lng = coordinate.lng;
        });

        // precompute the polygons center
        that.centerPoint.lat = that.topRight.lat - that.bottomLeft.lat;
        that.centerPoint.lon = that.topRight.lon - that.bottomLeft.lon;
    }

    /**
     * Returns the center for this polygon. More precisly a gps coordinate
     * which is equal to the center of the polygons bounding box.
     * @return {latlng} gps coordinate of the center of the polygon
     * @author Daniel Gerber <daniel.gerber@icloud.com>
     * @author Henning Hollburg <henning.hollburg@gmail.com>
     */
    that.getCenterPoint = function(){
        return that.centerPoint;
    },

    /**
     *
     */
    that.getColor = function(){
        return that.color;
    }

    /**
     *
     */
    that.setTravelTime = function(travelTime){
        that.travelTime = travelTime;
    }

    /**
     *
     */
    that.getTravelTime = function(){
        return that.travelTime;
    }

    /**
     *
     */
    that.setColor = function(color){
        that.color = color;
    }
}

r360.polygon = function (traveltime, outerBoundary) { 
    return new r360.Polygon(traveltime, outerBoundary);
};

/*
 *
 */
r360.MultiPolygon = function() {
    
    var that = this;    

    that._topRight   = new L.latLng(-90,-180);
    that._bottomLeft = new L.latLng(90, 180);
    that.travelTime;
    that.color;
    that.polygons    = new Array();

    /*
     *
     */
    that.addPolygon = function(polygon){
        that.polygons.push(polygon);
    }

    /*
     *
     */
    that.setColor = function(color){
        that.color = color;
    }

    /*
     *
     */
    that.getColor = function(){
        return that.color;
    }

    /*
     *
     */
    that.getTravelTime = function(){
        return that.travelTime;
    }

    /*
     *
     */
    that.setTravelTime = function(travelTime){
        that.travelTime = travelTime;
    }

    /*
     *
     */
    that.getBoundingBox = function(){
        return new L.LatLngBounds(that._bottomLeft, that._topRight)
    }

    /*
     *
     */
    that.setBoundingBox = function(){

        _.each(that.polygons, function(polygon){

            if (polygon._topRight.lat > that._topRight.lat)     that._topRight.lat   = polygon._topRight.lat;
            if (polygon._bottomLeft.lat < that._bottomLeft.lat) that._bottomLeft.lat = polygon._bottomLeft.lat;
            if (polygon._topRight.lng > that._topRight.lng)     that._topRight.lng   = polygon._topRight.lng;
            if (polygon._bottomLeft.lng < that._bottomLeft.lng) that._bottomLeft.lng = polygon._bottomLeft.lng;
        });
    }
};

r360.multiPolygon = function () { 
    return new r360.MultiPolygon();
};

/*
 *
 */
r360.RouteSegment = function(segment){      

    var that             = this;
    that.points          = [];
    that.type            = segment.type;
    that.travelTime      = segment.travelTime;
    that.length          = segment.length;    
    that.warning         = segment.warning;    
    that.elevationGain   = segment.elevationGain;
    that.errorMessage;   
    that.transitSegment  = false;

    // build the geometry
    _.each(segment.points, function(point){

        if (r360.config.utm) 
            that.points.push(L.latLng(r360.config.crs.projection.unproject(new L.Point(point[1], point[0]))));
        else
            that.points.push(point);
    });

    // in case we have a transit route, we set a color depending
    //  on the route type (bus, subway, tram etc.)
    // and we set information which are only available 
    // for transit segments like depature station and route short sign
    if ( segment.isTransit ) {

        that.color          = _.findWhere(r360.config.routeTypes, {routeType : segment.routeType}).color;
        that.transitSegment = true;
        that.routeType      = segment.routeType;
        that.routeShortName = segment.routeShortName;
        that.startname      = segment.startname;
        that.endname        = segment.endname;
        that.departureTime  = segment.departureTime;
        that.arrivalTime    = segment.arrivalTime;
        that.tripHeadSign   = segment.tripHeadSign;
    }
    else that.color         = _.findWhere(r360.config.routeTypes, {routeType : segment.type }).color;

    that.getPoints = function(){
        return that.points;
    }

    that.getType = function(){
        return that.type;
    }

    that.getColor = function(){
        return that.color;
    }

    that.getTravelTime = function(){
        return that.travelTime;
    }

    that.getLength = function(){
        return that.length;
    }

    that.getRouteType = function(){
        return that.routeType;
    }

    that.getRouteShortName = function(){
        return that.routeShortName;
    }

    that.getStartName = function(){
        return that.startname;
    }

    that.getEndName = function(){
        return that.endname;
    }

    that.getDepartureTime = function(){
        return that.departureTime;
    }

    that.getArrivalTime = function(){
        return that.arrivalTime;
    }

    that.getTripHeadSign = function(){
        return that.tripHeadSign;
    }

    that.getWarning = function(){
        return that.warning;
    }

    that.getElevationGain = function(){
        return that.elevationGain;
    }

    that.isTransit = function(){
        return that.transitSegment;
    }
};

r360.routeSegment = function (segment) { 
    return new r360.RouteSegment(segment);
};

/*
 *
 */
r360.Route = function(travelTime){

    var that = this;
    that.travelTime = travelTime;
    that.routeSegments = new Array();

    /*
     *
     */
    that.addRouteSegment = function(routeSegment){
        that.routeSegments.push(routeSegment);
    }

    /*
     *
     */
    that.setTravelTime = function(travelTime){
        that.travelTime = travelTime;
    }

    /*
     *
     */
    that.getLength = function(){
        return that.routeSegments.length;
    }

    /*
     *
     */
    that.getSegments = function(){
        return that.routeSegments;
    }

    /*
     *
     */
    that.getTravelTime = function(){
        return that.travelTime;
    }
};

r360.route = function (travelTime) { 
    return new r360.Route(travelTime);
};

/*
 *
 */
r360.Route360PolygonLayer = L.Class.extend({
   
    /**
      * This methods initializes the polygon layer's stroke width and polygon opacity.
      * It uses the default values, and in case the options contain other values, the
      * default values are overwritten. 
      *
      * @method send
      * 
      * @param {Object} [options] The typical JS options array.
      * @param {Number} [options.opacity] Defines the opacity of the polygons. 
      *     Higher values mean that the polygon is less opaque.
      * @param {Number} [options.strokeWidth] Defines the strokewidth of the polygons boundaries.
      *     Since we have degenerated polygons (they can have no area), the stroke width defines the
      *     thickness of a polygon. Thicker polygons are not as informative as thinner ones.
      */
    initialize: function (options) {
        
        // set default parameters
        this.opacity     = r360.config.defaultPolygonLayerOptions.opacity;
        this.strokeWidth = r360.config.defaultPolygonLayerOptions.strokeWidth;
        
        // overwrite defaults with optional parameters
        if ( typeof options != 'undefined' ) {

            if ( typeof options.opacity     != 'undefined') this.opacity      = options.opacity;
            if ( typeof options.strokeWidth != 'undefined') this.strokeWidth  = options.strokeWidth;
        }

        this._multiPolygons = new Array(); 
    },

    /* 
     *
     */
    getBoundingBox : function(){
        return new L.LatLngBounds(this._bottomLeft, this._topRight)
    },
    
    /*
     *
     */
    onAdd: function (map) {

        this._map = map;
        // create a DOM element and put it into one of the map panes
        this._el = L.DomUtil.create('div', 'my-custom-layer-'+$(map._container).attr("id")+' leaflet-zoom-hide');
        $(this._el).css({"opacity": this.opacity});
        $(this._el).attr("id","canvas" + $(this._map._container).attr("id"));
        this._map.getPanes().overlayPane.appendChild(this._el);

        // add a viewreset event listener for updating layer's position, do the latter
        this._map.on('moveend', this._reset, this);
        this._reset();
    },
    
    /*
    *
     */
    addLayer:function(sourceToPolygons){        
        
        var that    = this;

        if(r360.config.logging) var start   = new Date().getTime();

        that._resetBoundingBox();
        that._multiPolygons = new Array();

        if(r360.config.logging) var start_projecting   = new Date().getTime();
        

        _.each(sourceToPolygons, function(source){
            _.each(source.polygons, function(polygon){
                polygon.project(that._map);                
            });
        })

        if(r360.config.logging) var end_projecting   = new Date().getTime();
        

         _.each(sourceToPolygons, function(source){
            _.each(source.polygons, function(polygon){             
                that._updateBoundingBox(polygon.outerBoundary);         
            });
        })

         _.each(sourceToPolygons, function(source){
            _.each(source.polygons, function(polygon){               
                that._addPolygonToMultiPolygon(polygon);
            });
            that._multiPolygons.sort(function(a,b) { return (b.getTravelTime() - a.getTravelTime()) });
        })

        if(r360.config.logging){
            var end = new Date().getTime();
            console.log("adding layers took " + (end - start) + "ms; Projecting took: " + (end_projecting - start_projecting) + "ms");
        }
    },

    /*
     *
     */
    _addPolygonToMultiPolygon: function(polygon){

        var multiPolygons = _.filter(this._multiPolygons, function(multiPolygon){ return multiPolygon.getTravelTime() == polygon.travelTime; });

        // multipolygon with polygon's travetime already there
        if ( multiPolygons.length > 0 ) multiPolygons[0].addPolygon(polygon);
        else {

            var mp = new r360.multiPolygon();
            mp.setTravelTime(polygon.travelTime);
            mp.addPolygon(polygon);
            mp.setColor(polygon.getColor());
            this._multiPolygons.push(mp);
        }
    },

    /*
     *
     */
    _resetBoundingBox: function(){
        this._latlng = new L.LatLng(-180, 90);
        this._topRight = new L.latLng(-90,-180);
        this._bottomLeft = new L.latLng(90, 180);
    },
    
    /*
     *
     */
    _updateBoundingBox:function(coordinates){

        var that = this;

        _.each(coordinates, function(coordinate){

            if ( coordinate.lat > that._topRight.lat )          that._topRight.lat   = coordinate.lat;                
            else if( coordinate.lat < that._bottomLeft.lat )    that._bottomLeft.lat = coordinate.lat;
            
            if ( coordinate.lng > that._topRight.lng )          that._topRight.lng   = coordinate.lng;
            else if( coordinate.lng < that._bottomLeft.lng )    that._bottomLeft.lng = coordinate.lng;
        })
        
        if ( that._latlng.lat < that._topRight.lat)     that._latlng.lat = that._topRight.lat;
        if ( that._latlng.lng > that._bottomLeft.lng)   that._latlng.lng = that._bottomLeft.lng;
    },
  
    /*
     *
     */
    onRemove: function (map) {

        // remove layer's DOM elements and listeners
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
    },
    
    /*
     *
     */
    _buildString:function(path, point, suffix){
        
        var a = new Array();

        a.push(suffix);
        a.push(Math.round(point.x));
        a.push(Math.round(point.y));
        path.push(a)
        //path += suffix + point.x + ' ' + point.y;
        return path;
    },
    
    /*
     *
     */
    _createSVGData: function(polygon){

        // the min amount of pixels for a new point
        var minDiff = 5;

        var that    = this;        
        var points  = new Array();
        var scale   = Math.pow(2,that._map._zoom);
        var svgM    = "M";
        var svgL    = "L";        
        var pathData= new Array();
        var diffX, diffY, px, py, projectedPoint;
        var bounds  = that._map.getPixelBounds();
        var mapSize = that._map.getSize();


        

        /*
        we are only drawing the point if it is different to the last one
        hence, depending on zoom, we can reduce the number of points (SVG size) dramatically
        */   
        

        // the outer boundary
        for(var i = 0; i < polygon.outerProjectedBoundary.length; i++){

            projectedPoint = polygon.outerProjectedBoundary[i];

            px    = projectedPoint.x * scale; 
            py    = projectedPoint.y * scale; 
            

           

            if(px > bounds.max.x + mapSize.x)
                px = bounds.max.x + mapSize.x;
            if(py > bounds.max.y + mapSize.y)
                py = bounds.max.y + mapSize.y;
            if(px < bounds.min.x - mapSize.x)
                px = bounds.min.x - mapSize.x;
            if(py < bounds.min.y - mapSize.y)
                py = bounds.min.y - mapSize.y;
          

            point = new L.Point(px,py);
            point.x -= that._map.getPixelOrigin().x;
            point.y -= that._map.getPixelOrigin().y;

            if(i > 0){
                diffX = points[points.length-1].x - point.x;
                diffY = points[points.length-1].y - point.y;
            }
            else
                diffX = diffY = minDiff;
            

            if(diffY >= minDiff || diffX >= minDiff || diffX <= -minDiff || diffY <= -minDiff){
                points.push(point);
                if(i > 0)
                    pathData = that._buildString(pathData, point, svgL)
                else
                    pathData = that._buildString(pathData, point, svgM)
            }
        }
        
        pathData.push(['z']);
       

        // the inner boundaries

        /*
        for(var i = 0; i < polygon.innerProjectedBoundaries.length; i++){
            for(var j = 0; j < polygon.innerProjectedBoundaries[i].length; j++){
                projectedPoint = polygon.innerProjectedBoundaries[i][j];
                
                px    = projectedPoint.x * scale - that._map.getPixelOrigin().x;
                py    = projectedPoint.y * scale - that._map.getPixelOrigin().y;
                point = new L.Point(px,py);

                diffX = points[points.length-1].x - point.x;
                diffY = points[points.length-1].y - point.y; 



                if(diffY >= minDiff || diffX >= minDiff || diffX <= -minDiff || diffY <= -minDiff){
                    points.push(point);
                    if(j != 0)
                        pathData = that._buildString(pathData, point, svgL)
                    else
                        pathData = that._buildString(pathData, point, svgM)
                }
            }
            pathData.push(['z']);
        }
        */
        return pathData;
    },

    /*
     *
     */
    clearLayers: function(){        
        $('#canvas'+ $(this._map._container).attr("id")).empty();
        this.initialize();
    },

    /*
     *
     */
    _reset: function () {

        var that = this;
        
        //internalSVGOffset is used to have a little space between geometries and svg frame. otherwise buffers won't be displayed at the edges.
        var internalSVGOffset = 100;

        if(r360.config.logging) var start   = new Date().getTime();

        if(this._multiPolygons.length > 0){
            var pos = this._map.latLngToLayerPoint(this._latlng);         
            pos.x -= internalSVGOffset;
            pos.y -= internalSVGOffset;
            L.DomUtil.setPosition(this._el, pos);

            var bounds = that._map.getPixelBounds()

            // console.log("pos: " + pos + " bound max " + bounds.max);


            that._ieFixes();

            $('#canvas'+ $(this._map._container).attr("id")).empty();         

            var bottomLeft = this._map.latLngToLayerPoint(this._bottomLeft);
            var topRight = this._map.latLngToLayerPoint(this._topRight);
            var paper = Raphael('canvas'+ $(this._map._container).attr("id"), (topRight.x - bottomLeft.x) + internalSVGOffset * 2, (bottomLeft.y - topRight.y) + internalSVGOffset * 2);
            var st = paper.set();
            var svgData;
            var mp, poly;

            for(var i = 0; i < this._multiPolygons.length; i++){
                mp = this._multiPolygons[i];
                
                svgData = new Array();

                if(r360.config.logging) var start_svg   = new Date().getTime();
                for ( var j = 0; j < mp.polygons.length; j++) {
                    var svg = this._createSVGData(mp.polygons[j]);
                    if(svg.length > 2)
                        svgData.push(svg);
                }
                if(r360.config.logging) console.log("svg creation took: " + (new Date().getTime() - start_svg));                    
                
             
                // ie8 (vml) gets the holes from smaller polygons
                if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                    if (i < this._multiPolygons.length-1 ) {
                        for ( var l = 0; l < this._multiPolygons[i+1].polygons.length; l++ ) {
                            var poly2 = this._multiPolygons[i+1].polygons[l];
                            svgData.push(this._createSVGData(poly2.outerBoundary));
                        }
                    }
                }

                //'fill-opacity': 0

                var color = mp.getColor();
                if(r360.config.logging) var start_raphael  = new Date().getTime();
                var path = paper.path(svgData).attr({fill: color, stroke: color, "stroke-width": that.strokeWidth, "stroke-linejoin":"round","stroke-linecap":"round","fill-rule":"evenodd"})
                            .attr({ "opacity":"1"}).animate({ "opacity" : "1" }, mp.polygons[0].travelTime/3)
                            path.translate((bottomLeft.x - internalSVGOffset) *-1,((topRight.y - internalSVGOffset)*-1));
                st.push(path);
                if(r360.config.logging){
                    console.log("raphael creation took: " + (new Date().getTime() - start_raphael));                    
                }
            }

            if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                $('shape').each(function() {
                    $( this ).css( {"filter": "alpha(opacity=" + that.opacity * 100 + ")"} );
                });
            }
        }

        if(r360.config.logging){
            var end   = new Date().getTime();
            console.log("layer resetting tool: " +  (end - start) + "ms");
        } 
    },

    _ieFixes: function(){
         //ie 8 and 9 
        if (navigator.appVersion.indexOf("MSIE 9.") != -1 )  {
            $('#canvas'+ $(this._map._container).attr("id")).css("transform", "translate(" + pos.x + "px, " + pos.y + "px)");
        }
        if(navigator.appVersion.indexOf("MSIE 8.") != -1){
            $('#canvas'+ $(this._map._container).attr("id")).css({"position" : "absolute"});
        }
    }


});

r360.route360PolygonLayer = function () {
    return new r360.Route360PolygonLayer();
};

}(window, document));