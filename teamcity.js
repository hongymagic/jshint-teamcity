"use strict";

var tsm = require('teamcity-service-messages');

var REPORTER = 'JSHint';

var groupErrorsByFileName = function (errors) {
	return errors.reduce(function (previous, current) {
		var error = current.error;
		var fileName = current.file;

		previous[fileName] || (previous[fileName] = []);

		previous[fileName].push({
			name: error.reason + " at line " + error.line + ", col " + error.character,
			message: error.code + ": " + error.reason,
			detailed: error.evidence
		});

		return previous;
	}, {});
};

module.exports = {
	toString: function () {
		return __filename;
	},
	reporter: function (errors) {
		var errorsByFileName = groupErrorsByFileName(errors);
		var fileNames = Object.keys(errorsByFileName);

		tsm.testSuiteStarted({ name: REPORTER });

		fileNames.forEach(function (fileName) {
			var fileErrors = errorsByFileName[fileName];

			tsm.testSuiteStarted({ name: fileName });

			fileErrors.forEach(function (error) {
				var errorName = error.name;

				tsm
					.testStarted({ name: errorName })
					.testFailed({
						name: errorName,
						message: error.message,
						detailed: error.detailed
					})
					.testFinished({ name: errorName });
			});

			tsm.testSuiteFinished({ name: fileName });
		});

		// If there were no errors, tell TeamCity that tests ran successfully
		if (errors.length === 0) {
			tsm
				.testStarted({ name: REPORTER })
				.testFinished({ name: REPORTER });
		}

		tsm.testSuiteFinished({name: REPORTER });
	}
};
