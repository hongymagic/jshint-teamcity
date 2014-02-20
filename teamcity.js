"use strict";

function escapeTeamcityString(message) {
	if (!message) {
		return "";
	}

	return message.replace(/\|/g, "||")
		.replace(/\'/g, "|\'")
		.replace(/\n/g, "|n")
		.replace(/\r/g, "|r")
		.replace(/\u0085/g, "|x")
		.replace(/\u2028/g, "|l")
		.replace(/\u2029/g, "|p")
		.replace(/\[/g, "|[")
		.replace(/\]/g, "|]");
}

module.exports = {
	reporter: function (results) {
		var output = [];

		// Categorise each error by filename
		var errors = results.reduce(function (previous, current) {
			var error = current.error;

			if (!previous[current.file]) {
				previous[current.file] = [];
			}

			previous[current.file].push({
				name: escapeTeamcityString(current.file + ": line " + error.line + ", col " + error.character + ", " + error.reason),
				message: escapeTeamcityString(error.code + ": " + error.reason),
				detailed: escapeTeamcityString(error.evidence)
			});

			return previous;
		}, {});

		// Collate teamcity output into test suites (by filename)
		Object.keys(errors).forEach(function (key) {
			var suite = "JSHint: " + key;
			output.push("##teamcity[testSuiteStarted name='" + suite + "']");
			errors[key].forEach(function (test) {
				output.push("##teamcity[testStarted name='" + test.name + "']");
				output.push("##teamcity[testFailed name='" + test.name + "' message='" + test.message + "' detailed='" + test.detailed + "']");
			});
			output.push("##teamcity[testSuiteFinished name='" + suite + "']");
		});

		// If there were no output, tell TeamCity that tests ran successfully
		if (output.length === 0) {
			output.push("##teamcity[testStarted name='JSHint']");
			output.push("##teamcity[testFinished name='JSHint']");
		}

		// Print to process.stdout
		console.log(output.join("\n"));
	}
};
