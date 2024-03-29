// catch simple errors
"use strict";

// declare splat-app namespace, if it doesn't already exist
var splat = splat || {};

splat.utils = {

    // Asynchronously load templates located in separate .html files using
    // jQuery "deferred" mechanism, an implementation of Promises.  Note we
    // depend on template file names matching corresponding View file names,
    // e.g. Home.html and home.js which defines Backbone View "Home".
    /*
     * @param {[String]} views:  filenames of templates to be loaded
     * @param {function} callback:  callback function invoked when file is loaded
     */
    loadTemplates: function(views, callback) {

	// Array of deferred actions to keep track of template load status
        var deferreds = [];

	// Process each template-file in views array
        /*
         * @param {[integer]} index:  position of view template within views array
         * @param {[String]} view:  root name (w/o .html) of view template file
         */
        $.each(views, function(index, view) {

	    // If an associated Backbone view is defined, set its template function
            if (splat[view]) {
		// Push task of retrieving template file into deferred array.
		// Task performs "get" request to load the template, then passes
		// resulting template data to anonymous function to process it.
	        /*
	         * @param {String} data:  HTML from template file as String
	         */
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
	    	    // Set template function on associated Backbone view.
                    splat[view].prototype.template = _.template(data);
                }));

	    // No Backbone view file is defined; cannot set template function.
            } else {
                //console.log(view + " not found");
                console.log("view");
                console.log(view);
                console.log("not found");
            }
        });

	// When all deferred template-loads have completed,
	// invoke callback function.
        $.when.apply(null, deferreds).done(callback);
    },

    passValidation: function(inputId){
        var tagControl;
        //get error msg element for given inputId
        var tagError = document.getElementById("error-msg-" + inputId);
        tagError.innerHTML = ""; //clear error msg
        tagControl = document.getElementById("control-" + inputId);
        tagControl.className = "form-group";

    },

    failValidation: function(inputId, msg){
        var tagControl;
        //get error msg element for given inputId
        var tagError = document.getElementById("error-msg-" + inputId);

        tagControl = document.getElementById("control-" + inputId);
        tagControl.className = tagControl.className + " has-error"; //add error class
        tagError.innerHTML = msg; //set error msg
    },


    /* code for notification panel */
    showNotice: function(alertType, msg){
        if (alertType == 'warning'){
            $(".alert").html("<Strong>Error:</Strong>" + msg).addClass("alert-warning").show();
        } else if (alertType == 'info'){
            $(".alert").html("<Strosng>Notice:</Strosng>" + msg).addClass("alert-info").show();
        } else if (alertType == 'succ'){
            $(".alert").html("<Strong>Successful:</Strong>" + msg).addClass("alert-success").show();
        }
        $(".alert").fadeOut(5000);
        window.setTimeout(function() {
            $(".alert").fadeOut(5000).slideUp(500, function(){
                $(this).hide();
            });
        }, 3000);
    },

    hideNotice: function(){
        $(".alert").html("").removeClass("alert-warning alert-success alert-info").hide();
    },

    // Resize sourceImg, returning result as a DataURL value. Type,
    // quality are optional params for image-type and quality setting
    resize: function(sourceImg, type, quality) {
        var type = type || "image/jpeg"; // default MIME image type
        var quality = quality || "0.95"; // tradeoff quality vs size
        var image = new Image(), MAX_HEIGHT = 300, MAX_WIDTH = 450;
        image.src = sourceImg;
        image.height *= MAX_HEIGHT / image.height; // scale height
        image.width *= MAX_WIDTH / image.width; // scale height
        var canvas = document.createElement("canvas");
        canvas.width = image.width; // scale canvas to match image
        canvas.height = image.height;
        var ctx = canvas.getContext("2d"); // get 2D rendering context
        ctx.drawImage(image,0,0, image.width, image.height); // render
        return canvas.toDataURL(type, quality);
    }

};
