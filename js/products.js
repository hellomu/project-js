/**
 * 
 * @param {封装当前页加载函数} pno 当前页码
 */
function getPage(pno=0){
    ajax({
        type:"get",
        url:"data/routes/products/getProductsByKw.php",
        data:location.search.slice(1)+"&pno="+pno,
        dataType:"json"
    }).then(output=>{
        var html="";
        for(var pro of output.data){
                var p=pro;
                html+=`
                    <li>
                    <a href="product_details.html?lid=${p.lid}">
                    <img src="${p.md}" alt="">
                    </a>
                    <p>
                    ¥<span class="price">${p.price}</span>
                    <a href="product_details.html?lid=${p.lid}">${p.title}</a>
                    </p>
                    <div>
                    <span class="reduce">-</span>
                    <input type="text" value="1">
                    <span class="add">+</span>
                    <a href="javascript:;" class="addCart">加入购物车</a>
                    </div>
                    </li>
                `;
            }
        var showList=document.getElementById("show-list");
        showList.innerHTML=html;
        var html="";
        html+=`<a href="javascript:;" class="previous">上一页</a>`;
        for(var i=0;i<output.pageCount;i++){
            html+=`
            <a href="javascript:;">${i+1}</a> 
            `
        }
        html+=`<a href="javascript:;" class="next">下一页</a>`;
        var pages=document.getElementById("pages");
        pages.innerHTML=html;
        pages.children[output.pno+1].className="current";
        checkeTarStatus(pages,output.pno,output.pageCount);
    })
}
/**
 * 
 * @param {页码父元素} pages 
 * @param {当前页码，ajax传送过来的数据} pno 
 * @param {总页码，ajax传送过来的数据} pageCount 
 */
function checkeTarStatus(pages,pno,pageCount){
    var prev=pages.firstElementChild;
    var next=pages.lastElementChild;
    if(pno!==0&&pno!==pageCount-1){
        prev.className="previous";
        next.className="next";
    }else {
        if(pno===0){
            prev.className="previous disabled";
        }
        if(pno===pageCount-1){
            next.className="next disabled";
        }
    }
}
/**
 * 加载购物车代码块
 */
function getCart(){
    ajax({
        type:"get",
        url:"data/routes/cart/getCart.php",
        dataType:"json"
    }).then(data=>{
        var html="",totalPrice=0;
        for(var p of data){
            html+=`
            <div class="item" data-iid=${p.iid}>
            <span>${p.title}</span>
            <div>
              <span class="reduce">-</span>
              <input type="text" value="${p.count}">
              <span class="add">+</span>
            </div>
            <p>
              <span>${(p.price*p.count).toFixed(2)}</span>	
            </p>
          </div>
            `;
            totalPrice+=p.price*p.count;
        }
        totalPrice=totalPrice.toFixed(2);
        var cartContent=document.querySelector(".cart_content");
        cartContent.innerHTML=html;
        var total=document.getElementById("total");
        total.innerHTML=totalPrice;
    })
}
(()=>{
    getPage();
    getCart()
    /*页码跳转*/
    var pages=document.getElementById("pages");
    pages.addEventListener("click",function(e){
        var tar=e.target;
        if(tar.nodeName==="A"){
            if(tar!=pages.firstElementChild&&tar!=pages.lastElementChild){
                if(tar.className!="current"){
                    getPage(parseInt(tar.innerHTML)-1);
                }
            }else {
                if(!tar.className.endsWith("disabled")){
                    var curr=document.querySelector(".current");
                    curr.className="";
                    if(tar.className.startsWith("next")){
                    getPage(parseInt(curr.innerHTML));
                    }else {
                    getPage(parseInt(curr.innerHTML)-2);
                    }
                }
            }
        }
    })
    /**
     * 产品小图加入购物车单击功能
     */
    var list=document.getElementById("show-list");
    list.addEventListener("click",function(e){
        var tar=e.target;
        if(tar.className==="add"||tar.className==="reduce"){
            var input=tar.parentNode.children[1];
            var n=parseInt(input.value);
            if(tar.className==="add"){
                n+=1;
            }else {
                if(n>0){
                    n-=1;
                }else {
                    n=1;
                }
            }
            input.value=n;
        }else if(tar.className==="addCart"){
            ajax({
                type:"get",
                url:"data/routes/users/isLogin.php"
            }).then(text=>{
                if(text.ok==0){
                    var url=encodeURIComponent(location.href);
                    location="login.html?back="+url;
                }else {
                    var lid=tar.parentNode.parentNode.children[0].href.split("=")[1];
                    var count=tar.parentNode.children[1].value;
                    ajax({
                        type:"get",
                        url:"data/routes/cart/addToCart.php",
                        data:"lid="+lid+"&count="+count,
                        dataType:"text"
                    }).then(()=>{
                        tar.parentNode.children[1].value=1;
                        alert("添加成功");
                        getCart()
                    })
                }
            })
        }
    })
    /*商品列表页面购物车加减按钮单击事件*/
    var cartContent=document.querySelector(".cart_content");
    cartContent.addEventListener("click",function(e){
        var tar=e.target;
        if(tar.className=="reduce"||tar.className=="add"){
            var input=tar.parentNode.children[1].value;
            var n=parseInt(input);
            var iid=tar.parentNode.parentNode.dataset.iid;
            tar.className=="add"?n+=1:n-=1;
            ajax({
                type:"get",
                url:"data/routes/cart/updateCart.php",
                data:"iid="+iid+"&count="+n,
                dataType:"text"
            }).then(getCart)
        }
    })
    /*清空购物车单击事件*/
    var clear=document.querySelector(".title>a");
    clear.onclick=e=>{
        //e.preventDefault();
        ajax({
            type:"get",
            url:"data/routes/cart/clearCart.php",
            dataType:"text"
        }).then(getCart)
    }
})()