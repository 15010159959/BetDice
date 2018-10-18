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


    // 进度条数字获取  $bt.html( parseInt(left / 6.5));
    var $box = $( '#box' );
    var $bt = $( '#bt' ); //选择的数
    var $result_bt = $( '#result_bt' ); //结果数字
    var $bg = $( '#bg' );
    var $bgcolor = $( '#bgcolor' );
    var $btn = $( '#bt' );
    var $text = $( '#text' );
    var statu = false;
    var ox = 0;
    var lx = 0;
    var left = 0;
    var bgleft = 0;
    $btn.mousedown( function ( e ) {
        lx = parseInt( $btn.css( "marginLeft" ) ) + $bg.width() / 2;
        ox = e.pageX - lx;
        statu = true;
    } );
    $( document ).mouseup( function () {
        statu = false;
    } );
    $box.mousemove( function ( e ) {
        min = 0;
        max = $( "#bg" ).width() - 30;
        if ( statu ) {
            left = e.pageX - ox;
            if ( left < min ) {
                left = min;
            }
            if ( left > max ) {
                left = max;
            }
            width = left - $bg.width() / 2;
            $btn.css( 'marginLeft', width );
            $bgcolor.width( left );
            ratio = left * 100 / max;
            $bt.html( parseInt( ratio ) );
            $( '#myNumber' ).html( parseInt( ratio ) );
            $( '#odds' ).html( Number( 98 / ( parseInt( ratio ) - 1 ) ).toFixed( 3 ) + 'x' );//赔率计算
            $( '#percent' ).html( Number( ( parseInt( ratio ) / 98 ) * 100 ).toFixed( 2 ) + '%' );//胜率计算
            $( '#may_get_money' ).val( Number( ( $( '#odds' ).html() * $( "#money" ).val() ).toFixed( 4 ) ) ); //可能获得的奖金
        }
    } );
    $bg.click( function ( e ) {
        min = 0;
        max = $( "#bg" ).width() - 30;
        ox = $btn.offset().left - parseInt( $btn.css( "marginLeft" ) ) - $bg.width() / 2;
        if ( !statu ) {
            left = e.pageX - ox;
            console.log( e.pageX, ox, left );
            if ( left < min ) {
                left = min;
            }
            if ( left > max ) {
                left = max;
            }
            width = left - $bg.width() / 2;
            $btn.css( 'marginLeft', width );
            $bgcolor.width( left );
            ratio = left * 100 / max;
            $bt.html( parseInt( ratio ) );
            $( '#myNumber' ).html( parseInt( ratio ) );
            $( '#odds' ).html( Number( 98 / ( parseInt( ratio ) - 1 ) ).toFixed( 3 ) + 'x' );//赔率计算
            $( '#percent' ).html( Number( ( parseInt( ratio ) / 98 ) * 100 ).toFixed( 2 ) + '%' );//胜率计算
            $( '#may_get_money' ).val( Number( ( $( '#odds' ).html() * $( "#money" ).val() ).toFixed( 4 ) ) ); //可能获得的奖金
        }
    } );




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

    var showLoading = function () {

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
                if ( typeof ( scatter ) == undefined ) {
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
                            }

                        } )
                        .catch( err => {

                            alert( "Scatter 初始化失败." );
                        } );

                    hideLoading()
                }

                if ( checkCount > 5 ) {
                    clearInterval( checkInterval )
                    hideLoading()

                    alert( "加载Scatter失败若未安装请先安装." );
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

        } );
    };
    //获取账户合约币余额
    // var get_current_balance = function () {
    //     this.eoss.getCurrencyBalance('yangshun2534', account.name).then(function (resp) {
    //         console.log(resp);
    //     });
    // };

    var roll_by_scatter = function () {
        eoss.transfer( account.name, "yangshun2532", "0.0001 EOS", $( '#myNumber' ).html() )
            .then( ( resp ) => {
                console.log( resp );
                hideLoading()
                function TraversalObject ( obj ) {
                    for ( var a in obj ) {
                        if ( a == "random_roll" ) {
                            console.log( obj[ a ] );
                            $( "#random" ).text( obj[ a ] );
                            break;
                        };
                        if ( typeof ( obj[ a ] ) == "object" ) {
                            TraversalObject( obj[ a ] ); //递归遍历
                        }
                    }
                    for ( var b in obj ) {
                        if ( b == "payout" ) {
                            console.log( obj[ b ] );
                            $( "#get_money" ).text( obj[ b ] );
                            $( "#result" ).addClass( "result_animation" );
                            setTimeout( '$("#result").removeClass("result_animation");', 4000 );
                            break;
                        };
                        if ( typeof ( obj[ b ] ) == "object" ) {
                            TraversalObject( obj[ b ] ); //递归遍历
                        }
                    }
                }
                TraversalObject( resp );

            } )
            .catch( ( err ) => {
                hideLoading()
                console.log( JSON.stringify( err ) );

            } );
        hideLoading()
    };





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


    // play
    $( '#play' ).click( function () {
        $( ".modal.loading" ).modal( "show" );
        //init_scatter();
        roll_by_scatter();
        get_current_balance();
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
        $( '#allBetData' ).removeClass( 'hidden' );
        $( '#myBetData' ).addClass( 'hidden' );
    } )
    $( '#myBet' ).click( function () {
        $( '#myBet' ).addClass( 'active' );
        $( '#allBet' ).removeClass( 'active' );
        $( '#allBetData' ).addClass( 'hidden' );
        $( '#myBetData' ).removeClass( 'hidden' );
    } )
} )( jQuery );
