document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.getElementById("card-container");
  const historiqueContainer = document.getElementById("historique-container");

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

    checkboxElement.addEventListener("change", function () {
      if (checkboxElement.checked) {
        checkboxElement.setAttribute("disabled", "true");
        card.style.display = "block";
        historiqueContainer.appendChild(card);

        const remettreButton = document.createElement("button");
        remettreButton.textContent = "Remettre";
        remettreButton.addEventListener("click", function () {
          checkboxElement.removeAttribute("disabled");
          card.style.display = "block";
          cardContainer.appendChild(card);

          remettreButton.remove();
          effacerButton.remove();
        });

        const effacerButton = document.createElement("button");
        effacerButton.textContent = "Effacer";
        effacerButton.addEventListener("click", function () {
          const isConfirmed = window.confirm("Voulez-vous vraiment supprimer cette carte ?");
          if (isConfirmed) {
            card.remove();
            removeCardFromLocalStorage(cardInfo);
            remettreButton.remove();
            effacerButton.remove();
          }
        });

        card.appendChild(remettreButton);
        card.appendChild(effacerButton);
      }
    });

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
        historiqueContainer.appendChild(card);

        moveCardToHistorique(cardInfo);
      }
    });

    rendreLink.addEventListener("click", function () {
      container.removeChild(card);
      historiqueContainer.appendChild(card);

      moveCardToHistorique(cardInfo);
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

  function moveCardToHistorique(cardInfo) {
    const historiqueCards = JSON.parse(localStorage.getItem("historiqueCards")) || [];
    historiqueCards.push(cardInfo);
    localStorage.setItem("historiqueCards", JSON.stringify(historiqueCards));

    removeCardFromLocalStorage(cardInfo);
  }

  function loadCardsFromLocalStorage() {
    const container = document.getElementById("card-container");
    const existingCards = JSON.parse(localStorage.getItem("cards")) || [];

    existingCards.forEach(cardInfo => {
      generateCard(cardInfo);
    });

    const historiqueCards = JSON.parse(localStorage.getItem("historiqueCards")) || [];
    historiqueCards.forEach(cardInfo => {
      generateCard(cardInfo);
      container.removeChild(document.querySelector(`.card[data-name="${cardInfo.name}"]`));
    });
  }

  function performSearch() {
    var searchTerm = document.getElementById("search-input").value.trim().toLowerCase();
    var cards = document.querySelectorAll('.card');

    cards.forEach(function (card) {
      var cardName = card.getAttribute('data-name').toLowerCase();
      card.style.display = searchTerm === "" || cardName.startsWith(searchTerm) ? 'block' : 'none';
    });
  }

  function addNewCard() {
    const nameInput = document.getElementById("new-card-name");
    const roleInput = document.getElementById("new-card-role");
    const dateInput = document.getElementById("new-card-date");
    const voirPlusLinkInput = document.getElementById("new-card-voirPlusLink");
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
      const newCardInfo = { name: newName, role: newRole, date: newDate, voirPlusLink: newVoirPlusLink, rendreLink: newRendreLink };
      generateCard(newCardInfo);

      nameInput.value = "";
      roleInput.value = "";
      dateInput.value = "";
      voirPlusLinkInput.value = "";
      rendreLinkInput.value = "";
    }
  }

  window.addEventListener("load", loadCardsFromLocalStorage);

  document.getElementById("search-input").addEventListener("input", performSearch);
  document.getElementById("add-card-btn").addEventListener("click", addNewCard);
});





