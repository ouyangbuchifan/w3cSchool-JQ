/***
* t.head 标题文字
* t.text 提示内容文字
* t.btn 按钮文字
* fn 点击确定之后的回调
*/
(function($){
	window.alert = function(t, fn){
		var VERSION = "1.0.0";
		var option = {
			head:"此网页显示",
			text:"这里是弹框内容",
			btn:"确定"
		}
		var txt = $.extend(option, t);
		var modal = new Array();
		modal += '<div class="m_modal_bg" style="position: absolute;z-index:100;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.75);"></div>'
		modal += '<div class="m_modal" style="position: absolute;width: 80%;left: 10%;top: 100px;background: #fff;border-radius: 9px;text-align: center;z-index: 800;font-family:\'微软雅黑\'">';
		modal += '<div class="m_modal_head" style="margin-top: 10px;font-weight: bold;font-size: 14px;">' + txt.head + '</div>';
		modal += '<div class="m_modal_body" style="padding:5px 0 10px;font-size: 12px;border-bottom: 1px solid #eee;line-height: 1.8;">' + txt.text + '</div>';
		modal += '<div class="m_modal_foot"><span class="m_btn" style="display: block;color: #08f;line-height: 2.5;">' + txt.btn + '</span></div>'
		modal += '</div>';

		$('body').html(modal);
		$('.m_modal_foot .m_btn').on('click', function(){
			$('.m_modal_bg').remove();
			$('.m_modal').remove();
			fn();	//回调
		});
	}
})(jQuery);