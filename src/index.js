import * as d3 from 'd3';
import './main.scss';

function drawDonut(e, checkbox) {

  // mock JSON data
  let data = {
    retrieval1: [.20, .33, .44],
    retrieval2: [.44, .64],
    retrieval3: [.44, .64, .74]
  }
  
  // Setup Constants for your chart
  const width = 500
  const height = 200
  const radius = Math.min(width, height) / 2
  const donutSize = .7;
  const bgArcColor = '#ebebeb'

  // Used on event listeners.
  // Clear out previous chart and update indexes for colors, etc.
  // There's a specific way to do animations in D3 but we'll start here.
  const cycleValue = e?.target.dataset.option ? e.target.dataset.option : 'retrieval1'
  const cycleIndex = e?.target.dataset.index ? e.target.dataset.index : 1
  document.querySelector("#example").innerHTML = ""

  const viewBreakdownByTransfer = checkbox?.checked

  console.log('view breakdown', viewBreakdownByTransfer)

  let valuesInIndex = Object.values(data)[cycleIndex];
  let highestValue = valuesInIndex.at(-1)
  console.log('highest', highestValue)


  data = viewBreakdownByTransfer ? data : { [cycleValue]: [highestValue] }
  
  // 2) Colors used in mockup, with some fake ones as well
  const purples = ['#612cde', '#906be8', '#c0abf2', 'gray', 'lightgray']
  const greens = ['#22756b', '#3fc5b5', '#91ded5', 'gray', 'lightray']
  const yellows = ['#eeb040', '#f5d65f', '#f9e7a3']

  const colorMap = [ purples, greens, yellows ]

  // 3) create pie
  var pie = d3.pie()

  // 4) view console to see the results of adding our data into d3 pie.
  console.log( 'PIE', pie(data[cycleValue]) )
  
  // 5) Create SVG we're drawing, #example is in the html panel
  const svg = d3.select("#example").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  // Create color scales based on index selected (purples, greens, yellows, etc...)
  const color = d3.scaleOrdinal(colorMap[cycleIndex])
  
  // Background gray ring
  const backgroundArc = d3.arc()
    .innerRadius(radius * donutSize)
    .outerRadius(radius)
    .startAngle(0)
    .endAngle(Math.PI*2);
  
  // Individual color rings
  const arc = d3.arc()
                  .innerRadius(radius * donutSize)
                  .outerRadius(radius)
                  .startAngle( 0 )
                  .endAngle(d => (Math.PI * 2) * (d.data * 100 / 100))
  
  // a) select all is actually creating the groups here, the concept I believe is called a data join in d3.
  //     essentially telling d3 our selection named arc should be joined to the array of data?
  // b) data is logged to the console and contains the values, arcs, etc.
  // c) entering the svg to append the group with a className of arc.
  const bgArc = svg
                .append('g')
                .attr('class', 'bgArc')
                .attr('fill', 'gray')
  
  const arcs = svg
                .selectAll('arc')
                .data(pie(data[cycleValue].reverse()))
                .enter()
                .append('g')
                .attr('class', 'arc')
  
  
  
  // This could be appended but is broken up for clarity.
  // On the arcs we're adding a path with a fill from scaleOrdinal and the path from the arc above.
  bgArc.append('path').attr('fill', bgArcColor).attr('d', backgroundArc)
  arcs.append('path').attr('fill', (data , index) => color(index)).attr('d', arc)

  // Add text in center of donut
  svg.append("text")
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('class', 'center-text')
    .text("%" + data[cycleValue][0] * 100)
 };

drawDonut();
const buttons = document.querySelectorAll('button')
const checkbox = document.querySelector('[type=checkbox]')
buttons.forEach( btn => btn.addEventListener('click', (e) => drawDonut(e, checkbox)))
