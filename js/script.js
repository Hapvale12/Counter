/* grab necessary elements */
// grab the .form
const form = document.querySelector('.form');
// grab the .time-input
const timeInput = document.querySelector('.time-input');
// grab the select[name='format']
const format = document.querySelector("select[name='format']");
// grab the .set-btn
const setBtn = document.querySelector('.set-btn');
// grab the .countdown
const countDown = document.querySelector('.countdown');
// grab the .stop-btn 
const stopBtn = document.querySelector('.stop-btn');
// grab the .reset-btn
const resetBtn = document.querySelector('.reset-btn');
/* grab necessary elements ends */ 

// Recoger the body
const body = document.querySelector('body');
// Recoger mensaje de alerta
const message = document.querySelector('.message');
// Recoger la tabla de la página
const table = document.querySelector('.table');
// Recoger el interruptor
const toggleSwitch = document.getElementById('toggleSwitch');
// Recoger la fila 1 de la tabla
table.rows[2].style.backgroundColor = "black";
// Recoger el valor de la celda 1 de la fila 1
let minutes = table.rows[2].cells[1];
// Recoger el valor de la celda 2 de la fila 1
timeInput.value = minutes.innerHTML;
// Estado del cronometro
let running = false;
// Recoger botón de hide/esconder columnas
let hideBtn = document.querySelector('.hide-btn');
//Recoger imagen de botón
let hideImg = document.querySelector('.hide-btn-img');
//Recoger div de tabla
let tableDiv = document.querySelector('.columns');
/* global variables and constants */
// variable to store setInterval
let countDownInterval;
// secondsLeft in millisecond
let secondsLeftms;
// end time
let endTime;
// .stop-btn clicked or not
let stopBtnClicked = false;

/* global variables ends */

let newWindow = null;
window.addEventListener('beforeunload', function() {
  // Si la ventana secundaria está abierta, la cierra
  if (newWindow && !newWindow.closed) {
    newWindow.close();
  }
});
// Abre una nueva ventana
newWindow = window.open('./secondScreen.html', 'Cronómetro', '1');
// Obtiene el HTML del cronómetro
let countdownHTML = document.querySelector('.countdown').outerText;
// Agrega el HTML del cronómetro a la nueva ventana

newWindow.addEventListener('load', function() {
// Ahora puedes acceder a los elementos de la nueva ventana
newWindow.document.body.querySelector('.second-counter').innerText = countdownHTML;
});;


/* AGREGANDO NUEVOS MÉTODOS */
hideBtn.addEventListener('click', (event) => {
  // Prevenir que se recargue la página
  event.preventDefault();
  if(tableDiv.style.display === "none"){
    //Cambier display a flex
    tableDiv.setAttribute('style', 'display: flex');
    //Cambiar imagen de botón
    hideImg.src = "./imgs/view.png";
    // Cambiar display de body
    document.querySelector('body').setAttribute('style', 'justify-content: left;');
    document.querySelector('.countdown').setAttribute('style', 'font-size: 7.5rem;');
    document.querySelector('.counter').setAttribute('style', 'width:65%;');
    return;
  }
  else{
    //Cambiar opacity de mensaje
    message.style.opacity = "0";
    //Cambiar display a none
    tableDiv.setAttribute('style', 'display: none');
    //Cambiar imagen de botón
    hideImg.src = "./imgs/hide.png";
    // Cambiar display de body
    document.querySelector('body').setAttribute('style', 'justify-content: center');
    document.querySelector('.countdown').setAttribute('style', 'font-size: 11rem;');
    document.querySelector('.counter').setAttribute('style', 'width:100%;');
    return;
  }
});

timeInput.addEventListener('input', () => {
  let hours = Math.floor(timeInput.value / 60);
  let minutes = timeInput.value % 60;
  let timeString = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":00";
  let countDown = document.querySelector('.countdown');
  countDown.innerHTML = timeString;
  for (let i = 1; i < table.rows.length; i++) {
    table.rows[i].style.backgroundColor = "darkgray";
  }
});
function assignEventHandlers(){
  document.querySelectorAll('a[row-num]').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if(running === true){
        alert("Debes detener el cronometro antes de cambiar el tiempo.");
      }
      else{
        let row = parseInt(link.getAttribute('row-num'));
        row = row + 1;
        let minute = table.rows[row].cells[1].innerHTML;
        let countDown = document.querySelector('.countdown');
        for(let i = 1; i < table.rows.length; i++) {
          table.rows[i].style.backgroundColor = "darkgray";
        }
        if(minute < 10) {
          countDown.innerHTML = "00:0" + minute + ":00";
        }
        else{
          countDown.innerHTML = "00:" + minute + ":00";
        }
        table.rows[row].style.backgroundColor = "black";
        timeInput.value = minute;
      }
    });
  });
}


/* .stop-btn click listener */
stopBtn.addEventListener('click', () => {

  /* CAMBIANDO VALORES */
  
  form.setAttribute('style', 'display: block');
  resetBtn.setAttribute('style', 'opacity: 1');
  stopBtn.setAttribute('style', 'opacity: 1');

  // toggle the value of 'stopBtnClicked'
  stopBtnClicked = !stopBtnClicked;

  // if STOP button is clicked
  if (stopBtnClicked === true) {
    // change the text to 'Continuar'
    stopBtn.innerHTML = 'Continuar';
    // enable the .reset-btn
    resetBtn.disabled = false;
    // clear the setInterval() inorder to freeze the countdown timer
    clearInterval(countDownInterval);
    // calculate how many milliseconds is left to reach endTime from now
    secondsLeftms = endTime - Date.now();
  } 
  // if Continuar button is clicked
  else if (stopBtnClicked === false) {
    // then change text to 'Detener'
    stopBtn.innerHTML = 'Detener';
    // disable the .reset-btn
    resetBtn.disabled = true;
    // then update endTime
    endTime = secondsLeftms + Date.now();
    // set a new setInterval()
    countDownInterval = setInterval(() => {
      setCountDown(endTime);
    }, 0);
  }
});
/* .stop-btn click listener ends */

/* .reset-btn click listener */
resetBtn.addEventListener('click', () => {
  resetCountDown();
  running = false;
  /* Resetear valores */ 
  newWindow.document.body.style.backgroundColor = "black";
  stopBtn.setAttribute('style', 'opacity: 0.5');
  resetBtn.setAttribute('style', 'opacity: 0.5');
});
/* .reset-btn click listener ends */

/* .form submit listener */
form.addEventListener('submit', (event) => {
  // prevent the default page reloading
  event.preventDefault();
  // Cambiar estado del cronometro
  running = true;
  // get the countdown time user typed
  let countDownTime = timeInput.value;
  // check if it is not zero
  if (countDownTime > 0) {
    // check which is the format, ie the <select> element's value
      countDownTime = countDownTime * 60000;
    // get current time in milliseconds
    const now = Date.now();
    // calculate the ending time
    endTime = now + countDownTime;
    // activate the countdown at first
    setCountDown(endTime);
    countDownInterval = setInterval(() => {
      setCountDown(endTime);
    }, 10);
    // then disable the .set-btn
    setBtn.disabled = true;
    // then enable the .stop-btn
    stopBtn.disabled = false;
    // show message
    message.style.opacity = "0.5";
    setTimeout(() => {
      message.style.opacity = "0";
    }, 6500); 
  }

});
/* .form submit listener ends */

/* setCountDown function */
const setCountDown = (endTime) => {
  // calculate how many milliseconds is left to reach endTime from now
  let secondsLeftms = endTime - Date.now();
  // convert it to seconds
  let secondsLeft = Math.round(secondsLeftms / 1000);

  // calculate the hours, minutes and seconds
  let hours = Math.floor(Math.abs(secondsLeft) / 3600);
  let minutes = Math.floor(Math.abs(secondsLeft) / 60) - (hours * 60);
  let seconds = Math.abs(secondsLeft) % 60;

  // adding an extra zero infront of digits if it is < 10
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  // set the .countdown text
  let timeString = `${hours} : ${minutes} : ${seconds}`;
  if (secondsLeft < 0) {
    timeString = "-" + timeString;
    newWindow.document.body.style.backgroundColor = "red";
    stopBtn.setAttribute('style', 'opacity: 1');
    resetBtn.setAttribute('style', 'opacity: 1');
    resetBtn.innerHTML = "Finalizar";
  }
  else{
    // Agregando cambios de estilos 
    form.setAttribute('style', 'display: none');
    resetBtn.setAttribute('style', 'opacity: 0.5');
    stopBtn.setAttribute('style', 'opacity: 0.5');
  }
  countDown.innerHTML = timeString;
  // También actualiza el cronómetro en la nueva ventana, si existe
  if (newWindow) {
    // Recoger el texto del segundo cronómetro
    const secondCounter = newWindow.document.body.querySelector('.second-counter')
    secondCounter.innerHTML = countDown.outerHTML;
    secondCounter.style.margin = "0";
    secondCounter.style.padding = "0";

  }
};
/* setCountDown function ends */


/* resetCountDown function */
const resetCountDown = () => {
  // destroy the setInterval()
  clearInterval(countDownInterval);
  secondsLeft = 0;
  // reset the countdown text
  countDown.innerHTML = '00:00:00';
  // set stopBtnClicked = false
  stopBtnClicked = false;
  // change inner text to STOP
  stopBtn.innerHTML = 'Detener';

  // enable .set-btn
  setBtn.disabled = false;

  // disable .stop-btn and .reset-btn
  stopBtn.disabled = true;
  resetBtn.disabled = true;
  resetBtn.setAttribute('style', 'opacity: 0.5');
  stopBtn.setAttribute('style', 'opacity: 0.5');

   // Recorrer la tabla y buscar la que tiene el background negro
   for(let i = 1; i < table.rows.length; i++) {
    if(table.rows[i].style.backgroundColor === "black"){
      let nxtRow = i + 1;
      let countDown = document.querySelector('.countdown');
      for(let i = 1; i < table.rows.length; i++) {
        if(table.rows[i].style.backgroundColor = "black"){
          table.rows[i].style.backgroundColor = "darkgray"
        }
      }
      i = 16;
      if(nxtRow === 9){
        nxtRow = nxtRow + 1;
      }
      if(!toggleSwitch.checked){
        if(nxtRow < 14){
          table.rows[nxtRow].style.backgroundColor = "black";
          let minute = table.rows[nxtRow].cells[1].innerHTML;
          if(minute < 10) {
            countDown.innerHTML = "00:0" + minute + ":00";
          }
          else{
            countDown.innerHTML = "00:" + minute + ":00";
          }
          timeInput.value = minute;
          table.rows[nxtRow].style.backgroundColor = "black";
        }
      }
      else if (toggleSwitch.checked){
        if(nxtRow < 4){
          table.rows[nxtRow].style.backgroundColor = "black";
          let minute = table.rows[nxtRow].cells[1].innerHTML;
          if(minute < 10) {
            countDown.innerHTML = "00:0" + minute + ":00";
          }
          else{
            countDown.innerHTML = "00:" + minute + ":00";
          }
          timeInput.value = minute;
          table.rows[nxtRow].style.backgroundColor = "black";
        }
      }
    }
  }
    /* CAMBIANDO VALORES */
    form.setAttribute('style', 'display: block');
    resetBtn.setAttribute('style', 'opacity: 1');
    stopBtn.setAttribute('style', 'opacity: 1');
    // También actualiza el cronómetro en la nueva ventana, si existe
    if (newWindow) {
      newWindow.document.body.querySelector(".second-counter").innerText = countDown.innerText;
    }
    return;
};
/* resetCountDown function ends */

const tableContent1 = `
  <tr>
    <td colspan="3">Reunión de Entre Semana</td>
  </tr>
  <tr>
    <th>Tema / Asignación</th>
    <th>Min.</th>
    <th>Accion</th>
  </tr>
  <tr>
    <td contenteditable="true">Palabras de Introducción</td>
    <td contenteditable="true">1</td>
    <td>
      <a href="" style="font-size: small;" row-num="1">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td contenteditable="true">Discurso de Tesoros de la Biblia</td>
    <td contenteditable="true">10</td>
    <td>
      <a href="" style="font-size: small;" row-num="2">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td contenteditable="true">Busquemos Perlas Escondidas</td>
    <td contenteditable="true">10</td>
    <td>
      <a href="" style="font-size: small;" row-num="3">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td contenteditable="true">Lectura de la Biblia</td>
    <td contenteditable="true">4</td>
    <td>
      <a href="" style="font-size: small;" row-num="4">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td contenteditable="true">Asignacion 1</td>
    <td contenteditable="true">0</td>
    <td>
      <a href="" style="font-size: small;" row-num="5">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td contenteditable="true">Asignacion 2</td>
    <td contenteditable="true">0</td>
    <td>
      <a href="" style="font-size: small;" row-num="6">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td contenteditable="true">Asignacion 3</td>
    <td contenteditable="true">0</td>
    <td>
      <a href="" style="font-size: small;" row-num="7">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td colspan="3">Nuestra Vida Cristiana</td>
  </tr>
  <tr>
    <td contenteditable="true">Parte 1</td>
    <td contenteditable="true">15</td>
    <td>
      <a href="" style="font-size: small;" row-num="9">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td contenteditable="true">Parte 2</td>
    <td contenteditable="true">0</td>
    <td>
      <a href="" style="font-size: small;" row-num="10">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td contenteditable="true">Estudio Bíblico de Congregación</td>
    <td contenteditable="true">30</td>
    <td>
      <a href="" style="font-size: small;" row-num="11">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td contenteditable="true">Palabras de Conclusión</td>
    <td contenteditable="true">3</td>
    <td>
      <a href="" style="font-size: small;" row-num="12">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
`
const tableContent2 = `
  <tr>
  <td colspan="3">Reunión de Fin de Semana</td>
  </tr>
  <tr>
    <th>Tema / Asignación</th>
    <th>Min.</th>
    <th>Accion</th>
  </tr>
  <tr>
    <td contenteditable="true">Discurso Público</td>
    <td contenteditable="true">30</td>
    <td>
      <a href="" style="font-size: small;" row-num="1">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
  <tr>
    <td contenteditable="true">Estudio de la Atalaya</td>
    <td contenteditable="true">60</td>
    <td>
      <a href="" style="font-size: small;" row-num="2">
        <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
      </a>
    </td>
  </tr>
`

// agrega un evento de escucha al interruptor
toggleSwitch.addEventListener('change', function() {
  if(this.checked) {
    table.innerHTML = tableContent2;
    table.rows[2].style.backgroundColor = "black";
  }
  else {
    table.innerHTML = tableContent1;
    table.rows[2].style.backgroundColor = "black";
  }
  assignEventHandlers();
});
assignEventHandlers();


/* EXPERIMENTO */

let dayOfWeek = new Date().getDay();

function changeTableContent(){
  if(dayOfWeek === 0 || dayOfWeek === 6){
    table.innerHTML = tableContent2;
    table.rows[2].style.backgroundColor = "black";
    toggleSwitch.checked = true;
  }
  else{
    table.innerHTML = tableContent1;
    table.rows[2].style.backgroundColor = "black";
    toggleSwitch.checked = false;
  }
  assignEventHandlers();
}
changeTableContent();
/* FIN DE EXPERIMENTO */


//Código a implementar (Cambio de tema)
/* themeBtn.addEventListener('click', (event) => {
  // Prevenir que se recargue la página
  event.preventDefault();
  console.log(body.style.backgroundColor);
  if(body.style.backgroundColor === "black"){
    //Cambier display a flex
    body.style.backgroundColor = "white";
    countDown.style.color = "black";
    return;
  }
  else{
    //Cambiar opacity de mensaje
    body.style.backgroundColor = "black";
    countDown.style.color = "white";
    document.querySelector('.min-sec').setAttribute('style', 'border: 2px solid black;');
    return;
  }
}); */

// HTML
/* 
<!-- botón flotante de day / night -->
<a class="theme-btn" href=""><img src="./imgs/sun.png" class="theme-btn-img"></a> 
*/

// CSS
/* 
.theme-btn {
  position: fixed;
  right: 1rem;
  top: 1rem;
  padding: 0.25rem;
  height: 1rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  font-size: large;
  background-color: white;
}
*/
let isSharing = false;
let stream;

document.getElementById('share-screen').addEventListener('click', function() {
  const img = document.querySelector('.share-screen-img');
  const video = newWindow.document.getElementById('screen-video');
  const secondCounter = newWindow.document.body.querySelector('.second-counter');
  const originalStyles = secondCounter.style.cssText;

  console.log(originalStyles)
  if (!isSharing) {
    navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    })
      .then(mediaStream => {
        this.style = "background-color: green;"
        stream = mediaStream;
        isSharing = true;
        img.src = "./imgs/stop.png";
        video.srcObject = stream;
        video.play();
        video.hidden = false;
        secondCounter.style = "background-color: gray;position: absolute; top: 0%; left: 0%; transform: translate(-0%, -0%); font-size: 10rem; color: white; margin: 0; padding: 0;";
        stream.getTracks()[0].addEventListener('ended', () => {
          secondCounter.style.cssText = originalStyles;
          video.hidden = true;
          //Cambiar la imagen del botón
          img.src = "./imgs/share-screen.png";
          this.style = "background-color: none;"
        });
      })
      .catch(error => {
        console.error('Error al acceder a la pantalla', error);
      });
  } else {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    isSharing = false;
    video.hidden = true;
    img.src = "./imgs/share-screen.png";
    secondCounter.style.cssText = "background-color: none";
    this.style = "background-color: none;"
  }
});