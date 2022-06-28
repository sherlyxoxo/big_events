window.onload=function(){



// 自定义表单验证规则
let form = layui.form;

form.verify({
  password: [
    /^[\S]{6,12}$/
    ,'密码必须6到12位，且不能出现空格'
  ],
  // 校验两次密码是否一致的规则
  repass:function(value,item){
      let pwd= document.querySelector('.layui-form [name=newPwd]')
    // value确认密码框的内容，还需要拿到密码框内容，如果不一致return出去
  if(value !== pwd.value)
  return '两次输入密码不一致'
  },
  // 新旧密码不能一样的规则
  samePwd:function(value,item){
    let pwd2= document.querySelector('.layui-form [name=oldPwd]')
  // value确认密码框的内容，还需要拿到密码框内容，如果一致return出去
if(value === pwd2.value)
return '新旧密码不能一样'
}

  });      






// 监听表单提交事件
document.querySelector('.layui-form').addEventListener('submit',function(e){
// 阻止默认提交
e.preventDefault()


// 用layui拿到表单的数据
let data = form.val("formUserInfo")

// 发起ajax请求

$.ajax({
    type:'POST',
    url:'/my/updatepwd',
    data:data,
    success:function(res){
        if(res.status!==0) return layui.layer.msg('修改密码失败')
        layui.layer.msg('修改密码成功')
        // 重置表单
        document.querySelector('.layui-form').reset()
      }
    })
})


}