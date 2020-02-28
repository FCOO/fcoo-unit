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

    addSetting('length',    ns.unit.METRIC, [ns.unit.METRIC, ns.unit.NAUTICAL]);
    addSetting('area',      ns.unit.METRIC, [ns.unit.METRIC, ns.unit.NAUTICAL]);
    addSetting('speed',     ns.unit.METRIC, [ns.unit.METRIC, ns.unit.METRIC2, ns.unit.NAUTICAL]);
    addSetting('direction', ns.unit.DEGREE, [ns.unit.DEGREE, ns.unit.GRADIAN]);


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
                {id: ns.unit.METRIC,   text: 'km', title: {da:'Kilometer', en:'Kilometre'    }},
                {id: ns.unit.NAUTICAL, text: 'nm', title: {da:'Sømil',     en:'Nautical mile'}},
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
                {id: ns.unit.METRIC,   text: 'm/s',                   title: {da:'Meter pr. sekund',  en:'Metre per second'     }},
                {id: ns.unit.METRIC2,  text: {da:'km/t', en:'km/h'},  title: {da:'Kilometer i timen', en:'Kilometre per hour'     }},
                {id: ns.unit.NAUTICAL, text: {da:'Kn(ob)', en:'Kn(ot)'},                    title: {da:'Knob', en:'Knot'}},
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
