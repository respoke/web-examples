/*
 * # grunt-jsdoxy
 * 
 * forked from Matt McManus grunt-dox https://github.com/punkave/grunt-dox
 * 
 * Licensed under the MIT license.
 */

var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    jade = require('jade'),
    async = require('async');


module.exports = function(grunt) {

  grunt.registerMultiTask('jsdoxy', 'Generate jsdoxy output ', function() {

    var dir = this.filesSrc,
        dest = this.data.dest,
        done = this.async(),
        doxPath = path.resolve(__dirname,'../'),
        _opts = this.options(),
        _args = [],
        outputFile = _opts.jsonOutput || "jsdoxy-output.json";

    // Absolute path to jsdoxy
    var jsdoxy = [doxPath, 'bin', 'jsdoxy'].join(path.sep);

    // Cleanup any existing docs
    rimraf.sync(dest);

    var executeFiles = [];
    var output = [];

    dir.forEach(function(file) {
      executeFiles.push(function(cb){

        var outputFilepath = path.join(dest, file + ".json");

        // the exec'd process seems to not have proper permissions to write, 
        // unless the file exists already
        grunt.file.write(outputFilepath, " ");

        // capture the outputted file
        exec(
          jsdoxy + ' < ' + file + " > " + outputFilepath, 
          {maxBuffer: 5000*1024}, 
          function(error, stout, sterr) {
            if (error) { 
              grunt.log.error("jsdoxy ERROR:  "+ error + "\n" + error.stack);
              cb(err); 
            }
            if (!error) {
              grunt.log.ok( file + '" got doxxed, yo!');

              var fileJson = grunt.file.readJSON(outputFilepath);

              fileJson.forEach(function(comment) {
                if(!comment.ctx) comment.ctx = {};

                comment.ctx.file = {
                  input: file,
                  output: outputFilepath
                };
              });

              // then rewrite it with the most recent details
              grunt.file.write(outputFilepath, JSON.stringify(fileJson, null, 4));

              output = output.concat( fileJson );
              cb();
            }
        });
      });
    });

    async.series(executeFiles, function(err) {
      if(err) return;

          
      var organizedByClass = {};
      var lastClassnameWas = "";


      // comments.forEach, really
      output.forEach(function(comment) {
      
      // 
      // Important:
      // the `@class SomeClass` comment should always be in the first comment.
      // 

        comment.tags.forEach(function(tag) {

          if(tag.type == "class")
          {
            if(comment.isPrivate && !_opts.outputPrivate)
            {
              // do not include the private comments unless specified
            }
            else{
              lastClassnameWas = tag.string;
              organizedByClass[lastClassnameWas] = [];
              comment.ctx.name = lastClassnameWas;
            }
          }

        });

        if(!lastClassnameWas) return;

        organizedByClass[lastClassnameWas].push(comment);


      });

      grunt.file.write(outputFile, JSON.stringify(organizedByClass, null, 4));
      grunt.log.ok(
        "Organized docs into " 
        + Object.keys(organizedByClass).length 
        + " classes and wrote to " + outputFile
      );

      if(!_opts.template) return done();

      grunt.log.ok('Jadifying the output using ' + _opts.template);

      Object.keys(organizedByClass).forEach(function(classKey) {
        var thisClassDocs = organizedByClass[classKey];

        var classCommentLink;

        thisClassDocs.forEach(function(comment){
          comment.tags.forEach(function(tag){
            if(tag.type === "link") classCommentLink = tag.string;

            if(classCommentLink) return false;
          });
          if(classCommentLink) return false;
        });

        var jadeLocals = {
          structure:  organizedByClass,
          comments:   thisClassDocs,
          className:  classKey,
          link: classCommentLink
        };

        var html = jade.renderFile(_opts.template, jadeLocals );

        grunt.file.write(path.join(dest, jadeLocals.className + ".html"), html);

      });


      done();
    });
      

  });

};