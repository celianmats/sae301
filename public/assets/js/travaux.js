document.addEventListener("DOMContentLoaded", function () {
  function generateRandomDate() {
    var year = 2023;
    var month = Math.floor(Math.random() * 12) + 1;
    var day = Math.floor(Math.random() * 28) + 1;

    return `${day}/${month}/${year}`;
  }

  function generateCard(cardInfo) {
    const container = document.getElementById("card-container");

    // Vérifier si une carte avec le même nom existe déjà
    const existingCard = document.querySelector(`.card[data-name="${cardInfo.name}"]`);
    if (existingCard) {
      return; // Ne rien faire si la carte existe déjà
    }

    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", cardInfo.name);

    const nameElement = document.createElement("h3");
    nameElement.textContent = cardInfo.name;

    const roleElement = document.createElement("p");
    roleElement.textContent = cardInfo.role;

    const renduDateElement = document.createElement("b");
    renduDateElement.classList.add("rendu-date");

    // Check if the date is provided and in the correct format
    if (cardInfo.date && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cardInfo.date)) {
      renduDateElement.textContent = "Rendu : " + cardInfo.date;
    } else {
      renduDateElement.textContent = "Pas de date";
    }

    const checkboxElement = document.createElement("input");
    checkboxElement.setAttribute("type", "checkbox");
    checkboxElement.classList.add("check-input");

    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", "../images/check.png");
    imgElement.setAttribute("alt", "Check Image");

    const voirPlusButton = document.createElement("button");
    voirPlusButton.textContent = "Voir plus";
    voirPlusButton.classList.add("voir-plus-button");

    const rendreButton = document.createElement("button");
    rendreButton.textContent = "Rendre";
    rendreButton.classList.add("rendre-button");

    card.appendChild(nameElement);
    card.appendChild(roleElement);
    card.appendChild(renduDateElement);
    card.appendChild(checkboxElement);
    card.appendChild(imgElement);
    card.appendChild(voirPlusButton);
    card.appendChild(rendreButton);

    container.appendChild(card);

    // Ajouter la carte au stockage local
    saveCardToLocalStorage(cardInfo);

    // Ajouter les gestionnaires d'événements pour le bouton "Rendre" et la case à cocher
    checkboxElement.addEventListener("change", function () {
      if (checkboxElement.checked) {
        // Si la case à cocher est cochée, supprimer la carte
        container.removeChild(card);
        // Supprimer la carte du stockage local
        removeCardFromLocalStorage(cardInfo);
      }
    });

    rendreButton.addEventListener("click", function () {
      // Supprimer la carte lorsque le bouton "Rendre" est cliqué
      container.removeChild(card);
      // Supprimer la carte du stockage local
      removeCardFromLocalStorage(cardInfo);
    });
  }

  function saveCardToLocalStorage(cardInfo) {
    // Récupérer les cartes existantes du stockage local
    const existingCards = JSON.parse(localStorage.getItem("cards")) || [];

    // Vérifier si une carte avec le même nom existe déjà dans le stockage local
    const existingCardIndex = existingCards.findIndex(card => card.name === cardInfo.name);

    if (existingCardIndex === -1) {
      // Ajouter la nouvelle carte aux cartes existantes
      existingCards.push(cardInfo);

      // Sauvegarder les cartes mises à jour dans le stockage local
      localStorage.setItem("cards", JSON.stringify(existingCards));
    }
  }

  function removeCardFromLocalStorage(cardInfo) {
    // Récupérer les cartes existantes du stockage local
    const existingCards = JSON.parse(localStorage.getItem("cards")) || [];

    // Retirer la carte du stockage local en fonction du nom
    const updatedCards = existingCards.filter(card => card.name !== cardInfo.name);

    // Sauvegarder les cartes mises à jour dans le stockage local
    localStorage.setItem("cards", JSON.stringify(updatedCards));
  }

  function loadCardsFromLocalStorage() {
    const container = document.getElementById("card-container");

    // Récupérer les cartes du stockage local
    const existingCards = JSON.parse(localStorage.getItem("cards")) || [];

    // Générer les cartes pour chaque élément stocké
    existingCards.forEach(cardInfo => {
      generateCard(cardInfo);
    });
  }

  function performSearch() {
    var searchTerm = document.getElementById("search-input").value.trim().toLowerCase();
    var cards = document.querySelectorAll('.card');

    cards.forEach(function(card) {
      var cardName = card.getAttribute('data-name').toLowerCase();
      card.style.display = searchTerm === "" || cardName.startsWith(searchTerm) ? 'block' : 'none';
    });
  }

  function addNewCard() {
    const nameInput = document.getElementById("new-card-name");
    const roleInput = document.getElementById("new-card-role");
    const dateInput = document.getElementById("new-card-date");

    const newName = nameInput.value.trim();
    const newRole = roleInput.value.trim();
    let newDate = dateInput.value.trim();

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(newDate)) {
      newDate = "Pas de date";
    }

    if (newName && newRole) {
      const newCardInfo = { name: newName, role: newRole, date: newDate };
      generateCard(newCardInfo);

      nameInput.value = "";
      roleInput.value = "";
      dateInput.value = "";
    }
  }

  // Charger les cartes depuis le stockage local au chargement de la page
  window.addEventListener("load", loadCardsFromLocalStorage);

  document.getElementById("search-input").addEventListener("input", performSearch);
  document.getElementById("add-card-btn").addEventListener("click", addNewCard);
});



