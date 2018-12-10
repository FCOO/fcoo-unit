# fcoo-unit
>


## Description
Defines different formats for `"length"`, `"area"`, `"speed"`, `"direction"` in namespace `window.fcoo.unit` and set and load settings in [fcoo-settings](https://github.com/FCOO/fcoo-settings)


## Installation
### bower
`bower install https://github.com/FCOO/fcoo-unit.git --save`

## Demo
http://FCOO.github.io/fcoo-unit/demo/ 

## Usage
	//The following 'const' are defined in fcoo.unit to name the different unit
	window.fcoo.unit.METRIC  	//m, m2, m/s
    window.fcoo.unit.METRIC2 	//m, m2, km/t
	window.fcoo.unit.NAUTICAL	//nm, nm2, knots
    window.fcoo.unit.DEGREE		//0-360 / -180-180
	window.fcoo.unit.GRADIAN	//0-400 / -200-200
 
	//The following methods are defined that conver to the current unit set by fcoo.settings.set(scale, unit)
	window.fcoo.unit.getLength    : function( m   )
	window.fcoo.unit.getArea      : function( m2  )
	window.fcoo.unit.getSpeed     : function( ms  )
	window.fcoo.unit.getDirection : function( deg )

	//Examlpe
	window.fcoo.setting.set('speed', window.fcoo.unit.METRIC2 );
	window.fcoo.unit.getSpeed( 12.34 ); //Return 44.424 = 12.34m/s as km/h


## Scale and Units

| Scale/methods | `METRIC` | `METRIC2` | `NAUTICAL` | `DEGREE` | `GRADIAN` |
| :--: | :--: | :--: | :--: |:--: |:--: |
| `length/getLength(m)` | m | - | nm | - | - |
| `area/getArea(m2)` | m<sup>2</sup> | - | nm<sup>2</sup> | - | - |
| `speed/getSpeed(m2)` | m/s | km/h | knots | - | - |
| `direction/getDirection(deg)` | - | - | - | degree (0-360) | gradian (0-400) |


## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/fcoo-unit/LICENSE).

Copyright (c) 2018 [FCOO](https://github.com/FCOO)

## Contact information

Niels Holt nho@fcoo.dk
