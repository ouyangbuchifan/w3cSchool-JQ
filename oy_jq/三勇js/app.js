(function($) {
	Array.prototype.remove=function(obj){ 
		for(var i =0;i <this.length;i++){ 
			var temp = this[i]; 
			if(!isNaN(obj)){ 
				temp=i; 
			} 
			if(temp == obj){ 
				for(var j = i;j <this.length;j++){ 
					this[j]=this[j+1]; 
				} 
				this.length = this.length-1; 
			} 
		} 
	}
	Date.prototype.format = function(format) {
	    var date = {
	       "M+": this.getMonth() + 1,
	       "d+": this.getDate(),
	       "h+": this.getHours(),
	       "m+": this.getMinutes(),
	       "s+": this.getSeconds(),
	       "q+": Math.floor((this.getMonth() + 3) / 3),
	       "S+": this.getMilliseconds()
	    };
	    if (/(y+)/i.test(format)) {
	       format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	    }
	    for (var k in date) {
	       if (new RegExp("(" + k + ")").test(format)) {
	           format = format.replace(RegExp.$1, RegExp.$1.length == 1
	              ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
	       }
	    }
	    return format;
	}
})(jQuery);
//路由
(function($) {
  'use strict';
  var menuController = {
	  changeFile :function(){
		  $(".child_menu li a").on("click",function(){
			  var dataName = $(this).attr("data-name");
			  $(".right_col").load(dataName);
			
		  });
	  }
  }
  menuController.changeFile(); 
})(jQuery);
//组织机构控制

var orginfoController = {
	defauleParam : {
		curSelectNode:'',
		preAddUserlist:[],
		preAddOrgInfoId:'',
		preAddOrgInfoText:'',
		addUserInto:'',
		movePeopleOrgInfoId:'',
		movePeopleOrgInfoText:'',
		moveOrgInfoFromId:'',
		moveOrgInfoFromText:'',
		moveOrgInfoToId:'',
		moveOrgInfoToText:'',
		pointLeaderTreeId:'',
		pointLeaderTreeName:'',
		importOrgInfoToId:'',
		importOrgInfoToText:''
		
	},
	refreshTree:function(){
		$.ajax({
			url : baseUrl+'/orgInfo/refreshTree',
			data : '',
			contentType : 'application/json;charset=utf-8',
			type : "get",
			dataType : "json",
			success : function(result) {
				if (result.state == 1) {
					var copyTreeMessage = jQuery.extend(true, {}, result);
					//查询个人权限
					$.ajax({
						url : baseUrl+'/orgInfo/initSelfTree',
						contentType : 'application/json;charset=utf-8',
						type : "GET",
						dataType : "json",
						success : function(selfTreeResult) {
							var addTextHtml = "<button data-target=\"#addOrgInfoLabel\"   data-toggle=\"modal\"   class=\"myaddNode\" ></button>";
						    var editTextHtml = "<button data-target=\"#editOrgInfo\"   data-toggle=\"modal\"   class=\"myeditNode\"  ></button>";
						    var delTextHtml = "<button  onClick='return orginfoController.deleteNode(this)'   class=\"deleteNode\" ></button>";
						   /* data-target=\"#delConfirm\"   data-toggle=\"modal\" 
		*/				    
						    var selfTreeResultTree = selfTreeResult.data;
						    
						    for (var i = 0; i < result.jsTreeModalList.length; i++) {
						    	var temp = result.jsTreeModalList[i];
						    	if(selfTreeResultTree!=null){
						    		for(var j = 0 ; j< selfTreeResultTree.length;j++){
							    		var temp2 = selfTreeResultTree[j];
							    		if(temp.id==temp2.id){
							    			temp.text ="<span  data-id=\""+temp.id+"\" data-rootId=\"" + temp.rootId + "\"  data-orgName=\"" + temp.orgName + "\">"+temp.text+"</span>" + addTextHtml + editTextHtml 
									    	+ "<button  onClick='return orginfoController.deleteNode(this)' data-id=\""+temp.id+"\" data-text=\""+temp.text+"\"  data-orgName=\"" + temp.orgName + "\"  class=\"deleteNode\" ></button>";;
							    		}
							    	}
						    	}else{
					    			temp.text ="<span  data-id=\""+temp.id+"\" data-rootId=\"" + temp.rootId + "\"  data-orgName=\"" + temp.orgName + "\">"+temp.text+"</span>" + addTextHtml + editTextHtml 
							    	+ "<button  onClick='return orginfoController.deleteNode(this)' data-id=\""+temp.id+"\" data-text=\""+temp.text+"\"  data-orgName=\"" + temp.orgName + "\"  class=\"deleteNode\" ></button>";;
						    	}
						    	
							}
						    if($("#jstree").jstree(true)){
						    	$("#jstree").jstree(true).destroy ();
						    }
						    if($("#jstrees").jstree(true)){
						    	$("#jstrees").jstree(true).destroy ();
						    }
						    treeObj = { 
								'core' : {
									"multiple":false,
									'data' :result.jsTreeModalList,
									"animation": true,
									"check_callback": true,
									"worker": true
								},
								 types: {
						            default: {
						              icon: 'glyphicon glyphicon-flash'
						            },
						            star: {
						              icon: 'glyphicon glyphicon-star'
						            },
						            cloud: {
						              icon: 'glyphicon glyphicon-cloud'
						            }
						          },
						          version: 1,
						          plugins: ['types']
							}
							$('#jstree').jstree(treeObj)
								.on("select_node.jstree",function(node,selected){
									$(".importOrgInfoName").text(orginfoController.getSelectNodeText());
									orginfoController.defauleParam.importOrgInfoToId = selected.node.id;
									$('#userMessage').bootstrapTable('refresh',{
										query:{
											orgInfoid:selected.node.id
										}
									});
							});
						    
						    
						    treesObj = { 
									'core' : {
										"multiple":false,
										'data' :copyTreeMessage.jsTreeModalList,
										"animation": true,
										"check_callback": true,
										"worker": true
									},
									 types: {
							            default: {
							              icon: 'glyphicon glyphicon-flash'
							            },
							            star: {
							              icon: 'glyphicon glyphicon-star'
							            },
							            cloud: {
							              icon: 'glyphicon glyphicon-cloud'
							            }
							          },
							          version: 1,
							          plugins: ['types']
								}
						    
						    $("#jstrees").jstree(treesObj)
						    	.on("select_node.jstree",function(node,selected){
						    		orginfoController.defauleParam.preAddOrgInfoId=selected.node.id;
						    		orginfoController.defauleParam.preAddOrgInfoText=selected.node.text;
						    		$(".addUserInto").text(	selected.node.text);
						    		
						    		
					    	});
						    
						    if($("#movePeopleTree").jstree(true)){
						    	$("#movePeopleTree").jstree(true).destroy ();
						    }
						    $("#movePeopleTree").jstree(treesObj)
						    .on("select_node.jstree",function(node,selected){
						    		orginfoController.defauleParam.movePeopleOrgInfoId=selected.node.id;
						    		orginfoController.defauleParam.movePeopleOrgInfoText=selected.node.text;
						    		$(".movePeopleText").text(	selected.node.text);
						    });
						    if($("#moveOrgInfoFrom").jstree(true)){
						    	$("#moveOrgInfoFrom").jstree(true).destroy ();
						    }
						    $("#moveOrgInfoFrom").jstree(treesObj)
						    .on("select_node.jstree",function(node,selected){
						    		orginfoController.defauleParam.moveOrgInfoFromId=selected.node.id;
						    		orginfoController.defauleParam.moveOrgInfoFromText=selected.node.text;
						    		$(".moveOrgInfoFromText").text(	selected.node.text);
						    });
						    if($("#moveOrgInfoTo").jstree(true)){
						    	$("#moveOrgInfoTo").jstree(true).destroy ();
						    }
						    $("#moveOrgInfoTo").jstree(treesObj)
						    .on("select_node.jstree",function(node,selected){
						    		orginfoController.defauleParam.moveOrgInfoToId=selected.node.id;
						    		orginfoController.defauleParam.moveOrgInfoToText=selected.node.text;
						    		$(".moveOrgInfoToText").text(	selected.node.text);
						    });
						    if($("#pointLeaderTree").jstree(true)){
						    	$("#pointLeaderTree").jstree(true).destroy ();
						    }
						    //指定领导树
						    $("#pointLeaderTree").jstree(treesObj)
						    .on("select_node.jstree",function(node,selected){
					    		orginfoController.defauleParam.pointLeaderTreeId=selected.node.id;
					    		orginfoController.defauleParam.pointLeaderTreeName=selected.node.text;
					    		$(".pointLeaderOrgInfoName").text(selected.node.text);
						    });
							
							
							
							
							

						}
					});
					
					
				    
				} else {
				}

			}
		});
		$("#mergeOrgInfoBtn").on('click',function(){
			var orgInfoFromId = orginfoController.defauleParam.moveOrgInfoFromId;
			var orgInfoToId = orginfoController.defauleParam.moveOrgInfoToId;
			var mergerType =$("#mergeOrgInfo input[type=radio]:checked").attr("data-type");
			if(orgInfoFromId==null || orgInfoToId==null){
				errorPop("必须选择组织机构");
				return ;
			}
			$.ajax({
					url : baseUrl+'/orgInfo/merge2OrgInfo/mergerType/'+mergerType+'/moveOutId/'+orgInfoFromId+'/moveInId/'+orgInfoToId,
					contentType : 'application/json;charset=utf-8',
					type : "GET",
					dataType : "json",
					success : function(result) {
						if (result.state == 1) {
							successPop('添加成功');
							//需要刷新树信息
							orginfoController.refreshTree();
						} else {
							errorPop(result.msg);
						}
						$('#mergeOrgInfo').modal('hide');
						$('#userMessage').bootstrapTable('refresh',null);
						 $('#orgInvitList').bootstrapTable('refresh',null);
					}
				});
		});
	},
	getSelectNode:function(node,selected){
		orginfoController.defauleParam.curSelectNode = node;
		console.log(orginfoController.defauleParam);
		return node;
	},
	getSelectNodeId:function(){
		return id  = $('#jstree').jstree(true).get_selected()[0];
	},
	getSelectNodeText:function(){
		 var texts = $("#jstree").jstree(true).get_text(orginfoController.getSelectNodeId());
		if(texts.indexOf("<")!=-1 && texts.indexOf("button")!=-1){
			return texts.split("<")[1].split(">")[1];
		}else{
			return texts;
		}
	},
	//获取新增组织机构标签页
	getAddOrgInfoType:function(){
		return $("#addOrgInfoLabel li[class=active]").index();
	},
	//新增组织机构保存按钮处理
	saveOrgInfo:function(){
		$("#saveOrgInfo").on("click",function(){
			var addType = $("#addOrgInfoLabel li[class=active]").index();
			var orgLabel = $("#addOrgInfoLabel input[name=orgName]").val();
			//普通增加
			if(addType==0){
				var bootstrapValidator = $("#addOrgInfoForm").data('bootstrapValidator');
			    bootstrapValidator.validate();
			    if(bootstrapValidator.isValid()){
			    	errorPop('请输入正确的信息');
			    	return ;
			    }
				
				var orgLabel = $("#addOrgInfoLabel input[name=orgName]").val();
				var orgInfo = {
					parentId:orginfoController.getSelectNodeId(),
			        orgLabel: orgLabel
				}
				$.ajax({
					url : baseUrl+'/orgInfo/addOrgInfo',
					data : JSON.stringify(orgInfo),
					contentType : 'application/json;charset=utf-8',
					type : "post",
					dataType : "json",
					success : function(result) {
						if (result.state == 1) {
							successPop('添加成功');
							//需要刷新树信息
							orginfoController.refreshTree();
						} else {
							errorPop(result.msg);
						}
						$('#addOrgInfoLabel').modal('hide');
					}
				});
			//导入增加	
			}else{
				var importOrgInfoToId = orginfoController.defauleParam.importOrgInfoToId;
				var searchPhone = $("#addOrgInfoLabel input[name=phone]").val();
				var mergerType = $("#addOrgInfoLabel input[type=radio]:checked").attr("data-type");
				if(importOrgInfoToId!=null && importOrgInfoToId!='' 
					&& searchPhone!=null && searchPhone!=''){
					
					var bootstrapValidator = $("#importOrgInfoForm").data('bootstrapValidator');
				    bootstrapValidator.validate();
				    if(bootstrapValidator.isValid()){
				    	errorPop('请输入正确的信息');
				    	return ;
				    }
					
					$.ajax({
						url : baseUrl+'/orgInfo/importOrgInfo/phone/'+searchPhone+"/mergerintoId/"+importOrgInfoToId+"/mergerType/"+mergerType,
						contentType : 'application/json;charset=utf-8',
						type : "GET",
						dataType : "json",
						success : function(result) {
							if (result.state == 1) {
								successPop(result.msg);
							} else {
								errorPop(result.msg);
							}
							$('#addOrgInfoLabel').modal('hide');
							$('#orgFlowListTable').bootstrapTable('refresh', null);
							$('#userMessage').bootstrapTable('refresh',null);
						}
					});
					
				}else{
					errorPop('请选择要导入的组织,或检查手机号是否填写！');
				}
			}
		});
		
	},
	//编辑组织机构信息
	editOrgInfo:function(){
		$("#changeOrgInfo").on("click",function(){
			var bootstrapValidator = $("#editOrgInfoForm").data('bootstrapValidator');
			bootstrapValidator.validate();
			if (bootstrapValidator.isValid()) {
				errorPop('请输入正确的信息');
				return;
			}
			
			var orgName = $("#editOrgInfo input[name=orgInfoName]").val();
			var orgLabel = $("#editOrgInfo input[name=orgInfoLabel]").val();
			var orgInfo = {
					orgInfoName:orgName,
					orgLabel: orgLabel,
					orgId:orginfoController.getSelectNodeId()
			}
			
			$.ajax({
				url : baseUrl+'/orgInfo/editOrgInfo',
				data : JSON.stringify(orgInfo),
				contentType : 'application/json;charset=utf-8',
				type : "post",
				dataType : "json",
				success : function(result) {
					if (result.state == 1) {
						successPop('修改成功');
						//需要刷新树信息
						orginfoController.refreshTree();
					} else {
						errorPop(result.msg);
					}
					$('#editOrgInfo').modal('hide');
				}
			});
		});
	},
	//删除一个节点
	deleteNode:function(obj){
		console.log(obj);
		var curSelectId = $(obj).attr("data-id");;
		var getSelectNode = $(obj).attr("data-text");
		var Message = "确认要删除选择的数据吗？";
		if(curSelectId && getSelectNode){
			Message =  "确认要删除"+getSelectNode+"的数据吗？";
		}
		var deleteAlter =	insaleaderPop.alert({ 
				id:'delNode',
				message:Message,
				btnok:'删除',
				btncl:'取消'
			}).on(function(){
				if(curSelectId){
					$.ajax({
						url : baseUrl+'/orgInfo/delOrgInfo/'+curSelectId,
						contentType : 'application/json;charset=utf-8',
						type : "GET",
						dataType : "json",
						success : function(result) {
							if (result.state == 1) {
								successPop(result.msg);
								orginfoController.refreshTree();
							} else {
								errorPop(result.msg);
							}

						}
					});
				}
			});
		//$("#"+deleteAlter.id).modal("show");
	},
	
	
	initTree:function(){
		//指定组长
		$("#pointLeader").on("click",function(){
			var moingPeopleSelect = $('#userMessage').bootstrapTable('getSelections',null);
			if(moingPeopleSelect && moingPeopleSelect.length==1){
				var agentUser = moingPeopleSelect[0];
				$(".pointLeaderName").text(agentUser.userName);
				$("#pointLeaderModal").modal("show");
				
			}else{
				errorPop("请选择一条数据");
			}
		});
		//指定组长确定信息
		$("#pointLeaderBtn").on("click",function(){
			var moingPeopleSelect = $('#userMessage').bootstrapTable('getSelections',null);
			if(moingPeopleSelect && moingPeopleSelect.length==1){
				var agentUser = moingPeopleSelect[0];
				$.ajax({
					url : baseUrl+'/orgInfo/pointLeader/userId/'+agentUser.userId+"/orgInfoId/"+orginfoController.defauleParam.pointLeaderTreeId,
					contentType : 'application/json;charset=utf-8',
					type : "GET",
					dataType : "json",
					success : function(result) {
						if (result.state == 1) {
							successPop(result.msg);
						} else {
							errorPop(result.msg);
						}
						$("#pointLeaderModal").modal("hide");
						$('#userMessage').bootstrapTable('refresh', null);
					}
				});
			}else{
				errorPop("请选择一条数据");
			}
			
		});
		
		//离职
		$("#quitOut").on("click",function(){
			var moingPeopleSelect = $('#userMessage').bootstrapTable('getSelections',null);
			if(moingPeopleSelect && moingPeopleSelect.length==1){
				var agentUser = moingPeopleSelect[0];
				if(agentUser.orginfo.orgId == loingUserMessage.orgInfo.orgId){
					errorPop("您是根组织中的领导，离职时需要指定新的组长，请指定新的组长后操作!");
					return ;
				}
				
				var Message = "确定将"+agentUser.userName+"要离职么？";
				var curSelectId = null;
				if(curSelectId && getSelectNode){
					Message =  "确认要删除"+getSelectNode+"的数据吗？";
				}
				insaleaderPop.alert({ 
						id:'delNode',
						message:Message,
						btnok:'确定',
						btncl:'取消'
					}).on(function(){
						$.ajax({
							url : baseUrl+'/orgInfo/quitOrgInfo/'+agentUser.orginfo.orgId+"/delUserId/"+agentUser.userId,
							contentType : 'application/json;charset=utf-8',
							type : "get",
							dataType : "json",
							success : function(result) {
								if (result.state == 1) {
									successPop(result.msg);
								} else {
									errorPop(result.msg);
								}

							}
						});
				});
			}else{
				errorPop("请选择一条数据");
			}
		});
		$("#delPeople").on("click",function(){
			var moingPeopleSelect = $('#userMessage').bootstrapTable('getSelections',null);
			if(moingPeopleSelect && moingPeopleSelect.length==1){
				var agentUser = moingPeopleSelect[0];
				var Message = "确定要删除"+agentUser.userName+"用户么？";
				var curSelectId = null;
				if(curSelectId && getSelectNode){
					Message =  "确认要删除"+getSelectNode+"的数据吗？";
				}
				insaleaderPop.alert({ 
						id:'delNode',
						message:Message,
						btnok:'确定',
						btncl:'取消'
					}).on(function(){
						$.ajax({
							url : baseUrl+'/orgInfo/quitOrgInfo/'+agentUser.orginfo.orgId+"/delUserId/"+agentUser.userId,
							contentType : 'application/json;charset=utf-8',
							type : "get",
							dataType : "json",
							success : function(result) {
								if (result.state == 1) {
									successPop(result.msg);
								} else {
									errorPop(result.msg);
								}
								$('#userMessage').bootstrapTable('refresh', null);
								
								
							}
						});
				});
			}else{
				errorPop("请选择一条数据");
			}
			
		});
		orginfoController.refreshTree();
		//查询组织机构信息
		$(".searchOrgInfoByPhone").on("click",function(){
			var searchPhone = $("#addOrgInfoLabel input[name=phone]").val();
			var importOrgInfoToId = orginfoController.defauleParam.importOrgInfoToId;
			if(importOrgInfoToId!=null && importOrgInfoToId!=''  && searchPhone!=null && searchPhone!=''){
				$.ajax({
					url : baseUrl+'/orgInfo/searchPhone/'+searchPhone+"/mergerintoId/"+importOrgInfoToId,
					contentType : 'application/json;charset=utf-8',
					type : "GET",
					dataType : "json",
					success : function(result) {
						if (result.state == 1) {
							importTreeObj = { 
								'core' : {
									"multiple":false,
									'data' :result.data,
									"animation": true,
									"check_callback": true,
									"worker": true
								},
								 types: {
						            default: {
						              icon: 'glyphicon glyphicon-flash'
						            },
						            star: {
						              icon: 'glyphicon glyphicon-star'
						            },
						            cloud: {
						              icon: 'glyphicon glyphicon-cloud'
						            }
						          },
						          version: 1,
						          plugins: ['types']
							}
						  if($("#searchePhoneTree").jstree(true)){
						    	$("#searchePhoneTree").jstree(true).destroy ();
						    }
						    $("#searchePhoneTree").jstree(importTreeObj)
						    .on("select_node.jstree",function(node,selected){
						    });
						} else {
							errorPop(result.msg);
						}

					}
				});
			}else{
				errorPop('请输入手机号');
				return;
			}
		});
		//创建组织机构信息
		$("#confirmCreateOrgInfo").on("click",function(){
			var bootstrapValidator = $("#createOrgInfoForm").data('bootstrapValidator');
			bootstrapValidator.validate();
			if (bootstrapValidator.isValid()) {
				errorPop('请输入正确的信息');
				return;
			}
			
			var orgInfo = {
				orgName : $("#createOrgInfo input[name=orgName]").val(),
				orgLabel:$("#createOrgInfo input[name=orgLabel]").val()
			}
			$.ajax({
				url :baseUrl+'/orgInfo/createOrgInfo',
				data : JSON.stringify(orgInfo),
				contentType : 'application/json;charset=utf-8',
				type : "post",
				dataType : "json",
				success : function(result) {
					if (result.state == 1) {
						successPop('添加成功');
						//需要刷新树信息
						orginfoController.refreshTree();
					} else {
						errorPop(result.msg);
					}
					$('#createOrgInfo').modal('hide');
				}
			});
		});
		//说明内容的显示与隐藏
		$(".toggleIllustrate").on("click",function(){
			if ($(this).find("i").hasClass("fa-chevron-up")) {
				$(this).find("i").removeClass("fa-chevron-up");
				$(this).find("i").addClass("fa-chevron-down");
	            } else {
	            	$(this).find("i").removeClass("fa-chevron-down");
	            	$(this).find("i").addClass("fa-chevron-up");
	            }
			
			var $xpanel = $(this).closest('.x_panel');
			var $xcontent = $xpanel.find(".x_content");
			if ($xcontent) {
				$xcontent = $xcontent.eq(0);
            }
			if ($xcontent.attr("style")) {
				$xcontent.slideToggle(800, function () {
					$xcontent.removeAttr('style');
              });
            } else {
            	$xcontent.slideToggle(800);
            	$xcontent.css('height', 'auto');
            }
		});
		//组织机构成员信息
		$('#userMessage').bootstrapTable({
			url: baseUrl+'/orgInfo/orgInfoUsers',		 //请求后台的URL（*）
			method: 'GET',					  //请求方式（*）
			striped: true,					  //是否显示行间隔色
			cache: false,					   //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true,
			dataType: "json",
		    singleSelect: false,
		    pageSize:10,
		    pageList:[10, 25, 50, 100],
		    showRefresh:true,
		    showToggle:true,
		    showPaginationSwitch:true,
		    smartDisplay:true,
		    checkboxHeader: true,
		    columns: [{
	                field: 'state',
	                checkbox:true
	            }, {
                	title: '主键',
                    field: 'userid',
                    align: 'center',
                    valign: 'middle',
                    visible:false
                },{
                    title: '用户名',
                    field: 'userName',
                    align: 'center',
                    valign: 'middle',
                },{
                    title: '手机号',
                    field: 'mobile',
                    align: 'center',
                    valign: 'middle'
                },{
                	title: '身份',
                    field: 'orginfo.orgLeaderId',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(value,row,index){
                		if(row.orginfo.orgLeaderId !=null && row.orginfo.orgLeaderId!=''){
                			return "<span class='fa fa-users'>组长</span>";
                		}else{
                			return "<span class='fa fa-user'>成员</span>";
                		}
                	}
                },{
                	title:'操作',
                	formatter:function(value,row,index){
                		return "<a href='http://www.baidu.com'>查看</a>"
                	}
                }
            ],
            responseHandler:function(res){
            	return res["data"];
            },
            onCheck:function(row){
            	if(row.orginfo.orgLeaderId !=null && row.orginfo.orgLeaderId!=''){
            		$(".userBtns").show();
            	}else{
            		$(".userBtns").hide();
            	}
            }
		});
		//邀请记录内容
		$("#orgInvitList").bootstrapTable({
			url: baseUrl+'/orgInvitFlow/orgId/' + ((loingUserMessage && loingUserMessage.orgInfo)?loingUserMessage.orgInfo.orgId:'1' ),		 //请求后台的URL（*）
			method: 'GET',					  //请求方式（*）
			striped: true,					  //是否显示行间隔色
			cache: false,					   //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true,
			dataType: "json",
		    singleSelect: false,
		    pageSize:10,
		    pageList:[10, 25, 50, 100],
		    showRefresh:true,
		    showToggle:true,
		    showPaginationSwitch:true,
		    smartDisplay:true,
		    checkboxHeader: true,
		    columns: [{
	                field: 'state',
	                checkbox:true
		    	},{
                	title: '主键',
                    field: 'userid',
                    align: 'center',
                    valign: 'middle',
                    visible:false
                },{
                    title: '邀请者手机号/邮箱',
                    field: 'beInviterName',
                    align: 'center',
                    valign: 'middle',
                },{
                    title: '邀请类型组织/个人',
                    field: 'invitType',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(value,row,index){
                    	if(value=="1"){
                    		return "<span class='fa fa-user' style='color:blue'>个人<span>";
                    	}else{
                    		return "<span class='fa fa-users' style='color:green'>组织</span>";
                    	}
                    }
                },{
                    title: '邀请状态',
                    field: 'invitState',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(value,row,index){
                    	//1:待回复;2:已同意;3:已拒绝
                    	if(value=="1"){
                    		return "待回复";
                    	}else if(value=="2"){
                    		return "已同意";
                    	}else {
                    		return "已拒绝";
                    	}
                    }
                },{
                    title: '邀请时间',
                    field: 'invitTime',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(value,row,index){
                    	if(value){
                    		var newDate = new Date();
                        	newDate.setTime(value );
                        	return newDate.format("yyyy-MM-dd hh:mm:ss");
                    	}
                    
                    }
                },{
                    title: '回复时间',
                    field: 'beInviterTime',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(value,row,index){
                    	if(value){
                    		var newDate = new Date();
                        	newDate.setTime(value);
                        	return newDate.format("yyyy-MM-dd hh:mm:ss");
                    	}
                    	
                    }
                },{
                	title: '拒绝理由',
                    field: 'beInvitNote',
                    align: 'center',
                    valign: 'middle',
                    formatter:function(value,row,index){
                    	if(row.invitState=="3"){
                    		return value;
                    	}else{
                    		return "---";
                    	}
                    }
                },{
                	title:'操作',
                	events: orgInviteController.cancelInvite,
                	formatter:function(value,row,index){
                		if(row.invitState=="1"){
                			return "<a class='btn btn-success cancel btn-xs'><span class='fa fa-reply-all'>&nbsp;撤回<span></a>";
                		}else{
                			return "---";
                		}
                	}
                }
            ],
            responseHandler:function(res){
            	return res["data"];
            },
            onCheck:function(row){
            	console.log(row);
            }
		});
		//处理添加用户时方法
		$("#addUserBtn").on("click",function(){
			orginfoController.defauleParam.preAddUserlist = [];
			$("#addUserModal").modal("show");
			$("#addUserModal .fixed-table-loading").hide();
		});
		//预加载用户
		 $("#preAddUserlist").bootstrapTable({
			striped: true,					  //是否显示行间隔色
			pagination: true,
		    singleSelect: false,
		    columns: [{
                	title: '昵称',
                	field: 'nickName',
                    align: 'center',
                    valign: 'middle'
                },{
                    title: '邀请者手机号/邮箱',
                    field: 'mobile',
                    align: 'center',
                    valign: 'middle',
                },{
                	title:'操作',
                	formatter:function(value,row,index){
                		return "<a href='javascript:void(0)' onclick='return orginfoController.delPreAddUserList(this,"+index+")' ><span class='fa fa-trash' style='color:red' >删除</span></a>"
                	}
                }
            ]
		});
		 //根据手机查询用户
		$("#queryUserByPhone").on("click",function(){
			var phone = $("#addUserModal input[name=agentPhone]").val();
			$.ajax({
				url :baseUrl+'/agent/mobile/'+phone,
				contentType : 'application/json;charset=utf-8',
				type : "get",
				dataType : "json",
				success : function(result) {
					if (result.state == 1) {
						
						//检查该用户是否已添加了
						var curUser = result.data[0];
						for(var i= 0 ;i <orginfoController.defauleParam.preAddUserlist.length;i++ ){
							var temp = orginfoController.defauleParam.preAddUserlist[i];
							if(curUser.userId==temp.userId){
								errorPop("您要添加的代理人，已在下方列表中，请勿重复添加！");
								return;
							}
						}
						
						orginfoController.defauleParam.preAddUserlist.push(result.data[0]);
						$('#preAddUserlist').bootstrapTable('load', orginfoController.defauleParam.preAddUserlist); 
						successPop('已添加入列表，点击下方保存才可以加入指定组织');
					} else {
						errorPop(result.msg);
					}

				}
			});
		});
		//新增用户保存内容
		$("#preAddUserIntoOrgInfo").on("click",function(){
			 var bootstrapValidator = $("#importOrgInfoForm").data('bootstrapValidator');
			   bootstrapValidator.validate();
			  if(!bootstrapValidator.isValid()){
				  errorPop("请输入正确项目！");
				  return ;
			  }
			if(orginfoController.defauleParam.preAddUserlist!=null && orginfoController.defauleParam.preAddUserlist.length>=1 && orginfoController.defauleParam.preAddOrgInfoId!=''){
				var ids = "";
				for(var i = 0 ;i < orginfoController.defauleParam.preAddUserlist.length;i++){
					var temp = orginfoController.defauleParam.preAddUserlist[i];
					ids += temp.userId +"&";
				}
				$.ajax({
					url : baseUrl+'/orgInvitFlow/invitedIds/'+ids+"/orgInfoIntoId/"+orginfoController.defauleParam.preAddOrgInfoId,
					contentType : 'application/json;charset=utf-8',
					type : "get",
					dataType : "json",
					success : function(result) {
						if (result.state == 1) {
							  var inviteUserResult = result.data;
						 	  var sendInvitedItemSuc = new Array();
					          var sendInvitedItemFail = new Array();
					          for(var i = 0 ;i < inviteUserResult.length ;i++){
					            var item = inviteUserResult[i];
					            if(item.state==1){
					              sendInvitedItemSuc.push(inviteUserResult[i]);
					            }else{
					              sendInvitedItemFail.push(inviteUserResult[i])
					            }
					          }
					          var failUserItems = "";
					          for(var i = 0 ;i <sendInvitedItemFail.length;i++ ){
					        	  var item = sendInvitedItemFail[i];
					        	  failUserItems+= item.userName+"失败原因:"+item.msg+"<br/>";
					          }
					          var resultMsg = sendInvitedItemSuc.length +"发送邀请成功，<br>"+sendInvitedItemFail.length+"发送邀请失败;<br>";
					          if(sendInvitedItemFail.length>0){
					            resultMsg = resultMsg+failUserItems;
					          }
					         successPop(resultMsg);
						} else {
							errorPop(result.msg);
						}
						$("#addUserModal").modal("hide");
						//刷新邀请记录表
						 $('#orgInvitList').bootstrapTable('refresh',null);
					}
				
				});
			}else{
				errorPop("请进行添加用户或选择要加入的组织");
			}
		});
		//人员移动表格
		$("#preMovePerople").bootstrapTable({
			striped: true,					  //是否显示行间隔色
			pagination: true,
		    singleSelect: false,
		    columns: [{
	                field: 'state',
	                checkbox:true
	            }, {
                	title: '主键',
                    field: 'userid',
                    align: 'center',
                    valign: 'middle',
                    visible:false
                },{
                    title: '用户名',
                    field: 'userName',
                    align: 'center',
                    valign: 'middle',
                },{
                    title: '手机号',
                    field: 'mobile',
                    align: 'center',
                    valign: 'middle'
                },{
                	title:'操作',
                	formatter:function(value,row,index){
                		return "<a href='http://www.baidu.com'>查看</a>"
                	}
                }
            ]
		});
		//准备移动
		$("#preMovingPeople").on("click",function(){
			var moingPeopleSelect = $('#userMessage').bootstrapTable('getSelections',null);
			if(moingPeopleSelect && moingPeopleSelect.length>=1){
				var agentUser = moingPeopleSelect[0];
				$('#preMovePerople').bootstrapTable('load', moingPeopleSelect); 
				$(".movePeopleCount").text(moingPeopleSelect.length);
				$("#movePeople  .fixed-table-loading").hide();
				$("#movePeople").modal("show");
			}else{
				errorPop("至少选择一条数据");
			}
			
		});
		//人员移动
		$("#movingPeople").on("click",function(){
			var moingPeopleSelect = $('#userMessage').bootstrapTable('getSelections',null);
			$('#preAddUserlist').bootstrapTable('load', moingPeopleSelect); 
			var userIds = "";
			if(moingPeopleSelect && moingPeopleSelect.length>=1){
				var movePeopleOrgInfoId = orginfoController.defauleParam.movePeopleOrgInfoId;
				for(var i = 0 ;i < moingPeopleSelect.length;i++){
					var items = moingPeopleSelect[i];
					userIds += items.userId + "&";
				}
				$.ajax({
					url : baseUrl+'/orgInfo/userIds/'+userIds+"/moveInOrgInfoId/"+movePeopleOrgInfoId,
					contentType : 'application/json;charset=utf-8',
					type : "GET",
					dataType : "json",
					success : function(result) {
						if (result.state == 1) {
							successPop(result.msg);
						} else {
							errorPop(result.msg);
						}
					}
				});
				$('#userMessage').bootstrapTable('refresh',null);
				$("#movePeople").modal("hide");
				$("#orgFlowListTable").bootstrapTable('refresh',null);
			}else{
				errorPop("至少选择一个人员进行移动！");
			}
			
		});
		//判断该用户是否有组织机构，有责隐藏掉创建组织机构按钮
		var orgInfo = loingUserMessage.orgInfo;
		if(orgInfo){
			$("#createOrgInfoBtn").hide();
		}
		
	},
	delPreAddUserList:function(obj,index){
		orginfoController.defauleParam.preAddUserlist.remove(index);
		$('#preAddUserlist').bootstrapTable('load', orginfoController.defauleParam.preAddUserlist); 
	}
	
  }

//邀请记录控制
var orgInviteController = {
	 defualtParam : {
			
	},
	init:function(){
		$("#orgFlowListTable").bootstrapTable({
			url: baseUrl+'/orgInvitFlow/beInviterId',		 //请求后台的URL（*）
			method: 'GET',					  //请求方式（*）
			striped: true,					  //是否显示行间隔色
			cache: false,					   //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true,
			dataType: "json",
		    singleSelect: false,
		    pageSize:10,
		    pageList:[10],
		    checkboxHeader: true,
		    pageNumber:1,
		    sidePagination:'server',
		    bProcessing: true,
		    queryParamsType : "undefined",  
		    columns: [{
                field: 'state',
                checkbox:true
	    	},{
            	title: '主键',
                field: 'id',
                align: 'center',
                valign: 'middle',
                visible:false
            },{
                title: '邀请者手机号/邮箱',
                field: 'beInviterName',
                align: 'center',
                valign: 'middle',
            },{
                title: '邀请类型组织/个人',
                field: 'invitType',
                align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
                	if(value=="1"){
                		return "个人";
                	}else{
                		return "组织";
                	}
                }
            },{
                title: '邀请状态',
                field: 'invitState',
                align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
                	//1:待回复;2:已同意;3:已拒绝
                	if(value="1"){
                		return "待回复";
                	}else if(value="2"){
                		return "已同意";
                	}else {
                		return "已拒绝";
                	}
                }
            },{
                title: '邀请时间',
                field: 'invitTime',
                align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
                	if(value){
                		var newDate = new Date();
                    	newDate.setTime(value );
                    	return newDate.format("yyyy-MM-dd hh:mm:ss");
                	}
                }
            },{
                title: '回复时间',
                field: 'beInviterTime',
                align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
                	if(value){
                		var newDate = new Date();
                    	newDate.setTime(value);
                    	return newDate.format("yyyy-MM-dd hh:mm:ss");
                	}
                }
            },{
            	title: '拒绝理由',
                field: 'beInvitNote',
                align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
                	if(row.invitState=="3"){
                		return value;
                	}else{
                		return "---";
                	}
                }
            },{
            	title:'操作',
            	events: orgInviteController.operateEvents,
            	formatter:function(value,row,index){
            		if(row.invitState=="2"){
            			return "<a class='btn btn-success  btn-xs'><span class='fa fa-check-square-o'>已处理<span></a>";
            		}else if(row.invitState=="3"){
            			return "<a class='btn btn-danger  btn-xs'><span class='fa  fa-minus-circle'>&nbsp;已拒绝<span></a>";
            		}
            		return "<a href='javascript:void(0)' class='btn btn-info btn-xs agree' ><span class='fa fa-check-circle'>&nbsp;同意</span></a>" +
            				"&nbsp;<a href='javascript:void(0)'  class='btn btn-danger btn-xs disagree'  ><span class='fa fa-minus-circle'>&nbsp;拒绝</span></a>"
            	}
            }],
	        responseHandler:function(res){
	        	return {
	        		rows: res["data"],
	        		total:res['total']
        		};
	        },
	        onCheck:function(row){
	        	console.log(row);
	        },
	        queryParams:function(params){
	        	return {
	        		pageSize: params.limit,
	        		pageNumber:params.pageNumber,
	        		sortName:'invitTime', 
	        		sortOrder:'desc'
	        	}
	        }
		});
		$(".insaleaderSelect li").on('click',function(){
			$(".insaleaderSelect li").parent().prev().text("");
			$(".insaleaderSelect li").parent().prev().html($(this).find("a").text()+'<span class="caret"></span>');
			$(".insaleaderSelect li").parent().prev().attr("data-selected",$(this).attr("data-type"));
			
		});
		//查询按钮
		$("#search").on("click",function(){
			var inviteState = $("#toolbar ul[role=menu] li").parent().prev().attr("data-selected");
			var inviterName = $("#toolbar .top_search").val();
			var queryParam = {
				invitState: inviteState,
				inviterName:inviterName
			}
			$("#orgFlowListTable").bootstrapTable('refresh',{
				query:queryParam
			});
		});
	},
	operateEvents:{
		'click .agree': function (e, value, row, index) {
			var invitType = row.invitType;
			var id = row.id;
			//邀请个人
			if(invitType=="1"){
				$.ajax({
					url : baseUrl+'/orgInvitFlow/orgInvitFlowId',
					data:JSON.stringify({
						mergerOrgInfoId:id,
						invitState:2,
						beInviteNode:''
					}),
					contentType : 'application/json;charset=utf-8',
					type : "POST",
					dataType : "json",
					success : function(result) {
						if (result.state == 1) {
							successPop(result.msg);
						} else {
							errorPop(result.msg);
						}
						//刷新邀请列表
						$('#orgFlowListTable').bootstrapTable('refresh');
					}
				});
				//邀请组织
			}else{
				var mergerOrgInfoId = row.id;
				$.ajax({
					url : baseUrl+'/orgInvitFlow/orgInvitFlowId',
					data: JSON.stringify({
						mergerOrgInfoId:id,
						invitState:2,
						beInviteNode:''
					}),
					contentType : 'application/json;charset=utf-8',
					type : "POST",
					dataType : "json",
					success : function(result) {
						if (result.state == 1) {
							successPop(result.msg);
						} else {
							successPop(result.msg);
						}
						//刷新邀请列表
						$('#orgFlowListTable').bootstrapTable('refresh');
					}
				});
			}
        },
        'click .disagree': function (e, value, row, index) {
        	insaleaderPop.confirm({ 
				id:'delNode',
				message:"<div>请填写拒绝原因<div><br/><div><textarea class='form-control' rows='3' cols='40' style='width: 367px; height: 77px;'></textarea></div>",
				btnok:'保存',
				btncl:'取消'
			}).on(function(flag,id){
				var refuseNote = $("#"+id+" textarea").val();
				if(refuseNote!=null && refuseNote!=""){
					$.ajax({
						url : baseUrl+'/orgInvitFlow/mergerOrgInfoId',
						data: JSON.stringify({
							mergerOrgInfoId:row.id,
							invitState:3,
							beInviteNode:refuseNote
						}),
						contentType : 'application/json;charset=utf-8',
						type : "POST",
						dataType : "json",
						success : function(result) {
							if (result.state == 1) {
								successPop(result.msg);
							} else {
								successPop(result.msg);
							}
							//刷新邀请列表
							$('#orgFlowListTable').bootstrapTable('refresh');
						}
					});
				}else{
					errorPop("请填写拒绝原因");
					return;
				}
			});
        }
	},
	cancelInvite:{
		'click .cancel' : function (e, value, row, index) {
			console.log(e);
		}
	}
}











