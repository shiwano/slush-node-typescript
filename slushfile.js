var gulp = require('gulp'),
    fs = require('fs'),
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
            .pipe(rename(function (path) {
              path.basename = path.basename
                .replace(/^dot/, '')
                .replace('name', answers.name);
            }))
            .pipe(conflict('./'))
            .pipe(gulp.dest('./'))
            .pipe(install())
            .on('finish', function() {
              done();
            });
        });
      });
    });
  });
});
