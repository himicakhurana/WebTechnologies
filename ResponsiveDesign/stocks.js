var availableTags = [];


$("#search_symbol").autocomplete({
    source: function (request, response) {
        $.ajax({
            type: "GET",
            dataType: "json",
            data: {
                symbol: request.term,
                autocomplete: true
            },
            async: true,
            url: "http://stockboot571.appspot.com/", //Relative or absolute path to response.php file
            success: function (data) {
                availableTags = changedata(data);
                response(data);
                console.log("Form submitted successfully.\nReturned json:aass ");
            }

        });

    },
    minLength: 1,
    select: function (event, ui) {
        if (ui.item.label) {
            var res = ui.item.label;
            var space = res.indexOf("-");
            if (space >= 1) {
                space = space - 1;
                var sendSymbol = res.slice(0, space);
                sendSymbol = sendSymbol.toUpperCase();
                console.log('Splice:' + sendSymbol);

                $("#search_symbol").val(sendSymbol);
            }
        }
        return false;
    },
    open: function () {
        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    },
    close: function () {
        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
    }

});



/*http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters={"Normalized":fa
lse,"NumberOfDays":1095,"DataPeriod":"Day","Elements":[{"Symbol":"AAPL","Type":"price","Params":[
"ohlc"]}]}*/
$(document).ready(function () {
    if (typeof (Storage) !== "undefined") {

        sessionStorage.clear();
    }
    $("#search_symbol").val("");
    $('#myCarousel').carousel(0);
    $("#autorefresh").removeAttr("checked");
    $("#btn-next").prop("disabled", true);
    populateFav();
    $(document).on('shown.bs.tab', 'a[data-info="tab"]', function (e) { // on tab selection event
        $(".high-width").each(function () { // target each element with the .contains-chart class
            var chart = $(this).highcharts();
            if (chart !== undefined) {

                console.log(chart); // target the chart itself
                chart.reflow();
            } // reflow that chart
        });
    });
    $('.carousel').on('slid.bs.carousel', function () {

        // This variable contains all kinds of data and methods related to the carousel
        var carouselData = $(this).data('bs.carousel');
        // EDIT: Doesn't work in Boostrap >= 3.2
        //var currentIndex = carouselData.getActiveIndex();
        var currentIndex = carouselData.getItemIndex(carouselData.$element.find('.item.active'));

        // Create the text we want to display.
        // We increment the index because humans don't count like machines
        if (currentIndex == 1) {
            $(".high-width").each(function () { // target each element with the .contains-chart class
                var chart = $(this).highcharts();
                if (chart !== undefined) {
                    console.log(chart); // target the chart itself
                    chart.reflow(); // reflow that chart
                }
            });
        }
        // You have to create a HTML element <div id="carousel-index"></div>
        // under your carousel to make this work
    });

});

function changeFavimage() {
    /*document.cookie
     */
    var classstar = "images/addfav_2.png";
    var alt = "add-as-fav";
    if (sessionStorage.symbol) {
        var sym = sessionStorage.symbol;
        if (typeof (Storage) !== "undefined") {
            console.log("storing");
            // Code for localStorage/sessionStorage.
            if (localStorage.symbolj) {
                var symsJSONString = localStorage.symbolj;
                var symJsons = $.parseJSON(symsJSONString);


                var index = $.inArray(sym, symJsons);
                if (index >= 0) {
                    classstar = "images/addfav_1.png";
                    alt = "fav-already";
                    $("#star").addClass("yellow-star");
                    $("#star").removeClass("white-star");

                } else {
                    $("#star").addClass("white-star");
                    $("#star").removeClass("yellow-star");

                }
                console.log(localStorage.symbolj);

            }

        }
    }

}


$("#search_symbol").on('change keyup keydown paste input', function () {
    console.log($("#search_symbol").val());
    $("#search_symbol").autocomplete({
        source: function (request, response) {
            $.ajax({
                type: "GET",
                dataType: "json",
                data: {
                    symbol: request.term,
                    autocomplete: true
                },
                async: true,
                url: "http://stockboot571.appspot.com/", //Relative or absolute path to response.php file
                success: function (data) {
                    availableTags = changedata(data);

                    response(data);
                    console.log("Form submitted successfully.\nReturned json:aass ");
                }

            });

        },
        minLength: 1,
        select: function (event, ui) {
            if (ui.item.label) {
                var res = ui.item.label;
                var space = res.indexOf("-");
                if (space >= 1) {
                    space = space - 1;
                    var sendSymbol = res.slice(0, space);
                    sendSymbol = sendSymbol.toUpperCase();
                    console.log('hhhh' + sendSymbol);
                    $("#search_symbol").val(sendSymbol);
                }
            }
            return false;
        },
        open: function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }

    });

    function changedata(data) {
        var avtags = [];
        $.each(data,
            function (idx, obj) {
                var res = obj;
                var space = res.indexOf("-");
                if (space >= 1) {
                    space = space - 1;
                    var sendSymbol = res.slice(0, space);
                    avtags.push(sendSymbol.trim());
                }

            });
        return avtags;
    }

});

function getsym(x) {
    var sym = "";
    if (x.indexOf("-") >= 0) {
        var xArray = x.split('-');
        sym = xArray[0].trim();
    } else {
        sym = $("#search_symbol").val().trim();
    }
    return sym;
}
$("#addFav").on('click', function () {
    var sym = $("#detail-symbol").text();

    if (typeof (Storage) !== "undefined" && sym !== undefined) {
        console.log("storing");
        // Code for localStorage/sessionStorage.
        if (localStorage.symbolj) {
            var symsJSONString = localStorage.symbolj;
            var symJsons = $.parseJSON(symsJSONString);
            var index = $.inArray(sym, symJsons);
            if (index < 0 && sym.length > 0) {
                symJsons.push(sym);
                var symJson = JSON.stringify(symJsons);

                localStorage.setItem("symbolj", symJson);
                populateFavOne(sym);

            } else {

                symJsons.splice(index, 1);
                var symJson = JSON.stringify(symJsons);
                localStorage.setItem("symbolj", symJson);
                $(".dynamic-remove-fav").each(function (index) {
                    var symbol = $(this).find('td:eq(0)').text().trim();
                    if (sym == symbol) {

                        $(this).remove();
                    }

                });

            }
            console.log(localStorage.symbolj);

        } else {
            var symbols = [sym];
            var symJson = JSON.stringify(symbols);

            localStorage.setItem("symbolj", symJson);
            populateFavOne(sym);

        }

    } else {
        // Sorry! No Web Storage support..
    }
    changeFavimage();


});
$("#getquote").on('click', function () {
    if ($("form")[0].checkValidity()) {
        var x = $("#search_symbol").val().toUpperCase();


        var sym = getsym(x);



        if ($.inArray(x, availableTags) >= 0) {

            console.log("Val passed");

            $("#errorMsg").text("");
            sessionStorage.setItem('symbol', sym);

            var success = fetchdetails(sym, true);





        } else {
            $("#errorMsg").text("Select Valid Entry");

            if (sessionStorage.symbol) {
                sessionStorage.removeItem("symbol");
            }
            $('#myCarousel').carousel(0);

            $("#btn-next").prop("disabled", true);


            console.log("Select Valid Entry");
        }



        return false;
    }
});

/*function updateURL() {
    var x = $("#search_symbol").val();

    var sym = getsym(x);

      if (history.pushState) {
          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?symbol=' + sym;
          window.history.pushState({
              path: newurl
          }, '', newurl);
      }
    if (typeof (Storage) !== "undefined") {
        console.log("storing");
        // Code for localStorage/sessionStorage



    }*/
$("#reset").on('click', function () {
    if (sessionStorage.symbol) {
        sessionStorage.removeItem("symbol");
    }
    $('#myCarousel').carousel(0);

    $("#btn-next").prop("disabled", true);


    $("#errorMsg").text("");


});
$("#fb-share").on('click', function () {
    var name = $("#detail-name").text();
    var symbol = $("#detail-symbol").text();
    var price = $("#detail-price").text();
    var change = $("#detail-name").text();
    var change = $("#detail-change").text();
    if (change && change.indexOf(')') > 0) {
        change = change.split(')')[0];
    }

    FB.ui({
        method: 'feed',
        name: 'Current Stock Price of ' + name + ' is ' + price,
        caption: 'LAST TRADE PRICE:$ ' + price + ',CHANGE:' + change,
        description: 'Stock Information of ' + name + ' (' + symbol + ')',
        picture: 'http://chart.finance.yahoo.com/t?s=' + symbol + '&lang=en-US&width=200&height=200'
    }, function (response) {
        if (response && response.post_id) {
            alert("Posted on facebook successfully");
        } else {
            alert("Could not post on facebook");
        }
    });


});



function render(data) {

    var x = data.table;
    var z = data.highcharts;
    var y = data.news;

    console.log(data);
    var IS_JSONx = true;
    try {
        var json = $.parseJSON(x);
    } catch (err) {
        IS_JSONx = false;
    }
    var jsonz;
    if (x != "Error" && IS_JSONx) {
        var IS_JSONz = true;
        try {
            jsonz = $.parseJSON(z);
        } catch (err) {
            IS_JSONz = false;
        }
        if (z != "Error" && IS_JSONz) {
            if (jsonz.Positions !== null) {
                renderCharts(data.highcharts);
            } else {
                console.log("no highcharts");
                $("#container").html("");
                $("#container").text("No highcharts found");

            }

        } else {
            $("#container").html("");
            $("#container").text("No highcharts found");



        }

        $("#yahoochart").attr("src", "http://chart.finance.yahoo.com/t?s=" + sessionStorage.symbol + "&lang=en-US&width=400&height=300");

        table(data.table);
        var IS_JSONy = true;
        try {
            var json = $.parseJSON(y);
        } catch (err) {
            IS_JSONy = false;
        }
        if (y != "Error" && IS_JSONy) {

            news(data.news);
        } else {

            $("#news-info").html("");
            $("#news-info").text("No News found");

        }

        changeFavimage();
        $('#myCarousel').carousel(1);
        $("#btn-next").removeAttr("disabled");
        console.log("here" + sessionStorage.symbol);

    } else {
        $("#errorMsg").text("No Valid Information Found!");
        if (sessionStorage.symbol) {
            sessionStorage.removeItem("symbol");
        }

        $('#myCarousel').carousel(0);

        $("#btn-next").prop("disabled", true);

        console.log("No Valid Information Found!");
    }
}

function renderCharts(data) {
    var obj = $.parseJSON(data);
    console.log(obj);


    /*
        var obj = $.parseJSON(data);
    */

    var ohlc = getOHLC(obj);
    var height = $("#containerx").height();
    var width = $("#containerx").width();
    console.log(height + "--" + width);
    //alert(obj.Positions);
    // display historical chart in specified container
    var chart = new Highcharts.StockChart({
        chart: {
            renderTo: 'container',
            events: {
                load: function (event) {
                    //When is chart ready?
                    /*
                                        $(document).resize();
                    */
                    /* event.target.reflow();
                    $(window).trigger('resize');
*/
                }
            }
        },
        rangeSelector: {
            allButtonsEnabled: true,
            buttons: [{
                type: 'week',
                count: 1,
                text: '1w'
						}, {
                type: 'month',
                count: 1,
                text: '1m'
						}, {
                type: 'month',
                count: 3,
                text: '3m'
						}, {
                type: 'month',
                count: 6,
                text: '6m'
						}, {
                type: 'ytd',
                text: 'YTD'
						}, {
                type: 'year',
                count: 1,
                text: '1y'
						}, {
                type: 'all',
                text: 'All'
						}],

            selected: 0,
            inputEnabled: false

        },

        title: {
            text: sessionStorage.symbol + ' Stock Price'
        },

        yAxis: [{
            title: {
                text: 'Stock Value'
            },
            min: 0,

            max: 125,
            tickAmount: 6

			}],

        series: [{

            name: sessionStorage.symbol + ' Stock Price',
            data: ohlc,
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2,
                valuePrefix: '$'

            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
            }
            }]
    });

    /*chart.redraw();
    $(window).resize();*/
    /*  $('#container').highcharts('StockChart', {

        rangeSelector: {
            allButtonsEnabled: true,
            buttons: [{
                type: 'week',
                count: 1,
                text: '1w'
						}, {
                type: 'month',
                count: 1,
                text: '1m'
						}, {
                type: 'month',
                count: 3,
                text: '3m'
						}, {
                type: 'month',
                count: 6,
                text: '6m'
						}, {
                type: 'ytd',
                text: 'YTD'
						}, {
                type: 'year',
                count: 1,
                text: '1y'
						}, {
                type: 'all',
                text: 'All'
						}],

            selected: 0,
            inputEnabled: false

        },

        title: {
            text: sessionStorage.symbol + 'Stock Price'
        },

        yAxis: [{
            title: {
                text: 'Stock Value'
            }
			}],

        series: [{
            name: sessionStorage.symbol + ' Stock Price',
            data: ohlc,
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
            }
            }]
    });

*/

}

getOHLC = function (json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];

    if (elements[0]) {

        for (var i = 0, datLen = dates.length; i < datLen; i++) {
            var dat = fixDate(dates[i]);
            var pointData = [
                dat,
                //elements[0].DataSeries['open'].values[i],
                //elements[0].DataSeries['high'].values[i],
                //elements[0].DataSeries['low'].values[i],
                elements[0].DataSeries['close'].values[i]
            ];
            chartSeries.push(pointData);
        };
    }
    return chartSeries;
};

fixDate = function (dateIn) {
    var dat = new Date(dateIn);
    return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
};


function news(data) {

    /*
        var json = $.parseJSON(json);
    */
    var fym = sessionStorage.symbol;

    var json = $.parseJSON(data);
    console.log(json);

    $.each(json.d.results,
        function (idx, obj) {
            var regex = new RegExp(fym, 'g');
            var description = obj.Description.replace(regex, fym.bold());
            console.log(obj.Title);
            $("#news").append('<li  class="dynamic-remove"><a href="' + obj.Url + '"><span class="news-link">' + obj.Title + '</span></a><p>' + description + '</p><span class="news-detail">Publisher:</span>' + obj.Source + '<br><span class="news-detail">Date:</span>' + moment(obj.Date).format('D MMMM YYYY, HH:mm:ss') + '</li>');
        });

}

function table(data) {
    $(".dynamic-remove").remove();
    var obj = $.parseJSON(data);

    var spanclass = obj.Change > 0 ? "up" : "down";
    var spanclassy = obj.ChangeYTD > 0 ? "up" : "down";

    $("#details").append('<tr class="dynamic-remove"><td>Name</td><td id="detail-name">' + obj.Name + '</td></tr>');
    $("#details").append('<tr class="dynamic-remove"><td>Symbol</td><td id="detail-symbol">' + obj.Symbol + '</td></tr>');
    $("#details").append('<tr class="dynamic-remove"><td>Last Price</td><td id="detail-price">' + '$' + roundno(obj.LastPrice) + '</td></tr>');
    $("#details").append('<tr class="dynamic-remove"><td>Change(Change Percent)</td><td id="detail-change" class="' + spanclass + '">' + roundno(obj.Change) + '(' + roundno(obj.ChangePercent) + '%)<span class=' + spanclass + '><img src="images/' + spanclass + '.png" height="20" width="20" alt="' + spanclass + '-image-arrow"></span>' + '</td></tr > ');
    $("#details").append('<tr class="dynamic-remove"><td>Time and Date</td><td>' + moment(obj.Timestamp).format('D MMMM YYYY, h:mm:ss a') + '</td></tr>');
    $("#details").append('<tr class="dynamic-remove"><td>MarketCap</td><td>' + marketcap(obj.MarketCap) + '</td></tr>');
    $("#details").append('<tr class="dynamic-remove"><td>Volume</td><td>' + obj.Volume + '</td></tr>');
    $("#details").append('<tr class="dynamic-remove"><td>ChangeYTD (Change PercentYTD)</td><td class="' + spanclassy + '">' + roundno(obj.ChangeYTD) + '(' + roundno(obj.ChangePercentYTD) + '%)<span class=' + spanclassy + '><img src="images/' + spanclassy + '.png" height="20" width="20" alt="' + spanclass + '-image-arrow"></span>' + '</td></tr > ');
    $("#details").append('<tr class="dynamic-remove"><td>High Price</td><td>' + '$' + roundno(obj.High) + '</td></tr>');
    $("#details").append('<tr class="dynamic-remove"><td>Low Price</td><td>' + '$' + roundno(obj.Low) + '</td></tr>');
    $("#details").append('<tr class="dynamic-remove"><td>Opening Price</td><td>' + '$' + roundno(obj.Open) + '</td></tr>');
}
/*  FB.ui({
         method: 'feed',
         link: 'https://developers.facebook.com/docs/',
         caption: 'An example caption',
     }, function (response) {});*/

function populateFav() {



    if (typeof (Storage) !== "undefined") {
        console.log("storing");
        // Code for localStorage/sessionStorage.
        if (localStorage.symbolj) {
            var symsJSONString = localStorage.symbolj;
            var favorites = $.parseJSON(symsJSONString);
            if (favorites.length > 0) {
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    data: {
                        favorites: favorites,
                        fav: true
                    },
                    async: true,
                    jsonp: 'callback',
                    jsonpCallback: 'favappend',
                    url: "http://stockboot571.appspot.com/", //Relative or absolute path to response.php file
                    success: function (data) {

                        console.log("Form submitted successfully.\nReturned json:aa ");
                    }

                });

            }
        }
    }
}

function populateFavUpdate() {



    if (typeof (Storage) !== "undefined") {
        console.log("storing");
        // Code for localStorage/sessionStorage.
        if (localStorage.symbolj) {
            var symsJSONString = localStorage.symbolj;
            var favorites = $.parseJSON(symsJSONString);
            if (favorites.length > 0) {
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    data: {
                        favorites: favorites,
                        fav: true
                    },
                    async: true,
                    jsonp: 'callback',
                    jsonpCallback: 'favappendupdate',
                    url: "http://stockboot571.appspot.com/", //Relative or absolute path to response.php file
                    success: function (data) {

                        console.log("Form submitted successfully.\nReturned json:aa ");
                    }

                });

            }
        }
    }
}

function populateFavOne(symbol) {

    // Code for localStorage/sessionStorage.
    var symsJSONString = localStorage.symbolj;
    var favorites = [symbol];
    if (favorites.length > 0) {
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            data: {
                favorites: favorites,
                fav: true
            },
            async: true,
            jsonp: 'callback',
            jsonpCallback: 'favappend',
            url: "http://stockboot571.appspot.com/", //Relative or absolute path to response.php file
            success: function (data) {

                console.log("Form submitted successfully.\nReturned json:aa ");
            }

        });

    }


}

$(document).on('click', ".trash-icon", function (event) {
    console.log('trash-icon');

    var rowindex = $(this).closest('tr').index();
    var sym = $(this).closest("tr").find('td:eq(0)').text().trim();
    console.log('rowindex', rowindex);
    $("#favorites tr:eq(" + rowindex + ")").remove();


    if (typeof (Storage) !== "undefined") {
        console.log("storing");
        // Code for localStorage/sessionStorage.
        if (localStorage.symbolj) {
            var symsJSONString = localStorage.symbolj;
            var symJsons = $.parseJSON(symsJSONString);
            var index = $.inArray(sym, symJsons);
            if (index >= 0) {
                symJsons.splice(index, 1);
                var symJson = JSON.stringify(symJsons);
                localStorage.setItem("symbolj", symJson);
                if (sessionStorage.symbol) {
                    if (sessionStorage.symbol == sym) {
                        changeFavimage();
                    }
                }
            }
            console.log(localStorage.symbolj);

        }
    }

});
$(document).on('click', ".symbollink", function (event) {
    var sym = $(this).closest("tr").find('td:eq(0)').text().trim();

    sessionStorage.setItem('symbol', sym);

    var x = fetchdetails(sym, false);



});
$(document).on('click', "#refr", function (event) {
    populateFavUpdate();
});

function fetchdetails(sym, successvar) {

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        data: {
            symbol: sym,
            highcharts: true,
            table: true,
            news: true
        },
        async: true,
        jsonp: 'callback',
        jsonpCallback: 'render',
        url: "http://stockboot571.appspot.com/", //Relative or absolute path to response.php file
        success: function (data) {
            /*
                            updateURL();
            */
            if (successvar && data.table != "Error") {
                successvar = true;
            }


            console.log("Form submitted successfully.\nReturned json ");
            /* $(".high-width").each(function () {
                 $(this).highcharts().reflow();
                 console.log('doneeee');
             });*/
        }

    });

    return successvar;

}

function favappend(data) {

    /*
        var json = $.parseJSON(data);
    */
    $.each(data,
        function (idx, obj) {
            if (obj.Change) {
                var spanclass = obj.Change > 0 ? "up" : "down";
                $("#favorites").append('<tr class="dynamic-remove-fav"><td><button type="button" class="btn btn-link symbollink">' + obj.Symbol + '</button></td><td>' + obj.Name + '</td><td>$' + roundno(obj.LastPrice) + '</td><td class="' + spanclass + '">' + roundno(obj.Change) + '(' + roundno(obj.ChangePercent) + '%)<span class=' + spanclass + '><img src="images/' + spanclass + '.png" height="20" width="20" alt="' + spanclass + '-image-arrow"></span>' + '</td><td>' + marketcap(obj.MarketCap) + '</td><td> <button type="button" class="btn btn-default trash-icon"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></td></tr>');
            }
        });

}

function favappendupdate(data) {
    $(".dynamic-remove-fav").each(function (index) {
        var symbol = $(this).find('td:eq(0)').text().trim();
        var price, change;
        $.each(data,
            function (idx, obj) {
                var spanclass = obj.Change > 0 ? "up" : "down";


                if (symbol == obj.Symbol) {
                    price = '$' + roundno(obj.LastPrice);
                    change = '<span class="' + spanclass + '">' + roundno(obj.Change) + ' (' + roundno(obj.ChangePercent) + ' % )</span> <span class = ' + spanclass + '> <img src = "images/' + spanclass + '.png" height = "20 width = "20" alt = ""/></span>';
                }

            });

        $(this).find('td:eq(2)').html(price);
        $(this).find('td:eq(3)').html(change);

        console.log(index + ": " + $(this).text());
    });
}
var timeinterval;
$("#autorefresh").change(function () {
    if ($(this).is(':checked')) {
        timeinterval = setInterval('populateFavUpdate()', 5000);
    } else {
        clearInterval(timeinterval);
    }

});


function roundno(no) {
    if (no) {
        return no.toFixed(2);
    }
    return 0;
}

function marketcap(no) {
    if (no > 1000000000) {
        return (roundno(no / 1000000000) + 'Billion');
    } else {
        return (roundno(no / 1000000) + 'Million');

    }
    return 0 + 'Billion';

}

$("#tadaa").hover(function () {
    $(this).attr("title", "Auto Refresh Data");
});