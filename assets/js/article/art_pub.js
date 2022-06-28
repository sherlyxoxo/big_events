
window.onload=function(){

    let form = layui.form

initCate()
// 1.初始化文章分类
function initCate(){

 // 发起ajax请求
 $.ajax({
    type:'GET',
    url:'/my/article/cates',
  
    success:function(res){
  if(res.status!==0) return layui.layer.msg('获取文章分类失败')
//   console.log(res.data);
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

// 2.初始化富文本编辑器
initEditor()


// 3.设置文章封面
  // 3.1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 3.2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3.3. 初始化裁剪区域
  $image.cropper(options)



  //  3.4.点击上传文章图片

document.querySelector('#btn_choose').addEventListener('click',function(){
    document.querySelector('#file').click()
})


// 3.5.为文件选择框绑定change事件
document.querySelector('#file').addEventListener('change',function(e){
    let files= e.target.files
 //    检测是否选择图片
    if(files.length===0) return layui.layer.masg('请选择图片!')
    
    
 //  4.更换图片
 // 4.1拿到用户选择的图片
 let file = files[0] 
 // 4.2根据选择的文件，创建一个对应的 URL 地址
 let newImgURL = URL.createObjectURL(file)
 // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
 $image
    .cropper('destroy')      // 销毁旧的裁剪区域
    .attr('src', newImgURL)  // 重新设置图片路径
    .cropper(options)        // 重新初始化裁剪区域
 
 
 })





// 5.发布文章
// 5.1定义文章的发布状态
let art_state='已发布'
// 如果用户点击存为草稿，就将art——state改为草稿
document.querySelector('#btn_save').addEventListener('click',function(){
    art_state='草稿'
})

// 5.2监听submit事件
document.querySelector('#article_pub').addEventListener('submit',function(e){
   e.preventDefault()
//   5.3创建formdata对象
// console.log(this);
let fd =new FormData(this)
fd.append('state',art_state)



// 5.4将封面裁剪过后的图片输出为一个文件对象
$image
  .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    width: 400,
    height: 280
  })
  .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作
    fd.append('cover_img',blob)
    fd.forEach(function(v,k){
    console.log(k,v);
})
    //   5.5发布文章
    publishArticle(fd)
  })




})


// 6.定义发布文章的方法
function  publishArticle(fd){

    //    发起ajax请求
$.ajax({
    type:'POST',
    url:'/my/article/add',
    data:fd,
    // 注意：如果向服务器提交的是FormData格式的数据，必须添加以下两个配置项
    contentType:false,
    processData:false,
    success:function(res){
        // console.log(res)
        if(res.status!==0) return layui.layer.msg('发布文章失败')
        layui.layer.msg('发布文章成功')
        // location.href=`/article/art_list.html`
        window.parent.document.querySelector('[href="./article/art_list.html"]').click()


    }
  
 
       
})
}


}



