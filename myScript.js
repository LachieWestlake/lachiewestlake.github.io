
function selectload() {
    var numbers = [1960, 1964, 1968, 1972, 1976, 1980,1984,1988,1992,1996,2000,2004,2008,2012];
 
for (var i=0;i<numbers.length;i++){
    $('<option/>').val(numbers[i]).html(numbers[i]).appendTo('#year');
    }

};

selectload();
init();

var bigdata;

function init() {
    // svg.selectAll("*").remove(); //Clear SVG https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
    //Get Selected Option from Dropdown box https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript
    $('#year').prop('selectedIndex', 1).change();

}


function onChange() {




    // svg.selectAll("*").remove(); //Clear SVG https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
    //Get Selected Option from Dropdown box https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript
    var e = document.getElementById('year');
    var strUser = e.options[e.selectedIndex].value;
    //String to Array Object https://stackoverflow.com/questions/1086404/string-to-object-in-js
    var filters2 = ('{ "Year": [ "' + strUser + '"] }');
    var filters = JSON.parse(filters2);

    runData(filters);
}

function runData(filters) {
    data = [];
    d3.csv("olympicdata.csv", function (data) {
        //Filtering CSV Data:  https://stackoverflow.com/questions/10615290/select-data-from-a-csv-before-loading-it-with-javascript-d3-library
        
        data = data.filter(function (row) {
            return ['Year', 'Country', 'Gold', 'Silver', 'Bronze'].reduce(function (pass, column) {
                return pass && (
                    !filters[column] ||

                    row[column] === filters[column] ||

                    filters[column].indexOf(row[column]) >= 0
                );
            }, true);
        })


        draw(data);
    });
}

var counter = 2;

var swapSpeed = 1000;


function playFunction() {


   

    if (counter <= 14) {
        p = 1;

        $('#year').prop('selectedIndex', counter).change();
        counter = counter + 1;
      
        setTimeout(playFunction, p * swapSpeed);
    
        var select = counter;
        
    }
    else {
        console.log("re")
        var e = document.getElementById('year');
        var strUser = e.options[e.selectedIndex].index;
        counter = strUser;
        console.log(counter);

        if (counter == 14) {
            counter = 1;
            playFunction();
        }

    }
}

var val = 10;
function GetTopCountries(arrayData) {  //sorting to top slider function
    arrayData.sort(function (a, b) {
        return parseFloat(b.value) - parseFloat(a.value);
    });
    return arrayData.slice(0, val);
}



var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    var margin = {top: (parseInt(d3.select('body').style('height'), 10)/20), right: (parseInt(d3.select('body').style('width'), 10)/20), bottom: (parseInt(d3.select('body').style('height'), 10)/6), left: (parseInt(d3.select('body').style('width'), 10)/20)},
            width = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right,
            height = parseInt(d3.select('body').style('height'), 10) - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.35);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var colorStackChart = d3.scale.ordinal(["#ffd700", "#c0c0c0", "#cd7f32"])


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height + 70)
    .text("Countries");
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 9)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Medals 🥇");

var t = d3.transition()
    .duration(swapSpeed);

var active_link = "0"; //to control legend selections and hover
var legendClicked; //to control legend selections
var legendClassArray = []; //store legend classes to select bars in plotSingle()
var y_orig; //to store original y-posn

function draw(data) {

//   var colorStackChart = d3.scale.ordinal(["#ffd700", "#c0c0c0", "#cd7f32"]);
    colorStackChart.domain(d3.keys(data[0]).filter(function (key) { return key !== "Country" && key !== "Year" && key !== "locCity" && key !== "Pop" && key !== "Country Code" && key !== "NumMedals" && key !== "Rank" && key !== "Total"; }));
//    var agenames = d3.keys(data[0]).filter(function (key) { return key !== "Country" && key !== "Year" && key !== "locCity" && key !== "Pop" && key !== "Country Code" && key !== "NumMedals" && key !== "Rank" && key !== "Total"; });




    data.forEach(function (d) {
        var y0 = 0;
        var myCountry = d.Country;
        var myYear = d.Year;

        d.countryStack = colorStackChart.domain().map(function (name) { return { myCountry: myCountry, myYear: myYear, name: name, y0 : y0, y1: y0 += +d[name] }; });
        d.total = d.countryStack[d.countryStack.length - 1].y1;
    });

    data.sort(function (a, b) { return b.total - a.total; });

   data = GetTopCountries(data);

/*       data.forEach(function (d) {
        d.GoldStack = +d.Gold;
        d.SilverStack = +d.Silver;
        d.BronzeStack = +d.Bronze;
        d.Name = +d.countryStack;
        // d.countryStack = colorStackChart.domain().map(function (name) { return { myCountry: myCountry, myYear: myYear, name: name, y0: y0, y1: y0 += +d[name] }; });
    }); */





    /*   var dataIntermediate = xData.map(function (c) {
        return data.map(function (d) {
            return { x: d.Country, y: d[c], f: d.Rank - 1, j: d.countryStack };
        });
    });

    var dataStackLayout = d3.layout.stack()(dataIntermediate); */

    // console.log(dataStackLayout);

    x.domain(data.map(function (d) { return d.Country; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]);

    var layer = svg.selectAll(".stack")
        .data(data);

    layer.enter().append("g")
        /*     .attr("class", "g")
            .attr("transform", function (d) { return "translate(" + x(d.Country) + ",0)"; }); */
        .attr("class", "stack")
        .attr("transform", function (d) { return "translate(" + x(d.Country) + ",0)"; })

    d3.select("#layertip").remove()
    d3.select("#layertip").remove()
    d3.select("#layertip").remove()
    d3.select("#layertip").remove()
    d3.select("#layertip").remove()
    d3.select("#layertip").remove()
    d3.select("#layertip").remove()
    d3.select("#layertip").remove()
    d3.select("#layertip").remove()
    d3.select("#layertip").remove()




    layer.append("text")
        .attr("id", "layertip")
        .text(function (d) { return d3.format(".2s")(Math.round(d.total)); })
        .attr("y", function (d) { return height + 45; })
        .attr("x", x.rangeBand() / 3)
   


    var rect = layer.selectAll("rect")
        .data(function (d) {
            
            return d.countryStack;
        });

    rect.transition(t)
        //   .ease('elastic')
        .attr("x", function (d) {
            return x(x.rangeBand);
        })
        .attr("y", function (d) {
            return y(d.y1);
        })
        .attr("height", function (d) {
            return y(d.y0) - y(d.y1);
        })
        .attr("width", x.rangeBand())
    //   .style("fill", function (d) { return (d.name); });
    

    rect.enter().append("rect")
        //   .data(function (d) { return d.countryStack; })
        .attr("x", function (d) {
            return x(x.rangeBand);
        })
        .attr("y", function (d) {
            return y(d.y1);
        })
        .on("mouseon", function () {
            tooltip.style("display", null)


        })
        .on("mousemove", function (d) {
            divTooltip.style("left", d3.event.pageX + 10 + "px");
            divTooltip.style("top", d3.event.pageY - 25 + "px");
            divTooltip.style("display", "inline-block");
            var elements = document.querySelectorAll(':hover');
            l = elements.length
            l = l - 1
            element = elements[l].__data__
            value = element.y1 - element.y0
            divTooltip.html(d.myCountry + "<br>" + element.name + ": " + value);
        })
        .on("mouseout", function (d) {
            divTooltip.style("display", "none");
        })

        .attr("height", function (d) {
            return y(d.y0) - y(d.y1);
        })
        .attr("width", x.rangeBand())
        .attr("class", function (d) {
            classLabel = d.name.replace(/\s/g, ''); //remove spaces
            return "class" + d.name;
        })
        .style("fill", function (d) { return (d.name == "Gold" ? "#ffd700" : d.name == "Silver" ? "#c0c0c0" : d.name == "Bronze" ? "#cd7f32" : "Black"); })



    rect.exit().transition(t)
        .attr("height", 0)
        .attr("y", height)
        .remove();



    layer.exit().remove();

    svg.selectAll("g.x.axis")
        .transition(t).call(xAxis);

    svg.selectAll("g.y.axis")
        .transition(t).call(yAxis);

   // Adding tooltips: https://www.competa.com/blog/how-create-tooltips-in-d3-js/

    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 50)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

    tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
       // Adding a Legend: https://stackoverflow.com/questions/47895177/adding-a-legend-to-d3-stacked-bar-graph

    var legend = svg.selectAll(".legend")
        .data(colorStackChart.domain().slice().reverse())

        .enter().append("g")
        //.attr("class", "legend")
        .attr("class", function (d) {
            legendClassArray.push(d.replace(/\s/g, '')); //remove spaces
            return "legend";
        })
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    //reverse order to match order in which bars are stacked    
    legendClassArray = legendClassArray.reverse();


    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) { return (d == "Gold" ? "#ffd700" : d == "Silver" ? "#c0c0c0" : d == "Bronze" ? "#cd7f32" : "Black"); })
        .attr("id", function (d, i) {
            return "id" + d.replace(/\s/g, '');
        })
        .on("mouseover", function () {

           
                if (active_link === "0") d3.select(this).style("cursor", "pointer");
                else {
                    if (active_link.split("class").pop() === this.id.split("id").pop()) {
                        d3.select(this).style("cursor", "pointer");
                    } else d3.select(this).style("cursor", "auto");
                }
            
        })
        .on("click", function (d) {
        
            if (active_link === "0") { //nothing selected, turn on this selection
                console.log("hit")
                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", 2);

                active_link = this.id.split("id").pop();
                plotSingle(this);
                bigdata = this;
                //gray out the others
                for (i = 0; i < legendClassArray.length; i++) {
                    if (legendClassArray[i] != active_link) {
                        console.log(legendClassArray[i]);
                        d3.select("#id" + legendClassArray[i])
                            .style("opacity", 0.5);
                    }
                }

            } else { //deactivate
                if (active_link === this.id.split("id").pop()) {//active square selected; turn it OFF
                    d3.select(this)
                        .style("stroke", "none");

                    active_link = "0"; //reset

                    //restore remaining boxes to normal opacity
                    for (i = 0; i < legendClassArray.length; i++) {
                        d3.select("#id" + legendClassArray[i])
                            .style("opacity", 1);
                    }

                    //restore plot to original

                    restorePlot(d);

                }



            } //end active_link check
        }

        );

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

    //Legend Interactivity: http://dimplejs.org/advanced_examples_viewer.html?id=advanced_interactive_legends

    function restorePlot(d) {

        layer.selectAll("rect").forEach(function (d, i) {
            //restore shifted bars to original posn
            d3.select(d[idx])
                .transition()
                .duration(1000)
                .attr("y", y_orig[i]);
        })

        //restore opacity of erased bars
        for (i = 0; i < legendClassArray.length; i++) {
            if (legendClassArray[i] != class_keep) {
                d3.selectAll(".class" + legendClassArray[i])
                    .transition()
                    .duration(1000)
                    .delay(50)
                    .style("opacity", 1);
            }
        }

    }

    function plotSingle(d) {
        console.log("plot", d)
        bigdata = d;
        class_keep = d.id.split("id").pop();
        idx = legendClassArray.indexOf(class_keep);

        //erase all but selected bars by setting opacity to 0
        for (i = 0; i < legendClassArray.length; i++) {
            if (legendClassArray[i] != class_keep) {
                d3.selectAll(".class" + legendClassArray[i])
                    .transition()
                    .duration(500)
                    .style("opacity", 0);
               
            }
        }

        //lower the bars to start on x-axis
        y_orig = [];
        layer.selectAll("rect").forEach(function (d, i) {

            //get height and y posn of base bar and selected bar
            h_keep = d3.select(d[idx]).attr("height");
            y_keep = d3.select(d[idx]).attr("y");
            //store y_base in array to restore plot
            y_orig.push(y_keep);

            h_base = d3.select(d[0]).attr("height");
            y_base = d3.select(d[0]).attr("y");
         
            h_shift = h_keep - h_base;
            y_new = y_base - h_shift;

            //reposition selected bars
            d3.select(d[idx])
                .transition()
                .ease("bounce")
                .duration(500)
                .delay(50)
                .attr("y", y_new);

        })

    }

    

}

function ShowValue() {
    var layer = svg.selectAll(".stack")
    var rect = layer.selectAll("rect")

    rect.append("text")
        .attr("id", "texttip")
        .text(function (d) { return d3.format(".2s")(d.y1); })
        .attr("y", function (d) { return y(d.y1) + (y(d.y0) - y(d.y1)) / 2; })
        .attr("x", x.rangeBand() / 3)
        .style("fill", '#ffffff');
}

function Pause() {
    counter = 16;

}
     
function Swapper() {
    if (swapSpeed == 1000) {
        swapSpeed = 4000
    }
    else {
        swapSpeed = 1000
    }
}

function showVal() {

    val = document.getElementById("myRange").value;

}