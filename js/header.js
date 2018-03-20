//加载index.html->自动执行header.js
(()=>{
	function loadStatus(){
		//判断登录:
		var loginList=document.getElementById("loginList");
		var welcomeList=document.getElementById("welcomeList");
		ajax({
			type:"get",
			url:"data/routes/users/isLogin.php"
		}).then(data=>{//data:{ok:1,uname:xxx}
			if(data.ok==1){
				loginList.style.display="none";
				welcomeList.style.display="block";
				document.getElementById("uname").innerHTML=data.uname;
			}else{
				loginList.style.display="block";
				welcomeList.style.display="none";
			}
		});
	}
	//向header.html发送ajax get请求
	ajax({
		type:"get",
		url:"header.html",
		dataType:"html"
	})
	//然后，将获得的html片段，设置为header的内容
	.then(html=>{
		var header=document.getElementById("header");
		header.innerHTML=html;
		if(location.search){
			document.getElementById("txtSearch").value=
			decodeURI(location.search.split("=")[1]);
		}
		var search=document.querySelector("[data-trigger=search]");
		search.onclick=e=>{
			var tar=e.target;
			var kw=
			document.getElementById("txtSearch").value.trim();
			if(kw!==""){
				location="products.html?kw="+kw;
			}
		}
		loadStatus();

		//注销: 
		document.getElementById("logout").onclick=()=>{
			ajax({
				type:"get",
				url:"data/routes/users/logout.php",
				dataType:"text"
			}).then(()=>{
				location.reload();
			})
		}
	})
})();