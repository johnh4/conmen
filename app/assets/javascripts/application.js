// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require angular
//= require jquery_ujs
//= require foundation
//= require main
//= require_tree ./controllers
//= require_tree ./directives
//= require_tree ./services
//= require_tree ./filters
//= require_tree ./jvector_map
$(function(){
	console.log('in app js.');
	/*
	var source = new EventSource('home/events');

	source.addEventListener('message', function(e){
		console.log('e false changed again', e);
		var tweet = $.parseJSON(e.data);
		
		console.log('tweet', tweet);
		$('#tweets').append($('<li>').text(tweet.text));
	});
	*/
});

$(function(){ $(document).foundation(); });
