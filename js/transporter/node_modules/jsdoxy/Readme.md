# jsdoxy

A [jsdoc-ish](http://usejsdoc.org) documentation generator forked from [visionmedia/dox](https://github.com/visionmedia/dox).

### Differences from visionmedia/dox

* Allows multiline tag comments.
* Supports code context on string key properties like `someobject['asdf']`.
* Handles a few more tags.
* Code context for `@event`.
* Dumped the deprecated [github-flavored-markdown](https://github.com/isaacs/github-flavored-markdown) for [marked](https://github.com/chjj/marked).
* Includes a **grunt plugin** `jsdoxy`. 
	* Comments are organized into a plain object with the `@class MyClass` tag as the key.
	* Optionally renders the JSON output using [Jade](http://jade-lang.com).

# Usage

## Globally

One file at a time.

	npm install -g jsdoxy

You can do this from the terminal

	$>  jsdoxy --help

	  Usage: jsdoxy [options]

	  Options:

	    -h, --help     output usage information
	    -V, --version  output the version number
	    -r, --raw      output "raw" comments, leaving the markdown intact
	    -a, --api      output markdown readme documentation
	    -d, --debug    output parsed comments for debugging

	  Examples:

	    # stdin
	    $ jsdoxy > myfile.json

	    # operates over stdio
	    $ jsdoxy < myfile.js > myfile.json


## Grunt plugin

Multiple files at a time, organizing the output by the `@class` tag, optionally rendered using a jade template.

Install the package to your project with NPM

	npm install jsdoxy --save-dev

then in your source code, the `@class` tag should **always** be part of the first comment
	
	/**
	 * A class that does something.
	 * @class MyClass
	 * @param object opts Some parameters to get you started.
	 */
	function MyClass (opts) {
		. . .
	}

then inside `Gruntfile.js` at the project root

    grunt.loadNpmTasks('jsdoxy');

    grunt.initConfig({
		jsdoxy: {
            options: {
            	jsonOutput: 'jsdoxy-output.json', // default, not optional
            	outputPrivate: false, // default indicating whether to output private **classes**
                template: 'your-template.jade' // optional, to allow generation of html
            },
            files: {
                src: [ . . . ],
                dest: '. . .'
            }
        },
	});

yields `jsdoxy-output.json`
	
	{
		"MyClass": {
	        "tags": [
	            {
	                "type": "class",
	                "string": "MyClass"
	            },
	            {
	                "type": "param",
	                "types": [
	                    "object"
	                ],
	                "name": "opts",
	                "description": "Some parameters to get you started."
	            }
	         ],
	         "description": {
	           "full": "A class that does something.",
	           "summary": "A class that does something."
	        },
	        "isPrivate": false,
	        "ignore": false,
	        "code": "function MyClass(opts) { . . . }",
	        "ctx": {
	            "type": "declaration",
	            "name": "MyClass",
	            "string": "idk what goes here",
	            "file": {
	            	"input": "./input/file/path/file.js",
	            	"output": "./output/file/path/file.js.json"
	            }
	        }
	    }
	}

### your Jade template

The jade template will receive the following locals

	var jadeLocals = {
      structure:  organizedByClass,
      comments:   thisClassDocs,
      className:  classKey,
      link: classCommentLink
    };


# License

MIT
