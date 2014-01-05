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

function drawmap(hits, db)
{
	if (hits != null && hits.length > 0)
	{
		p = 0;
		t = 0;
		tdaterange = {};
		pdaterange = {};
		points = [];
		if (parseInt($("#animate").val()) > 0)
		{
			plot(hits, 0, db);
		}
		else
		{
			plotall(hits, db);
		}
	}
	else
	{
		alert("no results, try again");
	}
}

function buildkmz()
{
	if ($("#psurge")[0].style.display == "none")
	{
		var tide = 0;
		var tides = document.getElementsByName("tides");

		for ( var i = 0; i < tides.length; i++)
		{
			if (tides[i].checked)
			{
				tide = tides[i].value;
			}
		}

		var kmz = $("#sloshdir").val() + $("#sloshcat").val() + $("#sloshspeed")
				.val() + "i" + tide;
		ctaLayer = new google.maps.KmlLayer('http://bluegrit.cs.umbc.edu/~adprice1/asonmaps/SLOSH/' + kmz + '.kmz');
		ctaLayer.setMap(map);
	}
	else
	{
		// sandy_Adv25_2012102812_gt6_1.kmz
		var date = $("#surgedate").val();
		var num = $("#hour").val();
		var kmz = "sandy_" + $("#advisory").val() + date + num + $("#height")
				.val() + "_1.kmz";
		ctaLayer = new google.maps.KmlLayer('http://bluegrit.cs.umbc.edu/~adprice1/asonmaps/SLOSH/' + kmz + '.kmz');
		ctaLayer.setMap(map);
	}
}

function parsetime(t)
{
	var h = parseInt(t.split(":")[0]);
	var m = parseInt(t.split(":")[1].split(" ")[0]);

	h += (t.split(":")[1].split(" ")[1] == "PM" ? 12 : 0);

	if (h == 24 && t.split(":")[1].split(" ")[1] == "PM")
	{
		h = 12;
	}
	else if (h == 12 && t.split(":")[1].split(" ")[1] == "AM")
	{
		h = 0;
	}

	return [ h, m
	];
}

function filterdata()
{
	var sd = $("#sdatepicker").val().split("/");
	var ed = $("#edatepicker").val().split("/");

	var st = parsetime($('#stime').val());
	var et = parsetime($('#etime').val());

	var sdate = new Date(sd[2], sd[0] - 1, sd[1], st[0], st[1], 0);
	var edate = new Date(ed[2], ed[0] - 1, ed[1], et[0], et[1], 0);
	
	var t = $("#tweetdata").val();
	var p = $("#instagramdata").val();
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
			"start" : 0,
			"end" : 2000,
			"dbs" : [t, p]//"twittersandy", "instagramsandy"]
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

			$("#mediafeed").html("");
			drawmap(pics, p);
			drawmap(tweets, t);

			if ($("#mpoweroutageon")[0].checked || $("#mpoweroutageoff")[0].checked || $("#mflooding")[0].checked || $("#mcrime")[0].checked || $("#mcrimectl")[0].checked || $("#mcrimetrue")[0].checked || $("#mcrimefalse")[0].checked || $("#mfoodshortage")[0].checked || $("#mfoodctl")[0].checked || $("#mfoodtrue")[0].checked || $("#mfoodfalse")[0].checked)
			{
				map.markers.forEach(function(el, idx, all)
				{
					if (el.markup12 != null)
					{
						el.setVisible(el.markup12.poweroutageon == $("#mpoweroutageon")[0].checked) || (el.markup12.poweroutageoff == $("#mpoweroutageoff")[0].checked);
														
						if(el.markup12.flooding == $("#mflooding")[0].checked)
						{
							el.setVisible(el.markup12.feet <= parseInt($("#mfeet").val()));
						}
						else
						{
							el.setVisible(false);
						}
						
						if(el.markup12.crime == $("#mcrime")[0].checked)
						{
							el.setVisible($("#mcrimetrue")[0].checked);
							el.setVisible(!$("#mcrimefalse")[0].checked);
						}
						else
						{
							el.setVisible(false);
						}
						
						if($("#mfoodshortage")[0].checked)
						{								
							el.setVisible($("#mfoodtrue")[0].checked);
							el.setVisible(!$("#mfoodfalse")[0].checked);
						}
						else
						{
							el.setVisible(false);
						}								
					}
					else
					{
						el.setVisible(false);
					}
				});
			}
		},
		error : function(text)
		{
			alert(text.responseText);
		}
	});
}

function preparse(text)
{
	text.tweets
			.forEach(function(el, idx, all)
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

function initialize()
{
	$(document).ready(function()
	{
		$.widget("ui.timespinner", $.ui.spinner, {
			options : {
				// seconds
				step : 60 * 1000,
				// hours
				page : 60
			},
			_parse : function(value)
			{
				if (typeof value === "string")
				{
					// already a timestamp
					if (Number(value) == value)
					{
						return Number(value);
					}
					return +Globalize.parseDate(value);
				}
				return value;
			},
			_format : function(value)
			{
				return Globalize.format(new Date(value), "t");
			}
		});

		Globalize.culture("en-EN");

		$('.fancybox').fancybox({
			helpers : {
				title : {
					type : 'outside'
				}
			},
			minWidth : 600,
			height : "auto"
		});

		$('#sdatepicker').datepicker({
			minDate : new Date(2012, 9, 29),
			maxDate : new Date(2012, 10, 1)
		});
		$('#edatepicker').datepicker({
			minDate : new Date(2012, 9, 29),
			maxDate : new Date(2012, 10, 1)
		});
		$('#surgedate').datepicker({
			minDate : new Date(2012, 9, 29),
			maxDate : new Date(2012, 10, 1)
		});

		$(".tabs").tabs();

		$('#stime').timespinner();
		$('#etime').timespinner();

		$('#stime').val("12:00 AM");
		$('#etime').val("12:00 PM");

		$("#animate").spinner({
			max : 20000,
			min : 0
		});
		$("#sloshcat").spinner({
			max : 5,
			min : 1
		});
		$("#sloshspeed").spinner({
			max : 100,
			min : 1
		});
		$('#mfeet').spinner({
			max : 20,
			min : -1
		});

		$("#accordion").accordion();
		
		$("#lat").spinner({
			max:90.0, 
			min:-90.0, 
			step: 0.01,
			numberFormat: "n"
		});

		$("#long").spinner({
			max:180, 
			min:-180, 
			step: 0.01,
			numberFormat: "n"
		});
	});

	var myLatLng = new google.maps.LatLng(parseInt($("#lat").val()), parseInt($("#long").val()));

	var mapOptions = {
		zoom : 7,
		center : myLatLng,
		mapTypeId : google.maps.MapTypeId.HYBRID,
		noClear : false
	};

	map = new google.maps.Map(document.getElementById('mapfield'), mapOptions);

	$("#sloshcat").val("1");
	$("#sloshspeed").val("20");
	$("#animate").val(0);

	$("#progressbar").progressbar({
		value : 0
	});
	$("#pid").html(setInterval(function()
	{
		var val = $("#progressbar").progressbar("option", "value");
		if (val < 85)
		{
			$("#progressbar").progressbar({
				maxValue : 100,
				value : val + 1
			});
		}
	}, 100));

	var sd = $("#sdatepicker").val().split("/");
	var ed = $("#edatepicker").val().split("/");
	var sdate = new Date(sd[2], sd[0] - 1, sd[1], 0, 0, 0);
	var edate = new Date(ed[2], ed[0] - 1, ed[1], 12, 0, 0);

	reveal("tallies");
	var t = $("#tweetdata").val();
	var p = $("#instagramdata").val();
	
	$.ajax({
		url : "getdata.php",
		type : "post",
		data : {
			start : 0,
			end : 2000,
			sdate : sdate.getTime() / 1000,
			edate : edate.getTime() / 1000,
			"dbs" : [t, p]//"twittersandy", "instagramsandy"]
		},
		dataType : "json",
		success : function(text)
		{
			// fill global array
			preparse(text);
			clearInterval($("#pid").html());
			$("#progressbar").progressbar({
				maxValue : 100,
				value : 85
			});
			dates = mergesort(dates);

			map.clearMarkers(null);
			buildkmz();
			drawmap(pics, p);
			drawmap(tweets, t);
		},
		error : function(text)
		{
			downloaderror = true;
		}
	});
}

function senddata(db, tbl, id)
{
	var mymarkup = {
		poweroutageon : $("#poweroutageon")[0].checked,
		poweroutageoff : $("#poweroutageoff")[0].checked,
		poweroutageunk : $("#poweroutage")[0].checked,

		flooding : $("#flooding")[0].checked,
		feet : ($("#feet").val() == "" ? 0 : $("#feet").val()),

		crimetrue : $("#crimetrue")[0].checked,
		crimefalse : $("#crimefalse")[0].checked,
		crimenull : $("#crime")[0].checked,

		foodtrue : $("#foodtrue")[0].checked,
		foodfalse : $("#foodfalse")[0].checked,
		foodnull : $("#foodshortage")[0].checked
	};

	// http://intel03:9200/instagramsandy/instagram/312636592261404799_198195485/_update
	// -d "{script:\"ctx._source.markup12 = {\\\"poweroutageon\\\":false,
	// \\\"poweroutageoff\\\":false, \\\"flooding\\\":false, \\\"feet\\\":0,
	// \\\"crime\\\":false, \\\"foodshortage\\\":true}\"}"
	$.ajax({
		url : "markup.php",
		type : "POST",
		data : {
			index : db,
			item : tbl,
			record : id,
			markup : mymarkup
		},
		success: function(text)
		{
			$.fancybox.close();
		},
		failure: function(text)
		{
			alert(test.responseTest);
		}
	});
}
