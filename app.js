// vi skapar en array som vi ska kunna stoppa och sortera karaktärer, och för att det ska vara kunna lättare att följa med
let MovieChar = [];

// En funktion som stänger modalen, tömmer arrayen "MovieChar" och ERSÄTTER ALLT i våran modal tillbaka till ett "p" element
const closeModal = () => {
  document.getElementById("movie-modal-wrapper").style.display = "none";
  MovieChar = [];

  document.getElementById("movie-modal-wrapper").classList.remove("open");

  document.getElementById("movie-modal-content").innerHTML =
    "<p>loading...</p>";
};

// vi hämtar filmerna och all info som tillhör filmerna men väntar tills vi har fått in allt innan vi fortätter med koden, vi gör samma sak när vi översätter fråm Json till Js kod och kallar våran slutliga resultat till "movies" som vi sätter i innerhtml och skapar en till hörande "div" med ett onclick event beroende på vilken index filmen har, som följs av när filmen släpptes
const getMovies = async () => {
  const res = await fetch("https://swapi.dev/api/films");
  const data = await res.json();
  movies = data.results;
  console.log(movies);

  document.getElementById("movies").innerHTML = movies
    .map(
      (movie, index) =>
        `<div onclick="showMovie(${index})">
        <h2>${movie.title}</h2><h3>${movie.release_date}</h3>
      </div>`
    )
    .join("");
};

//if (du kommer ovan ifrån) {"scrolla ner till nästa funktion"} else {"låt mig förklara"} hehe

// beroende på igen vilken film(index), ska du ta karaktärerna array som kommer i url:er till respetive film och översätta dem först från url så vi får bara karaktärens "namn" och sedan från Json till JS, sedam skickar vi iväg alla promises tillbaka till funktionen nedanför
const charPromises = (index) => {
  const promises = movies[index].characters.map((url) => {
    return fetch(url).then((res) => res.json());
  });

  return promises;
};

/*
OKEJ... så när du har tryckt på knappen så körs denna funktion 
igen beroende på vilken av filmerna (index) så ska vi "try"/försöka öppna en modal som ska displaya följande 

OM ALLT GÅR BRA 
1: om allt går bra så sätter du modalen till flex och sätter modelwrapper till open

2: res = alla Karaktärena men vi tar allt samtidigt med hjälp av "Promise.all ()" som tas hand om av funktionen ovan för oss,

3: när vi har fått in alla promises så fortsätter vi, vi sätter res alltså våra karaktärer till en tom array "MovieChar" 

och nu om allt har gått bra så om "modalWrapper" är open så sätter du allt i "movie-modal-content"




*/
showMovie = async (index) => {
  const modalWrapper = document.getElementById("movie-modal-wrapper");
  try {
    modalWrapper.style.display = "flex";
    modalWrapper.classList.add("open");
    const res = await Promise.all(charPromises(index));
    let MovieChar = res;

    if (modalWrapper.classList.contains("open")) {
      document.getElementById("movie-modal-content").innerHTML =
        `<h3>${movies[index].title}</h3>` +
        MovieChar.map((item) => `<p>${item.name}</p>`)
          .sort()
          .join("");
    }
  } catch (error) {
    document.getElementById("movie-modal").innerHTML =
      "Something went wrong...";
    modalWrapper.style.display = "flex";
  }
};

getMovies();
