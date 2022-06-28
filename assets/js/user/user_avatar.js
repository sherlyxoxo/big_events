window.onload=function(){


    
 // 1.1 获取裁剪区域的 DOM 元素
 var $image = $('#image')
 // 1.2 配置选项
 const options = {
   // 纵横比
   aspectRatio: 1,
//    16/9、4/3
   // 指定预览区域
   preview: '.img-preview'
 }

 // 1.3 创建裁剪区域
 $image.cropper(options)






//  2.点击上传头像

document.querySelector('#btn_choose').addEventListener('click',function(){
    document.querySelector('#file').click()
})

// 3.为文件选择框绑定change事件
document.querySelector('#file').addEventListener('change',function(e){
   let files= e.target.files
//    检测是否选择图片
   if(files.length===0) return layui.layer.msg('请选择图片!')
   
   
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

   // 5.点击确定更换头像
   document.querySelector('#btn_set').addEventListener('click',function(){
   let dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    
    //   发起ajax请求,把头像上传到服务器
    $.ajax({
        type:'POST',
        url:'/my/update/avatar',
        data:{avatar:dataURL},
        success:function(res){
            if(res.status!==0) return layui.layer.masg('更换失败')
            window.parent.getUserInfo()
            layui.layer.msg('更换头像成功')
        }
    })
    
    
   
 })




}
 
