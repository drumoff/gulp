/*------------------------------------------------------------------
				AutoReloader + SassCompilation + MinFiles
-------------------------------------------------------------------- */
var gulp 		 = require('gulp'),
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat 		 = require('gulp-concat'),
	uglify 		 = require('gulp-uglifyjs'),
	cssnano 	 = require('gulp-cssnano'),
	rename		 = require('gulp-rename'),
	del			 = require('del'),
	imagemin	 = require('gulp-imagemin'),
	pngquant	 = require('imagemin-pngquant'),
	cache		 = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
	return gulp.src(['app/sass/**/*.sass','app/sass/**/*.scss'])
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream:true}))
});

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});


gulp.task('scripts',['sass'], function(){
	return gulp.src(['app/libs/jQuery/*.js','app/libs/**/*.js'])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('css-libs',function(){
	return gulp.src('app/css/libs.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'));
});

gulp.task('watch',['browser-sync','css-libs','scripts'], function () {
	gulp.watch(['app/sass/**/*.sass','app/sass/**/*.scss'], ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clear', function(){
	return cache.clearAll();
})


/*------------------------------------------------------------------------
------------------------------------------------------------------------ */

/*-----------------------------------------------------------------------
            					Prodaction              
-----------------------------------------------------------------------*/

gulp.task('clean', function(){
	return del.sync('dist');
})

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPluggins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
})

gulp.task('build', ['clean', 'img','sass', 'scripts'], function(){
	
	var buildCss = gulp.src([
		'app/css/main.css',
		'app/css/libs.min.css'
	])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildjs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

});

/*-----------------------------------------------------------------------
------------------------------------------------------------------------- */

/*----------------------------------------------------------------------------
								GitHub
-----------------------------------------------------------------------------*/ 

var git = require('gulp-git'),
    repo = 'https://github.com/drumoff/templateProjects.git',
    folders = ['app/**', 'app/css/**', 'app/js/**', 'app/fonts/**', 'app/img/**', 'app/libs/**'];


gulp.task('clone', function(){
   git.clone(repo, {args: './app'}, function(){

   })
});



gulp.task('init',function(){
    git.init(function(){

    })
});

gulp.task('add', ['init'],function(){
    return gulp.src(folders)
        .pipe(git.add());
});

gulp.task('commit', ['add'], function(){
    return gulp.src(folders)
        .pipe(git.commit('initial commit'));
});

gulp.task('addremote',function(){
    git.addRemote('origin', repo, function(){});
});

gulp.task('push', ['commit'], function(){
    git.push('origin', 'master', {args: " -f"},  function(){});
  });


gulp.task('exportToGit', ['init','add', 'commit', 'push'], function(){
    console.log('OPERATION SUCCES');
});  

//-----------------------------------------------------------------------//