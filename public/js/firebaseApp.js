const btnRegister = document.querySelector('#register');
btnRegister.addEventListener('click', ()=>{
   document.querySelector('.login').style.display = 'none';
   document.querySelector('.container-register').style.display = 'flex';
})

const btnDecline = document.querySelector('#decline')
btnDecline.addEventListener('click', ()=>{
   document.querySelector('.login').style.display = 'flex';
   document.querySelector('.container-register').style.display = 'none';
})

const firebaseConfig = {
   apiKey: "AIzaSyDMse56qVX2Z7yuo2aRlAgL3zsVQaNLpQ8",
   authDomain: "webagenda-df897.firebaseapp.com",
   projectId: "webagenda-df897",
   storageBucket: "webagenda-df897.appspot.com",
   messagingSenderId: "1094127975778",
   appId: "1:1094127975778:web:615eaf0706dca5c11a003b",
   measurementId: "G-3MRKRRFDPE"
 };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);


//iniciar app aqui
var usuario = null;

var formLogin = document.querySelector('.login-form')
var btnLogout = document.querySelector('.logout')

formLogin.addEventListener('submit', function(e){
   e.preventDefault();
   let inEmail = document.querySelector('#inEmail')
   let inpassword = document.querySelector('#inPassword')
   let email = inEmail.value;
   let password = inpassword.value;

   firebase.auth().signInWithEmailAndPassword(email, password)
   .then((userCredential) => {
      // Signed in
      usuario = userCredential.user;
      alert(`Bem-vindo, ${usuario.email}`)
      document.querySelector('.login').style.display = 'none';
      document.querySelector('.container-login').style.display = 'flex';
      formLogin.reset();
      // ...
   })
   .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(`Error: ${errorMessage}`)
      formLogin.focus();
   });


})


const formRegister = document.querySelector('.container-register')
formRegister.addEventListener('submit', (e)=>{
   e.preventDefault();
   let regEmail = document.querySelector('#inEmailRegis');
   let regPassword = document.querySelector('#inPasswordRegis');
   let confPassword = document.querySelector('#inPasswordConfirm');

   let email = regEmail.value;
   let password = regPassword.value;
   let passwordOkay = confPassword.value;

   if(email == "" || password == ""){
      alert('Por favor, informar email e senha')
   }else if(password != passwordOkay){
      alert('Verifique novamente sua senha')
   }else{
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
         // Signed in
         var usuario = userCredential.user;
         alert(`cadastrado com sucesso`)
         document.querySelector('.container-register').style.display = 'none';
         formRegister.reset();
         // ...
      })
      .catch((error) => {
         var errorCode = error.code;
         var errorMessage = error.message;
         // ..
      });
   }
})



btnLogout.addEventListener('click', (e)=>{
   e.preventDefault();

   firebase.auth().signOut().then(()=>{
      document.querySelector('.login').style.display = 'flex';
      document.querySelector('.container-login').style.display = 'none';
      alert('Você foi Deslogado')
   }).catch(()=>{
   
   })

})

//iniciando banco de dados
const db = firebase.firestore();

//verificação de mudança no banco de dados e listagem de tarefas
firebase.auth().onAuthStateChanged((val)=>{
   if(val){
      usuario = val;
      document.querySelector('.login').style.display = 'none';
      document.querySelector('.container-login').style.display = 'block';

      //Ouvir por mudanças no banco de dados
      db.collection('tarefas').where("user","==",usuario.uid).onSnapshot((data)=>{
         let list = document.querySelector('#tarefas');
         list.innerHTML = '';
         let tarefas = data.docs
         tarefas = tarefas.sort((a, b)=>{
            if(a.data().horario < b.data().horario)
               return -1;
            else
               return +1;
            
         })

         tarefas.map((val)=>{
            list.innerHTML += `<li>${val.data().tarefa} <button tarefa-id="${val.id}" class="btn-excluir" href="javascript:void(0)"></button></li>`
         })

         var btnExcluir = document.querySelectorAll('.btn-excluir');

         btnExcluir.forEach(element => {
            element.addEventListener('click', (e)=>{
               e.preventDefault();
               let docId = element.getAttribute('tarefa-id');

               db.collection('tarefas').doc(docId).delete();
            })
         });
      })
   }
})


//Cadastro de tarefas
var formCadastro = document.querySelector('.form-cadastro-tarefa');
formCadastro.addEventListener('submit', e =>{
   e.preventDefault();
   let inTarefa = document.querySelector('#inTarefa');
   let inDatetime = document.querySelector('#inDatetime');

   let tarefa = inTarefa.value;
   let datetime = inDatetime.value;

   let dataAtual = new Date().getTime();
   if(dataAtual > new Date(datetime).getTime()){
      alert('Você informou uma data invalida...')
      return
   }else if(tarefa == "" || datetime == ""){
      alert('Por favor preencha todos os campos do formulário')
      return
   }else{
      //Inserir e criar coleção
      db.collection('tarefas').add({
         tarefa : tarefa,
         horario : new Date(datetime).getTime(),
         user : usuario.uid
      })
      formCadastro.reset();
   }
   
   alert('Sua tarefa foi cadastrada com sucesso')
})