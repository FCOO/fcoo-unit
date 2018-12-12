/****************************************************************************
	fcoo-unit.js,

	(c) 2018, FCOO

	https://github.com/FCOO/fcoo-unit
	https://github.com/FCOO

    Get and set settings for the unit to display length, area, speed, direction (incl angle)
    Create namespace fcoo.unit with methods to convert m, m2, m/s, deg to selected unit

****************************************************************************/

(function ($, window/*, document, undefined*/) {
	"use strict";

	//Create fcoo-namespace
    window.fcoo = window.fcoo || {};
    var ns = window.fcoo;

    ns.unit = ns.unit || {};

    //Create const to hold the name of the selected unit
    $.extend(ns.unit, {
        METRIC  : 'METRIC',    //m, m2, m/s
        METRIC2 : 'METRIC2',   //m, m2, km/t
        NAUTICAL: 'NAUTICAL',   //nm, nm2, knots
        DEGREE  : 'DEGREE',    //0-360 / -180-180
        GRADIAN : 'GRADIAN',   //0-400 / -200-200
    });

    //Set default unit for the different scales
    $.extend(ns.unit, {
        length   : ns.unit.METRIC,
        area     : ns.unit.METRIC,
        speed    : ns.unit.METRIC,
        direction: ns.unit.DEGREE
    });

    //convertion = {length,area,speed,direction} of {unit: factor} = convert values from SI-unit to the value when unit is 'unit'
    var conversion = {
            length   : {'METRIC': 1, 'METRIC2': 1,          'NAUTICAL': 1/1852},
            area     : {'METRIC': 1, 'METRIC2': 1,          'NAUTICAL': 1/(1852*1852)},
            speed    : {'METRIC': 1, 'METRIC2': 60*60/1000, 'NAUTICAL': 60*60/1852},
            direction: {'DEGREE': 1, 'GRADIAN': 400/360}
        };

    function convertValue(value, scale, unit){
        unit = unit || ns.unit[scale];
        var factor = conversion[scale] ? conversion[scale][unit] || 1 : 1;
        return value*factor;
    }

    //Create convertion-methods
    $.extend(ns.unit, {
        getLength    : function( m   ){ return convertValue( m,  'length'     ); },
        getArea      : function( m2  ){ return convertValue( m2, 'area'       ); },
        getSpeed     : function( ms  ){ return convertValue( ms, 'speed'      ); },
        getDirection : function( deg ){ return convertValue( deg, 'direction' ); }
    });

    /***********************************************************
    Set up and load the different formats via fcoo.settings
    ***********************************************************/
    function addSetting(scaleId, defaultUnit, units){
        ns.settings.add({
            id            : scaleId,
            validator     : function( unit ){ return units.indexOf(unit) > -1; },
            applyFunc     : function( unit ){ ns.unit[scaleId] = unit; },
            defaultValue  : ns.unit[defaultUnit],
            callApply     : true,
            globalEvents  : window.fcoo.events.UNITCHANGED
        });
    }

    addSetting('length',    ns.unit.METRIC, [ns.unit.METRIC, ns.unit.NAUTICAL]);
    addSetting('area',      ns.unit.METRIC, [ns.unit.METRIC, ns.unit.NAUTICAL]);
    addSetting('speed',     ns.unit.METRIC, [ns.unit.METRIC, ns.unit.METRIC2, ns.unit.NAUTICAL]);
    addSetting('direction', ns.unit.DEGREE, [ns.unit.DEGREE, ns.unit.GRADIAN]);


    /************************************************************************************
    Define two new formats to convert distances in meter to kilometer or nautical miles
    ************************************************************************************/
/* TODO - include if needed
    function numeralFormat( name, unit, factor ){
        var regExp  = new RegExp('('+unit+')'),  // = /(km)/
            regExp2 = new RegExp('\s?\\' + unit);  // = /\s?\km/

        window.numeral.register('format', name, {
            regexps: {
                format  : regExp, // /(km)/,
                unformat: regExp  ///(km)/
            },
            format: function(value, format, roundingFunction) {
                var space = window.numeral._.includes(format, ' ' + unit) ? ' ' : '',
                    output;
                value = value / factor;

                // check for space before
                format = format.replace(regExp2, '');
                output = window.numeral._.numberToFormat(value, format, roundingFunction);

                if (window.numeral._.includes(output, ')')) {
                    output = output.split('');
                    output.splice(-1, 0, space + unit);
                    output = output.join('');
                } else {
                    output = output + space + unit;
                }

                return output;
            },
            unformat: function(string) {
                return window.numeral._.stringToNumber(string) * factor;
            }
        });
    }

    numeralFormat( 'kilometer', 'km', 1000 );
    numeralFormat( 'nautical',  'nm', 1852 );
*/

    //Update the unit-formats when the number-format is changed
    ns.events.on( window.fcoo.events.NUMBERFORMATCHANGED, function(){
        ns.events.fire( window.fcoo.events.UNITCHANGED );
    });



}(jQuery, this, document));