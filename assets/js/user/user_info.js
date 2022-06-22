;(function(){

// 自定义表单验证规则
let form = layui.form;

form.verify({
    nickname: function(value, item){ //value：表单的值、item：表单的DOM对象
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
      if(/(^\_)|(\__)|(\_+$)/.test(value)){
        return '用户名首尾不能出现下划线\'_\'';
      }
      if(/^\d+\d+\d$/.test(value)){
        return '用户名不能全为数字';
      }

      if(value.length>6){
        return '昵称长度必须在1-6个字符之间';
      }
      
      //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
      if(value === 'xxx'){
        alert('用户名不能为敏感词');
        return true;
      }
    }
    
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]

  });      

function getUserInfo(){  
    $.ajax({
    type:'GET',
    url:'/my/userinfo',
    success:function(res){
        if(res.status!==0) return layui.layer.msg('获取用户信息失败')
    //  调用form.val()快速为表单赋值
    form.val('formUserInfo',res.data)   
    //     let username=res.data.username
    //    document.querySelector('[name=username]').value=username
      }
    })
}
getUserInfo()


// 重置表单数据
document.querySelector('#btn_reset').addEventListener('click',function(e){
// 阻止默认重置
e.preventDefault()
// 再次调用getUserInfo()渲染初始数据
getUserInfo()
})


// 监听表单提交事件
document.querySelector('.layui-form').addEventListener('submit',function(e){
// 阻止默认重置
e.preventDefault()


// 用layui拿到表单的数据
let data = form.val("formUserInfo")

// 发起ajax请求

$.ajax({
    type:'POST',
    url:'/my/userinfo',
    data:data,
    success:function(res){
        if(res.status!==0) return layui.layer.msg('更新用户信息失败')
        layui.layer.msg('更新用户信息成功')
        //   调用父页面的方法，重新渲染用户头像和信息
        window.parent.getUserInfo()
      }
    })
})


})()