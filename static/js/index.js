import util from './utils/util';
let a = 'jinchenjie4';

var h = require("html!./tmpl/index.html");
alert(h);
//require('jquery.validate');
/*var jquery = require('jquery');

//require('imports?$=jquery!j');
//require('imports?validate=jquery.validate!./index.js');
$.validator.setDefaults({
	errorPlacement: function(error, element) {
		error.insertAfter(element);
	}
});*/

/*define(['jquery', 'jquery-validation'], function ($) {
	alert(0);
	$.validator.setDefaults({
		errorPlacement: function(error, element) {
			error.insertAfter(element);
		}
	});
});*/

require('jquery-validation');
alert($.validator);
alert(_.each);
$.each([1, 3], function(i, item) {
	alert(item);
});
util.say(a);
util.add(1, 2);