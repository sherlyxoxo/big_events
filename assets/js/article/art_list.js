window.onload=function(){



    let form=layui.form


// 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
let q ={
    pagenum:1,//页码值，默认请求第一页的数据
    pagesize:2,//每页显示几条数据，默认每页显示2条
    cate_id:'',//文章分类的id
    state:''//文章的发布状态
}

  // 定义处理时间的过滤器
  template.defaults.imports.dateFormat = function (dt) {
    const date = new Date(dt)
    let y = date.getFullYear()
    let m = padZero(date.getMonth() + 1)
    let d = padZero(date.getDate())

    let hh =padZero(date.getHours())
    let mm =padZero(date.getMinutes())
    let ss =padZero(date.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

//   定义补零函数
function padZero(a){
    return a<10? '0'+a :a
}


getArtList ()
// 封装渲染文章列表函数
function getArtList (){

    // 发起ajax请求
    $.ajax({
        type:'GET',
        url:'/my/article/list',
        data:q,
        success:function(res){
      if(res.status!==0) return layui.layer.msg('获取文章列表失败')
    //   console.log(res);
      // 2. 调用 template 函数   
  
      let htmlStr = template('tpl-user', res.data)
     
      // 3. 渲染HTML结构
      document.querySelector('.layui-table tbody').innerHTML=htmlStr
     
    //   4.渲染分页
    renderPage(res.total)
        }
    })

    
}



initCate()
// 初始化文章分类
function initCate(){

 // 发起ajax请求
 $.ajax({
    type:'GET',
    url:'/my/article/cates',
  
    success:function(res){
  if(res.status!==0) return layui.layer.msg('获取文章列表失败')
  
  // 2. 调用 template 函数

  let cateStr = template('cate-tpl', res)
 
  // 3. 渲染HTML结构
  document.querySelector('[name=cate_id]').innerHTML=cateStr
//  4.调用layuiform的render渲染表单
// 通知layui重新渲染表单区域的结构
   form.render()
    }
})

}


// 筛选文章
// 监听提交事件，获取筛选区域的数据

document.querySelector('#search').addEventListener('submit',function(e){
    e.preventDefault()
    let cate_id= document.querySelector('[name=cate_id]').value
    let state= document.querySelector('[name=state]').value
    q.cate_id=cate_id
    q.state=state
   
  
    // 重新获取文章列表
    getArtList ()
   
})


// 定义渲染分页的方法:表格渲染完成后调用

function renderPage(total){
    // console.log(total);
    let laypage = layui.laypage;
    
    //执行一个laypage实例
    laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit:q.pagesize,//每页限制显示的条数
      curr:q.pagenum,//设置被默认选中的分页
      layout:['count','limit','prev', 'page', 'next','skip'],//自定义排版
    limits:[2,3,5,10],//限制每页最多展示的条数
    //   分页发生切换的时候触发的回调函数
    // 触发jump回调的时候有2种：1.点击页码 2.只要调用了laypage.render就会触发jump回调
      jump:function(obj,first){
        // console.log(obj.curr);
        // 把最新的页码值，赋值到q这个查询对象中
        q.pagenum=obj.curr
        // 根据最新的q获取的条目数，赋值到q这个查询对象中的pageSIZE中
        q.pagesize=obj.limit

        // 根据切换的页码，重新渲染最新页面
        // getArtList ()  会发生死循环

        // 如果first值是true，说明是第二种方式触发的
        // first判断是否是初始加载分页，如果不是，说明是后面点击了页面，这时候再进行渲染

        if(!first) getArtList ()

      }

    });

}



// 删除文章，因为是动态渲染的，所以要通过事件委托


document.querySelector('tbody').addEventListener('click',function(e){
    //  获取页面上删除按钮的个数
    let len = document.querySelectorAll('#btn_del').length
    // console.log(len);
    if(e.target.id==="btn_del"){
        // 弹出确认层
       layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //发起ajax请求
            $.ajax({

                type:'GET',
                // 在url地址加上id
                url:'/my/article/delete/'+e.target.dataset.id,
                success:function(res){
                    if(res.status!==0) return layui.layer.msg('删除文章失败')
                //    console.log(res.data);
                
             
                layui.layer.msg('删除文章成功！')
                // 当数据删除完成后，需要判断这一页是否还有剩余的数据。如果没有剩余数据
                // 如果len=1，说明点击确定后，页面上就没有数据了，则让页码-1后，再重新渲染页面
                //   不能==='1'
                if(len===1){
                    // 页码值不能小于1             
                  q.pagenum= q.pagenum===1?1:q.pagenum-1
   
                }

                console.log(q);
                // 重新渲染页面
                getArtList ()

                      }

            })
          
            layer.close(index);
          });
            
    }
})



// 编辑文章分类和标题
let indexEdit=null
document.querySelector('tbody').addEventListener('click',function(e){
    if(e.target.id==="btn_edit") {
     

// 发起ajax请求
$.ajax({
    type:'GET',
    url:'/my/article/cates',
  
    success:function(res){
  if(res.status!==0) return layui.layer.msg('获取文章列表失败')
//   console.log(res.data);
  // 2. 调用 template 函数

  let editStr = template('dialog_edit', res)
 
  // 3. 渲染HTML结构
  document.querySelector('#cate2').innerHTML=editStr



  // 获取对应的id和文章信息
     $.ajax({
      type:'GET',
      // 在url地址加上id
      url:'/my/article/'+e.target.dataset.id,
      success:function(res){
        //  console.log(res.data);
      // 给表单快速赋值
      form.val('editArticle',res.data)     
            }

     })

//  4.调用layuiform的render渲染表单
// 通知layui重新渲染表单区域的结构
   form.render()
    }
})


     
        // 弹出修改文章分类信息的层
      indexEdit= layui.layer.open({
          type:1, //层类型
          area:['500px','350px'],//指定弹出页面宽高
          title:'修改文章信息',
          content: document.querySelector('#dialog_edit').innerHTML
      })

    
    }

//  layui监测表单提交事件

form.on('submit(editArticle)', function(data){
   
let fd2 =new FormData(document.querySelector('#form_edit'))
fd2.forEach(function(v,k){
    console.log(k,v);
})

//发起ajax请求


  $.ajax({
                  type:'POST',
                  url:'/my/article/edit',
                  data:fd2,
                  contentType:false,
                  processData:false,
                  success:function(res){
                if(res.status!==0) return layui.layer.msg('修改文章信息失败')
                 // 重新获取文章列表
                 getArtList ()
                layui.layer.msg('修改文章信息成功！')
          
      
              // 关闭弹出层
              layui.layer.close(indexEdit)
                  }
              
              })

  
  return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
});
     

  })








}



