/**
 * Created by Shirley on 3/18/17.
 */

var timeline, brush;
var timeSelectBegin = new Date(2007,1,21);
var timeSelectEnd = new Date(2007,4,14);
var timeBegin = new Date(2007,1,21);
var timeEnd = new Date(2015,11,14);


function bubbleChart() {

    var width = window.innerHeight+200;
    var height = window.innerHeight;
    var tooltip = floatingTooltip('gates_tooltip', 240);

    var center = { x: width / 2-50, y: height / 2 };

    var yearCenters = {
        2008: { x: width / 3, y: height / 2 },
        2009: { x: width / 2, y: height / 2 },
        2010: { x: 2 * width / 3, y: height / 2 }
    };

    var yearsTitleX = {
        2008: 160,
        2009: width / 2,
        2010: width - 160
    };


    var damper = 0.102;
    var svg = null;
    var bubbles = null;
    var nodes = [];


    function charge(d) {
        return -Math.pow(d.radius, 2.0) / 8;
    }


    var force = d3.layout.force()
            .size([width, height])
            .charge(charge)
            .gravity(-0.001)
            .friction(0.95);


    var fillColor = d3.scale.ordinal()
            .domain([-1,0,1])
            .range(['#e77777', '#ffffff','#33ffff']);


    var radiusScale = d3.scale.pow()
            .exponent(2)
            .range([2, 750]);


    function createNodes(rawData) {

        var myNodes = rawData.map(function (d) {


            return {
                id: d.id,
                radius: radiusScale(+d.desendants),
                value: d.desendants,
                name: d.title,
                author: d.author,
                group: d.sentiment,
                year: d.time,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
            };
        });

        // sort them to prevent occlusion of smaller nodes.
        myNodes.sort(function (a, b) { return b.value - a.value; });

        return myNodes;
    }

    var chart = function chart(selector, rawData) {

        var maxAmount = d3.max(rawData, function (d) { return +d.score; });
        radiusScale.domain([0, maxAmount]);

        nodes = createNodes(rawData);
        // Set the force's nodes to our newly created nodes array.
        force.nodes(nodes);

        svg = d3.select(selector)
                .append('svg')
                .attr("id","main-svg")
                .attr('width', width)
                .attr('height', height);


        // Bind nodes data to what will become DOM elements to represent them.
        bubbles = svg.selectAll('.star')
                .data(nodes, function (d) { return d.id; });


        bubbles.enter().append('circle')
                .attr('r', 0)
                .attr('fill', function (d) { return fillColor(d.group); })
                .attr('stroke', function (d) { return fillColor(d.group);})
                .attr('stroke-width', 3)
                .attr('stroke-opacity',0.5)
                .on('mouseover', showDetail)
                .on('mouseout', hideDetail);


        bubbles.transition()
                .duration(3000)
                .attr('r', function (d) { return d.radius/5; })
                .attr('stroke-width', function (d) { return d.radius/5; });

        // timeline
        drawTimeline(nodes);


        function drawTimeline(data) {
            var timelineWidth = 500;
            var timelineHeight = 20;

            timeline = d3.select("#timeline")
                    .append('svg')
                    .attr('width', 520)
                    .attr('height', 100);

            timeline.append("g")
                    .attr("width", timelineWidth)
                    .attr("height", timelineHeight)
                    .attr("class", "timeline");


            var timeXScale = d3.time.scale()
                    .domain([timeBegin, timeEnd])
                    .range([0, timelineWidth]);


            var timelineXAxis = d3.svg.axis()
                    .orient("bottom")
                    .scale(timeXScale)
                    .tickFormat(d3.time.format("%Y"));

            //draw frame
            timeline.append("rect")
                    .attr("width", timelineWidth)
                    .attr("height", timelineHeight)
                    .attr("transform", "translate(20,40)")
                    .attr("fill","#222222")
                    .attr("fill-opacity",0.5)
                    .attr("stroke-width", 1)
                    .attr("stroke", "white");

            //draw description
            timeline.append("text")
                    .attr("class", "timeline-text")
                    .attr("transform", "translate("+(timelineWidth+10)+",20)")
                    .attr("text-anchor","end")
                    .text("Timeline ("+timeBegin.toLocaleDateString()+" - "+timeEnd.toLocaleDateString()+")");

            //draw axis
            timeline.append("g")
                    .attr("class", "timeline-axis")
                    .attr("transform", "translate(20,"+(timelineHeight+40)+")")
                    .call(timelineXAxis);

            var timeData = [];
            data.forEach(function (entry) {
                var time = new Date(entry.year);
                timeData.push(time);
            });

            var	bins = d3.layout.histogram()
                    .bins(timeXScale.ticks(24*4))
                    (timeData);

            var timeYScale = d3.scale.linear()
                    .domain([200, 0])
                    .range([0, timelineHeight]);

            var area = d3.svg.area()
                    .x(function(d) { return (timeXScale(d.x)+20); })
                    .y0(timelineHeight+40)
                    .y1(function(d) { return timeYScale(d.y)+40; });

            timeline.append("path")
                    .datum(bins)
                    .attr("class", "area")
                    .attr("d", area)
                    .attr("fill","white")
                    .attr("fill-opacity",1)
                    .attr("stroke","white");


            //brush
            brush = d3.svg.brush()
                    .x(timeXScale)
                    .on("brush", updateTime);
            //draw brush
            timeline.append("g")
                    .attr("class", "brush")
                    .call(brush)
                    .selectAll("rect")
                    .attr("y", 1)
                    .attr("height", timelineHeight - 1)
                    .attr("transform", "translate(20,40)")
                    .attr("fill","rgba(255,255,255,0.7)")
                    .attr("stroke-width", 2)
                    .attr("stroke", "#ffffff");
        }


        function updateTime() {
            timeline.select(".brush")
                    .call(brush.extent([brush.extent()[0], brush.extent()[1]]));
            timeSelectBegin = brush.extent()[0];
            timeSelectEnd = brush.extent()[1];
            d3.select(".timeline-text").text(timeSelectBegin.toLocaleDateString()+" "+timeSelectBegin.toLocaleTimeString()
                    +" - "+timeSelectEnd.toLocaleDateString()+" "+timeSelectEnd.toLocaleTimeString());
            //update data
            updateCloudData(nodes);

        }

        function updateCloudData(data) {


            svg.selectAll("circle")
                    .data(data)
                    .attr("display", function (d) {

                        var time = new Date(d.year*1000);
                        if (time < timeSelectEnd && time > timeSelectBegin) {
                            //display

                            return "block";
                        } else {
                            //hide
                            return "none";
                        }

                    });
        }


        // Set initial layout to single group.
        groupBubbles();
    };


    function groupBubbles() {
        hideYears();

        force.on('tick', function (e) {
            bubbles.each(moveToCenter(e.alpha))
                    .attr('cx', function (d) { return d.x; })
                    .attr('cy', function (d) { return d.y; });
        });

        force.start();
    }


    function moveToCenter(alpha) {
        return function (d) {
            d.x = d.x + (center.x - d.x) * damper * alpha;
            d.y = d.y + (center.y - d.y) * damper * alpha;
        };
    }


    function splitBubbles() {
        showYears();

        force.on('tick', function (e) {
            bubbles.each(moveToYears(e.alpha))
                    .attr('cx', function (d) { return d.x; })
                    .attr('cy', function (d) { return d.y; });
        });

        force.start();
    }

    function moveToYears(alpha) {
        return function (d) {
            var target = yearCenters[d.year];
            d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
            d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
        };
    }

    /*
     * Hides Year title displays.
     */
    function hideYears() {
        svg.selectAll('.year').remove();
    }

    /*
     * Shows Year title displays.
     */
    function showYears() {
        // Another way to do this would be to create
        // the year texts once and then just hide them.
        var yearsData = d3.keys(yearsTitleX);
        var years = svg.selectAll('.year')
                .data(yearsData);

        years.enter().append('text')
                .attr('class', 'year')
                .attr('x', function (d) { return yearsTitleX[d]; })
                .attr('y', 40)
                .attr('text-anchor', 'middle')
                .text(function (d) { return d; });
    }


    /*
     * Function called on mouseover to display the
     * details of a bubble in the tooltip.
     */
    function showDetail(d) {
        // change outline to indicate hover state.
        d3.select(this).attr('stroke', 'white')
                    .style("cursor", "pointer");

        var content = '<p><span class="name">Title: </span><span class="value">' +
                d.name +
                '</span></p>'+
                '<p><span class="name">Author: </span><span class="value">' +
                d.author +
                '</span></p>';
        tooltip.showTooltip(content, d3.event);

        d3.select("#detail").style("display","block");
        d3.select("#detail-title").html(d.name);
        d3.select("#detail-author").html("Author: "+d.author);
        d3.select("#detail-comments").html("Comments: "+d.value);
        d3.select("#detail-date").html(timeConverter(d.year));
        var url = "image/"+d.id+".png";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4 && xhr.status == 200){
                document.getElementById("wordcloud-img").src = "image/"+d.id+".png";
            }
        };
        xhr.open("GET",url,true);
        xhr.send();

    }


    function hideDetail(d) {
        // reset outline
        d3.select(this)
                .attr('stroke', d3.rgb(fillColor(d.group)).darker())
                .style("cursor", "default");
        d3.select("#detail").style("display","none");
        document.getElementById("wordcloud-img").src = "image/temp.png";
        tooltip.hideTooltip();
    }


    chart.toggleDisplay = function (displayName) {
        if (displayName === 'year') {
            splitBubbles();
        } else {
            groupBubbles();
        }
    };


    // return the chart function from closure.
    return chart;
}

var myBubbleChart = bubbleChart();


function display(error, data) {
    if (error) {
        console.log(error);
    }
    myBubbleChart('#main-view', data);
}



function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month+ '-' + date  + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

//load data
d3.tsv('data/stories_senti_3000.tsv', display);
// d3.tsv('data/stories.tsv', display);