(function (d3,topojson) {

  Promise
    .all([
      d3.csv('https://raw.githubusercontent.com/diannediamante/geojson/main/UPCAT2018AppQual.csv'),
      d3.json('https://raw.githubusercontent.com/faeldon/philippines-json-maps/master/2011/geojson/regions/lowres/regions.0.001.json')
    ])
    .then(update); 
    
  const colorLegend = (selection, props) => {
    const {                      
      colorScale,                
      circleRadius,
      spacing,                   
      textOffset,
      backgroundRectWidth        
    } = props;                   
    

    //for the legend
    const backgroundRect = selection.selectAll('rect')
      .data([null]);             
    const n = colorScale.domain().length; 
    backgroundRect.enter().append('rect')
      .merge(backgroundRect)
        .attr('x', -circleRadius * 2)   
        .attr('y', -circleRadius * 2)   
        .attr('rx', circleRadius * 2)   
        .attr('width', backgroundRectWidth * 1.75)
        .attr('height', spacing * n + circleRadius * 2) 
        .attr('fill', 'white')
        .attr('opacity', 0.8)
        .attr("stroke", "black")
    

    const groups = selection.selectAll('.tick')
      .data(colorScale.domain());
    
    const groupsEnter = groups
      .enter().append('g')
      .attr('class', 'tick');
    groupsEnter
      .merge(groups)
      .attr('transform', (d, i) =>    
        `translate(0, ${i * spacing})`  
      );
    groups.exit().remove();
    
    groupsEnter.append('circle')
      .merge(groups.select('circle')) 
        .attr('r', circleRadius)
        .style('fill', colorScale);      
    
    
    groupsEnter.append('text')
      .merge(groups.select('text'))   
        .text(d => d)
        .attr('dy', '0.32em')
        .attr('x', textOffset);
  };



  const svg = d3.select('svg');
  const projection = d3.geoNaturalEarth1()
    .center([120, 9])
    .scale(2800)
    .translate([520, 500]);

  const pathGenerator = d3.geoPath()
    .projection(projection);


  const g = svg.append('g');

  const colorLegendG = svg.append('g')
      .attr('transform', `translate(40,310)`);


  g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));
    

  

  svg.call(d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
  }));

  const colorScale = d3.scaleOrdinal();


  const colorValue = d => d.region;

  function update (regions){
    colorScale
      .domain(regions[0].map(colorValue))
      .range(["#FF0000","#00FFFF","#0000FF","#00008B","#ADD8E6","#FFA500", "#800080","#A52A2A","#FFFF00","#800000","#00FF00","#008000","#FF00FF","#808000", "#FFC0CB","#7FFD4", "#FF6700"])
    
    colorLegendG.call(colorLegend, {
      colorScale,
      circleRadius: 8,
      spacing: 20,
      textOffset: 12,
      backgroundRectWidth: 235
  });


    g.selectAll('path').data(regions[1].features)
      .enter().append('path')
        .attr('class', 'region')
        .attr('d', pathGenerator)
        .data(regions[0])
        .attr('fill', d => colorScale(colorValue(d)))
      .append('title')
        .text(d => d.region + ': ' + "Applicants: " + d.applicants + ", Qualifiers: " + d.qualifiers + ", Percentage: " + d.percentage + "%");
  };

}(d3,topojson));


