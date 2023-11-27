document.addEventListener('DOMContentLoaded', function() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

    const day = document.querySelector(".calendar-dates");
    const currdate = document.querySelector(".calendar-current-date");
    const prenexIcons = document.querySelectorAll(".calendar-navigation span");
    const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "September",
        "Octobre",
        "Novembre",
        "Décembre"
    ];

    let events = JSON.parse(localStorage.getItem('events')) || {};

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
            lit += `<li class="${isToday}">${i}</li>`;
        }

        for (let i = dayend; i < 6; i++) {
            lit += `<li class="inactive">${i - dayend + 1}</li>`;
        }

        currdate.innerText = `${months[month]} ${year}`;

        day.innerHTML = lit;
    }

    manipulate();

    day.addEventListener("click", (event) => {
        const clickedElement = event.target;
        if (clickedElement.tagName === 'LI' && !clickedElement.classList.contains('inactive')) {

            document.querySelectorAll('.calendar-dates li').forEach(dateElement => {
                dateElement.classList.remove('clicked', 'highlight-red', 'highlight-orange', 'highlight-green');
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

    ajouterEvent.addEventListener("click", () => {
        const description = prompt("Ajouter un événement :");

        if (description !== null && description.trim() !== "") {

            const selectedDate = new Date(year, month, parseInt(document.querySelector('.clicked').innerText, 10));


            const timeInput = document.createElement('input');
            timeInput.type = 'text';
            timeInput.value = '12h00';
            timeInput.readOnly = true;

            evenementTexte.appendChild(timeInput);

            let time = prompt("Entrez l'heure de l'événement (format 24 heures) :", "Ex: 12h00");

            // Si l'heure est invalide, afficher une alerte et supprimer l'élément d'input
            if (!/^([01]\d|2[0-3])h[0-5]\d$/.test(time)) {
                alert("Format d'heure invalide. Utilisez le format 24 heures.");
                evenementTexte.removeChild(timeInput);
                return;
            }

            // Mettre à jour le champ de texte avec l'heure saisie
            timeInput.value = time;

            const dateKey = selectedDate.toISOString().split('T')[0];
            events[dateKey] = events[dateKey] || [];
            events[dateKey].push({ description, time });

            // Sauvegarder les événements
            localStorage.setItem('events', JSON.stringify(events));

            // Afficher les événements
            displayEvents(events[dateKey]);

            // Mettre à jour la couleur du jour actuel
            highlightCurrentDay(selectedDate);
        }
    });

// Fonction pour créer un élément d'événement avec des icônes de crayon et de poubelle
    function createEventElement(eventData) {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');

        const eventTextElement = document.createElement('div');
        eventTextElement.classList.add('evenement-texte-div');

        const textParagraph = document.createElement('p');
        textParagraph.textContent = `${eventData.description} (${eventData.time})`;

        // Icône de crayon (pour la modification)
        const editIcon = document.createElement('img');
        editIcon.src = '../../images/editer.png';
        editIcon.alt = 'Editer';
        editIcon.classList.add('edit-icon');

        // Icône de poubelle (pour la suppression)
        const trashIcon = document.createElement('img');
        trashIcon.src = '../../images/poubelle.png';
        trashIcon.alt = 'Poubelle';
        trashIcon.classList.add('trash-icon');

        eventTextElement.appendChild(textParagraph);
        eventTextElement.appendChild(editIcon);
        eventTextElement.appendChild(trashIcon);

        eventElement.appendChild(eventTextElement);

        // Ajouter des gestionnaires d'événements pour éditer et supprimer l'événement
        editIcon.addEventListener('click', () => {
            editEvent(eventData);
        });

        trashIcon.addEventListener('click', () => {
            removeEvent(eventData);
        });

        return eventElement;
    }

// Fonction pour modifier un événement
    function editEvent(eventData) {
        // Récupérer la date sélectionnée
        const selectedDate = new Date(year, month, parseInt(document.querySelector('.clicked').innerText, 10));
        const dateKey = selectedDate.toISOString().split('T')[0];

        // Récupérer les événements stockés pour la date sélectionnée
        const storedEvents = events[dateKey] || [];

        // Afficher une boîte de dialogue pour saisir la nouvelle description et l'heure
        const newDescription = prompt(`Modifier l'événement:\n\n${eventData.description} (${eventData.time})`, eventData.description);
        let newTime = prompt(`Modifier l'heure de l'événement:\n\n${eventData.description} (${eventData.time})`, eventData.time);

        // Valider le format de la nouvelle heure
        if (!/^([01]\d|2[0-3])h[0-5]\d$/.test(newTime)) {
            alert("Format d'heure invalide. Utilisez le format 24 heures.");
            return;
        }

        // Mettre à jour la description et l'heure de l'événement
        eventData.description = newDescription.trim();
        eventData.time = newTime.trim();

        // Mettre à jour le tableau d'événements
        events[dateKey] = storedEvents;

        // Sauvegarder les événements
        localStorage.setItem('events', JSON.stringify(events));

        // Afficher les événements mis à jour
        displayEvents(storedEvents);

        // Mettre à jour la couleur du jour actuel
        highlightCurrentDay(selectedDate);
    }

// Fonction pour supprimer un événement
    function removeEvent(eventData) {
        const selectedDate = new Date(year, month, parseInt(document.querySelector('.clicked').innerText, 10));
        const dateKey = selectedDate.toISOString().split('T')[0];
        const storedEvents = events[dateKey] || [];

        // Retirer l'événement de la liste
        const updatedEvents = storedEvents.filter(eventItem => eventItem !== eventData);

        // Mettre à jour le tableau d'événements
        events[dateKey] = updatedEvents;

        // Sauvegarder les événements
        localStorage.setItem('events', JSON.stringify(events));

        // Afficher les événements mis à jour
        displayEvents(updatedEvents);

        // Mettre à jour la couleur du jour actuel
        highlightCurrentDay(selectedDate);
    }

// Fonction pour afficher les événements
    function displayEvents(eventList) {
        evenementTexte.innerHTML = '';
        eventList.forEach(eventData => {
            const eventElement = createEventElement(eventData);
            evenementTexte.appendChild(eventElement);
        });
        evenementContainer.style.display = 'block';
    }

// Fonction pour mettre en surbrillance le jour actuel en fonction de la proximité des événements
    function highlightCurrentDay(selectedDate) {
        const nextDay = new Date(selectedDate);
        const nextDay1 = new Date(selectedDate);
        const nextDay2 = new Date(selectedDate);
        const nextDay3 = new Date(selectedDate);
        const nextDay4 = new Date(selectedDate);
        const nextDay5 = new Date(selectedDate);
        const nextDay6 = new Date(selectedDate);
        const nextDay7 = new Date(selectedDate);
        const nextDay8 = new Date(selectedDate);


        nextDay.setDate(selectedDate.getDate() - 1);
        nextDay1.setDate(selectedDate.getDate() + 1);
        nextDay2.setDate(selectedDate.getDate() + 2);
        nextDay3.setDate(selectedDate.getDate() + 3);
        nextDay4.setDate(selectedDate.getDate() + 4);
        nextDay5.setDate(selectedDate.getDate() + 5);
        nextDay6.setDate(selectedDate.getDate() + 6);
        nextDay7.setDate(selectedDate.getDate() + 7);
        nextDay8.setDate(selectedDate.getDate() + 8);

        const nextDayKey = nextDay.toISOString().split('T')[0];
        const nextDay1Key = nextDay1.toISOString().split('T')[0];
        const nextDay2Key = nextDay2.toISOString().split('T')[0];
        const nextDay3Key = nextDay3.toISOString().split('T')[0];
        const nextDay4Key = nextDay4.toISOString().split('T')[0];
        const nextDay5Key = nextDay5.toISOString().split('T')[0];
        const nextDay6Key = nextDay6.toISOString().split('T')[0];
        const nextDay7Key = nextDay7.toISOString().split('T')[0];
        const nextDay8Key = nextDay8.toISOString().split('T')[0];

        const hasEventCurrentDay = events[selectedDate.toISOString().split('T')[0]] && events[selectedDate.toISOString().split('T')[0]].length > 0;
        const hasEventNextDay1 = events[nextDay1Key] && events[nextDay1Key].length > 0;
        const hasEventNextDay = events[nextDayKey] && events[nextDayKey].length > 0;
        const hasEventNextDay2 = events[nextDay2Key] && events[nextDay2Key].length > 0;
        const hasEventNextDay3 = events[nextDay3Key] && events[nextDay3Key].length > 0;
        const hasEventNextDay4 = events[nextDay4Key] && events[nextDay4Key].length > 0;
        const hasEventNextDay5 = events[nextDay5Key] && events[nextDay5Key].length > 0;
        const hasEventNextDay6 = events[nextDay6Key] && events[nextDay6Key].length > 0;
        const hasEventNextDay7 = events[nextDay7Key] && events[nextDay7Key].length > 0;
        const hasEventNextDay8 = events[nextDay8Key] && events[nextDay8Key].length > 0;

        // Réinitialiser la couleur du jour actuel
        document.querySelectorAll('.calendar-dates li').forEach(dateElement => {
            dateElement.classList.remove('highlight-red', 'highlight-orange', 'highlight-green');
        });

        // Mettre en surbrillance le jour actuel en fonction de la proximité des événements
        const clickedElement = document.querySelector('.clicked');
        if (hasEventNextDay1) {
            clickedElement.classList.add('highlight-orange');
        } else if (hasEventCurrentDay) {
            clickedElement.classList.add('highlight-red');
        } else if (hasEventNextDay2 || hasEventNextDay3) {
            clickedElement.classList.add('highlight-orange');
        } else if (hasEventNextDay4 || hasEventNextDay5 || hasEventNextDay6 || hasEventNextDay7 || hasEventNextDay8) {
            clickedElement.classList.add('highlight-green');
        }
    }
});

