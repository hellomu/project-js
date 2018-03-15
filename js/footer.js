(()=>{
    ajax({
        type:"get",
        url:"footer.html",
        dataType:"text"
    }).then((text)=>{
    var footer=document.getElementById("footer");
    footer.innerHTML=text;
    })
})()