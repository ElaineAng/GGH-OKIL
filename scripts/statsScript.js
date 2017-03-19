
// Create the dc.js chart objects & link to div
var dataTable = dc.dataTable("#dc-table-graph");
var scoreChart = dc.barChart("#dc-score-chart");
var descendantsChart = dc.barChart("#dc-descendants-chart");
var dayOfWeekChart = dc.rowChart("#dc-dayweek-chart");
var islandChart = dc.pieChart("#dc-island-chart");
var timeChart = dc.lineChart("#dc-time-chart");

// load data from a csv file
d3.csv("data/stories-stat.csv", function (data) {
//  console.log(data);

  // format our data
  var dtgFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
  var dtgFormat2 = d3.time.format("%a %e %b %H:%M");
        
  data.forEach(function(d) { 
//    console.log(d);
//    console.log(d["time_ts"]);//2015-01-17 00:33:00 UTC
//    console.log(d);
//       console.log(d["title"]);
    d.dtg1  = d["times_ts"].substr(0,10) + " " + d["times_ts"].substr(11,8);
//    console.log(d.dtg1); //2015-07-11 10:57:41
    d.dtg   = dtgFormat.parse(d["times_ts"].substr(0,19));
//    console.log(d.dtg); //Sat Jul 11 2015 10:57:41 GMT+0800 (CST)
    d.descendants = +d.descendants;
//    console.log(d.descendants);
    d.score   = +d.score;
//    console.log(d.score);
  });

  // Run the data through crossfilter and load our 'facts'
  var facts = crossfilter(data);
  var all = facts.groupAll();

  // for score
  var scoreValue = facts.dimension(function (d) {
    return d.score;       // add the score dimension
  });
    
  var scoreValueGroupSum = scoreValue.group()
    .reduceSum(function(d) { return d.score; });	// sums 
  var scoreValueGroupCount = scoreValue.group()
    .reduceCount(function(d) { return d.score; }) //counts 

  // for descendants
  var descendantsValue = facts.dimension(function (d) {
    return d.descendants;
  });
  var descendantsValueGroup = descendantsValue.group();

  // time chart
  var volumeByDay = facts.dimension(function(d) {
    return d3.time.day(d.dtg);
  });
  var volumeByDayGroup = volumeByDay.group()
    .reduceCount(function(d) { return d.dtg; });

  // row chart Day of Week
  var dayOfWeek = facts.dimension(function (d) {
    var day = d.dtg.getDay();
    switch (day) {
      case 0:
        return "0.Sun";
      case 1:
        return "1.Mon";
      case 2:
        return "2.Tue";
      case 3:
        return "3.Wed";
      case 4:
        return "4.Thu";
      case 5:
        return "5.Fri";
      case 6:
        return "6.Sat";
    }
  });
  var dayOfWeekGroup = dayOfWeek.group();
    
  // Pie Chart
  var islands = facts.dimension(function (d) {
    if (d.sentiment > 0)
      return "positive";
    else if (d.sentiment == 0)
      return "neutral";
    else 
      return "negative";
    });
  var islandsGroup = islands.group();


  // Create datatable dimension
  var timeDimension = facts.dimension(function (d) {
    return d.dtg;
  });

  // Setup the charts

  // count all the facts
  dc.dataCount(".dc-data-count")
    .dimension(facts)
    .group(all);

//  console.log(scoreValue);
    
  // Score Bar Graph Counted
  scoreChart.width(480)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(scoreValue)
    .group(scoreValueGroupCount)
	.transitionDuration(500)
    .centerBar(true)	
    .x(d3.scale.linear().domain([70,3100]))
	.elasticY(true)
	.xAxis().tickFormat();	

  // descendants bar graph
  descendantsChart.width(480)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(descendantsValue)
    .group(descendantsValueGroup)
	.transitionDuration(500)
    .centerBar(true)	
    .x(d3.scale.linear().domain([70, 1100]))
	.elasticY(true)
	.xAxis().tickFormat(function(v) {return v;});


    
  // time graph
  timeChart.width(960)
    .height(150)
    .transitionDuration(500)
//    .mouseZoomable(true)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(volumeByDay)
    .group(volumeByDayGroup)
//    .brushOn(false)			// added for title
    .title(function(d){
      return dtgFormat2(d.data.key)
      + "\nNumber of Events: " + d.data.value;
      })
	.elasticY(true)
    .x(d3.time.scale().domain(d3.extent(data, function(d) { return d.dtg; }))) //Thu Apr 19 2012 12:53:21 GMT+0800 (CST)
    .xAxis();

  // row chart day of week
  dayOfWeekChart.width(300)
    .height(220)
    .margins({top: 5, left: 10, right: 10, bottom: 20})
    .dimension(dayOfWeek)
    .group(dayOfWeekGroup)
    // .colors(d3.scale.category10())
    .colors(["#8082C7","#9fcae0","#8082C7","#9fcae0","#8082C7","#9fcae0","#8082C7"])
    .label(function (d){
       return d.key.split(".")[1];
    })
    .title(function(d){return d.value;})
    .elasticX(true)
    .xAxis().ticks(4);
    
  // islands pie chart
  islandChart.width(250)
    .height(220)
    .radius(100)
    .innerRadius(30)
    .dimension(islands)
    .title(function(d){return d.value;})
    .group(islandsGroup);

  // Table of data
  dataTable.width(960).height(800)
//    .dimension(timeDimension)
    .dimension(descendantsValue)
	.group(function(d) { return "Top 10 stories by number of comments"
	 })
	.size(10)
    .columns([
        function (d) {
            if(d.url.length>5){
                return d.title + "<a style='color: #413f80' href='"+d.url+"'> >> Link >></a>";
            }else{
                return d.title;
            }

        },
      function(d) { return d.author},
      function(d) { return d.descendants; },
      function(d) { return d.score; },
      function(d) { if (d.sentiment == 1) {
                        return "positive"
                    }else if(d.sentiment == 0) {
                        return "neutral"
                    }else{
                        return "negative"
                    }}]);
  
//    .sortBy(function(d){ return d.descendants; })
//    .order(d3.ascending);

  // Render the Charts
  dc.renderAll();
  
});
  