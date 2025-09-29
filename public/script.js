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
            `<div class="card" onclick="openProject(${obj.id})">
                    <div>
                    <img src="../uploads/${obj.Myfilename}?t=${Date.now()}" alt="${obj.name}">
                    <p>${obj.name}</p>
                    <div>${obj.description}</div>
                </div>
                <div>
                    <button onclick="deleteProject(event,${obj.id})">מחיקה</button>
                    <button onclick="getById(event,${obj.id})">עריכה</button>
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

async function deleteProject(event,id) {
    event.stopPropagation(); // מונע פתיחת openProject
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

async function getById(event,id) {
    event.stopPropagation();
   try {
    let response = await fetch(`/p/${id}`);
    let obj = await response.json();
    document.getElementById('id').value = obj.id;
    document.getElementById('name').value = obj.name;
    document.getElementById('description').value = obj.description;
    document.getElementById('myImage').src = "../uploads/" + obj.Myfilename;
//     document.getElementById("ratingInfo").innerText = 
//    obj.rating ? `דירוג נוכחי: ${obj.rating.toFixed(2)} (${obj.ratingCount} מדרגים)` 
//               : "עדיין אין דירוגים";
    
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

   function openProject(id){
    // נפתח דף חדש עם query string של id
    window.open(`rateProject.html?id=${id}`, "_blank");
}

getData();
addTitle();

