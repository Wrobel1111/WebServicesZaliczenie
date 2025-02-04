function getKey(map, val)
{
	return [...map].find(([key, value]) => val === value)[0];
}

async function addItem(...args)
{
	var map1 = new Map();
	const response = await fetch(`http://192.168.1.12:3000/filter?var=kraje`);
	if (!response.ok)
	{
		window.location.href = `http://http.cat/images/${response.status}.jpg`;
	}
	else
	{
		var json = await response.json();
		json.forEach(option =>
		{
			map1.set(option._id, option.Kraj);
		})
		try
		{
			map1.get(args[0]);
			map1.get(args[1]);
		}
		catch (error)
		{
			alert("Nie znaleziono kraju");
			return
		}
		
	}
	console.log(args);
	fetch("http://192.168.1.12:3000/newgame",
	{
		method: "POST",
		body: JSON.stringify(args),
		headers:
		{
			"Content-type": "application/json; charset=UTF-8"
		}
	});
}