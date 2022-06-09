const { notify } = require('browser-sync');
const {src,dest} = require('gulp'); // что такое require и почему gulp в одинарных кавычках
  // Переменные src и dest создаются для помощи написания сценария. В эти переменные и присваивается сам Галп
  const gulp = require('gulp'); //создаем переменную Галп для каких то отдельных задач (каких? Зачем?) Список переменных может быть увеличин, по мере установки плагинов и дополнений.
  // Далее можно добавить плагин по синхронизации браузера. Добавление плагина идет через терминал: npm i browser-sync --save-dev
  // Теперь назначим плагину переменную
const browsersync = require("browser-sync").create();//require выполняется в той же строчке кода в которой прописан. import-from запускается только в начале файла
const fileinclude = require("gulp-file-include");
const del = require("del");
const scss = require("gulp-sass")(require('sass'));
const autoprefixer = require ("gulp-autoprefixer");
const group_media = require ("gulp-group-css-media-queries");
const clean_css = require("gulp-clean-css")
const rename = require("gulp-rename")
const uglify = require ("gulp-uglify-es").default
const imagemin = require("gulp-imagemin")
// Создаем отдельную функцию чтобы запускать обновление браузера

  const project_folder = "dist";
  const source_folder = "#src";

  const path ={
    //пути вывода, пути куда Галп будет выгружать готовые файлы
      build:{
       //Первый путь к html файлу 
      html:project_folder + "/", // "/" - ставится потому что файл находится в корне 
      css: project_folder + "/css/", // это папка вывода, исходник идет как scss
      js: project_folder + "/js/",
      img: project_folder + "/img/",
      }, // зачем в Галп обращать внимание на запятые??
      //тоже самое нужно для файлов с исходниками
      src: {
          //Первый путь к html файлу 
          html:[source_folder + "/*.html","!" + source_folder + "/_*.html"], // папка с проектом меняется на source
          css: source_folder + "/scss/style.scss", //Обрати внимание на разницу в названии исходника и конечной папки. Так обрати внимание что будет обрабатываться только один файл - style.scss, если в папке есть еще, они обрабатываться не будут
          js: source_folder + "/js/script.js",
          img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", // * - означает "любой", т.е. название у файла может быть любым. {} - Указывает на конкретные расширения которые будут обрабатываться. Т.е. если в папке будет какой нибудь текст txt то галп его проигнорирует
      },
      watch: // для чего он нужен? Для моментарльного контроля?
      {
          
          html:source_folder + "/**/*.html", // т.е. следим за всем что имеет расширение html
          css: source_folder + "/scss/**/*.scss", 
          js: source_folder + "/js/**/*.js ",
          img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      },
      clean:"./" + project_folder + "/" //объект clean будет отвечать за постоянное удаление папки каждый раз, как мы будет запускать Галп (Зачем это делать?)
  }
  function browserSync(params) {
    browsersync.init({
      server: {
        baseDir:"./" + project_folder + "/"
      },
      port:3000,
      notify: false
    })
  }

  function html () {
    return src(path.src.html)
    .pipe(fileinclude())
    //делаем для того чтобы gulp собирал наши файлы в один
    .pipe(dest(path.build.html))
  //pipe это функция в которой мы пишем команды для gulp
    .pipe(browsersync.stream())
  //для обновления страницы
  }
  //фунция готова и теперь её нужно подружить с gulp и включить в процесс выполнения
  function js () {
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(
      uglify()
    )
    .pipe (
      rename({
        extname:".min.js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
 
  }

  function images () {
    return src(path.src.img)
    .pipe (
      imagemin({
        progressive:true,
        svgoPlugins:[{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3 //0 to 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
  }


  function css () {
    return src(path.src.css)
    //.pipe(fileinclude()) этот удаляем, он не нужен, т.к предпроцессор Css сам умеет подключать
    .pipe(
      scss({
        outputStyle: "expanded"
        //добавляем разные характеристики, например, чтобы файл не был сжатым
      })
    )
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 5 versions"],
      cascade: true
    }))
    .pipe(dest(path.build.css))
    .pipe(group_media()
    ) 
    .pipe(clean_css())
    .pipe(rename(
      {extname:".min.css"}))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
  }
  //создаем функцию для стилей
  // пока это нам даст банальное копирование папки css в папку dist

  function watchFiles (params) {
    gulp.watch([path.watch.html],html)
    gulp.watch([path.watch.css],css)
    gulp.watch([path.watch.js],js)
    gulp.watch([path.watch.img],images)
  }
  //создаем новую функцию для того чтобы изменения были видны в режиме реального времени

  function clean(params) {
    return del(path.clean);

  }
  //создадим функцию которая будет удалять папку (какую?) судя по всему папку dist

  let build = gulp.series(clean,gulp.parallel(js, css, html, images))
  // потом включаем build в переменную watch
  //затем нужно подружить её с gulp через exports
  // добавляем (подключаем) нашу функцию в bild

  let watch=gulp.parallel(build,watchFiles,browserSync);

  exports.images = images;
  exports.js = js;
  exports.css = css;
  exports.html = html;
  exports.build = build;
  exports.watch = watch;
  exports.default = watch;

  //что такое флаг --save-dev?
  // не очень понятен процесс подключения плагина. Куча слов которые для меня непонятны и неясно в итоге получилось что нибудь или нет
