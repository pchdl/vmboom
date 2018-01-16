/*
HDL系统框架=========
2017-10-19
 */

//判断IE版本
var IE = '';
var browser = navigator.appName;
if(browser == "Microsoft Internet Explorer"){
   var b_version = navigator.appVersion;
   var version = b_version.split(";");
   var trim_Version = version[1].replace(/[ ]/g, "");
   if (trim_Version == "MSIE7.0") {
     IE = '7'
   }
   if (trim_Version == "MSIE8.0") {
     IE = '8'
   }
   if (trim_Version == "MSIE9.0") {
     IE = '9'
   }
   if (trim_Version == "MSIE10.0") {
     IE = '10'
   }
   if (trim_Version == "WOW64") {
     IE = '11'
   }
   //if(IE=='7'){alert('您当前使用的IE7内核的浏览器，请升级到9以上版本')}
   //if(IE=='8'){alert('您当前使用的IE8内核的浏览器，请升级到9以上版本')}            
}

//对select下拉菜单的控制
$('.select').each(function(){
   var w = $(this).width();
   $(this).width(w+40);
   $(this).parents('.selectbox').width(w+22);
})

$(function(){
   frameAuto();
   //监听浏览器改变窗体大小
   $(window).resize(function(){
   	frameAuto();
   })
   //左侧菜单滚动条插件
   if($('.frameleft').length>0){
      $('.frameleft').perfectScrollbar();
   }
   
   //点击select下拉菜单
   $('.select').on('click',function(){
      $(this).parent().addClass('focusselect');
   })
   $('.select').on('change',function(){
      $(this).parent().removeClass('focusselect'); 
   });
   //调整下拉菜菜单
   $('.dropdown').each(function(){
      var h = $(this).innerHeight();//包含padding
      // if($(this).hasClass('btn-group')){
      //    $(this).find('button:last').css('height',h+'px');
      // }
      $(this).find('.dropdown-item').css('top',h+1+'px');
   });



   //点击既定元素意外的地方使该既定元素失去加载效果
   $(document).click(function(e){
      var target = $(e.target);

      //下拉选择框select
      if(target.closest(".selectbox").length == 0){ 
         $(".selectbox").removeClass('focusselect'); 
      }
      //下拉菜单
      if(target.closest(".dropdown").length == 0){ 
         $(".dropdown-item").hide(); 
      }

      e.stopPropagation();
   });

   //下拉菜单
   $('.dropdown').on('click',function(e){
      var downlist = $(this).find('.dropdown-item');
      if(downlist.css('display')=='none'){
         downlist.show();
      }else{
         downlist.hide();
      }
      // e.stopPropagation;
   })


   //tab标签js
   $('.tabsign').on('click','.tab-list',function(){
      var ind = $(this).parent().find('.tab-list').index($(this));
      $(this).addClass('focus-list');
      $(this).siblings().removeClass('focus-list');
      var con = $(this).parents('.tabsign').find('.con-list').eq(ind);
      con.addClass('focus-con');
      con.siblings().removeClass('focus-con');
   })



   /*=======================================
      组件部分，控制样式
   ==========================================*/

   //单选框
   $('.label-radio').each(function(){
      if($(this).hasClass('selected')){
         $(this).prepend('<i class="radio"></i>');
         $(this).find('input[type=radio]').attr('checked',true);
      }else{
         $(this).prepend('<i></i>');
      }
   })
   var evTimeStamp = 0;
   $('.label-radio').on('click',function(e){
      //利用时间戳解决label点击触发两次的click事件
      var now = +new Date();
      if (now - evTimeStamp < 100) {
        return;
      }
      evTimeStamp = now;

      var radi = $(this).find('i');
      var inp = $(this).find('input[type=radio]');
      if(radi.hasClass('radio')){
         
      }else{
         inp.removeAttr('checked'); 
         radi.addClass('radio');
         $(this).addClass('selected');
         $(this).siblings().removeClass('selected');
         $(this).siblings().find('i').removeClass('radio');
         $(this).siblings().find('input[type=radio]').attr('checked',true); 
      } 
   });


});//$(function(){})==end==


//加载菜单==
function loadMenu(){
   $.ajax({
      type:'POST',
	   url:'common/data/menu.json', //实际应用上是调用方法返回数据
	   dataType:'json',
	   success: function(menu){ 
         //alert(JSON.stringify(menu))
         var menuobj = menu.menu;
         //一级菜单
         var mainmenu = '<ul class="mainmenu-ul">';//一级菜单
         var menus = '';//二级菜单和三级菜单
         var href = '';//默认打开第一菜单
         var id = '';
         var tabul = '';//tab
         for(i=0;i<menuobj.length;i++){
         	if(i==0){
         		mainmenu += '<li id="A'+i+'" class="mainmenu-li focus-mainmenu" data-href="'+menuobj[i].href+'">'+menuobj[i].text+'</li>';
         		menus += '<div class="leftmenu focus-menus"><div class="mainmenutext">'+menuobj[i].text+'</div><ul class="submenu-ul">';
         		tabul += '<ul class="tab-ul focus-tabs">';
         	}else{
         		mainmenu += '<li id="A'+i+'" class="mainmenu-li" data-href="'+menuobj[i].href+'">'+menuobj[i].text+'</li>';
         		menus += '<div class="leftmenu"><div class="mainmenutext">'+menuobj[i].text+'</div><ul class="submenu-ul">';
         		tabul += '<ul class="tab-ul">';
         	}
         	var submenu = menuobj[i].submenu;        	
         	if(submenu.length>0){//有二级菜单
               for(j=0;j<submenu.length;j++){
                  if(submenu[j].text!=""){//二级菜单text不为空时
               	   if(i==0 && j==0){
               	  	   menus += '<li id="sub_'+submenu[j].id+'" class="submenu-down submenu-li focus-submenu" data-href="'+submenu[j].href+'">'+submenu[j].text+'</li>';
               	   }else{
               	  	   menus += '<li id="sub_'+submenu[j].id+'" class="submenu-down submenu-li" data-href="'+submenu[j].href+'">'+submenu[j].text+'</li>';
               	   }
                  }
            	   var thrmenu = submenu[j].thrmenu;
            	   menus += '<li><ul class="thrmenu-ul">';
            	   if(thrmenu.length>0){//有三级菜单
                     for(k=0;k<thrmenu.length;k++){
                     	if(i==0 && j==0 && k==0){href = thrmenu[k].href;}
                     	//	id = thrmenu[k].id;
                     	//	menus += '<li id="thr_'+thrmenu[k].id+'" class="thrmenu-li focus-thrmenu" data-href="'+thrmenu[k].href+'">'+thrmenu[k].text+'</li>';
                     		//tabul += '<li id="tab_'+thrmenu[k].id+'" class="tab-li focus-tab">'+thrmenu[k].text+'<i class="close">&times;</i></li>'
                     	//}else{
                     		menus += '<li id="thr_'+thrmenu[k].id+'" class="thrmenu-li" data-href="'+thrmenu[k].href+'">'+thrmenu[k].text+'</li>';
                     	//}
                  }
            	  }
            	  menus += '</ul></li>';  
               }	
         	}
         	menus += '</ul></div>';
         	tabul += '</ul>';
         }
         mainmenu += '</ul>';
         $('.mainmenu').html(mainmenu);//加载一级菜单
         $('.frameleft').html(menus);//加载左侧菜单
         $('.tabbox').html(tabul);
         
         //点击一级菜单
         $('.mainmenu').on('click','.mainmenu-li',function(){
            var ind = $('.mainmenu').find('.mainmenu-ul').find('.mainmenu-li').index($(this));
            var nx = $('.frameleft').find('.leftmenu').index($('.focus-menus'));//激活的左侧菜单
            if(ind!=nx){
            	$('.focus-mainmenu').removeClass('focus-mainmenu');
            	$(this).addClass('focus-mainmenu');
            	$('.focus-menus').removeClass('focus-menus');
            	$('.leftmenu').eq(ind).addClass('focus-menus');
            	$('.focus-tabs').removeClass('focus-tabs');
            	$('.tab-ul').eq(ind).addClass('focus-tabs');  
            }
            $('.loadPage').children('iframe').hide();
            if($('.focus-tabs').find('.focus-tab').length==0) {
               
            }else{
               var id = $('.focus-tabs').find('.focus-tab').attr('id').split('_')[1];
               $('.loadPage').children('iframe#ifr_'+id).show();
               $('#thr_'+id).addClass('focus-thrmenu');
            }  

         });

         //点击二级菜单收起或展开（没有下级即三级菜单）
         $('.leftmenu').on('click','.submenu-li',function(){
            if($(this).next().length>0){
               if($(this).next().is(':visible')){
                  $(this).removeClass('submenu-down').addClass('submenu-up')
                  $(this).next().slideUp(200);
               }else{
                  $(this).removeClass('submenu-up').addClass('submenu-down')
                  $(this).next().slideDown(200);
               }
            }
         });         
   

         //点击三级菜单
         $('.frameleft').on('click','.thrmenu-li',function(){
         	var id = $(this).attr('id').split('_')[1];
         	var link = $(this).data('href');
         	//var text = $(this).text();
         	//$('.focus-thrmenu').removeClass('focus-thrmenu');
         	//$(this).addClass('focus-thrmenu');
            //
            openPage(link);
         });

         //点击tab
         $('.tabbox').on('click','.tab-li',function(){
         	var id = $(this).attr('id').split('_')[1];
         	if(!$(this).hasClass('focus-tab')){//不是当前tab
         		$('.focus-tabs').find('.focus-tab').removeClass('focus-tab');
         		$(this).addClass('focus-tab');
         		$('.loadPage').children('iframe:visible').hide();
         		$('.loadPage').children('iframe#ifr_'+id).show();
         		$('.focus-thrmenu').removeClass('focus-thrmenu');
         		$('#thr_'+id).addClass('focus-thrmenu');
         	}
         });

         //关闭tab
         $('.tabbox').on('click','.close',function(e){
            var prev = $(this).parent().prev();
            var next = $(this).parent().next();
            var id = $(this).parent().attr('id').split('_')[1];

        	
            if(!$(this).parent().hasClass('focus-tab')){//不是当前激活的tab
            	$('.loadPage').children('iframe#ifr_'+id).remove();
            	$(this).parent().remove(); 
            }else{

            	$('.loadPage').children('iframe#ifr_'+id).remove();
	        	$('.focus-thrmenu').removeClass('focus-thrmenu');
	        	$(this).parent().remove();
	        	$('.focus-tab').removeClass('focus-tab');

            	if(prev.length==1){//左侧有tab（优先）
            		prev.addClass('focus-tab');
            		var pid = prev.attr('id').split('_')[1];
            		$('.loadPage').children('iframe#ifr_'+pid).show();
            		$('#thr_'+pid).addClass('focus-thrmenu');
                }else{//右侧有tab
                	next.addClass('focus-tab');
            		var nid = next.attr('id').split('_')[1];
            		$('.loadPage').children('iframe#ifr_'+nid).show();
            		$('#thr_'+nid).addClass('focus-thrmenu');
                }
            }
            e.stopPropagation();//阻止冒泡事件
         });

         //打开的tab过多利用左右箭头滚动
         $('.prev').on('click',function(){
         	var ulw = $('.focus-tabs').width();
         	var tabw = $('.tabbox').width();
         	var marl =parseInt($('.focus-tabs').css('margin-left').replace('px',''));
         	if(marl<0){
         		if(marl+100>0){
         			$('.focus-tabs').stop().animate({'margin-left':'0px'},200)
         		}else{
         			$('.focus-tabs').stop().animate({'margin-left':(marl+100)+'px'},200)
         		}         		
         	}
         });
         $('.next').on('click',function(){
         	var ulw = $('.focus-tabs').width();
         	var tabw = $('.tabbox').width();
         	var marl = Math.abs(parseInt($('.focus-tabs').css('margin-left').replace('px','')));//去掉px取正整数
         	var tabsL = $('.tabbox').offset().left;
         	var lastL = $('.focus-tabs').find('.tab-li:last').offset().left;//最后一个li
         	var lastW = $('.focus-tabs').find('.tab-li:last').width();
         	var la = tabw-lastW+tabsL-20;
         	if(lastL>la){
         		$('.focus-tabs').stop().animate({'margin-left':-(marl+100)+'px'},200)
         	}	
         });
         openPage(href);//默认打开第一菜单
      }
   });
}

/*
通用打开页面==============
包括三级菜单打开和内页打开

 */
function openPage(url){  
   var thr_menu = $('.frameleft',top.window.document).find('.thrmenu-li[data-href="'+url+'"]');//根据url获取对应的三级菜单对象
   var id = thr_menu.attr('id').split('_')[1];
   var text = thr_menu.text();
   var leftmenu = thr_menu.parents('.leftmenu');//根据激活的三级菜单找到上级盒子
   var ind = $('.frameleft',top.window.document).find('.leftmenu').index(leftmenu);
   var mainmenu = $('.mainmenu-ul',top.window.document).find('.mainmenu-li').eq(ind);//找到主菜单
   var tabul = $('.tabbox',top.window.document).find('.tab-ul').eq(ind);//找到对应的tab-ul
   //给这个三级菜单加上focus-thrmenu
   leftmenu.find('.thrmenu-li').removeClass('focus-thrmenu');
   thr_menu.addClass('focus-thrmenu');
   //显示leftmenu左侧菜单盒子
   leftmenu.siblings().removeClass('focus-menus');
   leftmenu.addClass('focus-menus');
   //激活主菜单
   mainmenu.siblings().removeClass('focus-mainmenu');
   mainmenu.addClass('focus-mainmenu');
   //激活tab-ul
   tabul.siblings().removeClass('focus-tabs');
   tabul.addClass('focus-tabs');
   
   //tabbox和loadpage======
   var fo_tab = tabul.find('#tab_'+id);
   if(fo_tab.length>0){//存在页面则tab到该页面并刷新
      if(!fo_tab.hasClass('focus-tab')){
         tabul.find('.focus-tab').removeClass('focus-tab');
         fo_tab.addClass('focus-tab');
         $('.loadPage',top.window.document).children('iframe:visible').hide();
      } 
      //tab滚动可见============================
      var wW = $(top.window).width();
      var mL = parseFloat(tabul.css('margin-left').replace('px',''));
      var fL = fo_tab.offset().left;
      var fW = fo_tab.width();
      var tL = $('.tabbox',top.window.document).offset().left;
      if(fL<tL){
         tabul.stop().animate({'margin-left':tL-fL+mL+'px'})
      }
      if(fL+fW>wW){
         tabul.stop().animate({'margin-left':-(fL+fW-wW+50)+mL+'px'})
      }
      //alert($('.loadPage',top.window.document).children('iframe#ifr_'+id).length);
      $('.loadPage',top.window.document).children('iframe#ifr_'+id).attr('src',url).show();//重新加载
   }else{
      tabul.find('.focus-tab').removeClass('focus-tab');
      tabul.append('<li id="tab_'+id+'" class="tab-li focus-tab">'+text+'<i class="close">&times;</i></li>');
      //当前tab可见==向左滚动=================================================================
      var winw = $(top.window).width();
      var lastW = tabul.find('.tab-li:last').width();
      var lastL = tabul.find('.tab-li:last').offset().left;
      var marL = parseFloat(tabul.css('margin-left').replace('px',''));
      if(lastL+lastW>winw){
         tabul.stop().animate({'margin-left':-(lastL+lastW-winw+50)+marL+'px'})
      }
      //======================================================================================
      $('.loadPage',top.window.document).children('iframe:visible').hide();
      var iframe = '<iframe id="ifr_'+id+'" src="'+url+'" style="width: 100%;height: 100%;" frameborder="0" ></iframe>';
      $('.loadPage',top.window.document).append(iframe);
   }   
}


//框架自适应
function frameAuto(){
	var winW = $(window).width();
	var winH = $(window).height();
	var topH = $('.frametop').height();
	$('.framebot,.frameleft,.framebody').height(winH-topH);
	$('.frameleft').css('min-width','150px');
	$('.framebody').css('max-width',winW-140+'px');//浏览器边框宽度
	var logoW = $('.logo').width();
	var infoW = $('.sysinfo').width();
	$('.mainmenu').width(winW-logoW-infoW);
	$('.mainmenu-ul').css('max-width',winW-logoW-infoW+'px');
	var tabH = $('.tab').height();
	$('.loadPage').height(winH-topH-tabH);
	var tW = $('.tab').width();
	var pW = $('.prev').width();
	var nW = $('.next').width();
	$('.tabbox').width(tW-pW-nW-1);
}






//加法函数
function numAdd(num1, num2) {
	var baseNum, baseNum1, baseNum2;
	try {
	  baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
	  baseNum1 = 0;
	}
	try {
	  baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
	  baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	return (num1 * baseNum + num2 * baseNum) / baseNum;
};
// //减法函数
function numSub(num1, num2) {
	var baseNum, baseNum1, baseNum2;
	var precision;// 精度
	try {
	  baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
	  baseNum1 = 0;
	}
	try {
	  baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
	  baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
	return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};
// //乘法函数
function numMul(num1, num2) {
	var baseNum = 0;
	try {
	  baseNum += num1.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
	  baseNum += num2.toString().split(".")[1].length;
	} catch (e) {
	}
	return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
};
// //除法函数
function numDiv(num1, num2) {
    var baseNum1 = 0, baseNum2 = 0;
    var baseNum3, baseNum4;
    try {
      baseNum1 = num1.toString().split(".")[1].length;
    }catch (e){
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    with (Math) {
      baseNum3 = Number(num1.toString().replace(".", ""));
      baseNum4 = Number(num2.toString().replace(".", ""));
      return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
    }
};

//消息框插件===========
(function($){   
   $.extend({
      message: function(options){ 
         var dft = {  
                 title: '提示信息', //标题
                 text: '',          //信息内容
                 status:'primary',  //状态：primary(默认)/success(成功)/warning(警告)/danger(错误)三种  
                 btntext:'确定',   //按钮字体  
                 href:''            //点击按钮跳转页面       
             };
         var opt = $.extend(dft, options);//参数赋值

         var pop = '<div class="pop-bg"></div><div class="pop-box pop-'+opt.status+'"><div class="pop-header">'+opt.title+'<i class="close">&times</i></div>'
                 + '<div class="pop-body">'+opt.text+'</div>'
                 + '<div class="pop-footer"><button id="surebtn" class="btn btn-'+opt.status+'">'+opt.btntext+'</button></div>'
                 + '</div>';
         $('.pop-bg,.pop-box',top.window.document).remove();
         $('body',top.window.document).append(pop);

         if(IE=='7' || IE=='8' || IE=='9'){//兼容ie
            $('.close',top.window.document).css('float','right');
            $('.pop-bg',top.window.document).css('opacity','0.5');
            $('.pop-box',top.window.document).css('opacity','1'); 
         }

         $('.pop-header .close',top.window.document).on('click',function(){
            $('.pop-bg,.pop-box',top.window.document).remove();
         });
         $('#surebtn',top.window.document).on('click',function(){
            $('.pop-bg,.pop-box',top.window.document).remove();
            if(opt.href!=""){//打开页面
               openPage(opt.href);
            }   
            
         })
         

         //移动==
         $('.pop-header',top.window.document).mousedown(function(event){  
            var isMove = true;  
            var abs_x = event.pageX - $('.pop-box',top.window.document).offset().left - $('.pop-box',top.window.document).width()/2;  
            var abs_y = event.pageY - $('.pop-box',top.window.document).offset().top - $('.pop-box',top.window.document).height()/2 + $(top.window.document).scrollTop();  
            $(top.window.document).mousemove(function(event){  
               if (isMove) {  
                  var obj = $('.pop-box',top.window.document);  
                  obj.css({'left':event.pageX - abs_x, 'top':event.pageY - abs_y});  
               }  
            }).mouseup(function(){  
               isMove = false;  
            });  
         }); 
      }
   });
})(jQuery);

//弹窗含页面
(function($){   
   $.extend({
      popwin: function(options){ 
         var dft = {
            title:'',    //窗体标题
            href:'',     //页面链接
            width: '0.8',//窗体占浏览器可视宽度比
            height:'0.85' //窗体占浏览器可视高度比
         };
         var opt = $.extend(dft, options);//参数赋值


         var winW = parseFloat($(top.window).width()*opt.width);
         var winH = parseFloat($(top.window).height()*opt.height);

         var win = '<div class="win-bg"></div><div class="win-box" style="width:'+winW+'px;height:'+winH+'px;margin-left:-'+winW*.5+'px;margin-top:-'+winH*.5+'px">'
                 + '<div class="win-header">'+opt.title+'<i class="close">&times</i></div>'
                 + '<div class="win-body" style="height:'+parseFloat(winH-40)+'px"><iframe src="'+opt.href+'" frameborder="0" style="width:100%;height:100%"></iframe></div>'
                 + '</div>';
         $('.win-bg,.win-box',top.window.document).remove();
         $('body',top.window.document).append(win);
         if(IE=='7' || IE=='8' || IE=='9'){//兼容ie
            $('.close',top.window.document).css('float','right');
            $('.win-bg',top.window.document).css('opacity','0.5');
            $('.win-box',top.window.document).css('opacity','1'); 
         }

         $('.win-header .close',top.window.document).on('click',function(){
            $('.win-bg,.win-box',top.window.document).remove();
         });
      }
   })
})(jQuery);




