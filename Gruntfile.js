module.exports = function(grunt) {

    // Tell Grunt what tasks to load
    require('load-grunt-tasks')(grunt);

    // Task configuration
    grunt.initConfig({
        // The watch task
        watch: {
            // Watch our css files for changes
            scss: {
                files: ['styles/site.scss'], // what file to watch
                tasks: ['sass', 'autoprefixer'] // what task to execute on change
            },
            js: {
            	files: ['javascript/*.js'],
            	tasks: ['babel']
            },
            options: {
                // To prevent checking files for change after the autoprefixer task is done
                spawn: false
            }
        },

        // The sass task
        sass: {
            dist: {
                files: {
                    // Destination : Source
                    'styles/site.css': 'styles/site.scss'
                }
            }
        },

        // Autoprefix task
        autoprefixer: {
            dev: {
                src: 'styles/site.css', // source file
                dest: 'styles/site.css' // destionation file
            }
        },

       	//Babel task 
	  babel: {
	    options: {
	      sourceMap: true,
	      presets: ['es2015'],
	      ignore: '*.min.js'
	    },
	    dist: {
	      files: [{
			    expand: true,
			    cwd: 'javascript',
			    src: ['**/*.js'],
			    dest: 'dist/javascript',
			}]
	    }
	  }
    });

    // Default task when the grunt command is called
    grunt.registerTask('default', ['watch']);
}