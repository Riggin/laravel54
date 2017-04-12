Date.prototype.pattern=function(fmt) {
    var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
    };
    var week = {
    "0" : "/u65e5",
    "1" : "/u4e00",
    "2" : "/u4e8c",
    "3" : "/u4e09",
    "4" : "/u56db",
    "5" : "/u4e94",
    "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}


function loiMsg(msg,callback,tp,timeout) {
   if(typeof(tp)=="undefined") {
    var tp = "orange";
  }

  if(typeof(timeout)=="undefined") {
    var timeout = 2000;
  }
  var obj = $(".loimsg");
  if(obj.length<1) {
    $(".full-container").prepend('<div class="ui '+tp+' message loimsg">'+msg+'</div>');
  } else {
    obj.html(msg);
    obj.show();
  }

   setTimeout(function(){
        $(".loimsg").fadeOut();
        if(typeof(callback)=="function") {
            callback()
        }
    }, timeout);
}

function permPost(url,param,callback) {
   $.post(url,param,function(data){
      if(data.code!=0) {
        loiMsg(data.msg);
      } else {
        if(typeof(callback)=="function") {
           callback(data);
         }
      }
    },"json")
}


function loiForm() {}

loiForm.prototype.edit = function(name,id,callback) {
    var that = this;
    $.post("/json/edit",{name:name,id:id},function(data) {
      that.editData = data;
      $.each(data,function(name,obj){
          if(typeof(obj.tp)=="undefined") {
             return ;
          }
          switch(obj.tp) {
            case "input":
              $("#"+name).val(obj.val);
            break;
            case "textarea":
              $("#"+name).val(obj.val);
            break;
            case "select":
              var select = eval(name);
              select.dropdown('clear');
              select.dropdown('set selected', obj.val);
            break;
            case "muti_select":
              var select = eval(name);
              var select_class = obj.val.split(",");
              select.dropdown('clear');
              select.dropdown('set selected', select_class);
            break;
            case "radio":
              $("input[name='"+name+"'][value='"+obj.val+"']").prop("checked",true);
            break;
            case "checkbox":
              var checkbox = eval(name);
              if(obj.val>=1) {
                 checkbox.checkbox('set checked');
              } else {
                checkbox.checkbox('set unchecked');
              }
            break;
            case "checkboxs":
              var checkboxs = eval(name);
               $.each(checkboxs,function(a,b){
                  var v = parseInt($(b).find('input').val());
                  if(obj.val.indexOf(v)>=0) {
                    $(b).checkbox("set checked");
                  } else {
                     $(b).checkbox("set unchecked");
                  }
                });
            break;
           case  "img_input":
             $("#"+name).attr("data-val",obj.val);
             if(obj.val.length<1) {
                obj.val = defaultImg
             }
             $("#"+name).attr("src",img_domain+obj.val);
             break;
            case "article":
              var editor = eval(name);
              editor.$txt.html(obj.val);
            break;
          }
          if(typeof(obj.readonly)!="undefined" && obj.readonly==true && obj.val.length>1) {
              $("#"+name).attr("readonly",true);
          } else {
              $("#"+name).attr("readonly",false);
          }
      });
      callback(that.editData);
   },"json");
};

loiForm.prototype.save = function() {
   var that = this;
   var err;
   if(typeof(that.editData.err)!="undefined") {
    delete that.editData.err;
   }
   $.each(that.editData,function(name,obj){
      if(typeof(obj.tp)=="undefined") {
         return ;
      }
     switch(obj.tp) {
        case "input":
          that.editData[name].val = $("#"+name).val();
        break;
        case "textarea":
           that.editData[name].val = $("#"+name).val();
        break;
        case "select":
         var select = eval(name);
         var select_class = select.dropdown('get value');
         that.editData[name].val = select_class;
        break;
        case "muti_select":
          var select = eval(name);
          var select_arr = select.dropdown('get value');
          if(select_arr==null || select_arr.length<1) {
            select_arr = [];
          }
          that.editData[name].val = select_arr.join(",");
        break;
        case "radio":
          var objs = $("input[name='"+name+"']");
          $.each(objs,function(a,b){
             var radioObj =  $(b);
             if(radioObj.prop("checked")==true) {
                 that.editData[name].val = radioObj.val();
             }
          })
        break;
        case "checkbox":
          var checkbox = eval(name);
          var ischecked = checkbox.checkbox('is checked');
           if(ischecked==true) {
             that.editData[name].val = 1;
           } else {
             that.editData[name].val = 0;
           }
          break;
        case "checkboxs":
            var checkboxs = eval(name);
            var tmpVal = [];

            $.each(checkboxs,function(a,b){
              if($(b).checkbox("is checked")) {
                   var v = parseInt($(b).find('input').val());
                   tmpVal.push(v);
              }
            });

            that.editData[name].val = tmpVal;
          break;
        case  "img_input":
           that.editData[name].val = $("#"+name).attr("data-val");
        break;
        case  "article":
          var editor = eval(name);
          that.editData[name].val = editor.$txt.html();
        break;
      }

      switch(obj.ck) {
        case 'num':
          if(isNaN(that.editData[name].val)==true) {
              err = name;
          }
        break;
        case 'length':
          if(that.editData[name].val.length<1) {
             err = name;
          }
         break;
         case 'val':
          if(that.editData[name].val<1) {
             err = name;
          }
         break;
         case 'img':
          if(that.editData[name].val.length<10) {
             err = name;
          }
         break;
        case 'password':
          if(that.editData[name].val.length>0 && that.editData[name].val.length<6) {
             err = name;
          }
         break;
         default:
         break;
      }
      if(typeof(err)!="undefined") {
         return false;
      }
  });

  var out = that.editData;
  if(typeof(err)!="undefined") {
    out.err = err
  }

  return  out;
}

loiForm.prototype.submit =  function() {
  var that = this;
  var data = {};
   $.each(that.editData,function(name,obj){
      if(typeof(obj.tp)=="undefined") {
          return ;
      }
      data[name] = obj.val
   });
   return data;
}
