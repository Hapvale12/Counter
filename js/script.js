/* grab necessary elements */
const form = document.querySelector('.form');
const timeInput = document.querySelector('.time-input');
const format = document.querySelector("select[name='format']");
const setBtn = document.querySelector('.set-btn');
const countDown = document.querySelector('.countdown');
const stopBtn = document.querySelector('.stop-btn');
const resetBtn = document.querySelector('.reset-btn');
const body = document.querySelector('body');
const table = document.querySelector('.table');
const toggleSwitch = document.getElementById('toggleSwitch');
const title = document.getElementById('title_meeting');
const show_message = document.getElementById('show_message');
let hideBtn = document.querySelector('.hide-btn');
let hideImg = document.querySelector('.hide-btn-img');
let tableDiv = document.querySelector('.columns');

/* global variables and constants */
// Estado del cronometro
let running = false;
// variable to store setInterval
let countDownInterval;
// secondsLeft in millisecond
let secondsLeftms;
// end time
let endTime;
// .stop-btn clicked or not
let stopBtnClicked = false;
// json data meetings
let data_meeting_json = [];
// Path del archivo Json con los meetings
const path_json_data = "./json_data/meetings.json"
// Obteniendo el día (de 0 a 6) de la semana
const day = new Date().getDay();
// Verificar si el día es entre semana o fin de semana
let check_meeting_day = (day >= 1 && day <= 5) ? true : false;
let countdownHTML = '';
// grab the secondScreenText
let secondScreenText = "";
/* global variables ends */

let newWindow = null;
window.addEventListener('beforeunload', function () {
    // Si la ventana secundaria está abierta, la cierra
    if (newWindow && !newWindow.closed) {
        newWindow.close();
    }
});
window.addEventListener('load', async function () {
    let data_temp = await fetch(path_json_data)
    data_meeting_json = await data_temp.json()
    // Marca el Switch
    toggleSwitch.checked = check_meeting_day;
    // Crea la tabla usando el Json
    load_table_meeting();
    // Evento para capturar el click en el Link [a]
    assignEventHandlers();
    const filter_meeting = data_meeting_json.filter((x) => {
        return x.sesion == (check_meeting_day ? 'ministerio' : 'finde');
    });
    timeInput.value = filter_meeting[0].tiempo;
    countDown.innerHTML = filter_meeting[0].tiempo + ":00";
    // Abre una nueva ventana
    newWindow = window.open('./secondScreen.html', 'Cronómetro', '1');
    // Obtiene el HTML del cronómetro
    countdownHTML = document.querySelector('.countdown').outerText;
    // Agrega el HTML del cronómetro a la nueva ventana
    newWindow.addEventListener('load', function () {
        // Ahora puedes acceder a los elementos de la nueva ventana
        secondScreenText = newWindow.document.body.querySelector('.second-counter');
        secondScreenText.innerText = countdownHTML;
        
    // Agregamos la hora actual a la segunda pantalla
    // Este será flotante y estará fijo en la parte superior derecha. (Su clase es 'datetime')
    const currentDate = new Date();
    let DateTimeField = newWindow.document.querySelector('.datetime');
    if (DateTimeField) {
        DateTimeField.innerText = currentDate.toLocaleString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        DateTimeField.style.position = "fixed";
        DateTimeField.style.top = "0";
        DateTimeField.style.right = "0";
        DateTimeField.style.padding = "10px";
        DateTimeField.style.backgroundColor = "rgba(94, 94, 94, 0.5)";
        DateTimeField.style.color = "white";
        DateTimeField.style.fontSize = "10rem";
        DateTimeField.style.zIndex = "1000"; // Asegura que esté por encima de otros elementos
    }
    // Agregamos el evento para actualizar la hora cada segundo
    setInterval(() => {
        const currentDate = new Date();
        if (DateTimeField) {
            DateTimeField.innerText = currentDate.toLocaleString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }, 1000);
    });


});



show_message.addEventListener('click', (event) => {
    if (newWindow) {
        // Recoger el texto del segundo cronómetro
        const message_text_first = document.getElementById('message-text')
        if (message_text_first.value != '') {
            // Envía el mensahe a la 2da pantalla
            const message_text_second = newWindow.document.getElementById('message_text')
            if (event.target.innerHTML == 'Mostrar') {
                message_text_second.innerHTML = message_text_first.value;
                message_text_second.className = 'message-text-show';
                // Cambia el texto del botón
                event.target.innerHTML = "Ocultar"
            } else {
                event.target.innerHTML = "Mostrar"
                message_text_first.value = ''
                message_text_second.innerHTML = ''
                message_text_second.className = 'message-text-hide';
            }
        }
    }
})
/* AGREGANDO NUEVOS MÉTODOS */
hideBtn.addEventListener('click', (event) => {
    // Prevenir que se recargue la página
    event.preventDefault();
    if (tableDiv.style.display === "none") {
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
    else {
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
    let minutes = Math.floor(timeInput.value);
    let seconds = (timeInput.value * 60) % 60;
    let timeString = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + Math.floor(seconds);
    countDown.innerHTML = timeString;
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].style.backgroundColor = "darkgray";
    }
});
function assignEventHandlers() {
    document.querySelectorAll('a[row-num]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            if (running === true) {
                alert("Debes detener el cronometro antes de cambiar el tiempo.");
            }
            else {
                let row = parseInt(link.getAttribute('row-num'));
                row = row + 1;
                let minute = table.rows[row].cells[1].innerHTML;
                for (let i = 1; i < table.rows.length; i++) {
                    table.rows[i].style.backgroundColor = "darkgray";
                }
                if (minute < 10) {
                    countDown.innerHTML = "0" + minute + ":00";
                }
                else {
                    countDown.innerHTML = minute + ":00";
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
        }, 1000);
    }
});
/* .stop-btn click listener ends */

/* .reset-btn click listener */
resetBtn.addEventListener('click', () => {
    resetCountDown();
    running = false;
    /* Resetear valores */
    newWindow.document.body.style.backgroundColor = "black";
    countDown.setAttribute('style', 'color: white');
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
        }, 1000);
        // then disable the .set-btn
        setBtn.disabled = true;
        // then enable the .stop-btn
        stopBtn.disabled = false;
    }

});
/* .form submit listener ends */

/* setCountDown function */
const setCountDown = (endTime) => {
    // calculate how many milliseconds is left to reach endTime from now
    let secondsLeftms = endTime - Date.now();
    // convert it to seconds
    let secondsLeft = Math.round(secondsLeftms / 1000);

    // calculate the minutes and seconds
    let minutes = Math.floor(Math.abs(secondsLeft) / 60);
    let seconds = Math.abs(secondsLeft) % 60;

    // adding an extra zero infront of digits if it is < 10
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    // set the .countdown text
    let timeString = `${minutes} : ${seconds}`;

    // Change this
    if (secondsLeft < 0) {
        timeString = "-" + timeString;
        newWindow.document.body.style.backgroundColor = "red";
        countDown.setAttribute('style', 'color: red');
        stopBtn.setAttribute('style', 'opacity: 1');
        resetBtn.setAttribute('style', 'opacity: 1');
        resetBtn.innerHTML = "Finalizar";
    }
    else {
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
        secondCounter.innerText = countDown.outerText;
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
    countDown.innerHTML = '00:00';
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
    // Recorrer la tabla y buscar la fila que tiene el background negro
    for (let i = 1; i < table.rows.length; i++) {
        if (table.rows[i].style.backgroundColor === "black") {
            let nxtRow = i + 1;
            // Cambiar el color de fondo de la fila actual a "darkgray"
            table.rows[i].style.backgroundColor = "darkgray";
            if (nxtRow < table.rows.length) {
                // Actualizar el color de fondo de la siguiente fila a "black"
                table.rows[nxtRow].style.backgroundColor = "black";
                let minute = table.rows[nxtRow].cells[1].innerHTML;
                // Formatear y mostrar el tiempo
                countDown.innerHTML = minute < 10 ? "0" + minute + ":00" : minute + ":00";
                timeInput.value = minute;
            }
            else {
                table.rows[1].style.backgroundColor = "black";
                let minute = table.rows[1].cells[1].innerHTML;
                // Formatear y mostrar el tiempo
                countDown.innerHTML = minute < 10 ? "0" + minute + ":00" : minute + ":00";
                timeInput.value = minute;
            }
            break; // Salir del bucle después de encontrar y procesar la primera fila con fondo negro
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

function addrow(item_row, item_index, haslink = true) {
    let row = table.insertRow(-1); // We are adding at the end 
    // Create table cells
    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);

    // Add data to c1 and c2
    c1.setAttribute('contenteditable', true)
    c1.innerHTML = item_row.tema
    c2.setAttribute('contenteditable', true)
    c2.innerHTML = item_row.tiempo
    c3.innerHTML = haslink ? `<a href="" style="font-size: small;" row-num="` + (item_index) + `">
                  <img src="./imgs/right-arrow.png" alt="" height="20px" width="20px">
                </a>`: 'Acción'
}
// Asegúrate de que el toggle llame a load_table_meeting con su estado actual como argumento
toggleSwitch.addEventListener('change', function () {
    check_meeting_day = this.checked;
    load_table_meeting();
    assignEventHandlers();
});

function load_table_meeting() {
    table.innerHTML = "";
    const filter_meeting = data_meeting_json.filter((x) => {
        return x.sesion == (check_meeting_day ? 'ministerio' : 'finde');
    });
    addrow(
        {
            "tema": "Tema / Asignación",
            "tiempo": "Min."
        },
        0,
        false
    );
    filter_meeting.forEach((item_meeting, item_meeting_index) => {
        addrow(item_meeting, item_meeting_index);
    });
    title.innerText = check_meeting_day ? 'Reunión de Entre Semana' : 'Reunión de Fin de Semana';
    table.rows[1].style.backgroundColor = "black";
    timeInput.value = filter_meeting[0].tiempo;
    countDown.innerHTML = filter_meeting[0].tiempo + ":00";
    secondScreenText.innerText = filter_meeting[0].tiempo + ":00";
}

let isSharing = false;
let stream;

document.getElementById('share-screen').addEventListener('click', function () {
    const img = document.querySelector('.share-screen-img');
    const video = newWindow.document.getElementById('screen-video');
    const miniVideo = document.getElementById('mini-video');
    const secondCounter = newWindow.document.body.querySelector('.second-counter');
    const originalStyles = secondCounter.style.cssText;

    if (!isSharing) {
        navigator.mediaDevices.getDisplayMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 60 }
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

                miniVideo.srcObject = stream;
                miniVideo.play();
                miniVideo.hidden = false;
                miniVideo.style = "opacity: 1;"

                secondCounter.style = "background-color: gray;position: absolute; top: 0%; left: 0%; transform: translate(-0%, -0%); font-size: 13rem; opacity: 0.95";
                stream.getTracks()[0].addEventListener('ended', () => {
                    secondCounter.style.cssText = originalStyles;
                    video.hidden = true;
                    miniVideo.hidden = true;
                    miniVideo.style = "opacity: 0;"
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
        miniVideo.hidden = true;
        miniVideo.style = "opacity: 0;"
        img.src = "./imgs/share-screen.png";
        secondCounter.style.cssText = "background-color: none";
        this.style = "background-color: none;"
    }
});