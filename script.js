d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(function (data) {
  var dataset = data.data;
  DrawBar(dataset);
});

function DrawBar(dataset) {
  let margin = {
    top: 50,
    right: 20,
    bottom: 50,
    left: 100,
  };
  let width = 800 - margin.left - margin.right;
  let height = 400 - margin.top - margin.bottom;

  let minDate = dataset[0][0].substr(0, 4);
  minDate = new Date(minDate);
  let maxDate = dataset[dataset.length - 1][0].substr(0, 4);
  maxDate = new Date(maxDate);

  let xAxisScale = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);
  let yAxisScale = d3.scaleLinear().domain([0, d3.max(dataset, (d) => d[1])]).range([height, 0]);

  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale);

  let svg = d3
    .select("#barGraph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g").attr("transform", "translate(0," + height + ")").call(xAxis);
  svg.append("g").call(yAxis);

  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", function (d) {
      return d[0];
    })
    .attr("data-gdp", function (d) {
      return d[1];
    })
    .style("fill", "#D4AF37")
    .attr('x', function (d, i) {
      return xAxisScale(new Date(d[0]));
    })
    .attr('y', function (d) {
      return yAxisScale(d[1]);
    })
    .attr('width', width / dataset.length - 1)
    .attr('height', function (d) {
      return height - yAxisScale(d[1]);
    })
    .on('mouseover', (event, d) => mouseoverHandler(event, d))
    .on("mousemove", (event, d) => mousemovingHandler(event, d))
    .on("mouseout", (event, d) => mouseoutHandler(event, d))

  svg
    .append("g")
    .attr("id", "x-axis") // Add id="x-axis" here
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis") // Add id="y-axis" here
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -85)
    .attr("dy", "-0.8rem")
    .style("text-anchor", "end")
    .text("Value (billions)");
}

function mouseoverHandler(event, d) {
  let tooltip = d3.select("#tooltip");
  tooltip
    .style("opacity", 0.8)
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY + 15 + "px")
    .attr("data-date", d[0])
    .html('<p>Date:' + d[0] + '</p><p>Billions: ' + d[1] + "</p>");

  d3.select(event.target).style("opacity", 0.5);
}


function mouseoutHandler(event, d) {
  let tooltip = d3.select("#tooltip");
  tooltip.style("opacity", 0);
  d3.select(event.target).style("opacity", 1);
}


  function mousemovingHandler(event, d) {
    let tooltip = d3.select("#tooltip");
    tooltip
    .style("top", event.pageY - 10 + "px")
    .style("left", event.pageX + 10 + "px");
  }


