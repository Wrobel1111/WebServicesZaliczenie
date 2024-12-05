async function FetchFilteredOptions(selectedFilter)
{
	switch (selectedFilter.value)
	{
		case "kraj":
			const response = await fetch(`http://192.168.1.28:3000/filter?var=kraj&value=${selectedFilter.value}`);
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
					div.dataset.dateISO = currentDate.toISOString();
					div.dataset.dateNormal = currentDate.getDay() + '.' + currentDate.getMonth() + '.' + currentDate.getFullYear();
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
				const response = await fetch(`http://192.168.1.28:3000/filter?var=data&value=${selectedFilter.value}`);
				if (!response.ok)
				{
					window.location.href = `http://http.cat/images/${response.status}.jpg`;
				}
			})
			break;
		default:
			break;
	}
}