require("./gulpfile.js");

const fs = require('fs');
$.prompt = require('gulp-prompt');
$.cleanDest = require('gulp-dest-clean');

var lh_proj_path = "";

$.gulp.task("lh", function(done){
    var lh_proj_path_file = "../lh_project_path.js";
    fs.access(lh_proj_path_file, (err) => {
        if (err) {
            $.gulp.src('./package.json')
            .pipe($.prompt.prompt({
                type: 'input',
                name: 'lh_proj_path',
                message: 'Укажите путь к папке проекта в Dropbox, пример: /Users/XXX/Dropbox/LH_XxxxXxxx/1000_xxxxx/\n'
            }, function(res){
                lh_proj_path = res.lh_proj_path.substr(-1) == '/' ? res.lh_proj_path : res.lh_proj_path+'/';
                fs.access(lh_proj_path+"html", (err) => {
                    if (err) {
                        console.log("По указанному пути не удалось найти папку html. Пожалуйста, проверьте путь и синхронизацию Dropbox.");
                    } else {
                        fs.writeFile(lh_proj_path_file, "module.exports = '" + lh_proj_path + "';",
                            function(error) {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log("Отлично! Теперь путь сохранён в "+lh_proj_path_file+"\nПогнали!");
                                $.gulp.series("lh_run")();
                            }
                        );
                    }
                });
            }));
        } else {
            lh_proj_path = require(lh_proj_path_file);
            $.gulp.series("lh_run")();
        }
        done();
    });
});

$.gulp.task("sync_html", function() {
    return $.gulp
        .src("./"+$.path.dest+"**", {dot:true})
        .pipe($.cleanDest(lh_proj_path+"html/", '', {force: true, dot:true}))
        .pipe($.gulp.dest(lh_proj_path+"html/"));
});
$.gulp.task("sync_sources", function() {
    return $.gulp
        .src(["./**", "!./node_modules/**", "!./livehtml.js", "!./package-lock.json", "!./yarn.lock"], {dot:true})
        .pipe($.cleanDest(lh_proj_path+"sources/", '', {force: true, dot:true}))
        .pipe($.gulp.dest(lh_proj_path+"sources/"));
});

$.gulp.task("watch_lh", function() {
    return new Promise((res, rej) => {
        $.watch("./"+$.path.dest+"**")
            .pipe($.gulp.dest(lh_proj_path+"html/"));;
        $.watch(["./**", "!./node_modules/**", "!./livehtml.js", "!./package-lock.json", "!./yarn.lock"])
            .pipe($.gulp.dest(lh_proj_path+"sources/"));
        res();
    });
});

// BUILD
$.gulp.task("lh_run", $.gulp.series(
    "default",
    $.gulp.parallel("sync_html", "sync_sources"),
    "watch_lh"
));