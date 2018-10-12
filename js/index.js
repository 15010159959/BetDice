(function ($) {

    // 投注金额
 
    $('#Half').click(function(){
        $("#money").val(parseInt($("#money").val()) / 2 );
    })
    $('#Double').click(function(){
        $("#money").val(parseInt($("#money").val()) * 2 );
    })
    $('#Max').click(function(){
        $("#money").val('5000'  );
    })


    // 进度条数字获取  $bt.html( parseInt(left / 6.5));
    var $box = $('#box');
    var $bt = $('#bt');
    var $bg = $('#bg');
    var $bgcolor = $('#bgcolor');
    var $btn = $('#bt');
    var $text = $('#text');
    var statu = false;
    var ox = 0;
    var lx = 0;
    var left = 0;
    var bgleft = 0;
    $btn.mousedown(function (e) {
        lx = $btn.offset().left;
        ox = e.pageX - left;
        statu = true;
    });
    $(document).mouseup(function () {
        statu = false;
    });
    $box.mousemove(function (e) {
        if (statu) {
            left = e.pageX - ox;
            if (left < 0) {
                left = 0;
            }
            if (left > 650) {
                left = 650;
            }
            $btn.css('left', left);
            $bgcolor.width(left);
            $bt.html( parseInt(left / 6.5));
            $('#myNumber').html( parseInt(left / 6.5));
            
        }
    });
    $bg.click(function (e) {
        if (!statu) {
            bgleft = $bg.offset().left;
            left = e.pageX - bgleft;
            if (left < 0) {
                left = 0;
            }
            if (left > 650) {
                left = 650;
            }
            $btn.css('left', left);
            $bgcolor.stop().animate({ width: left }, 650);
            $bt.html( parseInt(left / 6.5));
            $('#myNumber').html( parseInt(left / 6.5));
        }
    });
})(jQuery);