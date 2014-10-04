var gulp = require('gulp'),
    fs = require('fs'),
    path = require('path'),
    inflection = require('inflection'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require("gulp-rename"),
    inquirer = require('inquirer'),
    license = require('license'),
    gitConfig = require('git-config');

gulp.task('default', function(done) {
  gitConfig(function (err, gitConfig) {
    if (err) { return done(err); }

    license.licenseTypes(function(err, licenseTypes) {
      inquirer.prompt([
        {type: 'input', name: 'name', message: 'Project name', default: gulp.args.join('-')},
        {type: 'input', name: 'description', message: 'Project description', default: 'The best project ever.'},
        {type: 'input', name: 'author_name', message: 'Project author name', default: gitConfig.user.name},
        {type: 'input', name: 'author_email', message: 'Project author name', default: gitConfig.user.email},
        {type: 'input', name: 'github_user_name', message: 'GitHub user name', default: gitConfig.github.user},
        {type: 'list', name: 'licenseType', message: 'Choose your license type', choices: licenseTypes, default: 'mit'},
        {type: 'confirm', name: 'moveon', message: 'OK?'}
      ],

      function(answers) {
        if (!answers.moveon) { return done(); }

        answers.year = new Date().getFullYear();

        license.createLicense({licenseType: answers.licenseType, year: answers.year, organization: answers.author_name}, function(err, licenseString) {
          fs.writeFileSync(__dirname + '/templates/LICENSE', licenseString);
          answers.license = answers.licenseType.toUpperCase();

          gulp.src(__dirname + '/templates/**', {dot: true})
            .pipe(template(answers))
            .pipe(rename(function (file) {
              if (file.basename.indexOf('dot') === 0) {
                file.basename = file.basename.replace('dot', '');
              } else {
                file.basename = file.basename.replace('name', answers.name);
              }
            }))
            .pipe(conflict('./'))
            .pipe(gulp.dest('./'))
            .pipe(install())
            .on('finish', done);
        });
      });
    });
  });
});

gulp.task('generate', function(done) {
  inquirer.prompt([
    {type: 'input', name: 'path', message: 'Path (dirname + basename)', default: gulp.args.join('_')},
    {type: 'list', name: 'format', message: 'Choose a script format', choices: ['class', 'module'], default: 'class'},
    {type: 'confirm', name: 'moveon', message: 'OK?'}
  ],

  function(answers) {
    if (!answers.moveon) { return done(); }

    answers.path = answers.path.replace(/^\/+|\/+$/g, '');
    answers.basename = path.basename(answers.path, '.ts');
    answers.dirname = path.dirname(answers.path);
    answers.classifyName = inflection.classify(answers.basename);

    answers.relativeRootDir = path.relative('src/' + answers.dirname, process.cwd()) || '.';

    gulp.src(__dirname + '/templates-generate/**/*-' + answers.format + '.ts')
      .pipe(template(answers))
      .pipe(rename(function (file) {
        file.dirname = path.join(file.dirname, answers.dirname);
        file.basename = file.basename
          .replace('-' + answers.format, '')
          .replace('name', answers.basename);
      }))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('finish', done);
  });
});
