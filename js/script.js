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

// Recoger the body
const body = document.querySelector('body');

// Recoger mensaje de alerta
const message = document.querySelector('.message');

// Recoger la tabla de la página
const table = document.querySelector('.table');

// Recoger la fila 1 de la tabla
table.rows[1].style.backgroundColor = "black";

// Recoger el valor de la celda 1 de la fila 1
let minutes = table.rows[1].cells[1];

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

/* grab necessary elements ends */ 

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

document.querySelectorAll('a[row-num]').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if(running === true){
        alert("Debes detener el cronometro antes de cambiar el tiempo.");
      }
      else{
        let row = link.getAttribute('row-num');
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
  body.style.backgroundColor = "black";
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
    body.style.backgroundColor = "red";
    stopBtn.setAttribute('style', 'opacity: 1');
    resetBtn.setAttribute('style', 'opacity: 1');
  }
  else{
    // Agregando cambios de estilos 
    form.setAttribute('style', 'display: none');
    resetBtn.setAttribute('style', 'opacity: 0.5');
    stopBtn.setAttribute('style', 'opacity: 0.5');
  }
  countDown.innerHTML = timeString;
};
/* setCountDown function ends */


/* resetCountDown function */
const resetCountDown = () => {
  // destroy the setInterval()
  clearInterval(countDownInterval);
  secondsLeft = 0;
  // reset the countdown text
  countDown.innerHTML = '00 : 00 : 00';
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

};
/* resetCountDown function ends */