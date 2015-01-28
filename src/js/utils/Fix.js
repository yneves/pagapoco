/*
 * This file is used for patching some javascript defficiencys
 *
 */

// Added the property .name on objects if they do not exists ( < IE9 )
// #ref http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript

// *** WARNING ***
// It's important to note that any techniques that inspect the object's constructor method (either with .toString() or .name)
// will fail to work if your Javascript has been minified with a tool like uglify, or the Rails asset pipeline.
// The minification renames the constructor, so you will end up with incorrect class names like n. If you're in this scenario,
// you may want to just manually define a className property on your objects and use that instead.

if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec((this).toString());
            return (results && results.length > 1) ? results[1].trim() : "";
        },
        set: function(value) {}
    });
}
