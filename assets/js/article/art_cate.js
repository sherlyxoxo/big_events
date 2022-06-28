
window.onload=function(){


// 1.封装获取文章分类的列表函数
function getArticle (){
    $.ajax({
        type:'GET',
        url:'/my/article/cates',
        success:function(res){
      if(res.status!==0) return layui.layer.msg('获取文章列表失败')
      // 2. 调用 template 函数
      let htmlStr = template('tpl-user', res.data)
     
      // 3. 渲染HTML结构
      document.querySelector('.layui-table tbody').innerHTML=htmlStr
    
        }
    
    })
}

getArticle ()

let form = layui.form
let indexAdd =null
// 4.点击添加按钮，增加文章分类
document.querySelector('#add').addEventListener('click',function(){
   indexAdd= layui.layer.open({
        type:1, //层类型
        area:['500px','250px'],//指定弹出页面宽高
        title:'添加文章分类',
        content: document.querySelector('#dialog_add').innerHTML
      });



    //   5.layui监测表单提交事件
      form.on('submit(addArticle)', function(data){
     
  
        let data1 = form.val("addArticle")
        $.ajax({
                        type:'POST',
                        url:'/my/article/addcates',
                        data:data1,
                        success:function(res){
                      if(res.status!==0) return layui.layer.msg('添加文章类别失败')
                      // 重新调用模板渲染函数
                      getArticle ()
                      layui.layer.msg('新增文章分类成功！')
                
            
                    // 关闭弹出层
                    layui.layer.close(indexAdd)
                        }
                    
                    })
        
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });
           

})

  
//   6.通过模板引擎渲染的表格，在dom中不存在，通过代理的方式绑定点击事件
    let indexEdit=null
    document.querySelector('tbody').addEventListener('click',function(e){
      if(e.target.id==="btn_edit") {
        // 弹出修改文章分类信息的层
        indexEdit= layui.layer.open({
            type:1, //层类型
            area:['500px','250px'],//指定弹出页面宽高
            title:'修改文章分类',
            content: document.querySelector('#dialog_edit').innerHTML
        })

        // 获取对应的id和文章信息
       $.ajax({
        type:'GET',
        // 在url地址加上id
        url:'/my/article/cates/'+e.target.dataset.id,
        success:function(res){
        //    console.log(res.data);
        // 给表单快速赋值
        form.val('editArticle',res.data)

              }

       })
      }

  //  7. layui监测表单提交事件
  form.on('submit(editArticle)', function(data){
     
  
    let data2 = form.val("editArticle")
    $.ajax({
                    type:'POST',
                    url:'/my/article/updatecate',
                    data:data2,
                    success:function(res){
                  if(res.status!==0) return layui.layer.msg('修改文章类别失败')
                  // 重新调用模板渲染函数
                  getArticle ()
                  layui.layer.msg('修改文章分类成功！')
            
        
                // 关闭弹出层
                layui.layer.close(indexEdit)
                    }
                
                })
    
    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
  });
       

    })

    

    // 8.点击删除文章
   
    document.querySelector('tbody').addEventListener('click',function(e){
        if(e.target.id==="btn_del"){
            // 弹出确认层
           layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
                //发起ajax请求
                $.ajax({

                    type:'GET',
                    // 在url地址加上id
                    url:'/my/article/deletecate/'+e.target.dataset.id,
                    success:function(res){
                        if(res.status!==0) return layui.layer.msg('删除文章类别失败')
                    //    console.log(res.data);
                    
                    // 重新渲染页面
                    getArticle ()
                    layui.layer.msg('删除文章分类成功！')
                          }

                })
              
                layer.close(index);
              });
                
        }
    })




  }