window.onload=function(){



// 切换登录注册
let login=document.querySelector('.login')
let regNew=document.querySelector('.regNew')

// 点击去注册
document.querySelector('#link_log').addEventListener('click',function(){
    regNew.style.display='block'
    login.style.display='none'
})

// 点击去登录

document.querySelector('#link_reg').addEventListener('click',function(){
    login.style.display='block'
    regNew.style.display='none'
})

// 自定义表单验证规则
    let form = layui.form;
    let layer=layui.layer
    form.verify({
        username: function(value, item){ //value：表单的值、item：表单的DOM对象
          if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
            return '用户名不能有特殊字符';
          }
          if(/(^\_)|(\__)|(\_+$)/.test(value)){
            return '用户名首尾不能出现下划线\'_\'';
          }
          if(/^\d+\d+\d$/.test(value)){
            return '用户名不能全为数字';
          }
          
          //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
          if(value === 'xxx'){
            alert('用户名不能为敏感词');
            return true;
          }
        }
        
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,pass: [
          /^[\S]{6,12}$/
          ,'密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repass:function(value,item){
            let pwd= document.querySelector('.regNew [name=password]')
          // value确认密码框的内容，还需要拿到密码框内容，如果不一致return出去
        if(value !== pwd.value)
        return '两次输入密码不一致'
        }
      });      





// 监听注册表单的提交事件


let form_reg =document.querySelector('.regNew form')
 form_reg.addEventListener('submit',function(e){
    // 1.阻止默认提交行为
    e.preventDefault()
    // 2.ajax发起请求  
let data={ 
    username:document.querySelector('.regNew [name=username]').value,
    password:document.querySelector('.regNew [name=password]').value}

   $.ajax({
    type:'POST',
    url:'/api/reguser',
    data:data,
    success:function(res){
        if(res.status!==0) return layer.msg(res.message);
        layer.msg('注册成功,请登录');
    }
   })

//    3.自动点击跳转链接去登录页面
document.querySelector('#link_reg').click()

  })



// 监听登录表单的提交事件

let form_log =document.querySelector('.login form')
form_log.addEventListener('submit',function(e){
     // 1.阻止默认提交行为
     e.preventDefault()
     // 2.ajax发起请求  
     let data={ 
        username:document.querySelector('.login [name=username]').value,
        password:document.querySelector('.login [name=password]').value}
    
     $.ajax({
        type:'POST',
        url:'/api/login',
        data:data,
        success:function(res){
            if(res.status!==0) return layer.msg('登录失败');
            layer.msg('登录成功')
        // 将登录成功后的token值存储到localstora
        localStorage.setItem('token',res.token)  
            //跳转到后台主页
            location.href='index.html'

        }
       })
})





}