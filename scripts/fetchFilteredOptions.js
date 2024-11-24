async function FetchFilteredOptions(selectedFilter)
{
		switch (key)
		{
			case "Kraj":
				const response = await fetch(`http://192.168.1.12:3000/filter?var=${selectedFilter.value}`);
				if (!response.ok)
				{
					window.location.href = `http://http.cat/images/${response.status}.jpg`;
				}
				else
				{
					var newSelect = document.createElement("select");
					var newSelectLabel = document.createElement("label");
					newSelectLabel.for = "filtr-kraje"
					newSelectLabel.innerText = "Który kraj?";
					newSelect.id = "filtr-kraje";
					document.getElementById("etap2-wyszukiwania").appendChild(newSelectLabel);
					document.getElementById("etap2-wyszukiwania").appendChild(document.createElement("br"));
					document.getElementById("etap2-wyszukiwania").appendChild(newSelect);
					const json = await response.json();
					json.forEach(option =>
					{
						const newOption = document.createElement("option");
						newOption.value = option.Kraj;
						newOption.innerHTML = option.Kraj;
						document.getElementById("filtr-kraje").appendChild(newOption);
					});
				}
				break;
			
			case "Data":
				
				break;
			default:
				break;
		}
}