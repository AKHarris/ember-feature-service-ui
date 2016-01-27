import Ember from 'ember';
import layout from '../templates/components/feature-service-ui';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'div',
  classNames: ['feature-service-ui'],

  isSpatialQuery: false,
  displayLayerMetadata: true,
  isStatisticsRequest: false,

  // dummy methods
  requestSent: false,
  responseBlockRender: Ember.computed('requestSent', function() {
    if (this.get('requestSent')) {
      return 'display: block;';
    } else {
      return 'display: hidden;';
    }
  }),

  // dataset object
  dataset: null,

  // This component will be able to fetch and cook its own dataset if need be 
  featureLayerUrl: '',

  fields: Ember.computed('dataset', function() {
    var dataset = this.get('dataset');
    var fields = dataset.attributes.fields.map(function(field, index, array) {
      var f = Ember.Object.create(field);
      f.set('requested', false);
      return f;
    });

    window.fields = fields;
    return fields;
  }),

  queryHost: Ember.computed('dataset', function() {
    return this.get('dataset').attributes.url + '/query'
  }),

  queryString: Ember.computed('where', 'objectIds', 'outFields', 'f', 'isSpatialQuery', 'geometryType', 'geometry', 'spatialRel', 'inSR', 'distance', 'units', 'returnGeometry', 'isStatisticsRequest', function() {
    let query = this.get('queryHost') + '?' + 'where=' + this.get('where') + '&' + this.get('outFields');

    if (this.get('isStatisticsRequest')) {
      query += '&groupByFieldsForStatistics=' + this.get('groupByFieldsForStatistics');
      query += '&outStatistics=' + this.get('outStatistics');
    } else {
      if (this.get('objectIds').length > 0) {
        query += '&objectIds=' + this.get('objectIds');
      }
  
      if (this.get('isSpatialQuery')) {
        query += '&geometryType=' + this.get('geometryType');
        query += '&geometry=' + this.get('geometry');
        query += '&spatialRel=' + this.get('spatialRel');
        query += '&inSR=' + this.get('inSR');
      }

    query += '&returnGeometry=' + this.get('returnGeometry');
    }

    return query + '&' + this.get('f');
  }),

  isAllOutFields: Ember.computed('outFields', function() {
    return this.get('outFields') === 'outFields=*';
  }),

  // **params**
  where: '1=1',
  objectIds: '',
  outFields: 'outFields=*',
  f: 'f=json',

  // *spatial params*
  geometry: Ember.computed('dataset', function() {
    let geo; 
    geo = this.get('dataset').attributes.extent.coordinates.map(function(coord, index, array) {
      return coord.join(',');
    }).join(',');

    return geo;
  }),

  geometryType: 'esriGeometryEnvelope', // default to 'esriGeometryEnvelope'
  geometryTypes: [
    'esriGeometryEnvelope',
    'esriGeometryPolygon',
    'esriGeometryPolyline',
    'esriGeometryMultipoint',
    'esriGeometryPoint'
  ],
 
  spatialRel: 'esriSpatialRelIntersects',
  spatialRels: [
    'esriSpatialRelIntersects',
    'esriSpatialRelCrosses',
    'esriSpatialRelEnvelopeIntersects',
    'esriSpatialRelIndexIntersects',
    'esriSpatialRelOverlaps',
    'esriSpatialRelTouches',
    'esriSpatialRelWithin',
    'esriSpatialRelRelation'
  ],

  inSR: '4326',

  distance: '',
  units: '',
  _units: [
    'esriSRUnit_Meter',
    'esriSRUnit_StatuteMile',
    'esriSRUnit_Foot',
    'esriSRUnit_Kilometer',
    'esriSRUnit_NauticalMile',
    'esriSRUnit_USNauticalMile'
  ],

  // end-of-spatial-params
  // *return-params*
  returnGeometry: true,

  // TODO: params to implement
  // 
  // 1. maxAllowableOffset
  // 2. geometryPrecision
  // 3. outSR
  // 4. gdbVersion
  // 5. returnDistinctValues
  // 6. returnIdsOnly
  // 7. returnCountOnly
  // 8. returnExtentOnly


  // *stats params*
  orderByFields: '',
  groupByFieldsForStatistics: '',
  outStatistics: '',
  // end-of-stats-parasm
  // end-of-params

  actions: {
    query() {
      console.log('query!');
    },

    updateOutFields(updatedField) {
      updatedField.toggleProperty('requested');
      let outFields = '';

      let requestedFields = this.get('fields').filterBy('requested', true).map(function(field, index, array) {
          return field.get('name');
      });

      if (requestedFields.length === 0) {
        outFields = 'outFields=*';
      } else {
        outFields = 'outFields=' + requestedFields.join(',');
      }

      this.set('outFields', outFields);
    },

    clearOutFields() {
      this.get('fields').setEach('requested', false);
      this.set('outFields', 'outFields=*');
    },

    toggleSpatialQuery() {
      window.dataset = this.get('dataset');
      this.toggleProperty('isSpatialQuery');
    },

    selectSpatialRel(rel) {
      this.set('spatialRel', rel);
    },

    selectGeometryType(type) {
      this.set('geometryType', type);
    },

    selectInSR(inSR) {
      this.set('inSR', inSR);
    },

    selectUnit(unit) {
      this.set('unit', unit);
    },

    toggleReturnGeometry() {
      this.toggleProperty('returnGeometry');
    },

    toggleStatisticsRequest() {
      console.log('boom');
      this.toggleProperty('isStatisticsRequest');
    }
  },

});
