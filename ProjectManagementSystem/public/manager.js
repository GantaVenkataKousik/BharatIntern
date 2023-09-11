const list = document.querySelector(".list");
const input = document.querySelector(".input");
const btn = document.querySelector(".btn");
const copyright = document.querySelector(".copyright");


const circle = document.querySelector(".circle");
const num = document.getElementById("num");
const loading = document.querySelector(".loading");
const to_do_list = document.querySelector(".to-do-list");


const taskCompleted = document.querySelector(".completed-list");




const taskListBottom = Math.max(
    list.getBoundingClientRect().bottom,
    taskCompleted.getBoundingClientRect().bottom
);


function handle_copyright(){

    const taskListBottom = Math.max(
        list.getBoundingClientRect().bottom,
        taskCompleted.getBoundingClientRect().bottom
    );
    const copyrightTop = copyright.getBoundingClientRect().top;
    if (taskListBottom >= copyrightTop) {
        copyright.style.display = "none";
    } else {
        copyright.style.display = "block";
    }
};


input.addEventListener("keyup", function(event) {
    
    handle_copyright()
    if (event.keyCode === 13) {
        event.preventDefault();
        add_task();
    }
});

function add_task() {

    if (input.value != "") {
        const usinput = document.createElement("p");
        const btn1 = document.createElement("button");
        const time = document.createElement("span");
        const edit = document.createElement("span");
        const icon = document.createElement("button");


        const now = new Date();
        const timeString = now.toLocaleTimeString();
        time.appendChild(document.createTextNode(timeString));
        edit.classList.add("edit");

        const textItem = input.value;
        input.value = "";
        usinput.appendChild(document.createTextNode(textItem));
        btn1.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        edit.innerHTML = '<i class="fa-solid fa-user-pen"></i>';
        edit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';


        const li = document.createElement("li");

        time.classList.add("time");
        edit.classList.add("edit");
        icon.classList.add("icon");
        btn1.classList.add("delete");
        usinput.classList.add("usinput");

        li.appendChild(usinput);
        li.appendChild(time);
        li.appendChild(edit);
        li.appendChild(icon);
        li.appendChild(btn1);

        li.classList.add("li")

        list.insertBefore(li, list.childNodes[0]);


        edit.addEventListener("click", function() {
            editTask(li);
        });

        btn1.addEventListener("click", function() { 
            handle_copyright();
            li.remove();

        });

        icon.addEventListener("click", () => {
            handle_copyright();
            if (edit.innerHTML === '<i class="fa-solid fa-pen-to-square"></i>') {
                completed_list(li);
            }

        })
    }
}

function completed_list(list_element) {
    const completed = document.querySelector(".completed-list");

    list_element.classList.add("completed-li");
    list_element.remove();


    const icon = list_element.querySelector(".icon");
    const edit = list_element.querySelector(".edit");
    const del = list_element.querySelector(".delete");
    const time = list_element.querySelector(".time");
    const input = list_element.querySelector(".usinput");


    icon.remove();
    edit.remove();


    time.classList.add("completed-time");
    del.classList.add("completed-del");
    input.classList.add("input-completed");


    const now = new Date();
    const timeString = now.toLocaleTimeString();
    time.innerText = `${timeString}`;

    completed.append(list_element);

}


function updateClock() {
    var now = new Date();
    var dname = now.getDay(),
        mon = now.getMonth(),
        dnum = now.getDate(),
        year = now.getFullYear(),
        hour = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds(),
        pe = 'AM';

    if (hour == 0) {
        hour = 12;
    }
    if (hour > 12) {
        hour = hour - 12;
        pe = "PM";
    }

    Number.prototype.pad = function(digit) {
        for (var n = this.toString(); n.length < digit; n = 0 + n);
        return n;
    }

    var months = ['January', 'febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


    var ids = ['day', 'month', 'datenum', 'year', 'hour', 'min', 'sec', 'fore-noon']

    var values = [week[dname], months[mon], dnum.pad(2), year, hour.pad(2), min.pad(2), sec.pad(2), pe]

    for (var i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).firstChild.nodeValue = values[i];
    }
}

function initClock() {
    window.setInterval("updateClock()", 1);
}


function editTask(li) {
    const usinput = li.querySelector(".usinput");
    const edit = li.querySelector(".edit");

    if (edit.innerHTML === '<i class="fa-solid fa-pen-to-square"></i>') {
        edit.innerHTML = "Save";
        const input = document.createElement("input");
        input.focus();
        input.classList.add("edit-input")
        input.classList.add("usinput");
        input.value = usinput.innerText;
        usinput.replaceWith(input);



        input.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                edit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
                const usinput = document.createElement("p");
                usinput.classList.add("usinput");
                usinput.appendChild(document.createTextNode(input.value));
                input.replaceWith(usinput);
            }
        });
    } else {
        edit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        const input = li.querySelector(".usinput");
        const usinput = document.createElement("p");
        usinput.classList.add("usinput");
        usinput.appendChild(document.createTextNode(input.value));
        input.replaceWith(usinput);
    }
}