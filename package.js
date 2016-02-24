Package.describe({
  name: 'ox2:image-cropper',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'DO NOT USE',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/ox2/oo-image-cropper',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

var C = 'client';
var S = 'server';
var CS = [C, S];

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');
    // Core
    api.use([
      'templating',
      'ecmascript',
      'mongo',
    ]);
    // 3rd party
    api.use([
      'less',
      'mquandalle:jade@0.4.9',
      'ox2:modals@2.2.0',
      'simple:imgur@1.0.3',
      'jonblum:jquery-cropper@2.0.1',
      'jquery@1.11.5-beta.11',

    ]);
    api.addFiles('lib/oo-image-cropper.jade', C);
    api.addFiles('lib/oo-image-cropper.less', C);
    api.addFiles('lib/oo-image-cropper.js', C);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('ox2:image-cropper');
  api.addFiles('tests/package-tests.js');
});
