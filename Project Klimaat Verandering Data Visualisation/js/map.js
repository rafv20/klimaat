
// set the dimensions and margins of the graph

var margin = { top: 20, right: 10, bottom: 40, left: 100 },
  width = 900 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// The svg
var svg = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");



//tooltip
var tooltip = d3.select("#tooltip")




// Map and projection
//var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(520)
  .center([0, 50])
  .translate([width / 2 - margin.left, height / 1.5]);

// Data and color scale
var data = d3.map();
console.log(data);
// var data = new Set()
//var my_domain = [100000, 1000000, 10000000, 30000000, 100000000, 500000000]
// var domain = [20, 250]
// var labels = ["< 100 M", "100 M - 500 M", "> 500 M"]
// var range = ["#F8CAEE", "#BF76AF", "#852170"]
// var colorScale = d3.scaleThreshold()
//   .domain(domain)
//   .range(range);

// Time
// var slider = document.getElementById("myRange");
// var output = document.getElementById("value");

// output.innerHTML = slider.value;
// slider.oninput = function() {
//   output.innerHTML = this.value;
//   selectedYear = this.value

// console.log(selectedYear)
var csv;

// slider
var slider = document.getElementById("SliderRange");
var output = document.getElementById("monthValue");
slider.oninput = function () {
  output.innerHTML = this.value;
  drawMap();
};
var s;
function myFunction() {

  output.innerHTML = slider.value;
  s = slider.value;
  document.getElementById('SliderRange').addEventListener('input', myFunction);
}
myFunction();



// var promises = []
// promises.push(d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"))
// promises.push(d3.csv('https://raw.githubusercontent.com/rafv20/klimaat/main/carbon-new-passenger-vehicles.csv'), function (d) { 
//   console.log(d)
//   data.set(d.code, +d.co2)
// })

function getCO2(key) {
  let result = "";
  for (d of globalData) {
    if (d.code == key && d.year == s) result = d.co2
  }
  return result;
}

let globalTopo;
let globalData;

d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (topo) {
  d3.csv("https://raw.githubusercontent.com/rafv20/klimaat/main/carbon-new-passenger-vehicles.csv").then(function (data2) {
    globalData = data2;
    globalTopo = topo;
    drawMap();
  });
});


function drawMap() {
  let mouseOver = function (d) {
    d3.selectAll(".topo")
      .transition()
      .duration(200)
      .style("opacity", 0.5)

    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
      .style("stroke-width", 1)

    let total = getCO2(d.id);
    let country = d.properties.name;

    if (total > 0) {
      tooltip
        .style("opacity", 1)
        .html(`<b>${country}
                  </br> <sub><i><small>AVERAGE EMISSION PER CAR</small></i></sub>
                  </br> <strong> ${total} </strong>gram
                  `)
    }
    else {
      tooltip
        .style("opacity", 1)
        .html(`
                    <b>${country}</b>
                    </br> <i><small>No emission data available.</small></i>`)
    }
    tooltip
      .style("left", (d3.event.pageX) + 15 + "px")
      .style("top", (d3.event.pageY - 50) + "px");
    d3.select("#annotation")
      .style("opacity", 0);
  }

  let mouseLeave = function (d) {
    d3.selectAll(".topo")
      .transition()
      .duration(200)
      .style("opacity", 1)

    d3.selectAll(".topo")
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "white")

    d3.select("#annotation")
      .style("opacity", 1)

    tooltip
      .style("opacity", .0)
  }

  // Draw the map
  let update = svg.selectAll("path").data(globalTopo.features)
    .attr("fill", function (d) {
      console.log(d);
      let total = getCO2(d.id);

      if (total <= 50) {
        return "rgb(17, 17, 17)"
      } else if (total <= 75) {
        return "rgb(255, 255, 178)"
      }
      else if (total <= 100) {
        return "rgb(254, 217, 118)"
      } else if (total <= 110) {
        return "rgb(254, 178, 76)"
      } else if (total <= 120) {
        return "rgb(253, 141, 60)"
      } else if (total <= 130) {
        return "rgb(240, 59, 32)"
      } else if (total <= 150) {
        return "rgb(189, 0, 38)"
      } else {
        return "rgb(112, 0, 23)"
      }
    })

  let enter = update.enter()
    .append("path")
    .attr("class", "topo")
    // draw each country
    .attr("d", d3.geoPath()
      .projection(projection)
    )

    // set the color of each country
    .style("opacity", 1)
    .style("stroke", "white")

    .attr("fill", function (d) {
      let total = getCO2(d.id);
      if (total <= 50) {
        return "rgb(17, 17, 17)"
      } else if (total <= 75) {
        return "rgb(255, 255, 178)"
      }
      else if (total <= 100) {
        return "rgb(254, 217, 118)"
      } else if (total <= 110) {
        return "rgb(254, 178, 76)"
      } else if (total <= 120) {
        return "rgb(253, 141, 60)"
      } else if (total <= 130) {
        return "rgb(240, 59, 32)"
      } else if (total <= 150) {
        return "rgb(189, 0, 38)"
      } else {
        return "rgb(112, 0, 23)"
      }
    })

    .style("opacity", 1)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .style("opacity", 1)

  var map = d3.select("#map")
    .call(d3.zoom().on("zoom", function () {
      svg.attr("transform", d3.event.transform)
    }))
  map
}
