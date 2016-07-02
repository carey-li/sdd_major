"use strict;"

if (typeof ss === "undefined") var ss = new Object;

ss.data = {
    cash: 50000,
    market_condition: M_PEACEFUL,
    player_data: JSON.parse(ss.db.player_data),
    company_data: JSON.parse(ss.db.company_data),
    internal: {}
}

ss.routines = {
    init: function() {

        console.info("StockSim Rev " + commit);
        console.info("Selected mode: " + ss.data.market_condition);

        switch (ss.data.market_condition) {
            case M_PEACEFUL:
                ss.data.internal.uptick_rate = M_PEACEFUL_BOUNDARY;
                break;
            case M_NORMAL:
                ss.data.internal.uptick_rate = M_NORMAL_BOUNDARY;
                break;
            case M_VOLATILE:
                ss.data.internal.uptick_rate = M_VOLATILE_BOUNDARY;
                break;
        };

        $(window).on('beforeunload', function(){
             ss.db.save_data = JSON.stringify(ss.data.player_data);
        });

        ss.ticker.startStockTickers();

    },
    getPortfolioValue: function() {
        let stocks = ss.data.player_data.owned_stocks,
            value = 0;

        for (var i = Object.keys(stocks).length - 1; i >= 0; i--) {
            
            let code = Object.keys(stocks)[i];

            value += ss.data.company_data[code].last_price * stocks[code];

        };

        return value;
    }
}

ss.ticker = {
    startStockTickers: function() {

        ss.data.internal.handles = {};

        for (var i = Object.keys(ss.data.company_data).length - 1; i >= 0; i--) {

            let code = Object.keys(ss.data.company_data)[i];

            ss.data.internal.handles[code] = setInterval(function() {
                    
                Math.random() <= (ss.data.internal.uptick_rate + (ss.data.company_data[code].last_price <= 60 ? 0.2 : 0)) ? ss.data.internal.movement = M_UP : ss.data.internal.movement = M_DOWN;

                ss.data.company_data[code].last_price += ss.rng.movement(ss.data.internal.movement);

            }, 5000);
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
        switch(ss.data.market_condition) {
            case M_PEACEFUL:
                return direction * (Math.floor(Math.random() * (M_PEACEFUL_MAXIMUM_MOVE - M_PEACEFUL_MINIMUM_MOVE)) + M_PEACEFUL_MAXIMUM_MOVE);
            case M_NORMAL:
                return direction * (Math.floor(Math.random() * (M_NORMAL_MAXIMUM_MOVE - M_NORMAL_MINIMUM_MOVE)) + M_NORMAL_MAXIMUM_MOVE);
            case M_VOLATILE:
                return direction * (Math.floor(Math.random() * (M_VOLATILE_MAXIMUM_MOVE - M_VOLATILE_MINIMUM_MOVE)) + M_VOLATILE_MAXIMUM_MOVE);
        };
    }
}

ss.pages = {
    portfolio: function() {
        $(document).ready(function() {
            ss.data.internal.portfolio_chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'portfolio-graph',
                    defaultSeriesType: 'spline',
                    events: {
                        load: function() { 
                            setInterval(function() {
                                let chart = ss.data.internal.portfolio_chart,
                                    series = chart.series[0],
                                    shift = series.data.length > 20;

                                chart.series[0].addPoint([Date.now(), ss.routines.getPortfolioValue()], true, shift);
                            }, 5000);
                        }
                    }
                },
                title: {
                    text: 'Live Portfolio Value'
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150,
                    maxZoom: 20 * 1000
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
                    data: [[Date.now(), ss.routines.getPortfolioValue()]]
                }]
            });        
        });
    }
}

ss.routines.init();