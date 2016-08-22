"use strict;"

if (typeof ss === "undefined") var ss = new Object;

ss.data = {
    market_condition: M_PEACEFUL,
    player_data: JSON.parse(ss.db.player_data),
    company_data: JSON.parse(ss.db.company_data),
    internal: {}
}

ss.routines = {
    init: function() {

        console.info("StockSim Rev " + commit);
        console.info("Selected mode: " + ss.data.market_condition);

        /*
         * Call save function whenever the player navigates away from the page.
         */

        $(window).on('beforeunload', function(){
             ss.db.player_data = JSON.stringify(ss.data.player_data);
             ss.db.company_data = JSON.stringify(ss.data.company_data);
        });

        ss.ticker.startStockTickers();

    },
    getPortfolioValue: function() {
        let stocks = ss.data.player_data.owned_stocks,
            value = 0;

        for (var i = Object.keys(stocks).length - 1; i >= 0; i--) {
            
            // Get the ASX stock symbol
            let code = Object.keys(stocks)[i];

            // Add the last_price of the stock to the counter variable value
            value += ss.data.company_data[code].last_price * stocks[code];

        };

        // Return the total value of the owned portfolio
        return value;
    },
    stock_search: function(symbol) {
        /*
         * Ensure that the provided stock symbol exists within company data
         */

        if (Object.keys(ss.data.company_data).indexOf(symbol) === -1) {
            alert("Invalid symbol provided.");

            return;
        };

        window.location = "?r=stock_view&symbol=" + symbol;
    },
    stock_purchase: function() {
        var amount = Math.floor($("#purchase_amount").val()),
            params={};window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,key,value){params[key] = value;}),
            purchase_amount = amount * ss.data.company_data[params.symbol].last_price;

        /*
         * Validate that the player owns the required amount of capital to purchase the requested shares.
         */

        if (Math.abs(purchase_amount) > ss.db.player_data.cash || purchase_amount <= 0) {
            alert("Insufficent funds");
        } else {
            if (confirm("Purchase " + amount + " shares of " + params.symbol + " for " + purchase_amount + "?")) {
                
                /*
                 * Perform the purchasing action;
                 * Sum the original owned shares and the purchased amount.
                 */

                if (typeof ss.data.player_data.owned_stocks[params.symbol] === "undefined") {
                    ss.data.player_data.owned_stocks[params.symbol] = amount;
                } else {
                    ss.data.player_data.owned_stocks[params.symbol] = Math.floor(ss.data.player_data.owned_stocks[params.symbol]) + Math.floor(amount);
                }

                ss.data.player_data.cash -= purchase_amount;

                /*
                 * Update the UI.
                 */

                $("#owned_shares").html(ss.data.player_data.owned_stocks[params.symbol]);
                $("#cash").html(ss.data.player_data.cash);
            }
        }
    },
    stock_sell: function() {
        var amount = Math.floor($("#sell_amount").val()),
            params={};window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,key,value){params[key] = value;}),
            sell_amount = amount * ss.data.company_data[params.symbol].last_price;

        /*
         * Validates the amount of stock that the player owns is enough to sell.
         */

        if (Math.floor(amount) > ss.data.player_data.owned_stocks[params.symbol] || amount <= 0) {
            alert("You cannot sell more stocks than you own.")
        } else {
            if (confirm("Sell " + amount + " shares of " + params.symbol + " for " + sell_amount + "?")) {
                /*
                 * Performs the selling actions;
                 * Deducts the share amounts and adds cash.
                 */

                ss.data.player_data.owned_stocks[params.symbol] = Math.floor(ss.data.player_data.owned_stocks[params.symbol]) - Math.floor(amount);

                ss.data.player_data.cash += sell_amount;

                $("#owned_shares").html(ss.data.player_data.owned_stocks[params.symbol]);
                $("#cash").html(ss.data.player_data.cash);
            }
        }
    }
}

ss.ticker = {
    startStockTickers: function() {

        ss.data.internal.handles = {};

        for (var i = Object.keys(ss.data.company_data).length - 1; i >= 0; i--) {

            let code = Object.keys(ss.data.company_data)[i];

            ss.data.internal.handles[code] = setInterval(function() {

                /*
                 * Decides on the direction the stock moves every TIME_PERIOD.
                 */
                    
                Math.random() <= (M_SETTINGS[ss.data.market_condition].boundary + (ss.data.company_data[code].last_price <= 30 ? 0.5 : 0)) ? move_direction = M_UP : move_direction = M_DOWN;

                ss.data.company_data[code].last_price += ss.rng.movement(move_direction);

            }, TIME_PERIOD);
        };
        
    },
    stopStockTickers: function() {

        for (var i = Object.keys(ss.data.company_data).length - 1; i >= 0; i--) {

            let code = Object.keys(ss.data.company_data)[i];

            clearInterval(ss.data.internal.handles[code]);

        };

    }
}

ss.rng = {
    movement: function(direction) {
        /*
         * Returns the movement in stock price based on max and min move constants.
         */

        return direction * (Math.floor(Math.random() * (M_SETTINGS[ss.data.market_condition].max_move - M_SETTINGS[ss.data.market_condition].min_move)) + M_SETTINGS[ss.data.market_condition].max_move);
    }
}

ss.pages = {
    portfolio: function() {
        $(document).ready(function() {

            /*
             * Inits HighChart library for home page.
             */

            ss.data.internal.portfolio_chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'portfolio-graph',
                    defaultSeriesType: 'spline',
                    events: {
                        load: function() { 
                            setInterval(function() {

                                /*
                                 * Updates chart data every TIME_PERIOD.
                                 */ 

                                let chart = ss.data.internal.portfolio_chart,
                                    series = chart.series[0],
                                    shift = series.data.length > 18;

                                chart.series[0].addPoint([Date.now(), ss.routines.getPortfolioValue() + ss.data.player_data.cash], true, shift);
                            }, TIME_PERIOD);
                        }
                    }
                },
                title: {
                    text: 'Live Portfolio Value'
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 50,
                    maxZoom: 20 * 1000,
                    labels: {
                        enabled: true,
                        rotation: -45
                    },
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%e. %b',
                        week: '%e. %b',
                        month: '%b \'%y',
                        year: '%Y'
                    }               
                },
                yAxis: {
                    minPadding: 0.2,
                    maxPadding: 0.2,
                    title: {
                        text: 'Value [$]',
                        margin: 80
                    }
                },
                series: [{
                    name: 'Portfolio value',
                    step: true,
                    data: [[Date.now(), ss.routines.getPortfolioValue() + ss.data.player_data.cash]]
                }]
            });        
        });
    },
    detailed_overview: function() {

        let stocks = ss.data.player_data.owned_stocks;

        $(document).ready(function($) {
            $(".clickable").click(function() {
                window.document.location = "?r=stock_view&symbol=" + $(this).data("symbol");
            });
        });

        for (var i = Object.keys(stocks).length - 1; i >= 0; i--) {

            let code = Object.keys(stocks)[i],
                /*
                 * Generates the table HTML markup
                 */ 

                row = '<tr style="cursor: pointer" class="clickable" data-symbol="' + code + '"><td>' + code + '</td>' + '<td>' + ss.data.company_data[code].name + '</td>' + '<td>' + ss.data.company_data[code].category + '</td><td>' + '$' + ss.data.company_data[code].last_price + '</td><td>' + stocks[code] + '</td><td>' + '$' + ss.data.company_data[code].last_price * stocks[code] + '</td></tr>';

            if (stocks[code] == 0) {
                continue;
            };

            $('#holdings > tbody:last-child').append(row);

        }

        /*
         * Generates static table rows.
         */

        $('#holdings > tbody:last-child').append('<tr><td></td><td>Cash</td><td>Liquid</td><td></td><td></td><td>' + '$' + ss.data.player_data.cash + '</td></tr>');

        $('#holdings > tbody:last-child').append('<tr><td></td><td><strong>Total</strong></td><td></td><td></td><td></td><td>' + '$' + (ss.data.player_data.cash + ss.routines.getPortfolioValue()) + '</td></tr>');

    },
    stock_search: function() {

        var stocks = [],
            data = ss.data.company_data;

        for (var i = Object.keys(data).length - 1; i >= 0; i--) {

            let code = Object.keys(data)[i];

            stocks.push(code + " – " + data[code].name);

        }

        /*
         * Initiate the Bloodhound searcher.
         */ 

        var stocks = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `stocks` is an array of state names defined in "The Basics"
            local: stocks
        });

        $('#searcher .typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'stocks',
            source: stocks
        });

        $("#searcher .typeahead").keyup(function(event){
            /*
             * Take only the stock_symbol.
             */

            if(event.keyCode == 13){
                ss.routines.stock_search($('#search_field').val().substr(0,3))            
            }
        });

    },
    stock_view: function() {
        var params={};window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,key,value){params[key] = value;});

        /*
         * Verify that a symbol has been provided and that it is valid.
         */

        if (typeof params.symbol === "undefined") {
            alert("No symbol provided!");
            window.location = '?r=stock_search';

            throw new Error("No symbol provided in symbol arg.");
        } else if (Object.keys(ss.data.company_data).indexOf(params.symbol) === -1) {
            alert("Invalid symbol provided!");
            window.location = '?r=stock_search';

            throw new Error("Invalid symbol provided.");
        }

        /*
         * Initiate Highwind charts.
         */

        $(document).ready(function() {
            ss.data.internal.stock_chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'symbol-graph',
                    defaultSeriesType: 'spline',
                    events: {
                        load: function() { 

                            /*
                             * Update page chart every TIME_PERIOD.
                             */

                            setInterval(function() {
                                let chart = ss.data.internal.stock_chart,
                                    series = chart.series[0],
                                    shift = series.data.length > 20;

                                    $("#price").html(ss.data.company_data[params.symbol].last_price);
                                    $("#cash").html(ss.data.player_data.cash);

                                chart.series[0].addPoint([Date.now(), ss.data.company_data[params.symbol].last_price], true, shift);
                            }, TIME_PERIOD);
                        }
                    }
                },
                title: {
                    text: ' '
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150,
                    maxZoom: 20 * 1000,
                    labels: {
                        enabled: true
                    }
                },
                yAxis: {
                    minPadding: 0.2,
                    maxPadding: 0.2,
                    title: {
                        text: ' ',
                        margin: 80
                    }
                },
                series: [{
                    name: params.symbol + ' Value',
                    data: [[Date.now(), ss.data.company_data[params.symbol].last_price]]
                }]
            });        
        });

        /*
         * Update the UI to reflect changes.
         */ 

        $("#symbol").html(params.symbol);
        $("#name").html(ss.data.company_data[params.symbol].name);
        $("#price").html(ss.data.company_data[params.symbol].last_price);
        $("#cash").html(ss.data.player_data.cash);

        if (typeof ss.data.player_data.owned_stocks[params.symbol] === "undefined") {
            $("#owned_shares").html(0);
            ss.data.player_data.owned_stocks[params.symbol] = 0;
        } else {
            $("#owned_shares").html(ss.data.player_data.owned_stocks[params.symbol]);
        }

        /*
         * Handle purchase options and validate that the buyer/seller has enough capital to purchase/sell.
         */

        $("#purchase_amount").keyup(function(event){
            var amount = $("#purchase_amount").val();

            /*
             * Alert insufficient funds
             */ 

            if(event.keyCode == 8){ // Keycode 8 -> Backspace
                $("#alert_insufficent_funds").hide();
                $("#submit_button").prop('disabled', false);  
            }

            if (amount * ss.data.company_data[params.symbol].last_price > ss.data.player_data.cash || amount <= 0) {
                if (amount > 0) {
                    $("#insufficent_purchase_amount").html(amount);
                    $("#alert_insufficent_funds").show();
                };

                $("#submit_button").prop('disabled', true);
            } else {
                $("#alert_insufficent_funds").hide();
                $("#submit_button").prop('disabled', false);

                if(event.keyCode == 13){ // Keycode 13 -> Enter
                    ss.routines.stock_purchase();          
                }
            }
        });

        $("#sell_amount").keyup(function(event){
            var amount = $("#sell_amount").val();

            /*
             * Alert insufficient funds
             */ 

            if(event.keyCode == 8){
                $("#alert_insufficent_stocks").hide();
                $("#sell_button").prop('disabled', false);         
            }

            if (amount > ss.data.player_data.owned_stocks[params.symbol] || amount == 0 || amount <= 0) {
                if (amount > 0) {
                    $("#insufficent_sell_amount").html(amount);
                    $("#alert_insufficent_stocks").show();
                };

                $("#sell_button").prop('disabled', true);
            } else {
                $("#alert_insufficent_stocks").hide();
                $("#sell_button").prop('disabled', false);

                if(event.keyCode == 13){
                    ss.routines.stock_sell();          
                }
            }
        });


    }
}

ss.routines.init();
