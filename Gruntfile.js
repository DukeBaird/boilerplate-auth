module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-pug');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-postcss');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		pug: {
			compile: {
				options: {
					pretty: true
				},
				files:[{
					cwd: 'templates',
					src: '**/*.pug',
					dest: 'public/views',
					expand: true,
					ext: '.html'
				}]
			}
		},

		postcss: {
			options: {
				map: true, // inline sourcemaps

				processors: [
					require('pixrem')(), // add fallbacks for rem units
					require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
					require('cssnano')() // minify the result
				]
			},
			dist: {
				src: 'public/css/index.css'
			}
		},

		sass: {
			dist: {
				files: {
					'public/css/index.css': 'public/css/index.sass'
				}
			}
		},

		watch: {
			grunt: {
				files: ['Gruntfile.js']
			},
			css: {
				files: 'public/css/**/*.sass',
				tasks: ['sass']
			},
			// pug: {
			// 	files: 'views/*.pug',
			// 	tasks: ['pug']
			// },
			postcss: {
				files: 'public/css/**/*.sass',
				tasks: ['postcss:dist']
			}
		}
	});
	grunt.registerTask('default', 'info', function() {
		grunt.log.writeln(' ');
		grunt.log.writeln('**********************************************************************'['rainbow']);
		grunt.log.writeln('**********************************************************************'['rainbow']);
	});
	grunt.registerTask('compile', 'Convert pug templates into html templates', ['pug','sass','postcss:dist', 'watch']);
	grunt.registerTask('autoPrefix', "Prefix css", ['postcss:dist']);
};