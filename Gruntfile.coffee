module.exports = (grunt) -> 
  grunt.initConfig
    jasmine: 
      src: 'src/jquery.ui.scalarInput.js'
      options:
        specs: 'spec_compiled/scalarInputSpec.js'
        vendor: ['lib/jquery-2.1.3.js', 'lib/jquery-ui-1.11.2-core.js']
    jshint: 
      all:
        'src/jquery.ui.scalarInput.js'
  
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-jshint'

  grunt.registerTask 'test', ['jshint', 'jasmine']
  grunt.registerTask 'travis', ['jshint', 'jasmine']
  grunt.registerTask 'default', ['test']
