module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      build: {
        src: [
          'src/gamerules.js',
          'src/menu.js',
          'src/grid.js',
          'src/gamerunner.js',
          'src/scrolling.js',
          'src/games/*.js',
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
