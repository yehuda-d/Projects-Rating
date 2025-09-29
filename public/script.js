function addTitle(){
    let txt = "Projects Rating"
    document.getElementById("h1").innerText = txt;
}

async function getData() {
    try {
        let response = await fetch('/p');
        let data = await response.json();
        createGrid(data);
    } catch (err) {
        alert(err);
    }
}

function createGrid(data){
    let txt = "";
    for (obj of data) {
        if(obj){
            txt+=
            `<div class="card">
                    <div>
                    <img src="../uploads/${obj.Myfilename}?t=${Date.now()}" alt="${obj.name}">
                    <p>${obj.name}</p>
                    <div>${obj.description}</div>
                </div>
                <div>
                    <button onclick="deleteProduct(${obj.id})">Delete</button>
                    <button onclick="getById(${obj.id})">Edit</button>
                </div>
            </div>`
        }
    }
    document.getElementById("main").innerHTML = txt;
}


//עוד לא עשיתי קומיט ופוש לפונקציות האלו כי הן עוד לא עובדות
async function addProject(){
    try {
        let name = document.getElementById("name").value;
        let description = document.getElementById("description").value;
        let myFile = document.getElementById("myFile").files[0];
        let formData = new FormData();
        formData.append('name',name);
        formData.append('description',description);
        if(myFile){
            formData.append('myFile',myFile);
        }
        await fetch('/p',{
            method: 'POST',
            body:formData
        })
        getData();
        clearInputs();
    } catch (err) {
        alert(err);
    }
}

function clearInputs(){
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("myFile").value = "";
    document.getElementById("myImage").src = "";
}




getData();
addTitle();

