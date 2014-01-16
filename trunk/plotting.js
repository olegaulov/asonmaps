function plot(hits, i, db)
{
	var el = hits[i];
	var anim = ($("#animate").val() == null ? .001 : parseInt($("#animate").val() * .001));
	
	if (el.geo != null && ($("#twitter")[0].checked || $("#both")[0].checked))
	{
		drawtweet(el, db);
	}
	else if (el.location != null && ($("#pictures")[0].checked || $("#both")[0].checked))
	{
		drawpic(el, db);
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

function plotall(hits, db)
{
	hits.forEach(function(el, idx, all)
	{
		if (el.geo != null && ($("#twitter")[0].checked || $("#both")[0].checked))
		{
			drawtweet(el, db);
		}
		else if (el.location != null && ($("#pictures")[0].checked || $("#both")[0].checked))
		{
			drawpic(el, db);
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

function drawtweet(el, db)
{
	centerlat += el.geo.coordinates[0];
	centerlong += el.geo.coordinates[1];

	var day = el.created_at.split(" ")[0].split("-");
	var time = el.created_at.split(" ")[1].split(":");

	var d = new Date(day[0], day[1] - 1, day[2], time[0], time[1], time[2], 0);

	var m = new google.maps.Marker({
		position : new google.maps.LatLng(el.geo.coordinates[0], el.geo.coordinates[1]),
		map : map,
		title : el.text + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "-(" + el.geo.coordinates[0] + "," + el.geo.coordinates[1] + ")",
		icon : 'tweetpin.png'
	});

	m.db = db;
	
	if(el.markup != null)
	{
		m.markup = el.markup;
	}
	points.push(m);
	$("#mediafeed").append("<p id=\"" + el.id_str + "\" onclick=\"recenter(" + (points.length - 1) + ")\"><input type=\"checkbox\" onclick=\"modPoint(" + (points.length - 1) + ")\" />" + el.text + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "</p>\n");

	google.maps.event.addListener(m, 'click', function()
	{						
		$("#divimg").html("<a id=\"popupimg\" data-fancybox-type=\"ajax\" href=\"getbyid.php?db=" + m.db + "&type=tweet&id=" + el.id + "\" rel=\"group\" class=\"fancybox fancybox.ajax\" title=\"" +(el.text != null ? el.text + " - " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "-(" + el.geo.coordinates[0] + "," + el.geo.coordinates[1] + ")": "")+ "\">tweet</a>");
		
		$("#divimg a").click();
		
		$("#mediafeed").scrollTop(0);
		var top = $("#" + el.id_str).position().top;
		$("#mediafeed").scrollTop(top);
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

function drawpic(el, db)
{
	centerlat += el.location.latitude;
	centerlong += el.location.longitude;
	
	var d = new Date(parseInt(el.created_time) * 1000);
	var m = new google.maps.Marker({
		position : new google.maps.LatLng(el.location.latitude, el.location.longitude),
		map : map,
		title : (el.caption != null ? el.caption.text : "") + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "-(" + el.location.latitude + "," + el.location.longitude + ")",
		icon : 'instagrampin.png'
	});
	
	m.db = db;

	if(el.markup != null)
	{
		m.markup = el.markup;
	}
	points.push(m);
	
	$("#mediafeed").append("<p id=\"" + el.id + "\" onclick=\"recenter(" + (points.length - 1) + ")\"><input type=\"checkbox\" onclick=modPoint(" + (points.length - 1) + ")/>" + (el.caption != null ? el.caption.text : "") + " - " + d + " " + (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()) + "</p>\n");
	
	google.maps.event.addListener(m, 'click', function()
	{
		$("#divimg").html("<a id=\"popupimg\" class=\"fancybox\" data-fancybox-type=\"ajax\" href=\"getbyid.php?db=" + m.db + "&type=image&id=" + el.id + "\" rel=\"group\" class=\"fancybox\" title=\"" +(el.caption != null ? el.caption.text + " - " + new Date(parseInt(el.caption.created_time) * 1000) + "-(" + el.location.latitude + "," + el.location.longitude + ")": "")+ "\"></a>");
		$("#divimg a").click();
		
		$("#mediafeed").scrollTop(0);
		var top = $("#" + el.id).position().top;
		$("#mediafeed").scrollTop(top);	
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