
// 每次调用$.ajax的时候，会先调用这个函数，拿到我们给ajax提供的配置对象

$.ajaxPrefilter(function(options){
// console.log(options.url);
// 在发起真正的ajax请求前，统一拼接请求的根路径
options.url='http://big-event-api-t.itheima.net'+options.url


// 统一为有权限的接口，设置headers请求头

if(options.url.includes('my')){
    options.headers={Authorization:localStorage.getItem('token')||''}
}


// 全局挂载complete函数
 options.complete=function(res){
      // console.log(res);
      if(res.responseJSON.status ===1&&res.responseJSON.message==='身份认证失败！'){
      // 1.强制清空token
      localStorage.removeItem('token')
      // 2.强制跳转登录页 
        location.href='login.html'

      }
    }

})