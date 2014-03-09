<img src="https://travis-ci.org/hongymagic/jshint-teamcity.png" data-bindattr-440="440" title="Build Status Images">

## jshint-teamcity

JSHint TeamCity Reporter which group by files using TeamCity Test Suites

### Install

Install with npm: `npm install --save-dev jshint-teamcity`

### Usage

Use it with:

#### JSHint CLI

```
jshint --reporter node_modules/jshint-teamcity/teamcity.js file.js
```

#### gulp-jshint

```
gulp.task('default', function () {
	gulp.src(['file.js'])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-teamcity'));
});
```

#### grunt-contrib-jshint

```
grunt.initConfig({
	jshint: {
		options: {
			reporter: require('jshint-teamcity')
		},
		target: ['file.js']
	}
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.registerTask('default', ['jshint']);
```

### Screenshot

<img src="http://cl.ly/UJnl/Screenshot%202014-02-20%2012.12.17.png" title="This is how it looks like in TeamCity">

### License

Thanks to [jshint-stylish](https://github.com/sindresorhus/jshint-stylish) and [jshint-teamcity-reporter](https://github.com/e-conomic/jshint-teamcity-reporter).

MIT © David Hong
