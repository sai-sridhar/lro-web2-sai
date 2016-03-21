/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    lessOptions : {
      paths : ['app/styles/less']

    },

    emberHighCharts: {
      includeHighCharts: true,
      includeHighStock: false,
      includeHighMaps: false,
      includeHighChartsMore: false,
      includeHighCharts3D: false,
      includeModules: ['broken-axis', 'heatmap'] // available modules: broken-axis, canvas-tools, data, drilldowm, exporting, funnel, heatmap, no-data-to-display, solid-gauge, treemap
    }

  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  app.import("bower_components/moment/moment.js");
  app.import("bower_components/sweetalert/dist/sweetalert.min.js");
  app.import("bower_components/sweetalert/dist/sweetalert.css");
  app.import("bower_components/d3/d3.min.js");


  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
