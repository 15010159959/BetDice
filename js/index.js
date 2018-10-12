    // 定义玩法函数
    var account = null;
    var eoss = null;
    var requiredFields = null;
    var tpAccount =null;
    // var money = $("#money").val() + 'EOS';    // 钱
    // var myNumber = $('#myNumber').text();  //投注的数字


    var init_scatter = function() {
        if (eoss != null) return;
        if (tpAccount != null) return;
        if (1) {
            if (!('scatter' in window)) {
                alert("没有找到Scatter.");
            } else {
                scatter.getIdentity({
                    accounts: [{
                        chainId: network.chainId,
                        blockchain: network.blockchain
                    }]
                })
                    .then(identity => {
                        setIdentity(identity);
                    })
                    .catch(err => {
                        alert("Scatter 初始化失败.");
                    });
            }
        } else {
            //移动端
            tpConnected = tp.isConnected();
            if (tpConnected) {
                //test
                // app.tpBalance();
                tp.getWalletList("eos").then(function (data) {
                    tpAccount = data.wallets.eos[0];
                });
            } else {
                alert("请下载TokenPocket") //待完善
            }
        }
    };
    var setIdentity = function (identity) {
        
        account = identity.accounts.find(acc => acc.blockchain === 'eos');
        eoss = scatter.eos(network, Eos, {});
        requiredFields = {
            accounts: [network]
        };
        
        //get_current_balance();
    };

    var roll_by_scatter = function () {
        eoss.transfer(account.name, "yangshun2532", "0.1000 EOS", "77")
            .then((resp) => {
                console.log(resp);
                var random_roll = stringify( resp.processed.action_traces[0].inline_traces[4].act.data.result.random_roll);
                alert(random_roll); //payout赢得奖金
            })
            .catch((err) => {
                console.log(JSON.stringify(err));
            });
    };

(function ($) {

    // 投注金额

    $('#Half').click(function () {
        $("#money").val(parseInt($("#money").val()) / 2);
    })
    $('#Double').click(function () {
        $("#money").val(parseInt($("#money").val()) * 2);
    })
    $('#Max').click(function () {
        $("#money").val('5000');
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
            $bt.html(parseInt(left / 6.5));
            $('#myNumber').html(parseInt(left / 6.5));

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
            $bt.html(parseInt(left / 6.5));
            $('#myNumber').html(parseInt(left / 6.5));
        }
    });




    // play
    $('#play').click(function () {
        init_scatter();
        roll_by_scatter();
    })
})(jQuery);