( function ( $ ) {
    // var money = $("#money").val(); //获取下注金额
    // var myNumber =$('#myNumber').html(); //获取投注的数字

    // 投注金额
    // 投注金额
    $( '#Half' ).click( function () {
        var money = $( "#money" ).val() / 2
        if ( money > balanceEos ) {
            money = balanceEos
        } else if ( money < 0.1 ) {
            money = 0.1
        }
        $( "#money" ).val( money );
    } )
    $( '#Double' ).click( function () {
        var money = $( "#money" ).val() * 2

        console.log( money )
        if ( money > balanceEos ) {
            money = balanceEos
        } else if ( money < 0.1 ) {
            money = 0.1
        }
        $( "#money" ).val( money );
    } )
    $( '#Max' ).click( function () {
        $( "#money" ).val( balanceEos );
    } )

    $( ".introduction" ).on( "click", function () {

    } );


    // 进度条数字获取  $bt.html( parseInt(left / 6.5));
    var $box = $( '#box' );
    var $bt = $( '#bt' ); //选择的数
    var $result_bt = $( '#result_bt' ); //结果数字
    var $bg = $( '#bg' );
    var $bgcolor = $( '#bgcolor' );
    var $bgcolor_neg = $( '#bgcolor-neg' );
    var $btn = $( '#bt' );
    var $text = $( '#text' );
    var statu = false;
    var ox = 0;
    var lx = 0;
    var left = 0;
    var bgleft = 0;
    $btn.on( "mousedown", function ( e ) {
        lx = parseInt( $btn.css( "marginLeft" ) ) + $bg.width() / 2;
        ox = e.pageX - lx;
        statu = true;
    } );
    $btn.on( "touchstart", function ( e ) {
        lx = parseInt( $btn.css( "marginLeft" ) ) + $bg.width() / 2;
        ox = e.touches[ 0 ].clientX - lx;
        statu = true;
    } );
    $( document ).on( "mouseup touchend", function ( e ) {
        statu = false;
    } );
    $( document ).on( "mousemove", function ( e ) {
        max = $( "#bg" ).width() - 30;
        min = max / 100;

        if ( statu ) {
            onChangeBet( e.pageX );
        }
    } );
    $( document ).on( "touchmove", function ( e ) {
        max = $( "#bg" ).width() - 30;
        min = max / 100;

        if ( statu ) {
            onChangeBet( e.touches[ 0 ].clientX );
        }
    } );
    $bg.click( function ( e ) {
        min = 0;
        max = $( "#bg" ).width() - 30;
        ox = $btn.offset().left - parseInt( $btn.css( "marginLeft" ) ) - $bg.width() / 2;
        if ( !statu ) {
            onChangeBet( e.pageX );
        }
    } );

    function onChangeBet ( x ) {
        left = x - ox;
        if ( left < min ) {
            left = min;
        }
        if ( left > max ) {
            left = max;
        }
        width = left - $bg.width() / 2;
        $btn.css( 'marginLeft', width );
        $bgcolor.width( left + 15 );
        $bgcolor_neg.width( max - left + 15 );
        ratio = left * 100 / max;
        $bt.html( parseInt( ratio ) );
        $( '#myNumber' ).html( parseInt( ratio ) );
        var odds = Number( 98 / ( parseInt( ratio ) - 1 ) ).toFixed( 3 )
        $( '#odds' ).html( odds + 'x' );//赔率计算
        $( '#percent' ).html( Number( ( parseInt( ratio ) / 98 ) * 100 ).toFixed( 2 ) + '%' );//胜率计算
        $( '#may_get_money' ).val( Number( ( odds * $( "#money" ).val() ).toFixed( 4 ) ) ); //可能获得的奖金
    }

    // 定义玩法函数
    var account = null;
    var eoss = null;
    var requiredFields = null;
    var tpAccount = null;
    var balanceEos = 0;
    // var money = $("#money").val();    // 钱
    // var myNumber = $('#myNumber').text();  //投注的数字

    var a = document.getElementById( "#result" );

    var hideLoading = function () {
        console.log( "hideLoading" )
        $( "#loading" ).modal( "hide" );
    }

    var init_scatter = function () {
        if ( account != null ) return;
        if ( eoss != null ) return;
        if ( tpAccount != null ) return;

        var that = this
        // 判断是否登录
        if ( 1 ) {
            var checkCount = 0
            var checkInterval = setInterval( function () {
                console.log( checkCount )
                if ( checkCount > 5 ) {
                    clearInterval( checkInterval )
                    hideLoading()

                    alert( "加载Scatter失败若未安装请先安装." );
                }
                if ( typeof ( scatter ) == "undefined" ) {
                    checkCount++
                    return
                } else {
                    clearInterval( checkInterval )

                    scatter.getIdentity( {
                        accounts: [ {
                            chainId: network.chainId,
                            blockchain: network.blockchain
                        } ]
                    } )
                        .then( identity => {
                            setIdentity( identity );
                            get_current_balance();

                            if ( account ) {
                                $( "#login" ).hide();
                                $( '.nickname' ).html( account.name );
                                $("#play").text("掷骰子")
                            }

                            setInterval(function(){
                                getBetList()
                            },1000 )

                        } )
                        .catch( err => {
                            console.log(err)
                            alert( "Scatter 初始化失败.", err );
                        } );

                    hideLoading()
                }

                checkCount++
            }, 500 )

        } else {
            //移动端
            tpConnected = tp.isConnected();
            if ( tpConnected ) {
                //test
                // app.tpBalance();
                tp.getWalletList( "eos" ).then( function ( data ) {
                    tpAccount = data.wallets.eos[ 0 ];
                } );
            } else {
                alert( "请下载TokenPocket" ) //待完善
                hideLoading()
            }
        }
    };
    var setIdentity = function ( identity ) {

        account = identity.accounts.find( acc => acc.blockchain === 'eos' );

        console.log( "account", account )
        eoss = scatter.eos( network, Eos, {} );
        requiredFields = {
            accounts: [ network ]
        };
        //get_current_balance();
    };

    //获取账户eos余额
    var get_current_balance = function () {
        eoss.getCurrencyBalance( 'eosio.token', account.name ).then( function ( resp ) {
            console.log( "get_current_balance", resp );
            balanceEos = resp[ 0 ]
            $( '#balanceEos' ).text( balanceEos );
            $( '#balanceBetDice' ).text( resp[ 1 ] )

        } );   
    };


    var roll_by_scatter = function () {
        var money = $( "#money" ).val()
        money = parseInt( money * 10000 ) / 10000
        money = money.toFixed( 4 )

        eoss.transfer( account.name, "yangshun2532", money + " EOS", $( '#myNumber' ).html() )
            .then( ( resp ) => {
                console.log( resp );
                hideLoading()

                var inline_traces = resp.processed.action_traces[ 0 ].inline_traces
                var i = inline_traces.length -1
                var roll = inline_traces[ i ].act.data.result.random_roll
                var payout = inline_traces[ i ].act.data.result.payout

                console.log( "random_roll ", roll , " payout ", payout)
                $("#random_roll").text(roll)
                $( "#get_money" ).text( payout );
                $( "#result" ).addClass( "result_animation" );
                setTimeout( '$("#result").removeClass("result_animation");', 4000 );
                get_current_balance();

            } )
            .catch( ( err ) => {
                hideLoading()
                console.log( "err ",  JSON.stringify( err ) );

            } );
    };


    var currentId = 0;
    var getBetList = function(){
        eoss.getTableRows({
            code: "yangshun2532",//EOS_CONFIG.contractName,
            scope: "yangshun2532",//.contractName,
            table: "bets",
            json: true
        }).then(data => {
            //console.log("getTableRows ", data)

            var html = ""
            maxId = currentId
            for(var i in data.rows){
                var row = data.rows[i]
                //console.log("getTableRows ", row)

                if (currentId < row.bet_id){

                    var p = parseFloat(row.payout)
                    var s = p>0?'win':'list'

                    html += '<tr class="'+s+'">'+
                            '<td>12121</td>'+
                            '<td>'+row.player+'</td>'+
                            '<td>'+row.roll_under+'</td>'+
                            '<td>'+parseFloat(row.amount)+'</td>'+
                            '<td>'+row.random_roll+'</td>'+
                            '<td>'+p+'</td>'+
                            '</tr>';
                    
                    maxId = row.bet_id>maxId?row.bet_id:maxId
                }
            }
            $("#bet-list").append(html)

            currentId = maxId

        }).catch(e => {
            console.error("getTableRows ", e);
        });
    }

    //保留4位小数并格式化输出（不足的部分补0）
    var fomatFloat = function ( value, n ) {
        var f = Math.round( value * Math.pow( 10, n ) ) / Math.pow( 10, n );
        var s = f.toString();
        var rs = s.indexOf( '.' );
        if ( rs < 0 ) {
            s += '.';
        }
        for ( var i = s.length - s.indexOf( '.' ); i <= n; i++ ) {
            s += "0";
        }
        return s;
    }


    var checkLogin = function(){
        if (account == null){
            $("#play").text("登录中...")
            //$(".modal.loading").modal("show");
            init_scatter();
            return true
        }
        return false;
    }
    // play
    $( '#play' ).click( function () {
        $( ".modal.loading" ).modal( "show" );
        //init_scatter();

        if(checkLogin()){
            return 
        }
        roll_by_scatter();
    } )

    // play
    $( '#login' ).click( function () {
        //if (account != null) return;
        $( ".modal.loading" ).modal( "show" );
        init_scatter();
    } )

    //betdata
    $( '#allBet' ).click( function () {
        $( '#allBet' ).addClass( 'active' );
        $( '#myBet' ).removeClass( 'active' );
        $( '.allBetData' ).removeClass( 'hidden' );
        $( '.myBetData' ).addClass( 'hidden' );
    } )
    $( '#myBet' ).click( function () {
        $( '#myBet' ).addClass( 'active' );
        $( '#allBet' ).removeClass( 'active' );
        $( '.allBetData' ).addClass( 'hidden' );
        $( '.myBetData' ).removeClass( 'hidden' );
    } )

    checkLogin();

    // progressbar.js@1.0.0 version is used
    // Docs: http://progressbarjs.readthedocs.org/en/1.0.0/
    var cpu = new ProgressBar.Circle( "#cpu", {
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        duration: 1400,
        easing: 'bounce',
        strokeWidth: 6,
        from: { color: '#FFEA82', a: 0 },
        to: { color: '#ED6A5A', a: 1 },
        // Set default step function for all animate calls
        step: function ( state, circle ) {
            circle.path.setAttribute( 'stroke', state.color );
            var value = Math.round( circle.value() * 100 );
            circle.setText( "CPU: " + value + "%" );
        }
    } );
    var net = new ProgressBar.Circle( "#net", {
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        duration: 1400,
        easing: 'bounce',
        strokeWidth: 6,
        from: { color: '#FFEA82', a: 0 },
        to: { color: '#ED6A5A', a: 1 },
        // Set default step function for all animate calls
        step: function ( state, circle ) {
            circle.path.setAttribute( 'stroke', state.color );
            var value = Math.round( circle.value() * 100 );
            circle.setText( "NET: " + value + "%" );
        }
    } );
    net.text.style.fontSize = '10px';
    cpu.text.style.fontSize = '10px';
    net.animate( 0.9 );  // Number from 0.0 to 1.0
    cpu.animate( 0.5 );  // Number from 0.0 to 1.0


    function countdown() {//倒计时
        end_time=1508227190; //终止时间
        var curr_time = parseInt(Date.parse(new Date())/1000);
        var diff_time=parseInt(end_time-curr_time);// 倒计时时间差
        var h = Math.floor(diff_time / 3600);
        var m = Math.floor((diff_time / 60 % 60));
        var s = Math.floor((diff_time % 60));
        $('.timer').html(h + "时" + m + "分" + s + "秒");
        if (diff_time<=0) {
            $('.timer').html(0 + "时" + 0 + "分" + 0 + "秒");
        };
    }
    countdown();
    var start_time=setInterval('countdown()',1000);
    
} )( jQuery );
