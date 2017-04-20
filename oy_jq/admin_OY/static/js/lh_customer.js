$(function () {
    
    // 主框架二级菜单内容
	$("#menu")
    .mmenu({
        offCanvas	: false,
        classes		: 'mm-white',
        header		: true,
        searchfield	: {
            add			: true,
            addTo		: '#locations',
            placeholder	: 'Address, Suburbs or Regions '
        },
        footer: {
            add: true,
            update: true
        },
        onClick		: {
            setSelected	: false
        }
    })
    // 伯嘉园艺效果
    var $settings = $('#settings');
    //	企业概况
    var $set_location = $('#setting-location .mm-counter');
    $('#locations').find( 'li span' ).click(function() {
        $set_location.text( $(this).text() );
        $settings.trigger( 'open.mm' );
    });

    //	新闻资讯
    var $set_radius = $('#setting-radius .mm-counter');
    $('#radius').find( 'li span' ).click(function() {
        $set_radius.text( $(this).text() );
        $settings.trigger( 'open.mm' );
    });

    // 景观设计	
    var $set_pricerange = $('#setting-pricerange .mm-counter');
    $('#pricerange').find( 'li span' ).click(function() {
        $set_pricerange.text( $(this).text() );
        $settings.trigger( 'open.mm' );
    });

    // 工程案例	
    var $set_engineering = $('#setting-engineering .mm-counter');
    $('#engineering').find( 'li span' ).click(function() {
        $set_engineering.text( $(this).text() );
        $settings.trigger( 'open.mm' );
    });

    // 在线留言	
    var $set_message = $('#setting-message .mm-counter');
    $('#message').find( 'li span' ).click(function() {
        $set_message.text( $(this).text() );
        $settings.trigger( 'open.mm' );
    });


	
})