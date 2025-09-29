let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    async function loadProject() {
      let res = await fetch(`/p/${id}`);
      let obj = await res.json();
      document.getElementById("title").innerText = obj.name;
      document.getElementById("desc").innerText = obj.description;
      document.getElementById("img").src = "../uploads/" + obj.Myfilename;
      document.getElementById("ratingInfo").innerText = "דירוג נוכחי: " + (obj.rating || 0).toFixed(2);
    }

 async function rate(score) {
      let res = await fetch(`/p/${id}/rate`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ score })
      });
      let data = await res.json();
      alert(data.message);
      loadProject();
    }

 

    loadProject();