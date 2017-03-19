/**
 * Created by Shirley on 3/18/17.
 */

// var timeline, brush;
// var timeSelectBegin = new Date(2007,2,21);
// var timeSelectEnd = new Date(2007,4,14);
// var timeBegin = new Date(2007,2,21);
// var timeEnd = new Date(2015,10,14);
//
// function drawTimeline(data) {
//     var timelineWidth = 500;
//     var timelineHeight = 100;
//
//     timeline = d3.select("#timeline")
//             .append('svg')
//             .attr('width', 520)
//             .attr('height', 200);
//
//     timeline.append("g")
//             .attr("width", timelineWidth)
//             .attr("height", timelineHeight)
//             .attr("class", "timeline");
//
//
//     var timeXScale = d3.time.scale()
//             .domain([timeBegin, timeEnd])
//             .range([0, timelineWidth]);
//
//
//     var timelineXAxis = d3.svg.axis()
//             .orient("bottom")
//             .scale(timeXScale)
//             .tickFormat(d3.time.format("%H:%M"));
//
//     //draw frame
//     timeline.append("rect")
//             .attr("width", timelineWidth)
//             .attr("height", timelineHeight)
//             .attr("transform", "translate(20,40)")
//             .attr("fill","transparent")
//             .attr("stroke-width", 1)
//             .attr("stroke", "white");
//
//     //draw description
//     timeline.append("text")
//             .attr("class", "timeline-text")
//             .attr("transform", "translate(20,20)")
//             .text(timeBegin.toLocaleDateString());
//
//     //draw axis
//     timeline.append("g")
//             .attr("class", "timeline-axis")
//             .attr("transform", "translate(20,"+(timelineHeight+40)+")")
//             .call(timelineXAxis);
//
//     var timeData = [];
//     data.forEach(function (entry) {
//         var time = new Date(entry.year);
//         timeData.push(time);
//     });
//
//     var	bins = d3.layout.histogram()
//             .bins(timeXScale.ticks(24*4))
//             (timeData);
//
//     var timeYScale = d3.scale.linear()
//             .domain([200, 0])
//             .range([0, timelineHeight]);
//
//     var area = d3.svg.area()
//             .x(function(d) { return (timeXScale(d.x)+20) ; })
//             .y0(timelineHeight+40)
//             .y1(function(d) { return timeYScale(d.y)+40; });
//
//     timeline.append("path")
//             .datum(bins)
//             .attr("class", "area")
//             .attr("d", area)
//             .attr("fill","white")
//             .attr("fill-opacity",0.3)
//             .attr("stroke","white");
//
//
//     //brush
//     brush = d3.svg.brush()
//             .x(timeXScale)
//             .on("brush", updateTime);
//     //draw brush
//     timeline.append("g")
//             .attr("class", "brush")
//             .call(brush)
//             .selectAll("rect")
//             .attr("y", 1)
//             .attr("height", timelineHeight - 1)
//             .attr("transform", "translate(20,40)")
//             .attr("fill","rgba(255,255,255,0.3)")
//             .attr("stroke-width", 2)
//             .attr("stroke", "#ff6666");
//
//
// }
//
//
// function updateTime() {
//     timeline.select(".brush")
//             .call(brush.extent([brush.extent()[0], brush.extent()[1]]));
//     timeSelectBegin = brush.extent()[0];
//     timeSelectEnd = brush.extent()[1];
//
//     d3.select(".timeline-text").text(timeBegin.toLocaleDateString()+" "+timeSelectBegin.toLocaleTimeString()
//             +" - "+timeSelectEnd.toLocaleTimeString());
//
//     //update data
//     updateCloudData();
//
// }
//
// function updateCloudData(data) {
//     svg.selectAll("circle")
//             .data(data)
//             .attr("display", function (d) {
//                 var time = new Date(d.year);
//                 if (time < timeSelectEnd && time > timeSelectBegin) {
//                    //display
//                     return "inherit";
//                 } else {
//                     //hide
//                     return "none";
//                 }
//
//             });
// }
