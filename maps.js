var coords = [];
var tweets = []; // stores tweets
var pics = [];
var range = {};
var dates = [];
var downloaderror = false;
var map;

var centerlat = 0;
var centerlong = 0;
var t = 0;
var p = 0;
var tdaterange = {};
var pdaterange = {};
var pid;
var ctaLayer;

google.maps.visualRefresh = true;

google.maps.Map.prototype.markers = new Array();

google.maps.Map.prototype.getMarkers = function()
{
	return this.markers;
};

google.maps.Map.prototype.clearMarkers = function()
{
	for ( var i = 0; i < this.markers.length; i++)
	{
		this.markers[i].setMap(null);
	}
	this.markers = new Array();
};

google.maps.Marker.prototype._setMap = google.maps.Marker.prototype.setMap;

google.maps.Marker.prototype.setMap = function(map)
{
	if (map)
	{
		map.markers[map.markers.length] = this;
	}
	this._setMap(map);
};

function plot(hits, i)
{
	var d = 0;
	
	var el = hits[i];
	var anim = ($("#animate").val() == null ? .001 : parseInt($("#animate").val() * .001));
	
	if (el.geo != null && ($("#twitter")[0].checked || $("#both")[0].checked))
	{
		centerlat += el.geo.coordinates[0];
		centerlong += el.geo.coordinates[1];

		var day = el.created_at.split(" ")[0].split("-");
		var time = el.created_at.split(" ")[1].split(":");

		d = new Date(day[0], day[1] - 1, day[2], time[0], time[1], time[2], 0);

		var m = new google.maps.Marker({
			position : new google.maps.LatLng(el.geo.coordinates[0], el.geo.coordinates[1]),
			map : map,
			title : el.text + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "-(" + el.geo.coordinates[0] + "," + el.geo.coordinates[1] + ")",
			icon : 'tweetpin.png'
		});
		
		$("#mediafeed").append("<p>" + el.text + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "</p>\n");

		google.maps.event.addListener(m, 'click', function(){});
		t++;

		if (tdaterange[d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()] == null)
		{
			tdaterange[d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()] = 1;
		}
		else
		{
			tdaterange[d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()]++;
		}
	}
	else if (el.location != null && ($("#pictures")[0].checked || $("#both")[0].checked))
	{
		centerlat += el.location.latitude;
		centerlong += el.location.longitude;

		d = new Date(parseInt(el.created_time) * 1000);
		var m = new google.maps.Marker({
			position : new google.maps.LatLng(el.location.latitude, el.location.longitude),
			map : map,
			title : (el.caption != null ? el.caption.text : "") + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "-(" + el.location.latitude + "," + el.location.longitude + ")",
			icon : 'instagrampin.png'
		});
		
		$("#mediafeed").append("<p>" + (el.caption != null ? el.caption.text : "") + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "</p>\n");
		
		google.maps.event.addListener(m, 'click', function()
		{
			$("#divimg").html("<a class=\"popupimg\" href=\"" + el.id + ".jpg\" rel=\"group\" class=\"fancybox\"></a>");
			$("#divimg a").html("<img src=\"http://bluegrit.cs.umbc.edu/~oleg2/instagrams/hurricanesandy/" + el.id + ".jpg\" /><p style=\"width:30%\">" + (el.caption != null ? el.caption.text + " - " + new Date(parseInt(el.caption.created_time) * 1000) + "-(" + el.location.latitude + "," + el.location.longitude + ")": "") + "</p>");
			$("#divimg a").click();
		});

		p++;

		if (pdaterange[d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()] == null)
		{
			pdaterange[d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()] = 1;
		}
		else
		{
			pdaterange[d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()]++;
		}
	}
	else
	{
		d = new Date();
	}

	$("#tallies").html("<ul id=\"nums\"></ul>");
	$("#nums").append("<li>tweets: " + t + "</li>");
	$("#nums").append("<li>Tweetdates<ul id=\"tweetdates\"></ul></li>");
	for (var h in tdaterange)
	{
		$("#tweetdates").append("<li>" + h + ": " + tdaterange[h] + "</li>");
	}

	$("#nums").append("<li>pictures: " + p + "</li>");
	$("#nums").append("<li>PicDates<ul id=\"picdates\"></ul></li>");
	for(var h in pdaterange)
	{
		$("#picdates").append("<li>" + h + ": " + pdaterange[h] + "</li>");
	}

	$("#nums").append("<li>total: " + hits.length + "</li>");
		
	if(i < hits.length)
	{
		setTimeout(function(){plot(hits, i + 1);}, anim);
	}
	else
	{		
		if($("#loop")[0].checked)
		{
			$("#pid").html(setTimeout(function(){drawmap(hits);}, anim));
		}
		else
		{
			$("#nums").append("<p>You have reached the end of the requested dataset.</p>");
		}
	}
}

function drawmap(hits)
{
	if (hits != null && hits.length > 0)
	{
		map.clearMarkers(null);
		buildkmz();
		$("#mediafeed").html("");
		p = 0;
		t = 0;
		tdaterange = {};
		pdaterange = {};
		plot(hits, 0);
	}
	else
	{
		alert("no results, try again");
	}
}

function buildkmz()
{	
	var tide = 0;
	var tides = document.getElementsByName("tides");
	
	for(var i = 0; i < tides.length; i++)
	{
		if(tides[i].checked)
		{
			tide = tides[i].value;
		}
	}
	
	var kmz = $("#sloshdir").val() + $("#sloshcat").val() + $("#sloshspeed").val() + "i" + tide;
	ctaLayer = new google.maps.KmlLayer('http://bluegrit.cs.umbc.edu/~adprice1/TweetMine/SLOSH/' + kmz + '.kmz');
	ctaLayer.setMap(map);
}

function filterdata()
{	
	var sd = $("#sdatepicker").val().split("/");
	var ed = $("#edatepicker").val().split("/");
	var st = $('#stime').val().split(":");
	var et = $('#etime').val().split(":");
	var sdate = new Date(sd[2], sd[0] - 1, sd[1], st[0], st[1].split(" ")[0], 0);
	var edate = new Date(ed[2], ed[0] - 1, ed[1], et[0], et[1].split(" ")[0], 0);	
	
	clearTimeout(pid);
	$.ajax({
		url : "getdata.php",
		type : "post",
		data : {
			"dataset" : $("#dataset").val(),
			"twittext" : $("#searchtwitter").val(),
			"pictext" : $("#searchpictures").val(),
			"sdate" : sdate.getTime() / 1000,
			"edate" : edate.getTime() / 1000
		},
		dataType : "json",
		success : function(text)
		{
			coords = [];
			tweets = [];
			pics = [];
			preparse(text);
			dates = mergesort(dates);

			drawmap(pics);
			drawmap(tweets);
		},
		error : function(text)
		{
			alert(text.responseText);
		}
	});
}

function preparse(text)
{
	text.tweets.forEach(function(el, idx, all)
	{
		if (el.geo != null)
		{
			coords.push(el);
			tweets.push(el);

			var d = el.created_at.split(" ")[0].split("-");
			var t = el.created_at.split(" ")[1].split(":");

			var time = new Date(d[0], parseInt(d[1]) - 1, d[2], t[0], t[1], t[2]);
			
			if (range[time.getTime()] == null)
			{
				range[time.getTime()] = 1;
			}
			else
			{
				range[time.getTime()] += 1;
			}
		}
	});

	text.pics.forEach(function(el, idx, all)
	{
		var time = parseInt(el.created_time) * 1000;
		var d = new Date(time);
		coords.push(el);
		pics.push(el);
		var str = d.getTime();
		if (range[str] == null)
		{
			range[str] = 1;
		}
		else
		{
			range[str] += 1;
		}
	});

	for ( var el in range)
	{
		dates.push(new Date(parseInt(el)));
	}
}

function mergesort(m)
{
	if (m.length > 1)
	{
		var left = [];
		var right = [];
		var middle = m.length / 2;

		for ( var x = 0; x < middle; x++)
		{
			left.push(m[x]);
		}
		for ( var x = middle; x < m.length; x++)
		{
			right.push(m[x]);
		}

		left = mergesort(left);
		right = mergesort(right);
		
		var val = $("#progressbar").progressbar( "option", "value" );
		$("#progressbar").progressbar({ value:  val + 1});

		return merge(left, right);
	}
	else
	{
		return m;
	}
}

function merge(left, right)
{
	var result = [];

	while (left.length > 0 || right.length > 0)
	{
		if (left.length > 0 && right.length > 0)
		{
			if (left[0] <= right[0])
			{
				result.push(left[0]);
				left = left.slice(1, left.length);
			}
			else
			{
				result.push(right[0]);
				right = right.slice(1, right.length);
			}
		}
		else if (left.length > 0)
		{
			result.push(left[0]);
			left = left.slice(1, left.length);
		}
		else if (right.length > 0)
		{
			result.push(right[0]);
			right = right.slice(1, right.length);
		}
	}
	return result;
}

function initialize()
{	
	$(document).ready(function()
	{	 
		$.widget( "ui.timespinner", $.ui.spinner, {
			options: {
				// seconds
				step: 60 * 1000,
				// hours
				page: 60
			},
			_parse: function( value ) 
			{
				if(typeof value === "string") 
				{
					// already a timestamp
					if(Number(value) == value) 
					{
						return Number(value);
					}
					return +Globalize.parseDate( value );
				}
				return value;
			},
			_format: function(value) 
			{
				return Globalize.format( new Date(value), "t" );
			}
		});
	
		Globalize.culture("en-EN");
	
		$('.fancybox').fancybox();
		$('#sdatepicker').datepicker({minDate: new Date(2012, 9, 29), maxDate: new Date(2012, 10, 1)});
		$('#edatepicker').datepicker({minDate: new Date(2012, 9, 29), maxDate: new Date(2012, 10, 1)});
		$(".tabs").tabs();
		
		$('#stime').timespinner();
		$('#etime').timespinner();	
		
		$('#stime').val("12:00 AM");
		$('#etime').val("12:00 PM");	
		 
		$("#animate").spinner({max : 20000,	min : 1});		
		$("#sloshcat").spinner({max:5, min:1});		
		$("#sloshspeed").spinner({max:100, min:1});
		
		$("#tabs").tabs();
	});

	var myLatLng = new google.maps.LatLng(40.8, -72.6);

	var mapOptions = {
		zoom : 7,
		center : myLatLng,
		mapTypeId : google.maps.MapTypeId.HYBRID,
		noClear : false
	};

	map = new google.maps.Map(document.getElementById('mapfield'), mapOptions);

	$("#sdatepicker").val("10/29/2012");
	$("#edatepicker").val("10/29/2012");
	
	$("#sloshcat").val("1");
	$("#sloshspeed").val("20");
	$("#animate").val("5000");
	
	$("#progressbar").progressbar({value: 0});
	$("#pid").html(setInterval(function()
	{
		var val = $("#progressbar").progressbar( "option", "value" );
		if(val < 85)
		{
			$("#progressbar").progressbar({ maxValue:100, value:  val + 1});
		}
	}, 100));
	
	var sd = $("#sdatepicker").val().split("/");
	var ed = $("#edatepicker").val().split("/");
	var sdate = new Date(sd[2], sd[0] - 1, sd[1], 0, 0, 0);
	var edate = new Date(ed[2], ed[0] - 1, ed[1], 12, 0, 0);
	
	reveal("tallies");
	
	$.ajax({
		url : "getdata.php",
		type : "post",
		data : {
			start : 0,
			end : 2000,
			sdate : sdate.getTime() / 1000,
			edate : edate.getTime() / 1000
		},
		dataType : "json",
		success : function(text)
		{
			// fill global array
			preparse(text);				
			clearInterval($("#pid").html());
			$("#progressbar").progressbar({ maxValue:100, value:  85});
			dates = mergesort(dates);
			drawmap(pics);
			drawmap(tweets);
		},
		error : function()
		{
			downloaderror = true;
		}
	});	
}

function reveal(id)
{
	if($("#" + id)[0].style.display == "none")
	{
		$("#" + id).slideDown();
	}
	else
	{
		$("#" + id).slideUp();
	}
}