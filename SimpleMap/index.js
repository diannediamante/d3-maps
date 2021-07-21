import { select, json, geoPath, geoMercator } from 'd3';
import { feature } from 'topojson';

const svg = select('svg')

// const width = +svg.attr('width')
// const height = +svg.attr('height')

const projection = geoMercator();
const pathGenerator = geoPath().projection(projection);

json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
    .then(data => {
        const countries = feature(data, data.objects.countries);
        // console.log(countries);

        svg.selectAll('path')
            .data(countries.features)
            .enter().append('path')
            .attr('d', pathGenerator)
    })