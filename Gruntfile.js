module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    concat: {
      build: {
        src: [
          "src/dom.js",
          "src/animations.js",
          "src/ai/*.js",
          "src/grid.js",
          "src/gridview.js",
          "src/viewport.js",
          "src/scoreboard.js",
          "src/gamerules.js",
          "src/games/*.js",
          "src/gamerunner.js",
          "src/menu.js",
          "src/scrolling.js",
          "src/game.js",
          "src/app.js",
        ],
        dest: "public/tttt.js",
      }
    },
    copy: {
      main: {
        files: [
          {
            src: ["index.html", "style.css"],
            dest: "public/",
          }
        ]
      }
    },
    watch: {
      scripts: {
        files: [
          "index.html",
          "style.css",
          "src/**/*.js",
        ],
        tasks: ["concat", "copy"],
        options: {
          debounceDelay: 250,
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task(s).
  grunt.registerTask("default", ["concat", "copy"]);

};
