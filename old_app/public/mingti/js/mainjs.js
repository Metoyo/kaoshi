$(function() {
    var webConfig = {apiUrl_mt:'http://www.taianting.com:4000/api/',token:'?token=12345&'};
/*-----sidebar 导航使用js代码   开始 -----------------------------------------------*/
	$('.dropdownToggle').click(function() {
		var activeLi = $(this).closest('.list-group-item');
		if(!activeLi.hasClass('active')) {
			$('.active').removeClass('active');
			$('.toggle-menu').slideUp(300);
			activeLi.addClass('active');
			$('.select').removeClass('select');
			activeLi.find('.toggle-menu li').first().find('a.menuitem').addClass('select');
			$(this).next('.toggle-menu').slideDown(600, function() {
			});
		}
	});
	
	//控制面板的折叠按钮事件
	$('.dsfoldBtn').on('click',function(){
		var $dashboard = $('.dashboard'),
			$main = $('.main'),
			dashboardWith = $dashboard.width();
		if(dashboardWith == 120){
			$('.userInfo, .nav-icon').hide();
			$('.dsfoldBtn').css('background-position-y','-20px');
			$dashboard.animate({
			    width: '20px'
			}, 500, function() {
			    
			});
			$main.animate({
			    'padding-left': '20px'
			}, 500, function() {
			    
			});
		}
		else{
			$('.dsfoldBtn').css('background-position-y','5px');
			$main.animate({
			    'padding-left': '120px'
			}, 500, function() {
			    
			});
			$dashboard.animate({
			    width: '120px'
			}, 500, function() {
			    $('.userInfo, .nav-icon').show();
			});
		}
	});
/*-----sidebar 导航使用js代码结束 -----------------------------------------------*/

/*-----知识点的树形结构样式开始-------------------------------------------------------*/
	$('.foldBtn').click(function() {
		$(this).toggleClass('unfoldBtn').closest('li').find('ul').toggle();
	});
	$('input[type=checkbox]').click(function() {
		var thisNode = $(this);
		var targetItem = $(this).closest('li').find('ul');
		if(targetItem.css('display') == "block") {
			targetItem.find('input[type=checkbox]').each(function() {
				if(thisNode.prop("checked")) {
					this.checked = true;
				} else {
					this.checked = false;
				}
			});
		}
		var cbVal = '';
		var cbArray = $('input[type=checkbox]');
		var cbl = cbArray.length;
		for( i = 0; i < cbl; i++) {
			if(cbArray.eq(i).prop("checked")) {
				cbVal += cbArray[i].value + ',';
			}
		}
	});
/*-----知识点的树形结构样式结束-------------------------------------------------------*/

/*-----大纲的添加和删除添加样式开始-------------------------------------------------------*/

	//查找每一级下面的子元素的最有后一个元素
	var findEachLastChild = function(prt, cld){
		$(prt).each(function(){
			$(this).find(cld).last().addClass('lastChild');
		});
	};
	//为每一个元素的最有后一个元素添加 lastChild
	var addLastClild = function(){
	    (function(){
            findEachLastChild('.dgLevel_0', '.dgLevel_1');
            findEachLastChild('.dgLevel_1', '.dgLevel_2');
            findEachLastChild('.dgLevel_2', '.dgLevel_3');
        })();
	};
	// 添加子节点
	var levelOneTpl = '<div class="media dgLevel_1 lastChild" data-zsdId = "">'
					+	 '<a class="media-object pull-left"></a>'
					+	 '<div class="media-body">'
					+		 '<div class="media-heading">'
					+			 '<div class="input-group col-md-4">'
					+				'<input type="text" class="form-control">'
					+				'<span class="input-group-btn">'
					+					'<button class="btn btn-default dgAddBtn dgAddBtn_1" type="button">'
					+						'<span class="glyphicon glyphicon-plus"> </span>'
					+					'</button>'
					+					'<button class="btn btn-default dgDeleteBtn" type="button">'
					+						'<span class="glyphicon glyphicon-trash"> </span>'
					+					'</button>'
					+				'</span>'
					+			'</div>'
					+		'</div>'
					+	'</div>'
					+ '</div>';
					
	var levelTwoTpl = '<div class="media dgLevel_2 lastChild" data-zsdId = "">'
					+	 '<a class="media-object pull-left"></a>'
					+	 '<div class="media-body">'
					+		 '<div class="media-heading">'
					+			 '<div class="input-group col-md-4">'
					+				'<input type="text" class="form-control">'
					+				'<span class="input-group-btn">'
					+					'<button class="btn btn-default dgAddBtn dgAddBtn_2" type="button">'
					+						'<span class="glyphicon glyphicon-plus"> </span>'
					+					'</button>'
					+					'<button class="btn btn-default dgDeleteBtn" type="button">'
					+						'<span class="glyphicon glyphicon-trash"> </span>'
					+					'</button>'
					+				'</span>'
					+			'</div>'
					+		'</div>'
					+	'</div>'
					+ '</div>';
					
	var levelThreeTpl = '<div class="media dgLevel_3 lastChild" data-zsdId = "">'
					+	 '<a class="media-object pull-left"></a>'
					+	 '<div class="media-body">'
					+		 '<div class="media-heading">'
					+			 '<div class="input-group col-md-4">'
					+				'<input type="text" class="form-control">'
					+				'<span class="input-group-btn">'
					+					'<button class="btn btn-default dgDeleteBtn" type="button">'
					+						'<span class="glyphicon glyphicon-trash"> </span>'
					+					'</button>'
					+				'</span>'
					+			'</div>'
					+		'</div>'
					+	'</div>'
					+ '</div>';
					
	$('.dagangInputForm').on('click', '.dgAddBtn_0', function(){
		$(this).closest('.media-heading').nextAll().removeClass('lastChild');
		$(this).closest('.media-body').append(levelOneTpl);
	});
	$('.dagangInputForm').on('click', '.dgAddBtn_1', function(){
		$(this).closest('.media-heading').nextAll().removeClass('lastChild');
		$(this).closest('.media-body').append(levelTwoTpl);
	});
	$('.dagangInputForm').on('click', '.dgAddBtn_2', function(){
		$(this).closest('.media-heading').nextAll().removeClass('lastChild');
		$(this).closest('.media-body').append(levelThreeTpl);
	});
	// 删除子节点  media
	$('.dagangInputForm').on('click', '.dgDeleteBtn', function(){
		$(this).closest('.media').siblings().last().addClass('lastChild');
		$(this).closest('.media').remove();
	});
	
/*-----大纲的添加和删除添加样式结束-------------------------------------------------------*/

/*-----根据不同的大纲显示不同的知识点 开始-------------------------------------------------------*/
$('.list-sheet').on('click','a.zsdg-btn',function(e){
    $('.saveDagangBtn').show();//保存按钮显示
    $('.dgInputWelcome').hide();//隐藏欢迎页面
    var cxzsdgzsd = $('span.cxzsdgzsd').text();
    var zhishidianId = $(this).data('zsdid');//知识点ID
    var gjd_id = $(this).data('gjdid');//根节点ID
    var ly_id = $(this).data('lyid');//根节点ID
    var dgListLeixing = $(this).data('leixing');//知识点类型
    var zsdgmc = $(this).text();//知识大纲名称
    
    var apiUrlCxzsdgzsd = cxzsdgzsd + '&zhishidagangid=' + zhishidianId;
    $('span.itemTitle').html(zsdgmc);
    //获得知识点数据
    $.ajax({
        type:'GET',
        url:apiUrlCxzsdgzsd,
        success: function(data){
            var zhishidian = {zhishidian: data};
            var source = '{{#zhishidian}}'
                        +    '<div class="media dagangBox dgLevel_0" data-jdId="{{JIEDIAN_ID}}" data-zsdId="{{ZHISHIDIAN_ID}}" data-jdxh="{{JIEDIANXUHAO}}" data-zsdlx="{{LEIXING}}" data-jdlx="{{JIEDIANLEIXING}}" data-zt="{{ZHUANGTAI}}">'
                        +         '<div class="media-body">'
                        +             '<div class="media-heading">'
                        +                 '<div class="col-md-4">'
                        +                     '<div class="form-control radius4 dagangName">'
                        +                         '{{ZHISHIDIANMINGCHENG}}'
                        +                         '<button class="btn btn-default dgAddBtn dgAddBtn_0" type="button">'
                        +                             '<span class="glyphicon glyphicon-plus"></span>'
                        +                         '</button>'
                        +                     '</div>'
                        +                 '</div>'
                        +             '</div>'
                        +             '<!-- 二级 -->'
                        +             '{{#each ZIJIEDIAN}}'
                        +                 '<div class="media dgLevel_1" data-jdId="{{JIEDIAN_ID}}" data-zsdId="{{ZHISHIDIAN_ID}}" data-jdxh="{{JIEDIANXUHAO}}" data-zsdlx="{{LEIXING}}" data-jdlx="{{JIEDIANLEIXING}}" data-zt="{{ZHUANGTAI}}">'
                        +                     '<a class="media-object pull-left"> </a>'
                        +                     '<div class="media-body">'
                        +                         '<div class="media-heading">'
                        +                             '<div class="input-group col-md-4">'
                        +                                 '<input type="text" class="form-control" value="{{ZHISHIDIANMINGCHENG}}">'
                        +                                 '<span class="input-group-btn">'
                        +                                     '<button class="btn btn-default dgAddBtn dgAddBtn_1" type="button">'
                        +                                         '<span class="glyphicon glyphicon-plus"> </span>'
                        +                                     '</button>'
                        +                                     '<button class="btn btn-default dgDeleteBtn" type="button">'
                        +                                         '<span class="glyphicon glyphicon-trash"> </span>'
                        +                                     '</button> </span>'
                        +                             '</div>'
                        +                         '</div>'
                        +                         '<!-- 三级 -->'
                        +                         '{{#each ZIJIEDIAN}}'
                        +                             '<div class="media dgLevel_2" data-jdId="{{JIEDIAN_ID}}" data-zsdId="{{ZHISHIDIAN_ID}}" data-jdxh="{{JIEDIANXUHAO}}" data-zsdlx="{{LEIXING}}" data-jdlx="{{JIEDIANLEIXING}}" data-zt="{{ZHUANGTAI}}">'
                        +                                 '<a class="media-object pull-left"> </a>'
                        +                                 '<div class="media-body">'
                        +                                     '<div class="media-heading">'
                        +                                         '<div class="input-group col-md-4">'
                        +                                             '<input type="text" class="form-control" value="{{ZHISHIDIANMINGCHENG}}">'
                        +                                             '<span class="input-group-btn">'
                        +                                                 '<button class="btn btn-default dgAddBtn dgAddBtn_2" type="button">'
                        +                                                     '<span class="glyphicon glyphicon-plus"></span>'
                        +                                                 '</button>'
                        +                                                 '<button class="btn btn-default dgDeleteBtn" type="button">'
                        +                                                     '<span class="glyphicon glyphicon-trash"> </span>'
                        +                                                 '</button> </span>'
                        +                                         '</div>'
                        +                                     '</div>'
                        +                                     '<!-- 四级 -->'
                        +                                     '{{#each ZIJIEDIAN}}'
                        +                                         '<div class="media dgLevel_3" data-jdId="{{JIEDIAN_ID}}" data-zsdId="{{ZHISHIDIAN_ID}}" data-jdxh="{{JIEDIANXUHAO}}" data-zsdlx="{{LEIXING}}" data-jdlx="{{JIEDIANLEIXING}}" data-zt="{{ZHUANGTAI}}">'
                        +                                             '<a class="media-object pull-left"> </a>'
                        +                                             '<div class="media-body">'
                        +                                                 '<div class="media-heading">'
                        +                                                     '<div class="input-group col-md-4">'
                        +                                                         '<input type="text" class="form-control" value="{{ZHISHIDIANMINGCHENG}}">'
                        +                                                         '<span class="input-group-btn">'
                        +                                                             '<button class="btn btn-default dgDeleteBtn" type="button">'
                        +                                                                 '<span class="glyphicon glyphicon-trash"> </span>'
                        +                                                             '</button> </span>'
                        +                                                     '</div>'
                        +                                                 '</div>'
                        +                                             '</div>'
                        +                                         '</div>'
                        +                                     '{{/each}}'
                        +                                 '</div>'
                        +                             '</div>'
                        +                         '{{/each}}'
                        +                     '</div>'
                        +                 '</div>'
                        +             '{{/each}}'
                        +         '</div>'
                        +     '</div>'
                        + '{{/zhishidian}}';
            var template = Handlebars.compile(source);
            var result = template(zhishidian);
            $('.dagangInputForm').html(result);
            //为每一个元素的最有后一个元素添加 lastChild
            addLastClild();
        },         
        error:function(XMLHttpRequest, textStatus, errorThrown){ 
            alert("XMLHttpRequest.status="+XMLHttpRequest.status + "\nXMLHttpRequest.readyState=" + XMLHttpRequest.readyState + "\ntextStatus="+textStatus);
        }
    });
    //保存修改后的知识大纲
    $('.saveBtbBox').on('click','.saveDagangBtn',function(){
        //拼接数据
        var jglyArr = cxzsdgzsd.split('&');
        var xgzsdgUrl = webConfig.apiUrl_mt + 'xiugai_zhishidagang';
        var shujuObj = {};
        var jiedian = [];
        shujuObj.ZHISHIDAGANG_ID = zhishidianId;
        shujuObj.ZHISHIDAGANGMINGCHENG = zsdgmc;
        shujuObj.GENJIEDIAN_ID = gjd_id;
        shujuObj.LEIXING = dgListLeixing;
        shujuObj.ZHUANGTAI = 1;
        
        //数据拼接
        var recursionFn = function(dglClass){
            var dgl = $(dglClass);
            var zsdArr = $.map(dgl,function(node){
                function rsfn(nd, lv){
                    var thisNode = nd;
                    var child = [];
                    var nextArr = nd.getElementsByClassName('.dgLevel_' + lv);
                    var nextArrL = nextArr.length;
                    if (nextArrL){
                        for(var i = 0; i < nextArrL; i++ ){
                            child.push(rsfn(nextArr[i], lv+1));
                        }
                    }
                    
                    var zsdmc = thisNode.getElementsByClassName('media-body')[0].getElementsByTagName('input')[0].value;
                    var jdObj = {
                                    JIEDIAN_ID: thisNode.getAttribute('data-jdid'), 
                                    ZHISHIDIAN_ID: thisNode.getAttribute('data-zsdid'), 
                                    ZHISHIDIANMINGCHENG: zsdmc, 
                                    ZHISHIDIAN_LEIXING: thisNode.getAttribute('data-zsdlx'), 
                                    JIEDIANLEIXING: thisNode.getAttribute('data-jdlx'), 
                                    JIEDIANXUHAO: thisNode.getAttribute('data-jdxh'), 
                                    ZHUANGTAI: thisNode.getAttribute('data-zt'), 
                                    ZIJIEDIAN: child
                                };
                    return jdObj;
                }
                rsfn(node, 2);
            });
            
        };
        recursionFn('.dgLevel_1');
        //提交选中数据
       /* var request = $.ajax({
            type:'POST',
            url: xgzsdgUrl,
            data: { token: 12345, 
                    caozuoyuan: jglyArr[1].split('=')[1],
                    jigouid: jglyArr[2].split('=')[1],
                    lingyuid: ly_id,
                    shuju: ""
                  }
        });
        
        request.done(function(msg) {
            alert('保存成功！');
        });
         
        request.fail(function(jqXHR, textStatus) {
            alert( "Request failed: " + textStatus );
        });*/
    });
});
/*-----根据不同的大纲显示不同的知识点 结束-------------------------------------------------------*/

/*-----单选题添加样式 开始-------------------------------------------------------*/
	//模板开始
	var danxuanTpl = '<div class="row"><form class="form-horizontal" role="form"><fieldset class="form-header"><div class="form-group form-th">' + '<div class="col-sm-8 col-sm-offset-1 text-center">题干</div><div class="col-sm-2">正确答案</div></div>' + '<div class="form-group"><label for="" class="col-sm-1 control-label">题目</label><div class="col-sm-8"><textarea class="form-control" rows="3"></textarea></div></div></fieldset>' + '<fieldset class="form-body"><div class="form-group"><label for="" class="col-sm-1 control-label">A.</label>' + '<div class="col-sm-8"><input type="text" class="form-control"></div><div class="col-sm-2"><span class="glyphicon glyphicon-minus-sign delete-this-tiem"></span>' + '<div class="radio"><input class="hide" type="radio" name="optionsRadios" value="option1"><span class="glyphicon glyphicon-ok"></span></div></div></div>' + '<div class="form-group"><label for="" class="col-sm-1 control-label">B.</label><div class="col-sm-8"><input type="text" class="form-control"></div>' + '<div class="col-sm-2"><span class="glyphicon glyphicon-minus-sign delete-this-tiem"></span><div class="radio"><input class="hide" type="radio" name="optionsRadios" value="option2"><span class="glyphicon glyphicon-ok"></span></div></div></div>' + '<div class="form-group"><label for="" class="col-sm-1 control-label">C.</label><div class="col-sm-8"><input type="text" class="form-control"></div>' + '<div class="col-sm-2"><span class="glyphicon glyphicon-minus-sign delete-this-tiem"></span><div class="radio"><input class="hide" type="radio" name="optionsRadios" value="option3"><span class="glyphicon glyphicon-ok"></span></div></div></div>' + '<div class="form-group"><label for="" class="col-sm-1 control-label">D.</label><div class="col-sm-8"><input type="text" class="form-control"></div>' + '<div class="col-sm-2"><span class="glyphicon glyphicon-minus-sign delete-this-tiem delete-select"></span><div class="radio"><input class="hide" type="radio" name="optionsRadios" value="option4"><span class="glyphicon glyphicon-ok"></span></div></div></div></fieldset>' + '<fieldset class="form-footer"><div class="form-group"><a href="javascript:void(0)" id="add-one-item" title="增加一项" class="col-sm-1 control-label text-right add-btn"> <span class="glyphicon glyphicon-plus-sign"> </a></div>' + '<div class="form-group"><div class="col-sm-offset-1 col-sm-8 text-right"><button type="submit" class="btn btn-primary">保存</button></div></div></fieldset></form></div>';
	//模板结束
	var addItemIndx = 0;
	$('#danxuanti').on('click', function() {
		var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
		if(!$(this).hasClass('select')) {
			// 点击题型
			$('a.menuitem').on('click', function() {
				$('.select').removeClass('select');
				$(this).addClass('select');
			});
			// 将对应的题型添加到dom中
			$('#content').html(danxuanTpl);
			addItemIndx = $('.form-body .form-group').length;
		}
		//添加一个新选项
		$('#add-one-item').on('click', function() {
			$('.form-body .form-group:last').clone().appendTo('.form-body');
			$('.form-body .form-group:last').find('.control-label').html(letters[addItemIndx] + '.');
			$('span.delete-select').removeClass('delete-select');
			$('span.delete-this-tiem:last').addClass('delete-select');
			$(".form-body .form-group:last").on('click', '.delete-select', removeThisItem);
			addItemIndx += 1;
		});
		//删除一个选项
		$('.form-group').on('click', '.delete-select', removeThisItem);
		function removeThisItem() {
			if(addItemIndx > 1) {
				$('.form-body .form-group').eq(addItemIndx - 1).remove();
				addItemIndx -= 1;
				if(addItemIndx > 1) {
					$('.delete-this-tiem').eq(addItemIndx - 1).addClass('delete-select');
				}
			}
		};

	});
/*-----单选题添加样式 开始-------------------------------------------------------*/

/*----- 填空题增加一个空 开始-------------------------------------------------------*/
	var itemIndx = 0;
	$('.add-btn-box').on('click', '.add-u-item', function() {
		itemIndx = $(".uStyle").length;
		$('.editor').append('&nbsp;&nbsp;<span class="uStyle">' + (itemIndx + 1) + '</span>&nbsp;&nbsp;');
		$('.form-body').append(danxuanTpl);
	});
/*-----填空题增加一个空  开始-------------------------------------------------------*/
});
