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
    var ns = window.fcoo = window.fcoo || {};

    ns.unit = ns.unit || {};

    //Create const to hold the name of the selected unit
    $.extend(ns.unit, {
        METRIC  : 'METRIC',     //m,   m2,  m/s
        METRIC2 : 'METRIC2',    //km, km2, km/t
        FEET    : 'FEET',       //Feet
        NAUTICAL: 'NAUTICAL',   //nm, nm2, knots
        DEGREE  : 'DEGREE',     //0-360 / -180-180
        GRADIAN : 'GRADIAN',    //0-400 / -200-200
    });

    //Set default unit for the different scales
    $.extend(ns.unit, {
        length   : ns.unit.NAUTICAL,
        height   : ns.unit.METRIC,
        area     : ns.unit.NAUTICAL,
        speed    : ns.unit.NAUTICAL,
        direction: ns.unit.DEGREE
    });

    //convertion = {length,area,speed,direction} of {unit: factor} = convert values from SI-unit to the value when unit is 'unit'
    var conversion = {
            length   : {'METRIC': 1, 'METRIC2': 1/1000,         'NAUTICAL': 1/1852},
            height   : {'METRIC': 1, 'METRIC2': 1/1000,         'FEET'    : 1/0.3048},
            area     : {'METRIC': 1, 'METRIC2': 1/(1000*1000),  'NAUTICAL': 1/(1852*1852)},
            speed    : {'METRIC': 1, 'METRIC2': 60*60/1000,     'NAUTICAL': 60*60/1852},
            direction: {'DEGREE': 1, 'GRADIAN': 400/360}
        };

    /*
    convertValue((value, scale, unit)
    Convert value [SI-unit] of scale to current unit or unit (specified)
    */
    ns.unit.convertValue = function(value, scale, unit, round){
        unit = unit || ns.unit[scale];
        var factor = conversion[scale] ? conversion[scale][unit] || 1 : 1,
            result = value*factor;
        return round ? Math.round(result) : result;
    };

    //Create convertion-methods
    $.extend(ns.unit, {
        getLength    : function( m  , round ){ return ns.unit.convertValue( m,   'length'   , null, round ); },
        getHeight    : function( m  , round ){ return ns.unit.convertValue( m,   'height'   , null, round ); },
        getArea      : function( m2 , round ){ return ns.unit.convertValue( m2,  'area'     , null, round ); },
        getSpeed     : function( ms , round ){ return ns.unit.convertValue( ms,  'speed'    , null, round ); },
        getDirection : function( deg, round ){ return ns.unit.convertValue( deg, 'direction', null, round ); }
    });

    /*
    convertValueBack((value, scale, unit)
    Convert value [current unit or unit (specified)] of scale to SI-unit
    */
    ns.unit.convertValueBack = function(value, scale, unit, round){
        var result = value / ns.unit.convertValue(1, scale, unit);
        return round ? Math.round(result) : result;
    };

    //Create convertion-back-methods
    $.extend(ns.unit, {
        getLengthBack   : function( length   , round ){ return ns.unit.convertValueBack( length,    'length'   , null, round ); },
        getHeightBack   : function( height   , round ){ return ns.unit.convertValueBack( height,    'height'   , null, round ); },
        getAreaBack     : function( area     , round ){ return ns.unit.convertValueBack( area,      'area'     , null, round ); },
        getSpeedBack    : function( speed    , round ){ return ns.unit.convertValueBack( speed,     'speed'    , null, round ); },
        getDirectionBack: function( direction, round ){ return ns.unit.convertValueBack( direction, 'direction', null, round ); }
    });

    /***********************************************************
    Set up and load the different formats via fcoo.globalSetting
    ***********************************************************/
    function addSetting(scaleId, defaultUnit, units){
        ns.globalSetting.add({
            id            : scaleId,
            validator     : function( unit ){ return units.indexOf(unit) > -1; },
            applyFunc     : function( unit ){ ns.unit[scaleId] = unit; },
            defaultValue  : ns.unit[defaultUnit],
            callApply     : true,
            globalEvents  : window.fcoo.events.UNITCHANGED
        });
    }

    addSetting('length',    ns.unit.NAUTICAL,   [ns.unit.METRIC2, ns.unit.NAUTICAL                   ]);
    addSetting('height',    ns.unit.METRIC,     [ns.unit.METRIC,  ns.unit.METRIC2,  ns.unit.FEET     ]);
    addSetting('area',      ns.unit.NAUTICAL,   [ns.unit.METRIC,  ns.unit.NAUTICAL                   ]);
    addSetting('speed',     ns.unit.NAUTICAL,   [ns.unit.METRIC,  ns.unit.METRIC2,  ns.unit.NAUTICAL ]);
    addSetting('direction', ns.unit.DEGREE,     [ns.unit.DEGREE,  ns.unit.GRADIAN                    ]);


    /***********************************************************
    Add content for globalSetting edit-form

Længde/Length
km  Kilometer   Kilometre
nm  Sømil       Nautical mile

Areal/Area
km2 Kvadratkilometer    Square kilometre
nm2 Kvadratsømil        Square nautical mile

Fart/Speed
m/s     Meter pr. sekund     Metre per second
km/t    Kilometer i timen   km/h Kilometre per hour
Kn      Knob                Knot

Retning/Direction
Grader (0-360)      Degree (0-360)
Nygrader (0-400)    Gradian (0-400)

ns.unit.METRIC  : 'METRIC',    //m, m2, m/s
        METRIC2 : 'METRIC2',   //m, m2, km/t
        NAUTICAL
    ***********************************************************/
    ns.globalSetting.addModalContent(ns.events.UNITCHANGED, [
        {
            id: 'length',
            type: 'radiobuttongroup',
            label: {icon:'fa-ruler-horizontal', text:{da:'Længde', en:'Length'}},
            items: [
                {id: ns.unit.METRIC2,  text: 'km', title: {da:'Kilometer', en:'Kilometre'    }},
                {id: ns.unit.NAUTICAL, text: 'nm', title: {da:'Sømil',     en:'Nautical mile'}},
            ]
        },

        {
            id: 'height',
            type: 'radiobuttongroup',
            label: {icon:'fa-ruler-vertical', text:{da:'Højde', en:'Height'}},
            items: [
                {id: ns.unit.METRIC,    text: 'm',                          title: {da:'Kilometer', en:'Kilometre'    }},
                {id: ns.unit.METRIC2,   text: 'km',                         title: {da:'Kilometer', en:'Kilometre'    }},
                {id: ns.unit.FEET,      text: {da:'Fod (eng)', en:'Feet'},  title: {da:'Fod (eng)',     en:'Feet'}},
            ]
        },

        {
            id: 'area',
            type: 'radiobuttongroup',
            label: {icon:'fa-ruler-combined', text:{da:'Areal', en:'Area'}},
            items: [
                {id: ns.unit.METRIC,   text: 'km<sup>2</sup>', title: {da:'Kvadratkilometer', en:'Square kilometre'     }},
                {id: ns.unit.NAUTICAL, text: 'nm<sup>2</sup>', title: {da:'Kvadratsømil',     en:' Square nautical mile'}},
            ]
        },
        {
            id: 'speed',
            type: 'radiobuttongroup',
            label: {icon:'far fa-tachometer', text:{da:'Fart', en:'Speed'}},
            items: [
                {id: ns.unit.METRIC,   text: 'm/s',                             title: {da:'Meter pr. sekund',  en:'Metre per second'     }},
                {id: ns.unit.METRIC2,  text: {da:'km/t', en:'km/h'},            title: {da:'Kilometer i timen', en:'Kilometre per hour'     }},
                {id: ns.unit.NAUTICAL, text: {da:'Kn (Knob)', en:'Kn (Knot)'},  title: {da:'Knob', en:'Knot'}},
            ]
        },
        {
            id: 'direction',
            type: 'radiobuttongroup',
            label: {icon:'fa-compass', text:{da:'Retning', en:'Direction'}},
            items: [
                {id: ns.unit.DEGREE,  text: {da:'Grader (0-360<sup>o</sup>)',   en:'Degree (0-360<sup>o</sup>)' }},
                {id: ns.unit.GRADIAN, text: {da:'Nygrader (0-400<sup>g</sup>)', en:'Gradian (0-400<sup>g</sup>)'}}
            ]
        }
    ]);


    //Update the unit-formats when the number-format is changed
    ns.events.on( ns.events.NUMBERFORMATCHANGED, function(){
        ns.events.fire( ns.events.UNITCHANGED );
    });

}(jQuery, this, document));
