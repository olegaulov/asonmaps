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

function showdiv(id)
{
    if($("#" + id)[0].style.display == "none")
    {
            $("#" + id).show();
    }
    else
    {
            $("#" + id).hide();
    }
}