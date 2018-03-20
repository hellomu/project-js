(()=>{
	//加载轮播图

	//加载首页商品
	ajax({
		type:"get",
		url:"data/routes/products/index_product.php",
		dataType:"json"
	}).then(products=>{
		console.log(products.banner);
		var html="",inds="";
		for(var img of products.banner){
			html+=`
			<li>
			<a href="${img.href}">
			  <img src="${img.img}">
			</a>
		  </li> 
			`;
			inds+=`
			<li></li>
			`
		}
		var timer=null,key=0,circle=0,liWidth=960;
		var bannerImg=document.querySelector(".banner-img");
		bannerImg.innerHTML=html;
		console.log(bannerImg.style.width)
		bannerImg.appendChild(bannerImg.children[0].cloneNode(true));
		var indicatiors=document.querySelector(".indicators");
		indicatiors.innerHTML=inds;
		var html="";
		//遍历recommended数组中的每个商品
		for(var i=0;i<products.recommended.length;i++){
			var p=products.recommended[i];
			if(i<2){
				html+=`
					<div>
						<div class="desc">
							<p class="name">${p.title}</p>
							<p class="details">${p.details}</p>
							<p class="price">¥${p.price}</p>
							<a href="${p.href}" class="view">查看详情</a>
						</div>
						<img src="${p.pic}">
					</div> 
				`;
			}else if(i==2){
				html+=`
					<div>
						<div class="desc">
							<p class="name">${p.title}</p>
							<p class="price">¥${p.price}</p>
							<a href="${p.href}" class="view">查看详情</a>
						</div>
						<img src="${p.pic}">
					</div>	
				`
			}else{
				html+=`
					<div class="product">
						<img src="${p.pic}">
						<p class="name">${p.title}</p>
						<p class="price">¥${p.price}</p>
						<a href="${p.href}">查看详情</a>
					</div>	
				`			
			}
		}
		//遍历结束后
		//设置id为f1下的class为floor-content的div的内容为html
		document.querySelector("#f1>.floor-content")
			      .innerHTML=html;
		html="";
		for(var i=0;i<products.new_arrival.length;i++){
			var p=products.new_arrival[i];
			if(i<2){
				html+=`
					<div>
						<div class="desc">
							<p class="name">${p.title}</p>
							<p class="details">${p.details}</p>
							<p class="price">¥${p.price}</p>
							<a href="${p.href}" class="view">查看详情</a>
						</div>
						<img src="${p.pic}">
					</div> 
				`;
			}else if(i==2){
				html+=`
					<div>
						<div class="desc">
							<p class="name">${p.title}</p>
							<p class="price">¥${p.price}</p>
							<a href="${p.href}" class="view">查看详情</a>
						</div>
						<img src="${p.pic}">
					</div>	
				`
			}else{
				html+=`
					<div class="product">
						<img src="${p.pic}">
						<p class="name">${p.title}</p>
						<p class="price">¥${p.price}</p>
						<a href="${p.href}">查看详情</a>
					</div>	
				`			
			}
		}
		//遍历结束后
		//设置id为f2下的class为floor-content的div的内容为html
		document.querySelector("#f2>.floor-content")
			      .innerHTML=html;
		html="";
		for(var i=0;i<products.top_sale.length;i++){
			var p=products.top_sale[i];
			if(i<2){
				html+=`
					<div>
						<div class="desc">
							<p class="name">${p.title}</p>
							<p class="details">${p.details}</p>
							<p class="price">¥${p.price}</p>
							<a href="${p.href}" class="view">查看详情</a>
						</div>
						<img src="${p.pic}">
					</div> 
				`;
			}else if(i==2){
				html+=`
					<div>
						<div class="desc">
							<p class="name">${p.title}</p>
							<p class="price">¥${p.price}</p>
							<a href="${p.href}" class="view">查看详情</a>
						</div>
						<img src="${p.pic}">
					</div>	
				`
			}else{
				html+=`
					<div class="product">
						<img src="${p.pic}">
						<p class="name">${p.title}</p>
						<p class="price">¥${p.price}</p>
						<a href="${p.href}">查看详情</a>
					</div>	
				`			
			}
		}
		//遍历结束后
		//设置id为f1下的class为floor-content的div的内容为html
		document.querySelector("#f3>.floor-content")
				  .innerHTML=html;
		//轮播图
		function animate(obj,target){
			clearInterval(obj.timer);
			obj.timer=setInterval(()=>{
				var speed=obj.offsetLeft<target?30:-30;
				var result=target-obj.offsetLeft;
				obj.style.left=obj.offsetLeft+speed+"px";
				if(Math.abs(result)<=Math.abs(speed)){
					clearInterval(obj.timer);
					obj.offsetLeft=target;
				}
			},10)
		}
		//var timer=null,key=0,circle=0,liWidth=960;
		var bannerLis=bannerImg.children;
		timer=setInterval(()=>{
			key+=1;
			if(key>bannerLis.length-1){
				bannerImg.style.left=0;
				key=1;
			}
			animate(bannerImg,-key*liWidth);
		},3000)
	})
})();