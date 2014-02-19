"use strict";

var assert = require("assert");
var jshint = require("jshint/src/cli").run;
var reporter = require("./teamcity").reporter;

describe("jshint-teamcity", function () {
	it("should be used by JSHint", function () {
		var result = false;
		var _log = process.stdout.write.bind(process.stdout);

		process.stdout.write = function (str) {
			_log(str);

			if (/##teamcity/g.test(str)) {
				result = true;
			}
		};

		jshint({
			args: ["test.js"],
			reporter: reporter
		});

		process.stdout.write = _log;
		assert(result);
	});
});