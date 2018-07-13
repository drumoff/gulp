var gulp = require('gulp');
    git = require('gulp-git'),
    repo = 'https://github.com/drumoff/templateProjects.git',
    folders = ['app/**', 'app/css/**', 'app/js/**', 'app/fonts/**', 'app/img/**', 'app/libs/**'];


gulp.task('clone', function(){
   git.clone(repo, {args: './app'}, function(){

   })
});

//----------------------Загрузка файлов на GitHub---------------------// 

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