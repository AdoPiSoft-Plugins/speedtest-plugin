(function() {
  "use strict";
  var App = angular.module("Plugins").config(function($stateProvider) {
    $stateProvider.state("plugins.speedtest", {
      templateUrl: "/public/plugins/speedtest-plugin/views/index.html",
      controller: "SpeedTestCtrl",
      url: "/plugins/speedtest",
      title: "Speed Test",
      sidebarMeta: {
        order: 1
      }
    })
  })
})();	