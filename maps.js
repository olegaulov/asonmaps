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

var points = [];

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

function modPoint(p)
{
	if(points[p].getVisible())
	{
		points[p].setVisible(false);
	}
	else
	{
		points[p].setVisible(true);
	}
}

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

		points.push(m);
		$("#mediafeed").append("<p id=\"" + el.id_str + "\"><input type=\"checkbox\" onclick=\"modPoint(" + (points.length - 1) + ")\" />" + el.text + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "</p>\n");

		google.maps.event.addListener(m, 'click', function()
		{
			/*$("#divimg").html("<a id=\"popupimg\" href=\"tweetpin.png\" rel=\"group\" class=\"fancybox\" title=\"" + (el.text + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "-(" + el.geo.coordinates[0] + "," + el.geo.coordinates[1] + ")") + "\"></a>");
			$("#divimg a").html("<img src=\"tweetpin.png\" />");
			$("#divimg a").click();*/	
			
			$("#mediafeed").scrollTop(0);
			var top = $("#" + el.id).position().top;
			$("#mediafeed").scrollTop(top);
			
			/*$(".fancybox-skin")[0].html("<input id=\"poweroutage\" type=\"checkbox\"/>Power Outage");
			$(".fancybox-skin")[0].append("<input id=\"flooding\" type=\"text\" />");
			$(".fancybox-skin")[0].append("<input id=\"crime\" type=\"checkbox\"/>Crime");
			$(".fancybox-skin")[0].append("<input id=\"foodshortage\" type=\"checkbox\"/>Food Shortage");
			$("#flooding").spinner({max : 20,	min : 0});*/	
		});
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
		
		points.push(m);
		
		$("#mediafeed").append("<p id=\"" + el.id + "\"><input type=\"checkbox\" onclick=modPoint(" + (points.length - 1) + ")/>" + (el.caption != null ? el.caption.text : "") + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "</p>\n");
		
		google.maps.event.addListener(m, 'click', function()
		{
			$("#divimg").html("<a id=\"popupimg\" href=\"" + el.id + ".jpg\" rel=\"group\" class=\"fancybox\" title=\"" +(el.caption != null ? el.caption.text + " - " + new Date(parseInt(el.caption.created_time) * 1000) + "-(" + el.location.latitude + "," + el.location.longitude + ")": "")+ "\"></a>");
			$("#divimg a").html("<img src=\"http://bluegrit.cs.umbc.edu/~oleg2/instagrams/hurricanesandy/" + el.id + ".jpg\" />");
			$("#divimg a").click();
			
			$("#mediafeed").scrollTop(0);
			var top = $("#" + el.id_str).position().top;
			$("#mediafeed").scrollTop(top);
			
			/*$(".fancybox-skin")[0].html("<input id=\"poweroutage\" type=\"checkbox\"/>Power Outage");
			$(".fancybox-skin")[0].append("<input id=\"flooding\" type=\"text\" />");
			$(".fancybox-skin")[0].append("<input id=\"crime\" type=\"checkbox\"/>Crime");
			$(".fancybox-skin")[0].append("<input id=\"foodshortage\" type=\"checkbox\"/>Food Shortage");
			$("#flooding").spinner({max : 20,	min : 0});*/		
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

function plotall(hits)
{
	var d = 0;
	hits.forEach(function(el, idx, all)
	{
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

			points.push(m);
			
			$("#mediafeed").append("<p id=\"" + el.id_str + "\"><input type=\"checkbox\" onclick=modPoint(" + (points.length - 1) + ")/>" + el.text + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "</p>\n");
	
			google.maps.event.addListener(m, 'click', function()
			{

				/*$("#divimg").html("<a id=\"popupimg\" href=\"tweetpin.png\" rel=\"group\" class=\"fancybox\" title=\"" + (el.text + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "-(" + el.geo.coordinates[0] + "," + el.geo.coordinates[1] + ")") + "\"></a>");
				$("#divimg a").html("<img src=\"tweetpin.png\" />");
				$("#divimg a").click();*/	
				
				$("#mediafeed").scrollTop(0);
				var top = $("#" + el.id).position().top;
				$("#mediafeed").scrollTop(top);
				
				/*$(".fancybox-skin")[0].html("<input id=\"poweroutage\" type=\"checkbox\"/>Power Outage");
				$(".fancybox-skin")[0].append("<input id=\"flooding\" type=\"text\" />");
				$(".fancybox-skin")[0].append("<input id=\"crime\" type=\"checkbox\"/>Crime");
				$(".fancybox-skin")[0].append("<input id=\"foodshortage\" type=\"checkbox\"/>Food Shortage");
				$("#flooding").spinner({max : 20,	min : 0});*/	
			});
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

			points.push(m);
			$("#mediafeed").append("<p id=\"" + el.id + "\"><input type=\"checkbox\" onclick=modPoint(" + (points.length - 1) + ")/>" + (el.caption != null ? el.caption.text : "") + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "</p>\n");
			
			google.maps.event.addListener(m, 'click', function()
			{
				$("#divimg").html("<a id=\"popupimg\" href=\"" + el.id + ".jpg\" rel=\"group\" class=\"fancybox\" title=\"" +(el.caption != null ? el.caption.text + " - " + new Date(parseInt(el.caption.created_time) * 1000) + "-(" + el.location.latitude + "," + el.location.longitude + ")": "")+ "\"></a>");
				$("#divimg a").html("<img src=\"http://bluegrit.cs.umbc.edu/~oleg2/instagrams/hurricanesandy/" + el.id + ".jpg\" />");
				$("#divimg a").click();
				
				$("#mediafeed").scrollTop(0);
				var top = $("#" + el.id_str).position().top;
				$("#mediafeed").scrollTop(top);
				
				/*$(".fancybox-skin")[0].html("<input id=\"poweroutage\" type=\"checkbox\"/>Power Outage");
				$(".fancybox-skin")[0].append("<input id=\"flooding\" type=\"text\" />");
				$(".fancybox-skin")[0].append("<input id=\"crime\" type=\"checkbox\"/>Crime");
				$(".fancybox-skin")[0].append("<input id=\"foodshortage\" type=\"checkbox\"/>Food Shortage");
				$("#flooding").spinner({max : 20,	min : 0});*/		
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
	});
	
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
}

function drawmap(hits)
{
	if (hits != null && hits.length > 0)
	{
		$("#mediafeed").html("");
		p = 0;
		t = 0;
		tdaterange = {};
		pdaterange = {};
		points = [];
		if(parseInt($("#animate").val()) > 0)
		{
			plot(hits, 0);
		}
		else
		{
			plotall(hits);
		}
	}
	else
	{
		alert("no results, try again");
	}
}

function buildkmz()
{	
	if($("#psurge")[0].style.display == "none")
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
	else
	{
		//sandy_Adv25_2012102812_gt6_1.kmz
		var date = $("#surgedate").val();
		var num = $("#hour").val();
		var kmz = "sandy_" + $("#advisory").val() + date + num + $("#height").val() + "_1.kmz";
		ctaLayer = new google.maps.KmlLayer('http://bluegrit.cs.umbc.edu/~adprice1/TweetMine/SLOSH/' + kmz + '.kmz');
		ctaLayer.setMap(map);
	}	
}

function parsetime(t)
{
	var h = parseInt(t.split(":")[0]);
	var m = parseInt(t.split(":")[1].split(" ")[0]);
	
	h += (t.split(":")[1].split(" ")[1] == "PM" ? 12 : 0);
	
	if(h == 24 && t.split(":")[1].split(" ")[1] == "PM")
	{
		h = 12;
	}
	else if(h == 12 && t.split(":")[1].split(" ")[1] == "AM")
	{
		h = 0;
	}
	
	return [h, m];
}

function filterdata()
{	
	var sd = $("#sdatepicker").val().split("/");
	var ed = $("#edatepicker").val().split("/");
	
	var st = parsetime($('#stime').val());
	var et = parsetime($('#etime').val());	
	
	var sdate = new Date(sd[2], sd[0] - 1, sd[1], st[0], st[1], 0);
	var edate = new Date(ed[2], ed[0] - 1, ed[1], et[0], et[1], 0);	
	
	clearTimeout(pid);
	$.ajax({
		url : "getdata.php",
		type : "post",
		data : {
			"dataset" : $("#dataset").val(),
			"twittext" : $("#tweetsearch").val(),
			"pictext" : $("#picsearch").val(),
			"sdate" : sdate.getTime() / 1000,
			"edate" : edate.getTime() / 1000,
			"start": 0,
			"end": 2000
		},
		dataType : "json",
		success : function(text)
		{
			coords = [];
			tweets = [];
			pics = [];
			preparse(text);
			dates = mergesort(dates);
			map.clearMarkers(null);
			buildkmz();

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
	
		$('.fancybox').fancybox({
			maxWidth	: 800,
			maxHeight	: 600,
			helpers: {
				title	: {
					type: 'outside'
				}
			}
		});
		
		$('#sdatepicker').datepicker({minDate: new Date(2012, 9, 29), maxDate: new Date(2012, 10, 1)});
		$('#edatepicker').datepicker({minDate: new Date(2012, 9, 29), maxDate: new Date(2012, 10, 1)});
		$('#surgedate').datepicker({minDate: new Date(2012, 9, 29), maxDate: new Date(2012, 10, 1)});
		
		$(".tabs").tabs();
		
		$('#stime').timespinner();
		$('#etime').timespinner();	
		
		$('#stime').val("12:00 AM");
		$('#etime').val("12:00 PM");	
		 
		$("#animate").spinner({max : 20000,	min : 0});		
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
			
			map.clearMarkers(null);
			buildkmz();
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