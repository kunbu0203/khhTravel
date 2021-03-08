var xhr = new XMLHttpRequest();

xhr.open('get', 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c', true)
xhr.send(null)

xhr.onload = function (){
    var obj = JSON.parse(xhr.responseText);
    console.log(obj.contentType);
}