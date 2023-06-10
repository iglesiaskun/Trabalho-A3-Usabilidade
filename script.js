const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const newsContainer = document.getElementById("newsContainer");
const favoriteList = document.getElementById("favoriteList");
const addFavoriteButton = document.getElementById("addFavoriteButton");

searchButton.addEventListener("click", () => {
  const keyword = searchInput.value;
  if (keyword) {
    searchNews(keyword);
  }
});

addFavoriteButton.addEventListener("click", () => {
  const topic = prompt("Digite o assunto favorito:");
  if (topic) {
    const favoriteCard = createFavoriteCard(topic);
    favoriteList.appendChild(favoriteCard);
  }
});

function searchNews(keyword) {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    keyword
  )}&sortBy=popularity&language=pt&apiKey=d9bd3403a6704d2f9967a50ed87a9be8`;

  showLoading();

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayNews(data.articles);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function displayNews(articles) {
  newsContainer.innerHTML = "";
  articles.forEach((article) => {
    const card = createCard(article);
    newsContainer.appendChild(card);
  });

  observeCards();
}

function createCard(article) {
  const card = document.createElement("div");
  card.classList.add("card");

  const image = document.createElement("img");
  image.src = article.urlToImage;
  image.alt = article.title;
  card.appendChild(image);

  const title = document.createElement("h2");
  title.textContent = article.title;
  card.appendChild(title);

  const description = document.createElement("p");
  description.textContent = article.description;
  card.appendChild(description);

  const source = document.createElement("p");
  source.textContent = `Fonte: ${article.source.name}`;
  card.appendChild(source);

  const publishedAt = document.createElement("p");
  publishedAt.textContent = `Publicado em: ${article.publishedAt}`;
  card.appendChild(publishedAt);

  return card;
}

function createFavoriteCard(topic) {
  const card = document.createElement("div");
  card.classList.add("favoriteCard");

  const title = document.createElement("h2");
  title.classList.add("favoriteTitle");
  title.textContent = topic;
  card.appendChild(title);

  const editButton = document.createElement("button");
  editButton.classList.add("favoriteEditButton");
  editButton.textContent = "Editar";
  card.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("favoriteDeleteButton");
  deleteButton.textContent = "Excluir";
  card.appendChild(deleteButton);

  editButton.addEventListener("click", () => {
    const newTopic = prompt("Digite o novo assunto favorito:", topic);
    if (newTopic) {
      title.textContent = newTopic;
    }
  });

  deleteButton.addEventListener("click", () => {
    favoriteList.removeChild(card);
  });

  card.addEventListener("click", () => {
    const keyword = title.textContent;
    searchNews(keyword);
  });

  return card;
}

function observeCards() {
  const cards = document.querySelectorAll(".card");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  });

  cards.forEach((card) => {
    observer.observe(card);
  });
}

function showLoading() {
  const loadingElement = document.createElement("div");
  loadingElement.classList.add("loading");

  newsContainer.innerHTML = "";
  newsContainer.appendChild(loadingElement);
}
