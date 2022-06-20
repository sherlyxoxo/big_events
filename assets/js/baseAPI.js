
// 每次调用$.ajax的时候，会先调用这个函数，拿到我们给ajax提供的配置对象

$.ajaxPrefilter(function(options){
// console.log(options.url);
// 在发起真正的ajax请求前，统一拼接请求的根路径
options.url='http://big-event-api-t.itheima.net'+options.url
})