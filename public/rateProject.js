let params = new URLSearchParams(window.location.search);
    let id = Number(params.get("id"));

    async function loadProject() {
        try{
            console.log("טוען פרויקט id=", id);
      let res = await fetch(`/p/${id}`);
       console.log("סטטוס:", res.status);
      let obj = await res.json();
      console.log("האובייקט:", obj);
      document.getElementById("title").innerText = obj.name;
      document.getElementById("desc").innerText = obj.description;
      document.getElementById("img").src = "/uploads/" + obj.Myfilename;
      document.getElementById("ratingInfo").innerText = obj.rating ? `דירוג נוכחי: ${(obj.rating || 0).toFixed(2)} (${obj.ratingCount} מדרגים)`
       : "עדיין אין דירוגים";
    }catch(err){
         console.error("שגיאה בטעינת הפרויקט:", err);
        alert( "שגיאה בטעינת הפרויקט" + err);
    }
    }

 async function rate(score) {
    //קבלת רשימת פרויקטים שכבר דורגו
    let ratedProjects = JSON.parse(localStorage.getItem("ratedProjects") || "[]");

                console.log("localStorage:", localStorage.getItem("ratedProjects"));
console.log("id הנוכחי:", id, "typeof:", typeof id);

    ratedProjects = ratedProjects.map(String);
    //בדיקה אם הפרויקט דורג כבר
    if (ratedProjects.includes(String(id))) {
        alert("כבר דירגת פרויקט זה");
        return;
    }
    try {
        let res = await fetch(`/p/${id}/rate`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ score })
        });
        let data = await res.json();
        if(res.ok){
            alert(data.message);
            ratedProjects.push(String(id));
            localStorage.setItem("ratedProjects", JSON.stringify(ratedProjects));
        
        loadProject();
    }else{
        alert("שגיאה:" + data.message);
    }
        
    }  catch(err){
        alert("שגיאה בשרת" + err);
    }
}
 
    document.getElementById("rate1").onclick = () => rate(1);
    document.getElementById("rate2").onclick = () => rate(2);
    document.getElementById("rate3").onclick = () => rate(3);
    document.getElementById("rate4").onclick = () => rate(4);
    document.getElementById("rate5").onclick = () => rate(5);
    
    
    loadProject();