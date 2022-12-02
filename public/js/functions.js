//Elementos do DOM
const slide = document.getElementById('slide');
const imgFilms = document.getElementById('imgFilms');
const outTitle = document.getElementById('outTitle');
const outDescription = document.getElementById('outDescription');
const outScore = document.getElementById('outScore');
const page = document.getElementById('page')
const navLeft = document.getElementById('navLeft');
const navRight = document.getElementById('navRight');
const blts = document.getElementById('bullets')

//variáveis de controle
var countApi = 1
var countCard = 0

//funções
const dataApi = async (count) => {
   const req = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${count}&api_key=ee85d6df320b8aeb6987dac41ab4bd7f&languege=pt-BR`);
   const resp = await req.json();
   page.innerText = count
   return resp;
}

const init = async (count) => {
   const obj = await dataApi(count);
   const filmes = [];

   obj.results.forEach((el,index) => {
      filmes.push({
         id: el.id,
         title: el.title,
         img_back: el.backdrop_path,
         img_poster: el.poster_path,
         overview: el.overview,
         score: el.vote_average,
         release: el.release_date
      })
   });

   return filmes;
}

const print = async (count) => {
   const data = await init(count);
   slide.innerHTML = "";
   imgFilms.innerHTML = "";
   data.forEach((el, index)=>{
      if(index == 0){
         imgFilms.innerHTML +=`<img class="select" src="https://image.tmdb.org/t/p/w1280${el.img_back}" alt="${el.title}">`;
         slide.innerHTML += `
         <div class="card_single select" style="--img: url(https://image.tmdb.org/t/p/w780${el.img_back});">
            <h2>${el.title}</h2>
         </div>
         `
      } else {
         imgFilms.innerHTML +=`<img class="" src="https://image.tmdb.org/t/p/w1280${el.img_back}" alt="${el.title}">`;
         slide.innerHTML += `
         <div class="card_single" style="--img: url(https://image.tmdb.org/t/p/w780${el.img_back});">
            <h2>${el.title}</h2>
         </div>
         `
      }
   })
   bullets.innerHTML = `<i class="fa-solid fa-arrow-left"></i><i class="fa-solid fa-arrow-right"></i>`;
   const cardSingle = document.querySelectorAll('.card_single');
   const imgSingle = document.querySelectorAll('#imgFilms > img');
   const bulletSingle = document.querySelectorAll('#bullets > i')

   createBullet(bulletSingle);
   clickFilm(cardSingle,imgSingle,data);
}
print(countApi);

const clickFilm = (card,imgs,info) =>{
   outTitle.innerText = info[0].title;
   outDescription.innerText = info[0].overview;
   outScore.innerHTML = '<i class="fa-sharp fa-solid fa-star"></i> '+info[0].score;

   card.forEach((back, i) =>{
      back.onclick = () => {
         card.forEach((press, j) => {
            if(i === j){
               press.classList.add('select');
               outTitle.innerText = info[j].title;
               outDescription.innerText = info[j].overview;
               outScore.innerHTML = '<i class="fa-sharp fa-solid fa-star"></i>'+info[j].score;
            } else {
               press.classList.remove('select');
            }
         })
         imgs.forEach((img, j) => {
            if(i === j){
               img.classList.add('select');
            } else {
               img.classList.remove('select');
            }
         })
      }
   })
}
navRight.onclick = () => {
   if(countApi >= 1){
      countApi++;
      print(countApi);
   }
   return 
}
navLeft.onclick = () => {
   if(countApi > 1){
      countApi--;
      print(countApi);
   }
   return 
}

const createBullet = (bullets)=> {
   slide.style.marginLeft = 0;
   countCard = 0
   bullets.forEach((blt,index) => {
      blt.onclick = () => {
         if(index == 0 && countCard > 0){
            if(window.screen.width <= 548 && countCard <= 1900){
               countCard -= 100;
               slide.style.marginLeft = `-${countCard}%`;
            }
            if(window.screen.width > 548 && window.screen.width <= 768 && countCard <= 900){
               countCard -= 100;
               slide.style.marginLeft = `-${countCard}%`;
            }
            if(window.screen.width > 768 && countCard <= 500){
               countCard -= 100;
               slide.style.marginLeft = `-${countCard}%`;
            }
         } else if(index != 0 && countCard >= 0){
            if(window.screen.width <= 548 && countCard < 1900){
               countCard += 100;
               slide.style.marginLeft = `-${countCard}%`;
            }
            if(window.screen.width > 548 && window.screen.width <= 768 && countCard < 900){
               countCard += 100;
               slide.style.marginLeft = `-${countCard}%`;
            }
            if(window.screen.width > 768 && countCard < 500){
               countCard += 100;
               slide.style.marginLeft = `-${countCard}%`;
            }
         }
      }
   })
}

window.addEventListener("resize", () => {
   if(window.screen.width === 768 || window.screen.width === 548 || window.screen.width > 768){
      countCard = 0;
      slide.style.marginLeft = 0
   }
})