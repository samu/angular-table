// Karma configuration
// Generated on Wed Feb 05 2014 13:15:20 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/underscore/underscore.js',

      'coffee/angular_table.coffee',

      'coffee/configuration/column_configuration.coffee',
      'coffee/configuration/configuration_variable_names.coffee',
      'coffee/configuration/scope_config_wrapper.coffee',
      'coffee/configuration/table_configuration.coffee',

      'coffee/directives/table/setup/setup.coffee',
      'coffee/directives/table/setup/standard_setup.coffee',
      'coffee/directives/table/setup/paginated_setup.coffee',
      'coffee/directives/table/table.coffee',

      'coffee/directives/pagination/page_sequence.coffee',
      'coffee/directives/pagination/pagination_template.coffee',

      'coffee/directives/at_table.coffee',
      'coffee/directives/at_pagination.coffee',
      'coffee/directives/at_implicit.coffee',

      'test/test_helper.coffee',
      'test/*.coffee',
      'test/templates/**/*.html'
    ],


    // list of files to exclude
    exclude: [

    ],

    plugins: [
      'karma-coffee-preprocessor',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-ng-html2js-preprocessor'
    ],

    preprocessors: {
      'coffee/**/**/*.coffee': ['coffee'],
      'test/*.coffee': ['coffee'],
      'test/templates/**/*.html': ['ng-html2js']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
