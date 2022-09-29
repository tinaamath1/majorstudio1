    // set the dimensions and margins of the graph
var margin = {top: 100, right: 200, bottom: 0, left: 0},
    width = 1300,
    height = 400;

// The svg

var svg = d3.select("svg")
    .attr("width", 100 + width + (margin.left + margin.right))
    .attr("height", 300 + height + (margin.top + margin.bottom))
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  


// create a tooltip
    var tooltip = d3.select("#tooltip")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute")
 

      
// Map and projection
//var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(200)
  .center([0,20])
  .translate([width / 2 - margin.left, height / 2]);

// Data and color scale
var data = d3.map();

//var my_domain = [10, 25, 50, 100, 250, 500, 1000, 2000]
var domain = [0, 2000]
var labels = ["0-10", "10-25","25-50","50-100","100-250","250-500","500-1000","1000-2000"]
var range = ["#E97452","#D65D42","#C34632","#9E1711","#8B0001"]
var colorScale = d3.scaleThreshold()
  .domain(domain),
  .range(range);


var promises = []
promises.push(d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"))
promises.push(d3.csv("https://raw.githubusercontent.com/tinaamath1/majorstudio1d/main/data/2017_mortality_parse.csv", function(d) { data.set(d.geoAreaName, +d.value); }))


myDataPromises = Promise.all(promises).then(function(topo) {


    
    let mouseOver = function(d) {
        d3.selectAll(".topo")
            
            .transition()
            .duration(200)
            .style("opacity", .5)
            
        
        d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "black")
      
        d.total = data.get(d.id) || 0;
        
        tooltip
            .style("opacity", 0.8)
            .html(d.id + ": " + d3.format(",.2r")(d.total))
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
            
        d3.select("#annotation")
        .style("opacity", 0)    
        

  }

  let mouseLeave = function(d) {
    d3.selectAll(".topo")
      .transition()
      .duration(200)
      .style("opacity", .7)
      
    d3.selectAll(".topo")
      .transition()
      .duration(200)
      .style("stroke", "transparent")
      
    d3.select("#annotation")
        .style("opacity", 1)
      
    tooltip
          .style("opacity", 0)
  }

    var topo = topo[0]

    // Draw the map
    svg.append("g")
        .selectAll("path")
        
        .data(topo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        })
        .style("opacity", .7)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
      
      
    // legend
    var legend_x = width - margin.left
    var legend_y = height - 30
    svg.append("g")
        .attr("class", "legendQuant")
        .attr("transform", "translate(" + legend_x + "," + legend_y+")");

    var legend = d3.legendColor()
        .labels(labels)
        .title("Maternal Mortality Ratio")
        .scale(colorScale)
    
    
     svg.select(".legendQuant")
        .call(legend);



// Add annotation to the chart
const makeAnnotations = d3.annotation()
  .annotations(annotations)

  svg.append("g")
  .style("opacity", 1)
  .attr("name", "annotation")
  .call(makeAnnotations)

    })


    
   