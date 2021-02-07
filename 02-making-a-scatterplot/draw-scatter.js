async function drawScatter() {
  // Access data
  let dataset = await d3.json("../data/my_weather_data.json");

  const xAccessor = (d) => d.dewPoint;
  const yAccessor = (d) => d.humidity;

  // Create chart dimensions
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

  let dimensions = {
    width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // Draw canvas
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // Create scales
  // const xScale = d3.scaleLinear();

  // The concept behind scales

  //   • what inputs it will need to handle (domain), and
  //   • what outputs we want back (range).

  // Finding the extents
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  // Draw data
  bounds
    .append("circle")
    .attr("cx", dimensions.boundedWidth / 2)
    .attr("cy", dimensions.boundedHeight / 2)
    .attr("r", 5);

  dataset.forEach((d) => {
    bounds
      .append("circle")
      .attr("cx", xScale(xAccessor(d)))
      .attr("cy", yScale(yAccessor(d)))
      .attr("r", 5);
  });

  // Data joins
  // const dots = bounds
  //   .selectAll("circle")
  //   .data(dataset)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", (d) => xScale(xAccessor(d)))
  //   .attr("cy", (d) => yScale(yAccessor(d)))
  //   .attr("r", 5)
  //   .attr("fill", "cornflowerblue");

  // Data join exercise
  function drawDots(dataset) {
    const dots = bounds.selectAll("circle").data(dataset);
    dots
      .join("circle")
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(colorAccessor(d)));
  }
  setTimeout(() => {
    drawDots(dataset);
  }, 1000);

  // Draw peripherals
  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew point (&degF)");

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);
  const yAxis = bounds.append("g").call(yAxisGenerator);

  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Relative humidity")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle");

  // Initialize interactions

  // Extra credit: adding a color scale
  const colorAccessor = (d) => d.cloudCover;
  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(["skyblue", "darkslategrey"]);
}

drawScatter();
