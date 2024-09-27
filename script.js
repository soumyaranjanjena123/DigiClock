let alarmTime = null;
let alarmTimeout = null;
let stopwatchInterval = null;
let elapsedTime = 0;



let isStopwatchRunning = false;

let isStopped = false;


const alarmSound = new Audio('FM9B3TC-alarm.mp3')

// Function to update the clock based on the selected region
const updateClock = (region) => {
    let now = new Date();
    
    switch(region) {
        case 'asia':
            now = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
            break;
        case 'africa':
            now = new Date(now.toLocaleString("en-US", {timeZone: "Africa/Johannesburg"}));
            break;
        case 'europe':
            now = new Date(now.toLocaleString("en-US", {timeZone: "Europe/London"}));
            break;
        case 'us':
            now = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
            break;
        case 'uk':
            now = new Date(now.toLocaleString("en-US", {timeZone: "Europe/London"}));
            break;
        default:
            break;
    }

    let hours = now.getHours();
    let redim = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, 0);

    const minute = now.getMinutes().toString().padStart(2, 0);
    const seconds = now.getSeconds().toString().padStart(2, 0);

    let timeString = `${hours}:${minute}:${seconds} ${redim}`;
    document.getElementById("clock").textContent = timeString;

    return timeString;
};


const themImages = document.querySelectorAll('.themeImages img');
let currentThemeIndex = 0

const changeTheme=()=>{
    const body = document.body
    currentThemeIndex = (currentThemeIndex +1) % themImages.length

    const newTheme =themImages[currentThemeIndex].src


    body.style.backgroundImage = `url(${newTheme})`
    body.style.backgroundSize = "cover"
    body.style.backgroundPosition= 'center'
    body.style.transition = 'background 0.5s ease'
};


document.getElementById('themeChange').addEventListener('click',changeTheme)


document.getElementById('region').addEventListener('change', (e) => {
    const region = e.target.value;
    updateClock(region);
    clearInterval(clockInterval);
    clockInterval = setInterval(() => updateClock(region), 1000);
});


const speakTime = () => {
    const timeText = document.getElementById("clock").textContent;
    const speech = new SpeechSynthesisUtterance(`The time is ${timeText}`);
    window.speechSynthesis.speak(speech);
};


document.getElementById('alarm').addEventListener('click', () => {
    const alarmHour = prompt("Enter alarm hour (HH)");
    const alarmMinute = prompt("Enter alarm minute (MM)");
    const ampm = document.getElementById('ampm').value;

    alarmTime = `${alarmHour.padStart(2, '0')}:${alarmMinute.padStart(2, '0')}:00 ${ampm.toUpperCase()}`;
    checkAlarm();

    document.getElementById("alarmTimeDisplay").textContent= `Alarm set for: ${alarmTime}`
});


const checkAlarm = () => {
    if (alarmTime === document.getElementById("clock").textContent) {
        alarmTimeout = setTimeout(() => {
            alert("Alarm ringing!");
            stopAlarm();
            playAlramSound()
        }, 1000);
    } else {
        alarmTimeout = setTimeout(checkAlarm, 1000);
    }
};


const playAlramSound = ()=>{
    alarmSound.loop = true;
    alarmSound.play()
};


// Stop the alarm
const stopAlarm = () => {
    clearTimeout(alarmTimeout);
    alarmTime = null;
    document.getElementById("alarmTimeDisplay").textContent = "";
    alarmSound.pause();
    
};





// Reminder

const reminderDateInput = document.getElementById('reminderDate')

const reminderTimeInput = document.getElementById('reminderTime')

const reminderCauseInput = document.getElementById('reminderCause')

const reminderList = document.getElementById('reminderList')

const setReminderBtn = document.getElementById('setReminderBtn')


const loadReminders=()=>{
    const reminders = JSON.parse(localStorage.getItem('reminders')) || []
    reminderList.innerHTML = '';
    reminders.forEach(reminder=>{
        const li = document.createElement('li')
        li.textContent=`${reminder.date} ${reminder.time} - ${reminder.cause}`
        reminderList.appendChild(li);
    })
}

const setReminder =()=>{
    const reminderDate = reminderDateInput.value;

    const reminderTime = reminderTimeInput.value;

    const reminderCause = reminderCauseInput.value;


    if(!reminderDate || !reminderTime || ! reminderCause){
        alert("Please fill all the fields")
        return;
    }

    const reminder ={
        date: reminderDate,
        time: reminderTime,
        cause: reminderCause
    }

    let reminders = JSON.parse(localStorage.getItem('reminders')) ||[]

    reminders.push(reminder);

    
    localStorage.setItem('reminders', JSON.stringify(reminders));

    
    loadReminders();

    
    reminderDateInput.value = '';
    reminderTimeInput.value = '';
    reminderCauseInput.value = '';
};
    

const checkReminders=()=>{
    const now = new Date();

    const currentDate = now.toISOString().split("T")[0]
    const currentTime = now.toTimeString().split(' ')[0].substring(0,5)


    const reminders = JSON.parse(localStorage.getItem('reminders')) || []

    reminders.forEach((reminder,index)=>{
        if(reminder.date === currentDate && reminder.time === currentTime){

            alert(`Remnder: ${reminder.cause}`)

            reminders.splice(index,1);
            localStorage.setItem('reminders',JSON.stringify(reminders));
            loadReminders()
        }
    })



}



setReminderBtn.addEventListener('click',setReminder)



loadReminders()

setInterval(checkReminders,60000)





// StopWatch


const formatTime = (ms) => {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
};


// Stopwatch functionality
document.getElementById('startStopW').addEventListener('click', () => {

    if(isStopped){

        elapsedTime= 0
        document.getElementById("stopWatch").textContent = formatTime(elapsedTime)

        isStopped = false
    }

    if (!isStopwatchRunning) {
        isStopwatchRunning = true;
        stopwatchInterval = setInterval(() => {
            elapsedTime += 1000;
            document.getElementById("stopWatch").textContent = formatTime(elapsedTime);
        }, 1000)
    }
})

document.getElementById('pauseStopW').addEventListener('click', () => {

    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
})


document.getElementById('watchReset').addEventListener('click',()=>{


    clearInterval(stopwatchInterval)

    isStopwatchRunning = false

    elapsedTime = 0


    document.getElementById('stopWatch').textContent = "00:00:00"
})


document.getElementById('stopStopW').addEventListener('click', () => {

    if(isStopwatchRunning){


        clearInterval(stopwatchInterval)
        
        
        isStopwatchRunning = false; 


        isStopped =true

    }
})





let clockInterval = setInterval(() => updateClock('asia'), 1000);
