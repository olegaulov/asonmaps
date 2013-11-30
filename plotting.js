function plot(hits, i)
{
	var el = hits[i];
	var anim = ($("#animate").val() == null ? .001 : parseInt($("#animate").val() * .001));
	
	if (el.geo != null && ($("#twitter")[0].checked || $("#both")[0].checked))
	{
		drawtweet(el);
	}
	else if (el.location != null && ($("#pictures")[0].checked || $("#both")[0].checked))
	{
		drawpic(el);
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
	hits.forEach(function(el, idx, all)
	{
		if (el.geo != null && ($("#twitter")[0].checked || $("#both")[0].checked))
		{
			drawtweet(el);
		}
		else if (el.location != null && ($("#pictures")[0].checked || $("#both")[0].checked))
		{
			drawpic(el);
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
