module.exports = (grunt) -> 
  grunt.initConfig

    coffee:
      compile: 
        files: 
          'spec/scalarInputSpec.js': 'spec/scalarInputSpec.coffee'
        options: 
          sourceMap: true

    watch:
      compile: 
        files: ['spec/scalarInputSpec.coffee']
        tasks: 'compile'
      test:
        files: ['src/jquery.ui.scalarInput.js', 'spec/scalarInputSpec.js']
        tasks: 'test:dev'

    jshint: 
      all:
        'src/jquery.ui.scalarInput.js'

    jasmine: 
      # we keep _SpecRunner.html around when devving to help debug
      dev: 
        src: 'src/jquery.ui.scalarInput.js'
        options:
          specs: 'spec/scalarInputSpec.js'
          vendor: ['lib/jquery-2.1.3.js', 'lib/jquery-ui-1.11.2-core.js']
          keepRunner: true
      prod: 
        src: 'src/jquery.ui.scalarInput.js'
        options:
          specs: 'spec/scalarInputSpec.js'
          vendor: ['lib/jquery-2.1.3.js', 'lib/jquery-ui-1.11.2-core.js']
  
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'compile', ['coffee']
  grunt.registerTask 'test', ['jshint', 'jasmine:prod']
  grunt.registerTask 'test:dev', ['jshint', 'jasmine:dev']

  grunt.registerTask 'default', ['compile', 'test']
  grunt.registerTask 'travis', ['default']
