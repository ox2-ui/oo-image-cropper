Package.describe({
  name: 'ox2:image-cropper',
  version: '1.1.0',
  // Brief, one-line summary of the package.
  summary: 'DO NOT USE',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: ''
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
      'ox2:modals@3.0.0',
      'simple:imgur@1.0.3',
      'jonblum:jquery-cropper@2.3.0',
      'jquery',

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
