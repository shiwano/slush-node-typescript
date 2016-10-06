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

function createIgnoreFileFun(answers) {
  return function(file) {
    if (!answers.karma && file.match(/karma/)) {
      return true;
    }

    if (!answers.gulp && file.match(/gulp/)) {
      return true;
    }

    if (!answers.webpack && file.match(/webpack/)) {
      return true;
    }

    if (!answers.nightwatch && file.match(/nightwatch/)) {
      return true;
    }

    return false;
  }
}

gulp.task('default', function(done) {
  gitConfig(function (err, gitConfig) {
    if (err) { 
      console.log('Abort!', err);
      return done(err);
    }

    license.licenseTypes(function(err, licenseTypes) {
      // Substitute empty values in case configuration isn't specified.
      var user = gitConfig.user ? gitConfig.user : {};
      var github = gitConfig.github ? gitConfig.github : {};

      inquirer.prompt([
        {type: 'input', name: 'name', message: 'Project name', default: gulp.args.join('-')},
        {type: 'input', name: 'description', message: 'Project description', default: 'The best project ever.'},
        {type: 'input', name: 'author_name', message: 'Project author name', default: user.name},
        {type: 'input', name: 'author_email', message: 'Project author name', default: user.email},
        {type: 'input', name: 'github_user_name', message: 'GitHub user name', default: github.user},
        {type: 'list', name: 'licenseType', message: 'Choose your license type', choices: licenseTypes, default: 'mit'},

        {
          type: 'checkbox',
          name: 'taskManagers',
          message: 'Select one or more task managers',
          choices: ['gulp', 'webpack'],
          // select at least 1
          validate: function(input) {
            return input.length > 0;
          },
          default: ['gulp']
        },

        {
          type: 'confirm',
          name: 'nightwatch',
          message: 'Use nightwatch for E2E testing',
          default: false
        },

        {
          type: 'confirm',
          name: 'karma',
          message: 'Use Karma for testing',
          default: false
        },

        {
          type: 'confirm',
          name: 'istanbul',
          message: 'Use Istanbul for test coverage',
          default: false
        },

        {
          type: 'confirm',
          name: 'sinon',
          message: 'Use Sinon to mock server',
          default: false
        },

        {type: 'confirm', name: 'moveon', message: 'OK?', default: true}
      ]).then(function(answers) {
        if (answers.taskManagers.indexOf('webpack') > 0) {
          answers.webpack = true;
        }
        if (answers.taskManagers.indexOf('gulp') > 0) {
          answers.gulp = true;
        }

        if (!answers.moveon) {
          console.log('Aborting...');
          return done();
        }

        answers.year = new Date().getFullYear();

        license.createLicense({
          licenseType: answers.licenseType, 
          year: answers.year, 
          organization: answers.author_name
        },
          function(err, licenseString) {
            if (err) {
              console.log('Aborting: license error');
              return done(err);
            }

            console.log('create license');

            fs.writeFileSync(__dirname + '/templates/LICENSE', licenseString);
            answers.license = answers.licenseType.toUpperCase();

            var ignoreFile = createIgnoreFileFun(answers);

            console.log('create project...');
            gulp.src(__dirname + '/templates/**', {dot: true})
              .pipe(gulpIgnore.exclude(ignoreFile))
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
          } // fun
        );
      });
    });
  });
});

gulp.task('generate', function(done) {
  inquirer.prompt([
    {type: 'input', name: 'path', message: 'Path (dirname + basename)', default: gulp.args.join('_')},
    {type: 'list', name: 'format', message: 'Choose a script format', choices: ['class', 'module'], default: 'class'},
    {type: 'confirm', name: 'moveon', message: 'OK?'}
  ]).then(function(answers) {
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
