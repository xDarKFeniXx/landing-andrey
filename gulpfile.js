/*function defaultTask(cb) {
    // place code for your default task here
    cb();
  }
  
  exports.default = defaultTask */
  let project_folder = "dist";
  let source_folder = "#src";

  let path ={
      build: //пути вывода, пути куда Галп будет выгружать готовые файлы 
      {
       //Первый путь к html файлу 
      html:project_folder + "/" // "/" - ставится потому что файл находится в корне 
      css: project_folder + "/css/", // это папка вывода, исходник идет как scss
      js: project_folder + "/js/",
      img: project_folder + "/img/",
      }, // зачем в Галп обращать внимание на запятые??
      src: //тоже самое нужно для файлов с исходниками
      {
          //Первый путь к html файлу 
          html:source_folder + "/" // папка с проектом меняется на source
          css: source_folder + "/scss/style.scss", //Обрати внимание на разницу в названии исходника и конечной папки. Так обрати внимание что будет обрабатываться только один файл - style.scss, если в папке есть еще, они обрабатываться не будут
          js: source_folder + "/js/script.js",
          img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", // * - означает "любой", т.е. название у файла может быть любым. {} - Указывает на конкретные расширения которые будут обрабатываться. Т.е. если в папке будет какой нибудь текст txt то галп его проигнорирует
      },
      watch: // для чего он нужен? Для моментарльного контроля?
      {
          
          html:source_folder + "/**/*.html" // т.е. следим за всем что имеет расширение html
          css: source_folder + "/scss/**/*.scss, 
          js: source_folder + "/js/**/*.js ",
          img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      },
      clean:"./" + project_folder + "/" //объект clean будет отвечать за постоянное удаление папки каждый раз, как мы будет запускать Галп (Зачем это делать?)
  }
  let {src,dest} = require('gulp'), // что такое require и почему gulp в одинарных кавычках
  // Переменные src и dest создаются для помощи написания сценария. В эти переменные и присваивается сам Галп
  gulp = require('gulp'), //создаем переменную Галп для каких то отдельных задач (каких? Зачем?) Список переменных может быть увеличин, по мере установки плагинов и дополнений.
  // Далее можно добавить плагин по синхронизации браузера. Добавление плагина идет через терминал: npm i browser-sync --save-dev
  // Теперь назначим плагину переменную
  browsersync = require('gulp')
  gulp = require("browser-sync").create();

  function name(params) {

  }
