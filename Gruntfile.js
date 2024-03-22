module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      build: {
        src: [
          'src/dom.js',
          'src/animations.js',
          'src/grid.js',
          'src/gridview.js',
          'src/viewport.js',
          'src/scoreboard.js',
          'src/gamerules.js',
          'src/games/*.js',
          'src/gamerunner.js',
          'src/menu.js',
          'src/scrolling.js',
          'src/game.js',
          'src/app.js',
        ],
        dest: 'public/tttt.js',
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat']);

};
