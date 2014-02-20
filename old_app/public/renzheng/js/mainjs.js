$(function() {
	$('.dashboard').hide();
	/* 注册页面用到的javascript代码，开始 */
	var ifNull = false, 
		indx, //那一个div在被编辑的索引
		errLength = 0, //用于记录有多少输入框是空的
		regStep1 = false, //个人信息是否完成
		regStep2 = false, //学科选择是否完成
		phoneRegexp = /^[1][3458][0-9]{9}$/, //验证手机的正则表达式
		emailRegexp = /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9]\.[a-z\.]{1,}[a-z]$/, //验证邮箱的正则表达式
		userNameRegexp = /^.{4,30}$/,//用户名的正则表达式
		passwordRegexp = /^.{6,20}$/,//密码的正则表达式
		phoneBool = false, //手机号码是否正确
		emailBool = false, //邮箱是否正确
		userNameBool = false, //用户名格式是否正确
		passwordBool = false; //密码格式是否正确
	var webConfig = {apiUrl:'http://www.taianting.com:3000/api/',token:'?token=12345&'};
	//console.log(webConfig.apiUrl);
	//console.log(webConfig.token);
/* 注册和登录的代码   开始--------------------------------------------------------------------------------------------------*/
	//用于给激活的下一步
	var activeTab = function(indx) {
		$('li.active,div.active').removeClass('active');
		$('.nav-tabs li').eq(indx).addClass('active');
		$('.tab-pane').eq(indx).addClass('active');
	};

	//用于检测值是否为空
	var checkVal = function(tg) {
		var inputArr = $(tg), itsVal;
		inputArr.each(function() {
			itsVal = $(this).val();
			if($(this).attr('name') !== 'shouji'){
				if ( !itsVal || itsVal == '请选择') {
					$(this).prev('label').addClass('errorMsg');
					errLength++;
				} 
				else {
					if ($(this).attr('name') == 'youxiang') {//验证邮箱格式
						if (emailRegexp.test(itsVal)) {
							$(this).prev('label').removeClass('errorMsg');
							emailBool = true;
						}
						else {
							$(this).prev('label').addClass('errorMsg');
							$(this).prev('label').find('.msgBox').html('邮箱格式不正确！');
						}
					} 
					/*else if ($(this).attr('name') == 'shouji') {//验证手机号格式
						if (phoneRegexp.test(itsVal)) {
							$(this).prev('label').removeClass('errorMsg');
							phoneBool = true;
						} 
						else {
							$(this).prev('label').addClass('errorMsg');
							$(this).prev('label').find('.msgBox').html('手机号码不正确！');
						}
					}*/
					else if ($(this).attr('name') == 'yonghuming') {//验证用户名长度
						if (userNameRegexp.test(itsVal)) {
							$(this).prev('label').removeClass('errorMsg');
							userNameBool = true;
						} 
						else {
							$(this).prev('label').addClass('errorMsg');
							$(this).prev('label').find('.msgBox').html('用户名长度不正确！');
						}
					}
					else if ($(this).attr('name') == 'mima') {//验证密码长度 
						if (passwordRegexp.test(itsVal)) {
							$(this).prev('label').removeClass('errorMsg');
							//passwordBool = true;
						} 
						else {
							$(this).prev('label').addClass('errorMsg');
							$(this).prev('label').find('.msgBox').html('密码长度不正确！');
						}
					}
					else if ($(this).attr('name') == 'confirmPassword') {//验证两次密码是否正确	
						var regPSW = $('input.regPassword').val();			
						if (itsVal == regPSW) {		
							$(this).prev('label').removeClass('errorMsg');
							passwordBool = true;
						}
						else{
							$(this).prev('label').addClass('errorMsg');
							$(this).prev('label').find('.msgBox').html('两次输入的密码不一致！');
						}					 
					}
					else {
						$(this).prev('label').removeClass('errorMsg');
					}
				}
				phoneBool = true;
			}
			else{
				if (!itsVal) {
					phoneBool = true; //允许手机号码为空
				} 
				else {//当手机号码不用空时
					if(phoneRegexp.test(itsVal)){
						$(this).prev('label').removeClass('errorMsg');
						phoneBool = true;
					}
					else{
						$(this).prev('label').addClass('errorMsg');
						$(this).prev('label').find('.msgBox').html('手机号码不正确！');
						phoneBool = true;
					}
				}
			}
		});
	};

	//点击下一步时的代码
	$('.nextBtn').click(function() {
		var tabPanIndx = $(this).closest('div.tab-pane').index();
			errLength = 0;
			checkVal('.active input');
			checkVal('.active select');
		if (tabPanIndx == 0) {
			if (!errLength && emailBool && userNameBool && passwordBool && phoneBool) {
				indx = tabPanIndx + 1;
				activeTab(indx);
				regStep1 = true;
			} else {
				regStep1 = false;
			}
		} else {
			if (!errLength && $('span.objectName').html().length && $('span.rightName').html().length) {
				indx = tabPanIndx + 1;
				activeTab(indx);
				// 拼接角色的字符串
				var jueseArr = [];
				$('.subJuese').map(function() {
				  return $.merge(jueseArr,JSON.parse($(this).text()));
				}).get();
				$('.jueseVal').val(JSON.stringify(jueseArr));
				
				regStep2 = true;
			} else {
				if ($('span.objectName').html().length == 0 || $('span.rightName').html().length == 0) {
					$('label.msgLabel').addClass('errorMsg');
				}
				regStep2 = false;
			}
		}
		
	});

	//点击上一步时的代码
	$('.prevBtn').click(function() {
		var tabPanIndx = $(this).closest('div.tab-pane').index();
		indx = tabPanIndx - 1;
		activeTab(indx);
	});

	//输入框错误时，重新输入，当输入框失去焦点后检查输入值
	$('.active input').change(function(){
		checkVal($(this));
	});
	
	//得到机构（jigou）id
	var jigouID;//定义机构id，在点下一步的时候拼接字符用
	$('.subOrganization').change(function(){
		var myJigouID = $(this).val();
		if (myJigouID !== '请选择'){			
			jigouID = myJigouID;
		}
		else{
			alert('请选择机构！');
		}
	});
	
	//新增一个科目按钮
	//var chooseObjectArray = [];
	$('.myField').change(function() {
		var myFieldVal = $(this).val();
		var	cobjRadio; //得到 选择科目 的长度
		if (myFieldVal !== '请选择') {
			$('.objectWrap').show();
			$('.addNewObject').click(function() {
				$('input:checkbox[name=rightName]').prop("checked",false);
				$('input:radio[name=objectName]').prop("checked",false);
				$('.objectToggleBox').show();
				//克隆一个存放新增科目的容器 selectedObjectList
				$('.selectedObjectList:last-child').clone().appendTo('.selectedObjectBox');
				$('.selectedObjectList:last-child').find('.objectName, .rightName, .subJuese').empty();
				$('.addNewObject').hide();
			});
			
			//获得科目名称和科目权限
			$('.getObjectAndRight').click(function() {
				var objectName = $('input:radio[name=objectName]:checked'), //获得选择科目名称
					lingyuID = objectName.val(),
					chooseRightArr = $('input:checkbox[name=rightName]:checked'),
					chooseRight = '';
				var	solLength =  $('.selectedObjectList').length;
				//var cobjRadio = $('.chooseObject .radio-inline').length;
				//得到角色额名称
				var rightTxt = chooseRightArr.map(function(){
					return $(this).next('span').text();
				}).get().join("，");	
				
				//拼接角色的id
				var jueseID = chooseRightArr.map(function(){
					return {jigou: jigouID, lingyu: lingyuID, juese: $(this).val()};
				}).get();
				console.log(jueseID);
				//console.log(subJuese);
				//获得科目权限
				if (objectName && rightTxt) {
					var radioSelectIndx = $('input:radio[name=objectName]:checked').closest('.radio-inline').index();
					//var myObj = {};
					$('.selectedObjectList:last-child span.objectName').html(objectName.next('span').text());//得到选中的值的文本
					$('.selectedObjectList:last-child span.rightName').html(rightTxt);//得到选中的值的文本
					$('.selectedObjectList:last-child span.radioSelectIndx').html(radioSelectIndx);
					$('.selectedObjectList:last-child p.subJuese').html(JSON.stringify(jueseID));
					$('label.msgLabel').removeClass('errorMsg');
					$('.objectToggleBox').hide();
					$('.objectWrapSub').show();
					$('input:radio[name=objectName]:checked').closest('.radio-inline').hide();
					if(solLength < cobjRadio){
						$('a.addNewObject').show();
					}
					else{
						$('a.addNewObject').hide();
					}
				}
			});
		}
		else{
			$('.objectWrap').hide();
		}
		
		//根据不同的学科领域，得到不同科目
		var lingYuUrl = webConfig.apiUrl + 'lingYu' + webConfig.token+ 'parentid=' + myFieldVal;
		//var lingYuUrl = 'http://192.168.1.111:3000/api/lingYu?token=12345&parentid=' + myFieldVal
		$.ajax({
			type:'GET',
			url:lingYuUrl,
			success: function(data){
				var lingYu = {lingYu: data};
				var source = '{{#lingYu}}<label class="radio-inline"><input type="radio" name="objectName" value="{{LINGYU_ID}}"><span>{{LINGYUMINGCHENG}}</span></label>{{/lingYu}}';
				var template = Handlebars.compile(source);
				var result = template(lingYu);
				$('.chooseObject').html(result);
				cobjRadio = data.length;
			},		   
			error:function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("XMLHttpRequest.status="+XMLHttpRequest.status + "\nXMLHttpRequest.readyState=" + XMLHttpRequest.readyState + "\ntextStatus="+textStatus);
			}
		});
	});
	
	//删除已选择的科目
	$('.selectedObjectBox').on('click','.delSelectedObject',function(event){
		var solLength =  $('.selectedObjectList').length,
			thisBtnIndx = $(this).closest('.selectedObjectList').index();
		if(solLength > 1){	
			//$('.chooseObject').append(chooseObjectArray[thisBtnIndx]);
			var whichListBeDelete = $(this).next('span.radioSelectIndx').html();
			$('.chooseObject .radio-inline').eq(parseInt(whichListBeDelete)).show();
			$(this).closest('.selectedObjectList').remove();
			$('a.addNewObject').show();	
		}
		else{
			//$('.selectedObjectList').hide();
			$('.objectName,.rightName,.subJuese').empty();
			$('a.addNewObject').hide();
			$('.objectToggleBox').show();
			$('.chooseObject .radio-inline').show();
			$('input:checkbox[name=rightName]').prop("checked",false);
			$('input:radio[name=objectName]').prop("checked",false);
		}
	});
	
	//当第一步和第二步的数据都正确时，上面的tab可点
	$('.nav-tabs li').click(function() {
		if (regStep1 && regStep2) {
			var thisIndx = $(this).index();
			$('li.active,div.active').removeClass('active');
			$(this).addClass('active');
			$('.tab-pane').eq(thisIndx).addClass('active');
		}
	});

	/* 注册页面用到的javascript代码，结束 */

	//根据不同的机构类别，得到不同的机构
	$('.organization').change(function(){
		var orgTarget = $(this),
			whichSelect = orgTarget.val(),
			jiGou_LeiBieUrl = webConfig.apiUrl + 'jiGou' + webConfig.token+ 'leibieid=' + whichSelect;
			//jiGou_LeiBieUrl = 'http://192.168.1.111:3000/api/jiGou?token=12345&leibieid=' + whichSelect;
			
		$.ajax({
			type:'GET',
			url:jiGou_LeiBieUrl,
			success: function(data){
				var jiGou = {jiGou: data};
				var source = '{{#jiGou}}<option value="{{JIGOU_ID}}">{{JIGOUMINGCHENG}}</option>{{/jiGou}}';
				var template = Handlebars.compile(source);
				var result = template(jiGou);
				//console.log(result);
				$('.subOrganization').html('<option>请选择</option>' + result);
			},		   
			error:function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("XMLHttpRequest.status="+XMLHttpRequest.status + "\nXMLHttpRequest.readyState=" + XMLHttpRequest.readyState + "\ntextStatus="+textStatus);
			}
		});
	});
	
/* 注册和登录的代码   结束--------------------------------------------------------------------------------------------------------------------------*/
	
	
/* 个人详情页用到的javascript代码，开始  ------------------------------------------------------------------*/
	
	$('.privilegeBtn').click(function() {
		//调待审核用户角色数据
		var userUID = $('.userUID').text();
		var dshyhjsUrl = webConfig.apiUrl + 'daishenhe_yonghu_juese' + webConfig.token+ 'caozuoyuan=' + userUID;
		var czynshUrl = webConfig.apiUrl + 'caozuoyuan_neng_shenhe' + webConfig.token+ 'caozuoyuan=' + userUID;
		
		//得到待审核数据
		$.ajax({
			type:'GET',
			url:dshyhjsUrl,
			success: function(data){
				var daiShenHeYongHuJueSe = {daiShenHeYongHuJueSe: data};
				var source = '{{#daiShenHeYongHuJueSe}}'
							+ 	'<tr><td>{{LINGYUMINGCHENG}}<span class="shYonghuId">{{UID}}</span><span class="shJigouId">{{JIGOU_ID}}</span><span class="shLingyuId">{{LINGYU_ID}}</span></td>'
							+ 	'<td>{{XINGMING}}</td>'
							+	'<td class="text-left"><div class="shenheJueseList">{{#each JUESE}}'
							+		'{{#if JUESE_ID}}{{#compare ZHUANGTAI -1}}'
							+			'<label class="checkbox-inline"><span class="originZT">{{ZHUANGTAI}}</span>'
							+			'<input type="checkbox" name="rightName" value="{{JUESE_ID}}" checked="true"><span>{{JUESEMINGCHENG}}</span></label>'
							+		'{{else}}'
							+			'<label class="checkbox-inline"><span class="originZT">{{ZHUANGTAI}}</span>'
							+			'<input type="checkbox" name="rightName" value="{{JUESE_ID}}"><span>{{JUESEMINGCHENG}}</span></label>'
							+		'{{/compare}}{{/if}}'
							+	'{{/each}}</div></td>'
							+	'<td class="passBtn"><button type="button" class="btn btn-success">通过审批</button><span class="shMsgBox"></span></td></tr>'
							+ '{{/daiShenHeYongHuJueSe}}';
				var template = Handlebars.compile(source);
				 // 添加角色的 helper
				Handlebars.registerHelper("compare", function(v1,v2,options) {
					if(v1>v2){
			            //满足添加继续执行
			            return options.fn(this);
		            }
			        else{
			             //不满足条件执行{{else}}部分
			            return options.inverse(this);
			        }
				});

				var result = template(daiShenHeYongHuJueSe);
				$('.shenheList').html(result);
				//审核按钮样式
				$('.shenheJueseList input:checkbox[name=rightName]').change(function(){
					//变按钮的样式
					var trIndx = $(this).closest('tr').index();
					$('.passBtn').eq(trIndx).find('.btn').removeClass('hide');
					$('.passBtn').eq(trIndx).find('span.shMsgBox').html('');
					$('.passBtn').eq(trIndx).find('.btn').removeClass('btn-success').addClass('btn-danger').text('确认修改');
				});
				
				$('.shenheBox').slideToggle();
				
				//点击通过审核按钮，提交审核数据  
				$('.passBtn .btn').on('click', function(){
					var $targetTr = $(this).closest('tr'),
						yonghuid = $targetTr.find('span.shYonghuId').text(),
						jigou = $targetTr.find('span.shJigouId').text(),
						lingyu = $targetTr.find('span.shLingyuId').text(),
						checkboxInline = $targetTr.find('.checkbox-inline'),
						checkboxArr = [];
					checkboxInline.map(function(){
						var originZT = $(this).find('.originZT').text();
						var chb = $(this).find('input:checkbox');
						if(originZT > -1){
							if(chb.prop("checked")){
								var jueseVal = {yonghuid: yonghuid, jigou: jigou, lingyu: lingyu, juese: [{juese_id: chb.val(), zhuangtai: 1}]};
								checkboxArr.push(jueseVal);
							}
							else{
								var jueseVal = {yonghuid: yonghuid, jigou: jigou, lingyu: lingyu, juese: [{juese_id: chb.val(), zhuangtai: 0}]};
								checkboxArr.push(jueseVal);
							}
						}
						else{
							if(chb.prop("checked")){
								var jueseVal = {yonghuid: yonghuid, jigou: jigou, lingyu: lingyu, juese: [{juese_id: chb.val(), zhuangtai: 1}]};
								checkboxArr.push(jueseVal);
							}
						}
					});
					
					//提交选中数据
					var shyhjsUrl = webConfig.apiUrl + 'shenhe_yonghu_juese';
					
					var request = $.ajax({
						type:'POST',
						url: shyhjsUrl,
						data: { token: 12345, caozuoyuan: userUID, yonghujuese: checkboxArr}
					});
					
					request.done(function(msg) {
						$targetTr.find('span.shMsgBox').html('提交成功!');
					 	$targetTr.find('.btn').addClass('hide');
					});
					 
					request.fail(function(jqXHR, textStatus) {
					  	alert( "Request failed: " + textStatus );
					});
				});
			},		   
			error:function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("XMLHttpRequest.status="+XMLHttpRequest.status + "\nXMLHttpRequest.readyState=" + XMLHttpRequest.readyState + "\ntextStatus="+textStatus);
			}
		});
		
		$('.closeShenBox').click(function(){
			$('.shenheBox').hide();
		});
	});
	
/*  个人详情页用到的javascript代码，结束 ------------------------------------------------------------------*/

/* 提交审核页面代码，开始  ------------------------------------------------------------------*/
	//$('input:checkbox[name=rightName]:checked')
	
	
/* 提交审核页面代码，结束 ------------------------------------------------------------------*/
});
