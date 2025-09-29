function addTitle(){
    let txt = "דירוג פרוייקטים"
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
                    <button onclick="deleteProject(${obj.id})">מחיקה</button>
                    <button onclick="getById(${obj.id})">עריכה</button>
                </div>
            </div>`
        }
    }
    document.getElementById("main").innerHTML = txt;
}


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

async function deleteProject(id) {
    try {
        if(confirm('האם אתה בטוח שברצומך למחוק?')){
            await fetch(`/p/${id}`,{
                method: 'DELETE'
        })
        getData();
        }
    } catch (err) {
        alert(err)
    }
}

async function getById(id) {
   try {
    let response = await fetch(`/p/${id}`);
    let obj = await response.json();
    console.log(obj);
    document.getElementById('id').value = obj.id;
    document.getElementById('name').value = obj.name;
    document.getElementById('description').value = obj.description;
    document.getElementById('myImage').src = "../uploads/" + obj.Myfilename;
    console.log(obj.Myfilename);
    
   } catch (err) {
    alert(err);
   } 
}

async function editProject(id) {
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
        await fetch(`/p/${id}`,{
            method: 'PATCH',
            body: formData
        })
        getData();
        clearInputs();
    } catch (err) {
        alert(err);
    }
}

function addOrEdit(){
    let id = document.getElementById('id').value;
    if(id){
        editProject(id);
    }else{
        addProject();
    }
}


getData();
addTitle();

