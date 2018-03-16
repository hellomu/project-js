(()=>{
  if(location.search!=""){
      ajax({
          type:"get",
          url:"data/routes/products/getProductById.php",
          data:location.search.slice(1),
          dataType:"json"
      }).then(data=>{
          /*渲染页面*/
          console.log(data);
          var p=data.product;
          var imgs=data.imgs;
          var family=data.family;
          var div=document.getElementById("show-details");
          var title=div.querySelector("h1");
          var subtitle=div.querySelector("h3>a");
          var price=div.querySelector(".price>.stu-price>span");
          var promise=div.querySelector("div>.promise");
          title.innerHTML=p.title;
          subtitle.innerHTML=p.subtitle;
          price.innerHTML="¥"+p.price;
          promise.innerHTML=p.promise;
          var spec=div.querySelector(".spec>div");
          var html="";
          for(var laptop of family){
              html+=`
              <a href="product_details.html?lid=${laptop.lid}" class=${p.lid===laptop.lid?"active":""}
              }>${laptop.spec}</a>
              `
          }
          spec.innerHTML=html;
          /*添加购物车*/
          var account=div.querySelector(".account");
          account.addEventListener("click",function(e){
              var tar=e.target;
              if(tar.className=="number-reduce"||
            tar.className=="number-add"){
                var input=tar.parentNode.children[2];
                var n=parseInt(input.value);
                if(tar.className=="number-add"){
                    n+=1;
                }else {
                    if(n>1){
                        n-=1;
                    }
                }
                input.value=n;
            }
          })
          var shops=div.querySelector(".shops");
          shops.addEventListener("click",function(e){
            var tar=e.target;
            if(tar.nodeName=="A"){
                if(tar.className="cart"){
                    ajax({
                        type:"get",
                        url:"data/routes/users/isLogin.php"
                    }).then(text=>{
                        if(text.ok==0){
                            var url=encodeURIComponent(location.href);
                            location="login.html?back="+url;
                        }else {
                            var input=tar.parentNode.previousElementSibling.children[2];
                            var count=parseInt(input.value);
                            var lid=location.search.split("=")[1];
                            lid=parseInt(lid);
                            ajax({
                                type:"get",
                                url:"data/routes/cart/addToCart.php",
                                data:"lid="+lid+"&count="+count,
                                dataType:"text"
                            }).then(()=>{
                                alert("添加购物车成功");
                                input.value=1;
                            })
                        }
                    })
                }
            }
          })
          /*放大镜*/
          var mImg=document.getElementById("mImg");
          var lgDiv=document.getElementById("largeDiv");
          mImg.src=p.md;
          lgDiv.style.background="url("+imgs[0].lg+")";
          var html="";
          for(var pic of imgs){
            html+=`
            <li class="i1"><img src="${pic.sm}" 
            data-md="${pic.md}" 
            data-lg="${pic.lg}"></li>
            `;
          }
          var iconList=document.getElementById("icon_list");
          iconList.innerHTML=html;
          var aBackward=document.querySelector("#preview>h1>a:nth-child(1)");
          var aForword=aBackward.nextElementSibling;
          if(imgs.length<=5){
              aBackward.className="backward disabled";
              aForword.className="forward disabled";
          }
          var move=0,liWidth=62;
          aForword.onclick=e=>{
              var tar=e.target;
              if(!tar.className.endsWith("disabled")){
                move+=1;
                iconList.style.left=-move*liWidth+20+"px";
                //move>0 后退键启用
                //imgs.length-move=5 前进键禁用
                if(move>0){
                    aBackward.className="backward";
                }
                if(imgs.length-move==5){
                    aForword.className="forward disabled";
                }
            }
        }
          aBackward.onclick=e=>{
              var tar=e.target;
              if(!tar.className.endsWith("disabled")){
                move-=1;
                iconList.style.left=-move*liWidth+20+"px";
                //imgs.length-move>5 前进键启用
                //move==0后退键禁用
                if(imgs.length-move>5){
                    aForword.className="forward";
                }
                if(move==0){
                    aBackward.className="backward disabled";
                }
            }
        }
          iconList.onmouseover=e=>{
              var tar=e.target;
              if(e.nodeName="IMG"){
                  var md=tar.dataset.md;
                  var lg=tar.dataset.lg;
                  if(md!=undefined&&lg!=undefined){
                  mImg.src=md;
                  lgDiv.style.background="url("+lg+")";
                  }
              }
          }
          var superMask=document.getElementById("superMask");
          var mask=document.getElementById("mask");
          superMask.onmouseover=e=>{
            var tar=e.target;
            mask.style.display=lgDiv.style.display="block";
          }
          superMask.onmouseout=e=>{
            var tar=e.target;
            mask.style.display=lgDiv.style.display="none";
          }
          var MSIZE=175;
          superMask.onmousemove=e=>{
              var top,left,x=e.offsetX,y=e.offsetY,bottom,right;
              top=y-MSIZE/2;
              left=x-MSIZE/2;
              if(top<0) top=0;
              if(left<0) left=0;
              if(top>175) top=175;
              if(left>175) left=175;
              mask.style.cssText="display:block;top:"+top+"px;left:"+left+"px";
              lgDiv.style.backgroundPosition=
              -(800/350*left)+"px "+-(800/350*top)+"px"
          }
      })
  }
})()