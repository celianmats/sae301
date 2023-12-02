document.addEventListener('DOMContentLoaded', function() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

    const day = document.querySelector(".calendar-dates");
    const currdate = document.querySelector(".calendar-current-date");
    const prenexIcons = document.querySelectorAll(".calendar-navigation span");
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "September", "Octobre", "Novembre", "Décembre"];

    let events = JSON.parse(localStorage.getItem('events')) || {};
    let currentDayColor = '';

    const manipulate = () => {
        let dayone = new Date(year, month, 1).getDay();
        dayone = (dayone === 0) ? 6 : dayone - 1;
        let lastdate = new Date(year, month + 1, 0).getDate();
        let dayend = new Date(year, month, lastdate).getDay();
        let monthlastdate = new Date(year, month, 0).getDate();
        let lit = "";

        for (let i = dayone; i > 0; i--) {
            lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
        }

        for (let i = 1; i <= lastdate; i++) {
            let isToday = i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? "active" : "";
            lit += `<li class="${isToday}" data-date="${year}-${pad(month + 1)}-${pad(i)}">${i}</li>`;
        }

        for (let i = dayend; i < 6; i++) {
            lit += `<li class="inactive">${i - dayend + 1}</li>`;
        }

        currdate.innerText = `${months[month]} ${year}`;
        day.innerHTML = lit;
    }

    function pad(num) {
        return num < 10 ? '0' + num : num;
    }

    manipulate();

    function checkAndHighlightCurrentDay() {
        const selectedDate = new Date(year, month, date.getDate());
        const dateKey = selectedDate.toISOString().split('T')[0];
        const hasEventCurrentDay = events[dateKey] && events[dateKey].length > 0;
        const clickedElement = document.querySelector('.active');

        if (hasEventCurrentDay && currentDayColor === '') {
            currentDayColor = 'highlight-red';
        }

        if (currentDayColor !== '') {
            clickedElement.classList.add(currentDayColor);
        }
    }

    checkAndHighlightCurrentDay();

    day.addEventListener("click", (event) => {
        const clickedElement = event.target;
        if (clickedElement.tagName === 'LI' && !clickedElement.classList.contains('inactive')) {
            document.querySelectorAll('.calendar-dates li').forEach(dateElement => {
                dateElement.classList.remove('clicked', 'highlight-red', 'highlight-orange', 'highlight-green', 'highlight-blue');
            });

            clickedElement.classList.add('clicked');
            const selectedDate = new Date(year, month, parseInt(clickedElement.innerText, 10));
            const dateKey = selectedDate.toISOString().split('T')[0];
            const storedEvents = events[dateKey] || [];
            displayEvents(storedEvents);
            highlightCurrentDay(selectedDate);
        }
    });

    prenexIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            month = icon.id === "calendar-prev" ? month - 1 : month + 1;

            if (month < 0 || month > 11) {
                date = new Date(year, month, new Date().getDate());
                year = date.getFullYear();
                month = date.getMonth();
            } else {
                date = new Date();
            }

            manipulate();
        });
    });

    const evenementBox = document.querySelector(".evenement");

    day.addEventListener("click", (event) => {
        const clickedElement = event.target;
        if (clickedElement.tagName === 'LI' && !clickedElement.classList.contains('inactive')) {
            document.querySelectorAll('.calendar-dates li').forEach(dateElement => {
                dateElement.classList.remove('clicked');
            });

            clickedElement.classList.add('clicked');
            evenementBox.style.display = 'block';
        }
    });

    const ajouterEvent = document.querySelector(".ajouter");
    const evenementContainer = document.querySelector(".evenement");
    const evenementTexte = document.querySelector(".evenement-texte");

// Fonction de validation pour la description
    function isValidDescription(description) {
        // Utiliser une expression régulière pour permettre uniquement des caractères alphanumériques et des espaces
        const regex = /^[a-zA-Z0-9\s]+$/;
        return regex.test(description);
    }

// Fonction de validation pour l'heure
    function isValidTime(time) {
        // Utiliser une expression régulière pour vérifier le format d'heure (format 24 heures)
        const regex = /^([01]\d|2[0-3])h[0-5]\d$/;
        return regex.test(time);
    }

    ajouterEvent.addEventListener("click", () => {
        const selectedDate = new Date(year, month, parseInt(document.querySelector('.clicked').innerText, 10));

        // Vérifier si la date sélectionnée est antérieure à la date actuelle
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Ajuster pour comparer les dates sans l'heure
        if (selectedDate < currentDate) {
            alert("Vous ne pouvez pas ajouter d'événement sur une date passée.");
            return;
        }

        const description = prompt("Ajouter un événement :");

        // Valider la description
        if (!isValidDescription(description)) {
            alert("Description invalide. Utilisez uniquement des caractères alphanumériques et des espaces.");
            return;
        }

        const timeInput = document.createElement('input');
        timeInput.type = 'text';
        timeInput.placeholder = 'Ex: 12h00';
        timeInput.readOnly = true;

        timeInput.addEventListener('focus', () => {
            timeInput.value = '';
            timeInput.readOnly = false;
        });

        timeInput.addEventListener('blur', () => {
            if (!timeInput.value.trim()) {
                timeInput.value = 'Ex: 12h00';
                timeInput.readOnly = true;
            }
        });

        evenementTexte.appendChild(timeInput);

        let time = prompt("Entrez l'heure de l'événement (format 24 heures) :", "Ex: 12h00");

        // Valider l'heure
        if (!isValidTime(time)) {
            alert("Format d'heure invalide. Utilisez le format 24 heures.");
            evenementTexte.removeChild(timeInput);
            return;
        }

        timeInput.value = time;

        const dateKey = selectedDate.toISOString().split('T')[0];
        events[dateKey] = events[dateKey] || [];
        events[dateKey].push({ description, time });

        localStorage.setItem('events', JSON.stringify(events));
        displayEvents(events[dateKey]);
        highlightCurrentDay(selectedDate);
    });

    function createEventElement(eventData) {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        const eventTextElement = document.createElement('div');
        eventTextElement.classList.add('evenement-texte');
        const textParagraph = document.createElement('p');
        textParagraph.textContent = `${eventData.description} (${eventData.time})`;
        const editIcon = document.createElement('img');
        editIcon.src = '../../images/editer.png';
        editIcon.alt = 'Editer';
        editIcon.classList.add('edit-icon');
        const trashIcon = document.createElement('img');
        trashIcon.src = '../../images/poubelle.png';
        trashIcon.alt = 'Poubelle';
        trashIcon.classList.add('trash-icon');

        eventTextElement.appendChild(textParagraph);
        eventTextElement.appendChild(editIcon);
        eventTextElement.appendChild(trashIcon);

        eventElement.appendChild(eventTextElement);

        editIcon.addEventListener('click', () => {
            editEvent(eventData);
        });

        trashIcon.addEventListener('click', () => {
            removeEvent(eventData);
        });

        return eventElement;
    }

    function editEvent(eventData) {
        const selectedDate = new Date(year, month, parseInt(document.querySelector('.clicked').innerText, 10));
        const dateKey = selectedDate.toISOString().split('T')[0];
        const storedEvents = events[dateKey] || [];
        const newDescription = prompt(`Modifier l'événement:\n\n${eventData.description} (${eventData.time})`, eventData.description);
        let newTime = prompt(`Modifier l'heure de l'événement:\n\n${eventData.description} (${eventData.time})`, eventData.time);

        // Valider la nouvelle heure
        if (!isValidTime(newTime)) {
            alert("Format d'heure invalide. Utilisez le format 24 heures.");
            return;
        }

        eventData.description = newDescription.trim();
        eventData.time = newTime.trim();
        events[dateKey] = storedEvents;
        localStorage.setItem('events', JSON.stringify(events));
        displayEvents(storedEvents);
        highlightCurrentDay(selectedDate);
    }

    function removeEvent(eventData) {
        const selectedDate = new Date(year, month, parseInt(document.querySelector('.clicked').innerText, 10));
        const dateKey = selectedDate.toISOString().split('T')[0];
        const storedEvents = events[dateKey] || [];
        const updatedEvents = storedEvents.filter(eventItem => eventItem !== eventData);
        events[dateKey] = updatedEvents;
        localStorage.setItem('events', JSON.stringify(events));
        displayEvents(updatedEvents);
        highlightCurrentDay(selectedDate);
    }

    function displayEvents(eventList) {
        evenementTexte.innerHTML = '';
        eventList.forEach(eventData => {
            const eventElement = createEventElement(eventData);
            evenementTexte.appendChild(eventElement);
        });
        evenementContainer.style.display = 'block';
    }

    function highlightCurrentDay(selectedDate) {
        const today = new Date(year, month, date.getDate());
        const daysDifference = Math.floor((selectedDate - today) / (24 * 60 * 60 * 1000));

        const clickedElement = document.querySelector('.clicked');
        document.querySelectorAll('.calendar-dates li').forEach(dateElement => {
            dateElement.classList.remove('highlight-red', 'highlight-orange', 'highlight-green', 'highlight-blue');
        });

        if (daysDifference === 0) {
            if (currentDayColor === 'highlight-red' || (events[selectedDate.toISOString().split('T')[0]] && events[selectedDate.toISOString().split('T')[0]].length > 0)) {
                clickedElement.classList.add('highlight-red');
            }
        } else if (daysDifference >= 1 && daysDifference <= 3) {
            if (currentDayColor === 'highlight-orange' || (events[selectedDate.toISOString().split('T')[0]] && events[selectedDate.toISOString().split('T')[0]].length > 0)) {
                clickedElement.classList.add('highlight-orange');
            }
        } else if (daysDifference >= 4 && daysDifference <= 8) {
            if (currentDayColor === 'highlight-green' || (events[selectedDate.toISOString().split('T')[0]] && events[selectedDate.toISOString().split('T')[0]].length > 0)) {
                clickedElement.classList.add('highlight-green');
            }
        } else {
            if (events[selectedDate.toISOString().split('T')[0]] && events[selectedDate.toISOString().split('T')[0]].length > 0) {
                clickedElement.classList.add('highlight-blue');
            }
        }
    }

});

