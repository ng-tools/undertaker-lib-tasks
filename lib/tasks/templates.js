'use strict';

var util = require('util');
var DefaultRegistry = require('undertaker-registry');
var vfs = require('vinyl-fs');
var resolveRequire = require('resolve-require');
var _ = require('lodash');

function TemplatesRegistry() {

  DefaultRegistry.call(this);

  this.set('ng:src/templates', function() {

    // Lazy load expensive modules
    var factory = resolveRequire('factory-' + this.factory);
    var reload = require('browser-sync').reload;

    var paths = this.paths;
    return vfs.src(paths.templates, {cwd: paths.cwd, base: paths.cwd})
      .pipe(factory.views.src.bind(this)())
      .pipe(reload({stream: true}));

  });

  this.set('ng:dist/templates', function() {

    // Lazy load expensive modules
    var factory = resolveRequire('factory-' + this.factory);

    var paths = this.paths;
    return vfs.src(paths.templates, {cwd: paths.cwd, base: paths.cwd})
      .pipe(factory.views.dist.bind(this)());

  });

  this.set('ng:test/templates', function() {

    // Lazy load expensive modules
    var factory = resolveRequire('factory-' + this.factory);

    var paths = this.paths;
    return vfs.src(paths.templates, {cwd: paths.cwd, base: paths.cwd})
      .pipe(factory.views.dist.bind(this)({dest: paths.tmp}));

  });

}

util.inherits(TemplatesRegistry, DefaultRegistry);

module.exports = TemplatesRegistry;
