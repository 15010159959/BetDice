(function ($) {

    // 投注金额
    $('#Half').click(function () {
        var money = $("#money").val() / 2

        bmax = playType == 'eos' ? parseFloat(balanceEos) : parseFloat(balanceBetDice);
        bmin = playType == 'eos' ? 0.1 : 100;
        if (money > bmax) {
            money = bmax
        } else if (money < bmin) {
            money = bmin
        }
        $("#money").val(money);

        var odds = parseFloat($("#odds").text())
        $('#may_get_money').val(Number((odds * money).toFixed(3))); //可能获得的奖金

    })
    $('#Double').click(function () {
        var money = $("#money").val() * 2

        bmax = playType == 'eos' ? parseFloat(balanceEos) : parseFloat(balanceBetDice);
        bmin = playType == 'eos' ? 0.1 : 100;

        console.log(money)
        if (money > bmax) {
            money = bmax
        } else if (money < bmin) {
            money = bmin
        }
        $("#money").val(money);
        var odds = parseFloat($("#odds").text())
        $('#may_get_money').val(Number((odds * money).toFixed(3))); //可能获得的奖金

    })
    $('#Max').click(function () {

        bmax = playType == 'eos' ? parseFloat(balanceEos) : parseFloat(balanceBetDice);
        bmin = playType == 'eos' ? 0.1 : 100;

        var money = bmax;
        if (money < bmin) {
            money = bmin
        }

        $("#money").val(money);
        var odds = parseFloat($("#odds").text())
        $('#may_get_money').val(Number((odds * money).toFixed(3))); //可能获得的奖金

    })

    $("#money").change(function () {
        var money = $("#money").val();
        bmax = playType == 'eos' ? parseFloat(balanceEos) : parseFloat(balanceBetDice);
        bmin = playType == 'eos' ? 0.1 : 100;

        if (money > bmax) {
            money = bmax
        } else if (money < bmin) {
            money = bmin
        }

        $("#money").val(money);
        var odds = parseFloat($("#odds").text())
        $('#may_get_money').val(Number((odds * money).toFixed(3)));
    })

    // 进度条数字获取  $bt.html( parseInt(left / 6.5));
    var $box = $('#box');
    var $result_bt = $('#result_bt'); //结果数字
    var $bg = $('#bg');
    var $bgcolor = $('#bgcolor');
    var $bgcolor_neg = $('#bgcolor-neg');
    var $btn = $('#dice-slider-button-i'); //选择的数
    var $slider_number = $('#dice-slider-button-em'); //选择的数

    var $text = $('#text');
    var statu = false;
    var ox = 0;
    var lx = 0;
    var left = 0;
    var bgleft = 0;

    var remain_draw_times = 0;

    $(".lottery_button").attr("disabled", true);

    $btn.on("mousedown", function (e) {
        lx = parseInt($btn.css("marginLeft")) + $bg.width() / 2;
        ox = e.pageX - lx;
        statu = true;
    });
    $btn.on("touchstart", function (e) {
        lx = parseInt($btn.css("marginLeft")) + $bg.width() / 2;
        ox = e.touches[0].clientX - lx;
        statu = true;
    });
    $(document).on("mouseup touchend", function (e) {
        statu = false;
    });


    $(document).on("mousemove", function (e) {
        max = $("#bg").width() - 30;
        min = max / 100;

        if (statu) {
            onChangeBet(e.pageX);
        }
    });
    $(document).on("touchmove", function (e) {
        max = $("#bg").width() - 30;
        min = max / 100;

        if (statu) {
            onChangeBet(e.touches[0].clientX);
        }
    });
    $bg.click(function (e) {
        max = $("#bg").width() - 30;
        min = max / 100;
        ox = $btn.offset().left - parseInt($btn.css("marginLeft")) - $bg.width() / 2;
        if (!statu) {
            onChangeBet(e.pageX);
        }
    });

    function onChangeBet(x) {
        left = x - ox;

        //max = max-min*3
        if (left < min * 2) {
            left = min * 2;
        }
        if (left > max - min * 4) {
            left = max - min * 4;
        }

        width = left - $bg.width() / 2;
        $btn.css('marginLeft', width);
        $slider_number.css('marginLeft', width - 15)

        $bgcolor.width(left + 15);
        $bgcolor_neg.width(max - left + 15);
        ratio = left * 100 / max;
        //$btn.html(parseInt(ratio));
        $slider_number.text(parseInt(ratio));

        $('#myNumber').html(parseInt(ratio));
        $('#myNumberValue').val(parseInt(ratio));
        var odds = Number(98.5 / (parseInt(ratio) - 1)).toFixed(2)
        $('#odds').html(odds + 'x'); //赔率计算
        $('#percent').html(parseInt((parseInt(ratio - 1) / 100) * 100) + '%'); //中奖概率计算
        $('#may_get_money').val(Number((odds * $("#money").val()).toFixed(3))); //可能获得的奖金
    }

    // 定义玩法函数
    var account = null;
    var eoss = null;
    var requiredFields = null;
    var tpAccount = null;
    var balanceEos = 0;
    var balanceBetDice = 0;
    var betContract = "yangshun2541"
    var bugContract = "yangshun2534"

    var inviteCode = "";
    var playType = 'eos'

    var urls = window.location.href.split('ref=')
    if (urls.length > 1 && urls[1].length == 12) {
        inviteCode = urls[1]
    }
    $("#inviteLink").val(document.location.origin + "/?ref=");

    var a = document.getElementById("#result");

    var hideLoading = function () {
        $("#loading").modal("hide");
    }

    var init_scatter = function () {
        if (account != null) return;
        if (eoss != null) return;
        if (tpAccount != null) return;

        var that = this
        var status = false
        // 判断是否登录
        if (1) {
            var checkCount = 0
            var checkInterval = setInterval(function () {
                console.log(checkCount)
                if (checkCount > 20) {
                    clearInterval(checkInterval)
                    hideLoading()

                    showAlert('加载Scatter失败若未安装请先安装', false)
                    return
                }
                if (typeof (scatter) == "undefined") {
                    checkCount++
                    return
                } else {
                    if (status == true) {
                        return
                    }
                    status = true
                    clearInterval(checkInterval)

                    eoss = scatter.eos(network, Eos, {});
                    setTimeout(function () {
                        getBetCurrentId()
                    }, 10)

                    setTimeout(function () {
                        getBetRanks()
                    }, 10)


                    $("#alertmsg").addClass("result_animation");
                    setTimeout('$("#alertmsg").removeClass("result_animation");', 4000);

                    scatter.getIdentity({
                            accounts: [{
                                chainId: network.chainId,
                                blockchain: network.blockchain
                            }]
                        })
                        .then(identity => {
                            setIdentity(identity);

                            showSuccess('登录成功')
                            if (account) {
                                $("#login").hide();
                                $('.nickname').html(account.name);
                                $("#play").text("掷骰子")

                                $("#inviteLink").val(document.location.origin + "/?ref=" + account.name);
                            }

                            get_bonuspool();

                            setTimeout(function () {

                                get_current_balance();

                            }, 1000)

                            setTimeout(function () {
                                get_cpu();
                                get_invite_info();
                            }, 5000)

                        })
                        .catch(err => {
                            console.log(err)
                            //alert( "Scatter 初始化失败.", err );

                            showAlert('Scatter 初始化失败, 请刷新重试', true)
                        });

                    hideLoading()
                }

                checkCount++
            }, 500)

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
                hideLoading()
            }
        }
    };
    var setIdentity = function (identity) {

        account = identity.accounts.find(acc => acc.blockchain === 'eos');

        console.log("account", account)
        eoss = scatter.eos(network, Eos, {});
        requiredFields = {
            accounts: [network]
        };
        //get_current_balance();
    };

    //获取账户eos余额
    var get_current_balance = function () {
        eoss.getCurrencyBalance('eosio.token', account.name).then(function (resp) {
            console.log("get_current_balance", resp);
            balanceEos = resp[0]
            $('#balanceEos').text(balanceEos);
        });

        eoss.getCurrencyBalance('yangshun2534', account.name).then(function (resp) {
            console.log("get_current_balance", resp);
            balanceBetDice = resp[0]
            $('.balance-token-text').text(balanceBetDice);
        });
    };

    var get_cpu = function () {
        eoss.getAccount({
            account_name: account.name
        }).then(data => {
            cp = data.cpu_limit.max == 0 ? 1 : data.cpu_limit.used / data.cpu_limit.max
            np = data.net_limit.max == 0 ? 1 : data.net_limit.used / data.net_limit.max

            cp = cp > 1 ? 1 : cp;
            np = np > 1 ? 1 : np;
            net.animate(np); // Number from 0.0 to 1.0
            cpu.animate(cp);
        }).catch(e => {
            console.error("getAccout ", e);
        });
    }


    var roll_by_scatter = function () {
       
        var money = $("#money").val()
        money = parseInt(money * 10000) / 10000
        money = money.toFixed(4)

        var contract_name = betContract;
        var code = "eosio.token"

        if (playType == 'eos') {

            if (money < 0.1 || money > parseFloat(balanceEos)) {

                hideLoading()
                showAlert('EOS余额不足')
                return
            }
            money += " EOS"
        } else {
            if (money < 0.1 || money > parseFloat(balanceBetDice)) {

                hideLoading()
                showAlert('余额不足')
                return
            }


            money += " AI"
            code = bugContract
        }

        eoss.contract(code, {
                accouts: [network]
            }).then(contract => {

                var meno = $('#myNumberValue').val()
                meno += ' ' + inviteCode
                console.log(meno)
                contract.transfer(account.name, contract_name, money, meno, {
                        authorization: [account.name + '@active']
                    })
                    //eoss.transfer(account.name, contract, money, $( '#myNumber' ).html()) // 抵押 换成‘stake’  赎回unstaketoken
                    .then((resp) => {
                        hideLoading()

                        var inline_traces = resp.processed.action_traces[0].inline_traces
                        var i = inline_traces.length - 1
                        var roll = inline_traces[i].act.data.result.random_roll
                        var payout = inline_traces[i].act.data.result.payout

                        console.log("random_roll ", roll, " payout ", payout)
                        var res = '';

                        if (parseFloat(payout) > 0) {
                            res = '<div class="alert alert-success">' +
                                '<strong>恭喜！</strong>结果是' +
                                roll + ', 您获得了' + payout +
                                '</div>';
                        } else {
                            res = '<div class="alert alert-warning">' +
                                '<strong>再接再厉！</strong>结果是' +
                                roll +
                                '</div>';
                        }
                        $("#result").html(res);
                        $("#result").addClass("result_animation");
                        setTimeout('$("#result").removeClass("result_animation");', 4000);
                        get_current_balance();

                        setTimeout(function () {
                            get_cpu();
                            getBetRanks()
                        }, 1000)

                    })
                    .catch((err) => {
                        hideLoading()
                        //console.log( "err ", err, JSON.stringify( err ) );
                        if (err && err.message) {
                            showAlert('执行失败' + err.message, false)
                        } else {
                            var errJson = JSON.parse(err)

                            showAlert('执行失败' + errJson.error.name, false)
                        }

                    });
            })


            .catch((err) => {
                hideLoading()
                console.log("err ", err, JSON.stringify(err));

            });
    };


    var bets = [];
    var currentId = 0;

    var getBetCurrentId = function () {
        eoss.getTableRows({
            code: betContract, //EOS_CONFIG.contractName,
            scope: betContract, //.contractName,
            table: "global",
            json: true
        }).then(data => {
            console.log("getTableRows ", data)

            currentId = data.rows[0].current_id

            currentId = currentId > 20 ? currentId - 20 : -1;

            getBetList()
            getMyBetList()

            setInterval(function () {
                getBetList()
            }, 1000)
        }).catch(e => {
            console.error("getTableRows ", e);
        });
    }

    var lottery_draw_time_interval;
    var last_draw_time;
    var getBetRanks = function () {

        eoss.getAbi({
            account_name: "yangshun2541"
        }).then(data => {
            console.log("getCode ", data)

        }).catch(e => {
            console.error("getCode ", e);
        });


        eoss.getTableRows({
            code: betContract, //EOS_CONFIG.contractName,
            scope: betContract, //.contractName,
            table: "accountinfo",
            json: true
        }).then(data => {
            console.log("getAccinfo ", data)

            var html = '';

            var rows = []
            var day_time = (parseInt(Date.now() / 1000 / 86400) + 1) * 86400 - 8 * 3600 - 24 * 3600; //终止时间

            for (var i in data.rows) {
                if (data.rows[i].last_bet_time > day_time) {
                    rows.push(data.rows[i])
                }
                if (data.rows[i].user == account.name) {
                    clearInterval(lottery_draw_time_interval)
                    remain_draw_times = data.rows[i].remain_draw_times
                    last_draw_time = data.rows[i].last_draw_time

                    $(".lottery_button").attr("disabled", false)
                    if (remain_draw_times == 0) {
                        $(".lottery_button").attr("disabled", true)
                        $(".lottery-draw").hide()
                    } else {
                        if ((Date.now() / 1000 - last_draw_time) < 3600) {
                            $(".lottery_button").attr("disabled", true)
                            $(".lottery-draw").show()
                            var t = 3600 - (Date.now() / 1000 - last_draw_time)
                            var m = parseInt(t / 60);
                            m = m > 9 ? m : '0' + m;

                            var s = parseInt(t % 60)
                            s = s > 9 ? s : '0' + s

                            $("#lottery_draw_time").text(m + ':' + s);

                            lottery_draw_time_interval = setInterval(function () {
                                if ((Date.now() / 1000 - last_draw_time) < 3600) {
                                    var t = 3600 - (Date.now() / 1000 - last_draw_time)
                                    var m = parseInt(t / 60);
                                    m = m > 9 ? m : '0' + m;

                                    var s = parseInt(t % 60)
                                    s = s > 9 ? s : '0' + s

                                    $("#lottery_draw_time").text(m + ':' + s);
                                } else {
                                    clearInterval(lottery_draw_time_interval)
                                    $("#lottery_draw_time").text("")
                                    $(".lottery_button").attr("disabled", false)
                                    $(".lottery-draw").hide()
                                }
                            }, 1000)
                        } else {
                            $(".lottery-draw").hide()
                        }


                        $("#remain_draw_times").text(remain_draw_times)
                    }
                }
            }

            rows.sort(function (a, b) {
                return b.bet_amount_today - a.bet_amount_today;
            })

            for (var i in rows) {
                var k = parseInt(i) + 1;
                var row = rows[i]
                html += '<li class="items top' + k + '">' +
                    '<span>' + k + '</span>' +
                    '<span>' + row.user + '</span>' +
                    '<span>' +
                    '<em style="font-weight: 600;">' + parseFloat(row.bet_amount_today / 10000) + '</em>' +
                    '<em style="font-size: 12px; padding-left: 4px;">EOS</em>' +
                    '</span>' +
                    '<span>' +
                    //'<em style="font-weight: 600; color: rgb(41, 224, 141);">1000</em>'+
                    //'<em style="font-size: 12px; padding-left: 4px;">EOS</em>'+
                    '</span>' +
                    '</li>';
            }
            $("#bet-rank").html(html)
        }).catch(e => {
            console.error("getAccinfo ", e);
        });
    }

    var getBetList = function () {

        eoss.getTableRows({
            code: betContract, //EOS_CONFIG.contractName,
            scope: betContract, //.contractName,
            table: "bet",
            lower_bound: currentId + 1,
            //upper_bound:  12,
            limit: 20,
            //index_position:2,
            json: true
        }).then(data => {
            //console.log("getTableRows ",  data.rows,data.rows.length, bets.length)
            var l = data.rows.length
            var j = bets.length

            for (i = j - l - 1; i >= 0; i--) {
                bets[i + l] = bets[i]
            }

            for (var i in data.rows) {
                bets[i] = data.rows[l - i - 1];
            }
            var html = ""
            maxId = currentId

            for (var i in bets) {
                var row = bets[i]

                var p = parseFloat(row.payout)
                var s = p > 0 ? 'win' : 'list'
                var d = new Date(row.timestamp * 1000)

                var t = d.getHours() > 9 ? d.getHours() : '0' + d.getHours()
                t += ':'
                t += d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()
                t += ':'
                t += d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds()

                html += '<tr class="' + s + '">' +
                    '<td>' + t + '</td>' +
                    '<td>' + row.player + '</td>' +
                    '<td>' + row.roll_under + '</td>' +
                    '<td>' + parseFloat(row.amount) + '</td>' +
                    '<td>' + row.random_roll + '</td>' +
                    '<td>' + row.payout + '</td>' +
                    '</tr>';

                maxId = row.bet_id > maxId ? row.bet_id : maxId
            }
            $("#bet-list").html(html)

            currentId = maxId

        }).catch(e => {
            console.error("getTableRows ", e);
        });
    }

    var getMyBetList = function () {

        eoss.getTableRows({
            code: betContract, //EOS_CONFIG.contractName,
            scope: betContract, //.contractName,
            table: "bet",
            lower_bound: account.name,
            //upper_bound:  account.name,
            limit: 200,
            index_position: 2,
            key_type: "i64",
            json: true
        }).then(data => {

            var l = data.rows.length

            i = l - 1;
            for (; i > 0; i--) {
                if (data.rows[i].player == account.name) {
                    break;
                }
            }
            var mbets = []
            j = 0;
            for (; i > 0 & j < 20; i--) {
                mbets[j] = data.rows[i]
                j++
            }
            var html = ""
            for (var i in mbets) {
                var row = mbets[i]

                var p = parseFloat(row.payout)
                var s = p > 0 ? 'win' : 'list'
                var d = new Date(row.timestamp * 1000)

                var t = d.getHours() > 9 ? d.getHours() : '0' + d.getHours()
                t += ':'
                t += d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()
                t += ':'
                t += d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds()

                html += '<tr class="' + s + '">' +
                    '<td>' + t + '</td>' +
                    '<td>' + row.player + '</td>' +
                    '<td>' + row.roll_under + '</td>' +
                    '<td>' + parseFloat(row.amount) + '</td>' +
                    '<td>' + row.random_roll + '</td>' +
                    '<td>' + row.payout + '</td>' +
                    '</tr>';
            }
            $(".myBetData").html(html)

        }).catch(e => {
            console.error("getTableRows ", e);
        });
    }


    var get_invite_info = function () {
        eoss.getTableRows({
            code: betContract, //EOS_CONFIG.contractName,
            scope: betContract, //.contractName,
            table: "invitebonus",
            lower_bound: account.name,
            limit: 1,
            json: true
        }).then(data => {
            if (data.rows && data.rows.length > 0) {
                var row = data.rows[0];

                $("#invite-eos").text(row.eos_amount)
                $("#invite-dice").text(row.token_amount)

            }
            console.log("getInviteInfo ", data)


        }).catch(e => {
            console.error("getInviteInfo ", e);
        });
    }

    //保留4位小数并格式化输出（不足的部分补0）
    var fomatFloat = function (value, n) {
        var f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            s += '.';
        }
        for (var i = s.length - s.indexOf('.'); i <= n; i++) {
            s += "0";
        }
        return s;
    }

    $(".lottery_button").click(function () {

        $(this).attr("disabled", true)

        console.log("lottery_button");
        var that = this

        eoss.contract(betContract, {
            accouts: [network]
        }).then(contract => {

            contract.draw(account.name, {
                    authorization: [account.name + '@active']
                })
                .then((resp) => {
                    console.log(resp)

                    var inline_traces = resp.processed.action_traces[0].inline_traces
                    var i = inline_traces.length - 1
                    var luckey_num = inline_traces[i].act.data.luckey_num
                    var payout = inline_traces[i].act.data.payout
                    //console.log(payout)

                    //payout = parseFloat(payout)
                    //payout = payout/10000
                    showSuccess('抽奖成功! 幸运数字' + luckey_num + " 奖励" + payout);
                    $(that).attr("disabled", false)

                    getBetRanks()

                }).catch(err => {

                    if (err && err.message) {
                        showAlert('执行失败' + err.message, false)
                    } else {
                        var errJson = JSON.parse(err)

                        showAlert('抽奖失敗' + errJson.error.name);
                    }

                    $(that).attr("disabled", false)
                });
        })
    })

    var bonus_eos_amount, bonus_token_amount, bonus_stake_amount;
    var get_bonuspool = function () {
        eoss.getTableRows({
            code: betContract, //EOS_CONFIG.contractName,
            scope: betContract, //.contractName,
            table: "bonuspool",
            //lower_bound:account.name,
            //limit:1,
            json: true
        }).then(data => {
            console.log("getbonuspool ", data)
            bonus_eos_amount = 0;
            bonus_token_amount = 0;
            bonus_stake_amount = 0;
            var eos_earn = 0;
            var token_earn = 0;

            if (data.rows.length > 0) {
                bonus_eos_amount = Number(parseFloat(data.rows[0].eos / 10000)).toFixed(2)
                bonus_token_amount = Number(parseFloat(data.rows[0].token / 10000)).toFixed(2)

                bonus_stake_amount = Number(parseFloat(data.rows[0].stake_amount / 10000)).toFixed(2)


                eos_earn = Number((bonus_eos_amount / bonus_stake_amount) * 10000).toFixed(5)

                token_earn = Number((bonus_token_amount / bonus_stake_amount) * 10000).toFixed(5)
            }

            $(".bonus-eos-amount").text(bonus_eos_amount)
            $(".bonus-token-amount").text(bonus_token_amount)
            $(".bonus-eos-earn").text(eos_earn)
            $(".bonus-token-earn").text(token_earn)
            $(".stake-token-amount").text(bonus_stake_amount)
            setTimeout(function () {
                get_stake();
                get_unstake();
            }, 1000)
        }).catch(e => {
            console.error("getInviteInfo ", e);
        });


    }

    var get_stake = function () {

        eoss.getTableRows({
            code: betContract,
            scope: betContract,
            table: "stake",
            lower_bound: account.name,
            limit: 1,
            json: true
        }).then(data => {
            console.log("stake ", data)

            var token = 0.00
            var eos_myearn = 0.00
            var token_myearn = 0.00

            var eos_money = 0.00
            var token_money = 0.00
            //var stake_amount = 0.00;
            if (data && data.rows && data.rows.length > 0 && data.rows[0].user == account.name) {
                var amount = Number(parseFloat(data.rows[0].amount / 10000)).toFixed(2);
                token = amount;

                eos_myearn = Number((bonus_eos_amount / bonus_stake_amount) * amount).toFixed(4)
                token_myearn = Number((bonus_token_amount / bonus_stake_amount) * amount).toFixed(4)

                eos_money = Number(parseFloat(data.rows[0].eos_amount / 10000)).toFixed(4);
                token_money = Number(parseFloat(data.rows[0].token_amount / 10000)).toFixed(4);
            }

            $(".bonus-eos-money").text(eos_money)
            $(".bonus-token-money").text(token_money)


            $(".bonus-eos-myearn").text(eos_myearn)
            $(".bonus-token-myearn").text(token_myearn)

            $(".unstake-token").text(token);
        }).catch(e => {
            console.error("getInviteInfo ", e);
        });
    }

    $("#stake").click(function () {
        $(this).attr("disabled", true)

        var that = this
        var money = $("#stake-money").val();

        stake(money, function () {
            $(that).attr("disabled", false)
        })
    })

    $("#unstake").click(function () {
        $(this).attr("disabled", true)
        var money = $("#unstake-money").val();

        var that = this

        unstake(money, function () {
            $(that).attr("disabled", false)
        })
    })

    $("#takeout").click(function () {
        $(this).attr("disabled", true)

        var that = this

        eoss.contract(betContract, {
            accouts: [network]
        }).then(contract => {

            contract.getbonus(account.name, {
                    authorization: [account.name + '@active']
                })
                .then((resp) => {
                    console.log(resp)
                    get_stake();
                    get_bonuspool();
                    showSuccess('领取成功');
                    $(that).attr("disabled", false)

                }).catch(e => {
                    if (e && e.message) {
                        showAlert('执行失败' + e.message, false)
                    } else {
                        var err = JSON.parse(e)
                        showAlert('领取失败' + err.error.name);
                    }

                    console.error("stake err:", e);
                    $(that).attr("disabled", false)

                });
        })

    })

    $("#releasestake").click(function () {
        $(this).attr("disabled", true)

        var that = this

        eoss.contract(betContract, {
            accouts: [network]
        }).then(contract => {

            contract.restake(account.name, {
                    authorization: [account.name + '@active']
                })
                .then((resp) => {
                    console.log(resp)
                    get_stake();
                    get_unstake();
                    get_bonuspool();
                    showSuccess('重新抵押成功');
                    $(that).attr("disabled", false)

                }).catch(e => {
                    if (e && e.message) {
                        showAlert('执行失败' + e.message, false)
                    } else {
                        var err = JSON.parse(e)
                        showAlert('重新抵押失敗' + err.error.name);
                    }
                    console.error("stake err:", e);
                    $(that).attr("disabled", false)
                });
        })
    })


    $("#takeoutstake").click(function () {
        $(this).attr("disabled", true)

        var that = this

        eoss.contract(betContract, {
            accouts: [network]
        }).then(contract => {

            contract.release(account.name, {
                    authorization: [account.name + '@active']
                })
                .then((resp) => {
                    console.log(resp)
                    get_stake();
                    get_unstake();
                    get_bonuspool();
                    showSuccess('領取成功');
                    $(that).attr("disabled", false)

                }).catch(e => {
                    showAlert('領取失敗' + e.message);
                    console.error("stake err:", e);
                    $(that).attr("disabled", false)
                });
        })
    })


    var stake = function (money, callback) {
        money = parseInt(money * 10000) / 10000
        money = Number(money).toFixed(4)
        money += " AI";
        eoss.contract(bugContract, {
            accouts: [network]
        }).then(contract => {

            var meno = 'stake'
            console.log(meno)
            contract.transfer(account.name, betContract, money, meno, {
                    authorization: [account.name + '@active']
                })
                .then((resp) => {
                    console.log(resp)
                    get_stake();
                    get_unstake();
                    get_bonuspool();
                    showSuccess('抵押成功,请等待分红');
                    callback()
                }).catch(e => {
                    showAlert('抵押失败' + e.message);
                    console.error("stake err:", e);
                    callback()
                });
        })
    }

    var unstake = function (money, callback) {
        money = parseInt(money * 10000) / 10000
        money = Number(money).toFixed(4)
        money += " AI";

        eoss.contract(betContract, {
            accouts: [network]
        }).then(contract => {

            //console.log(meno)
            contract.unstaketoken(account.name, money, {
                    authorization: [account.name + '@active']
                })
                .then((resp) => {
                    console.log(resp)
                    showSuccess('赎回成功,请等待24小时解除抵押');
                    get_stake();
                    get_unstake();
                    get_bonuspool();
                    callback()
                }).catch(e => {
                    console.error("stake err:", e);

                    if (e && e.message) {
                        showAlert('执行失败' + e.message, false)
                    } else {
                        var err = JSON.parse(e)
                        showAlert('赎回失败' + err.error.name);
                    }


                    callback()
                });
        })
    }

    var release_time_interval;
    var release_time;
    var get_unstake = function () {

        eoss.getTableRows({
            code: betContract,
            scope: betContract,
            table: "unstake",
            lower_bound: account.name,
            index_position: 2,
            key_type: "i64",
            limit: 1,
            json: true
        }).then(data => {
            console.log("unstake ", data)

            if (data.rows && data.rows.length > 0 && data.rows[0].user == account.name) {
                $("#release-item").show();

                clearInterval(release_time_interval)
                var amount = Number(parseFloat(data.rows[0].amount / 10000)).toFixed(4);

                var t = parseInt(data.rows[0].time);

                release_time = t
                var t = t + 3600 * 24 - parseInt(Date.now() / 1000)
                if (t > 0) {
                    var h = parseInt(t / 3600);
                    h = h > 9 ? h : '0' + h;


                    var m = parseInt(parseInt(t % 3600) / 60);
                    m = m > 9 ? m : '0' + m;

                    var s = parseInt(parseInt(t % 3600) % 60)
                    s = s > 9 ? s : '0' + s

                    $(".release-time").text(h + ':' + m + ':' + s)
                    $("#takeoutstake").hide();


                    release_time_interval = setInterval(function () {
                        var t = release_time
                        release_time--
                        t = t + 3600 * 24 - parseInt(Date.now() / 1000)

                        if (t > 0) {
                            var h = parseInt(t / 3600);
                            h = h > 9 ? h : '0' + h;


                            var m = parseInt(parseInt(t % 3600) / 60);
                            m = m > 9 ? m : '0' + m;

                            var s = parseInt(parseInt(t % 3600) % 60)
                            s = s > 9 ? s : '0' + s

                            $(".release-time").text(h + ':' + m + ':' + s)


                            $("#takeoutstake").hide();
                        } else {
                            clearInterval(release_time_interval)
                            $(".release-time").text('00:00:00')
                            $("#takeoutstake").show();
                        }
                    }, 1000)
                } else {
                    $(".release-time").text('00:00:00')
                    $("#takeoutstake").show();
                }
                $(".release-token").text(amount)
            } else {
                $("#release-item").hide();
            }
        }).catch(e => {
            console.error("getInviteInfo ", e);
        });
    }

    var showSuccess = function (msg) {
        $(".modal.alert-msg").modal("show");

        var html = '<div  class="alert alert-success" style="padding:20px 0;">' +
            msg +
            '</div>';
        $("#alert-msg").html(html)
        setTimeout(function () {
            $("#alert-modal").modal("hide");
        }, 1500)
    }

    var showAlert = function (msg, isShow) {
        var html = '<div  class="alert alert-warning" style="padding:20px 0;">';
        if (isShow == undefined || !isShow) {
            html += '<a href="#" class="close" data-dismiss="alert">x</a>';
        }

        html += msg + '</div>';

        $("#alert-msg").html(html)
        $("#alert-modal").modal("show");
        if (isShow == undefined || !isShow) {
            setTimeout(function () {
                $("#alert-modal").modal("hide");
                hideLoading()
            }, 2500)
        }
    }

    var checkLogin = function () {
        if (account == null) {
            $("#play").text("登录中...")
            //$(".modal.loading").modal("show");
            init_scatter();
            return true
        }
        return false;
    }
    // play
    $('#play').click(function () {
        $("#loading").modal("show");
        //init_scatter();

        if (checkLogin()) {
            return
        }
        roll_by_scatter();
    })

    // play
    $('#login').click(function () {
        //if (account != null) return;
        $("#loading").modal("show");
        init_scatter();
    })

    //betdata
    $('#allBet').click(function () {
        $('#allBet').addClass('active');
        $('#myBet').removeClass('active');
        $('.allBetData').removeClass('hidden');
        $('.myBetData').addClass('hidden');
    })
    $('#myBet').click(function () {
        console.log('myBet')
        $('#myBet').addClass('active');
        $('#allBet').removeClass('active');
        $('.allBetData').addClass('hidden');
        $('.myBetData').removeClass('hidden');
    })


    $('#play-eos').click(function () {
        if (playType == 'eos') {
            return
        }
        playType = 'eos'
        $("#play-eos").addClass('active')
        $("#play-dice").removeClass('active')

        $(".play-type").text('EOS')
        $("#money").val(0.10);
        var odds = parseFloat($("#odds").text())
        $('#may_get_money').val(Number((odds * 0.1).toFixed(3))); //可能获得的奖金
    });

    $('#play-dice').click(function () {
        if (playType == 'ai') {
            return
        }
        playType = 'ai'
        $("#play-dice").addClass('active')
        $("#play-eos").removeClass('active')

        $(".play-type").text('AI')
        $("#money").val(100.00);

        var odds = parseFloat($("#odds").text())
        $('#may_get_money').val(Number((odds * 100.00).toFixed(3))); //可能获得的奖金
    });

    checkLogin();

    // progressbar.js@1.0.0 version is used
    // Docs: http://progressbarjs.readthedocs.org/en/1.0.0/
    var cpu = new ProgressBar.Circle("#cpu", {
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        duration: 1400,
        easing: 'bounce',
        strokeWidth: 6,
        from: {
            color: '#FFEA82',
            a: 0
        },
        to: {
            color: '#ED6A5A',
            a: 1
        },
        // Set default step function for all animate calls
        step: function (state, circle) {
            circle.path.setAttribute('stroke', state.color);
            var value = Math.round(circle.value() * 100);
            circle.setText("CPU: " + value + "%");
        }
    });
    var net = new ProgressBar.Circle("#net", {
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        duration: 1400,
        easing: 'bounce',
        strokeWidth: 6,
        from: {
            color: '#FFEA82',
            a: 0
        },
        to: {
            color: '#ED6A5A',
            a: 1
        },
        // Set default step function for all animate calls
        step: function (state, circle) {
            circle.path.setAttribute('stroke', state.color);
            var value = Math.round(circle.value() * 100);
            circle.setText("NET: " + value + "%");
        }
    });
    net.text.style.fontSize = '10px';
    cpu.text.style.fontSize = '10px';
    net.animate(0); // Number from 0.0 to 1.0
    cpu.animate(0); // Number from 0.0 to 1.0


    function countdown() { //倒计时
        var end_time = (parseInt(Date.now() / 1000 / 86400) + 1) * 86400 - 8 * 3600; //终止时间
        var curr_time = parseInt(Date.parse(new Date()) / 1000);
        var diff_time = parseInt(end_time - curr_time); // 倒计时时间差
        var h = Math.floor(diff_time / 3600);
        h = h > 9 ? h : '0' + h;
        var m = Math.floor((diff_time / 60 % 60));
        m = m > 9 ? m : '0' + m;

        var s = Math.floor((diff_time % 60));
        s = s > 9 ? s : '0' + s;

        $('.timer').html(h + "时" + m + "分" + s + "秒");
        $("#bonus-remain-time").html(h + ":" + m + ":" + s)
        if (diff_time <= 0) {
            $("#bonus-remain-time").html("00:00:00")
            $('.timer').html(0 + "时" + 0 + "分" + 0 + "秒");
        };


    }
    countdown();
    var start_time = setInterval(function () {
        countdown()
    }, 1000);

})(jQuery);