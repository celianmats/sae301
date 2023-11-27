document.addEventListener("DOMContentLoaded", function () {

  function generateCard(cardInfo) {
    const container = document.getElementById("card-container");

    const existingCard = document.querySelector(`.card[data-name="${cardInfo.name}"]`);
    if (existingCard) {
      return;
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

    const linksContainer = document.createElement("div");

    const voirPlusLink = document.createElement("a");
    voirPlusLink.setAttribute("href", cardInfo.voirPlusLink || "#");
    voirPlusLink.textContent = "Voir plus";
    voirPlusLink.classList.add("voir-plus-button");
    voirPlusLink.addEventListener("click", function () {
      window.location.href = voirPlusLink.getAttribute("href");
    });

    const rendreLink = document.createElement("a");
    rendreLink.setAttribute("href", cardInfo.rendreLink || "#");
    rendreLink.textContent = "Rendre";
    rendreLink.classList.add("rendre-button");
    rendreLink.addEventListener("click", function () {
      window.location.href = rendreLink.getAttribute("href");
    });

    linksContainer.appendChild(voirPlusLink);
    linksContainer.appendChild(rendreLink);

    card.appendChild(nameElement);
    card.appendChild(roleElement);
    card.appendChild(renduDateElement);
    card.appendChild(checkboxElement);
    card.appendChild(imgElement);
    card.appendChild(linksContainer);

    container.appendChild(card);

    saveCardToLocalStorage(cardInfo);

    checkboxElement.addEventListener("change", function () {
      if (checkboxElement.checked) {

        container.removeChild(card);

        removeCardFromLocalStorage(cardInfo);
      }
    });

    rendreButton.addEventListener("click", function () {

      container.removeChild(card);

      removeCardFromLocalStorage(cardInfo);
    });
  }

  function saveCardToLocalStorage(cardInfo) {

    const existingCards = JSON.parse(localStorage.getItem("cards")) || [];

    const existingCardIndex = existingCards.findIndex(card => card.name === cardInfo.name);

    if (existingCardIndex === -1) {
      existingCards.push(cardInfo);

      localStorage.setItem("cards", JSON.stringify(existingCards));
    }
  }

  function removeCardFromLocalStorage(cardInfo) {

    const existingCards = JSON.parse(localStorage.getItem("cards")) || [];

    const updatedCards = existingCards.filter(card => card.name !== cardInfo.name);

    localStorage.setItem("cards", JSON.stringify(updatedCards));
  }

  function loadCardsFromLocalStorage() {
    const container = document.getElementById("card-container");

    const existingCards = JSON.parse(localStorage.getItem("cards")) || [];

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
    const voirPlusLinkInput = document.getElementById("new-card-voirPlusLink"); // Ajout de cette ligne
    const rendreLinkInput = document.getElementById("new-card-rendreLink");

    const newName = nameInput.value.trim();
    const newRole = roleInput.value.trim();
    let newDate = dateInput.value.trim();
    const newVoirPlusLink = voirPlusLinkInput.value.trim();
    const newRendreLink = rendreLinkInput.value.trim();

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(newDate)) {
      newDate = "Pas de date";
    }

    if (newName && newRole) {
      const newCardInfo = { name: newName, role: newRole, date: newDate, voirPlusLink: newVoirPlusLink, rendreLink: newRendreLink, };
      generateCard(newCardInfo);

      nameInput.value = "";
      roleInput.value = "";
      dateInput.value = "";
      voirPlusLinkInput.value = "";
      rendreLinkInput.value = "";
    }
  }

  // Charger les cartes depuis le stockage local au chargement de la page
  window.addEventListener("load", loadCardsFromLocalStorage);

  document.getElementById("search-input").addEventListener("input", performSearch);
  document.getElementById("add-card-btn").addEventListener("click", addNewCard);
});



