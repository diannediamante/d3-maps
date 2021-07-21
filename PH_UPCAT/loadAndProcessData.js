import { feature } from 'topojson';
import { csv, json } from 'd3';

export const loadAndProcessData = () => 
  Promise
    .all([
      csv('https://raw.githubusercontent.com/diannediamante/geojson/main/UPCAT2018AppQual.csv'),
      json('https://raw.githubusercontent.com/faeldon/philippines-json-maps/master/2011/geojson/regions/lowres/regions.0.001.json')
    ])
    .then(([csvData, topoJSONdata]) => {
      const rowById = csvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d;
        return accumulator;
      }, {});

      const countries = feature(topoJSONdata, topoJSONdata.objects.countries);

      countries.features.forEach(d => {
        Object.assign(d.properties, rowById[d.id]);
      });

      return countries;
    });
