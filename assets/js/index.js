// layui 的js
;(function(){
  layui.use(['element', 'layer', 'util'], function(){
    var element = layui.element
    ,layer = layui.layer
    ,util = layui.util
    ,$ = layui.$;
    
    //头部事件
    util.event('lay-header-event', {
      //左侧菜单事件
      menuLeft: function(othis){
        layer.msg('展开左侧菜单的操作', {icon: 0});
      }
      ,menuRight: function(){
        layer.open({
          type: 1
          ,content: '<div style="padding: 15px;">处理右侧面板的操作</div>'
          ,area: ['260px', '100%']
          ,offset: 'rt' //右上角
          ,anim: 5
          ,shadeClose: true
        });
      }
    });
    
  });
})()




// 在全局封装调用用户信息函数
function getUserInfo(){
  $.ajax({
    type:'GET',
    url:'/my/userinfo',
    // 请求体配置对象,如果没有就空字符串
    // headers:{Authorization:localStorage.getItem('token')||''},
    success:function(res){
      if(res.status!==0) return layui.layer.msg('获取用户信息失败')
      // layui.layer.msg('获取用户信息成功')
      // console.log(res.data);
      // 调用渲染用户头像的函数
      renderAvatar(res.data)
    },

    // 不论成功还是失败，最终都会调用complete回调函数
    // complete:function(res){
    //   // console.log(res);
    //   if(res.responseJSON.status ===1&&res.responseJSON.message==='身份认证失败！'){
    //   // 1.强制清空token
    //   localStorage.removeItem('token')
    //   // 2.强制跳转登录页 
    //     location.href='login.html'

    //   }
    // }
  })
}


// 在全局封装渲染用户头像的函数 
function renderAvatar(user){
  // 1.获取用户名称
let name = user.nickname ||user.username
// 2.设置欢迎文本
document.querySelector('.welcome').innerHTML=`欢迎 ${name}!`
// 3.按需渲染用户头像
// 渲染图片头像
if(user.user_pic!==null){
  // 1）修改图片头像的属性
  document.querySelectorAll('.layui-nav-img').forEach(function(item){
    item.src=user.user_pic
    item.style.display='inline-block'
  })

}else{
  // 渲染文本头像
  // 2）获取用户名首个字符
  let first = name[0].toUpperCase()
  document.querySelectorAll('.text-avatar').forEach(function(item){
    item.style.display='inline-block'
    item.innerHTML=first
  })
}
}








// 自己的js
;(function(){

// 调用用户信息并渲染头像
getUserInfo()
// 点击退出
document.querySelector('#btn_logOut').addEventListener('click',function(){
//  提示用户是否退出
  layui.layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
  //  1.清空本地存储中的token
  localStorage.removeItem('token')
  // 2.跳转回登录页
  location.href='login.html'
// 3.关闭confirm询问框
    layer.close(index);
  });
})




})()