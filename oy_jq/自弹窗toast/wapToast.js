(function($) {
	$.fn.wapToast = function(options) {
		var defaultOp = {
			align: 'left',
			size: '12px',
			bottom: '10%',
			txt: 'hello, world!'
		}
		var toastSta;
		var dtd = $.extend(defaultOp, options);
		var toastDom = new Array();
		toastDom.push('<div id = "wapToast" style="position:fixed;left:10%;padding:10px;width:80%;color: #fff;background: rgba(0, 0, 0, .75);line-height:1.8;bottom:' + dtd.bottom + ';font-size:' + dtd.size + ';text-align:' + dtd.align + ';">' );
		toastDom.push('<p>' + dtd.txt + '</p>');
		toastDom.push('</div>');
		
		toastDom = toastDom.join('');
		if (!$("#wapToast").is(':visible')) {	// 防止多次点击
			$('body').append(toastDom);
		}

		// 显示
		$('#wapToast').fadeIn();
		setTimeout(function(){
			$('#wapToast').fadeOut();
		},2500)
		setTimeout(function(){
			$('#wapToast').remove();
		},3000)
	}
})(jQuery);