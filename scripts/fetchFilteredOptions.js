async function FetchFilteredOptions(selectedFilter)
{
	switch (selectedFilter.value)
	{
		case "kraj":
			const response = await fetch(`http://192.168.1.12:3000/filter?var=kraje`);
			if (!response.ok)
			{
				window.location.href = `http://http.cat/images/${response.status}.jpg`;
			}
			else
			{
				var map1 = new Map();
				var newSelect = document.createElement("select");
				var newSelectLabel = document.createElement("label");
				newSelectLabel.for = "filtr-kraje"
				newSelectLabel.innerText = "Który kraj?";
				newSelect.id = "filtr-kraje";
				var newConfirmButton = document.createElement("button");
				newConfirmButton.id = "filtr-kraje-potwierdz";
				newConfirmButton.innerText = "Potwierdź";
				document.getElementById("etap2-wyszukiwania").appendChild(newSelectLabel);
				document.getElementById("etap2-wyszukiwania").appendChild(document.createElement("br"));
				document.getElementById("etap2-wyszukiwania").appendChild(newSelect);
				const json = await response.json();
				json.forEach(option =>
				{
					map1.set(option._id, option.Kraj);
					const newOption = document.createElement("option");
					newOption.value = option.Kraj;
					newOption.innerHTML = option.Kraj;
					document.getElementById("filtr-kraje").appendChild(newOption);
				});
				document.getElementById("etap2-wyszukiwania").appendChild(newConfirmButton);
				document.getElementById("filtr-kraje-potwierdz").addEventListener("click", async (e) =>
				{
					var country = document.getElementById("filtr-kraje").value;
					const response2 = await fetch(`http://192.168.1.12:3000/filter?var=kraj&value=${country}`);
					if (!response2.ok)
					{
						window.location.href = `http://http.cat/images/${response2.status}.jpg`;
					}
					else
					{
						var resultContainer = document.createElement("div");
						resultContainer.id = "etap2-wyszukiwania-wyniki";
						document.getElementById("etap2-wyszukiwania").appendChild(resultContainer);
						//var disclaimer = document.createElement("p");
						//disclaimer.innerText = "Uwaga: każdy mecz ma znacznie więcej informacji, niż jest wyświetlone. Aby zobaczyć wszystkie, wciśnij przycisk \"Zobacz więcej\" dla danego meczu.";
						//document.getElementById("etap2-wyszukiwania").appendChild(disclaimer);
						const json2 = await response2.json(); //This json contains 2 parts, depending whether the team was hosts or guests
						var idCounter = 0;
						json2.result2Part1.forEach(element =>
						{
							var newGame = document.createElement("div");
							newGame.innerHTML =
							`<p>Data: ${element.Data}</p>
							<p>Gospodarz: ${map1.get(element['Drużyna 1'])}</p>
							<p>Gość: ${map1.get(element['Drużyna 2'])}</p>
							<p>Kategoria: ${element.Kategoria}</p>
							<p>Wynik: ${element['Liczba goli drużyna 1']}:${element['Liczba goli drużyna 2']}</p>
							<br><br>
							`
							document.getElementById("etap2-wyszukiwania-wyniki").appendChild(newGame);
							idCounter += 1;
						})

					}
				})
			}
			break;
		
		case "data":
			var calendarString = 
			`<div class="container" id="container">
  				<div class="calendar">
  					<header>
  						<div class="header-display">
							<pre class="left" style="float:left">◀</pre>
							<pre class="right" style="float:right">▶</pre>
							<span class="display" style="margin: 0 auto; display:table">""</span>
  						</div>
  					</header>
  				<div class="week">
  					<div>Pon</div>
  					<div>Wto</div>
  					<div>Śro</div>
  					<div>Czw</div>
  					<div>Pią</div>
  					<div>Sob</div>
					<div>Nie</div>
  				</div>
  				<div class="days">
  					<!--days will be filled here-->
  				</div>
  				</div>
  					<div class="display-selected">
  						<p class="selected"></p>
  					</div>
				</div>`;
			document.getElementById("etap2-wyszukiwania").innerHTML = calendarString;
			let display = document.querySelector(".display");
			let previous = document.querySelector(".left");
			let next = document.querySelector(".right");
			let days = document.querySelector(".days");
			let selected = document.querySelector(".selected");
			let date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth();
			let formattedDate = date.toLocaleString("pl-PL",
			{
				month: "long",
				year: "numeric",
			});
			var tempChosenDate;

			display.innerHTML = `${formattedDate}`;

			function DisplayCalendar()
			{
				let formattedDate = date.toLocaleString("pl-PL",
					{
						month: "long",
						year: "numeric",
					});
				display.innerHTML = `${formattedDate}`;
				const firstDay = new Date(year, month, 1);
    			const firstDayIndex = firstDay.getDay() || 7 - 1; //Kij wam w oko hamburgery
    			const lastDay = new Date(year, month + 1, 0);
    			const numberOfDays = lastDay.getDate();
				for (let x = 1; x <= firstDayIndex; x++)
				{
					let div = document.createElement("div");
					div.innerHTML += "";
					days.appendChild(div);
				}
				for (let i = 1; i <= numberOfDays; i++)
				{
					let div = document.createElement("div");
					let currentDate = new Date(year, month, i);
					console.log(currentDate);
					div.dataset.dateISO = currentDate.toISOString();
					div.dataset.dateNormal = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear();
					div.innerHTML += i;
					days.appendChild(div);
					if (
					  currentDate.getFullYear() === new Date().getFullYear() &&
					  currentDate.getMonth() === new Date().getMonth() &&
					  currentDate.getDate() === new Date().getDate()
					)
					{
					  div.classList.add("current-date");
					}
				}
			}
			function DisplaySelected()
			{
				const dayElements = document.querySelectorAll(".days div");
				dayElements.forEach((day) =>
				{
					day.addEventListener("click", (e) =>
					{
    					const selectedDate = e.target.dataset.dateNormal;
    					selected.innerHTML = `Wybrana data: ${selectedDate}`;
						tempChosenDate = e.target.attributes['0']
					});
				});
			}
			previous.addEventListener("click", () =>
			{
				days.innerHTML = "";
				selected.innerHTML = "";
				if (month < 0)
				{
					month = 11;
					year = year - 1;
				}
				month = month - 1;
				console.log(month);
				date.setMonth(month);
				DisplayCalendar();
				DisplaySelected();
			});
			next.addEventListener("click", () =>
			{
				days.innerHTML = "";
				selected.innerHTML = "";
				if (month > 11)
				{
					month = 0;
					year = year + 1;
				}
				month = month + 1;
				date.setMonth(month);
				DisplayCalendar();
				DisplaySelected();
			});
			
			DisplayCalendar();
			DisplaySelected();

			var buttonConfirm = document.createElement("button");
			buttonConfirm.id = "potwierdz-date";
			buttonConfirm.innerHTML = 'Potwierdź';
			document.getElementById("container").appendChild(buttonConfirm);

			document.getElementById("potwierdz-date").addEventListener("click", async (e) =>
			{
				console.log(tempChosenDate)
				//const response = await fetch(`http://192.168.1.12:3000/filter?var=data&value=${}`);
				//if (!response.ok)
				//{
				//	window.location.href = `http://http.cat/images/${response.status}.jpg`;
				//}
			})
			break;
		default:
			break;
	}
}