import Ember from 'ember';
import layout from '../templates/components/feature-service-ui';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'div',
  classNames: ['feature-service-ui'],

  dataset: null,
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

  queryString: Ember.computed('outFields', 'f', function() {
    return this.get('queryHost') + '?' + this.get('outFields') + '&' + this.get('f');
  }),

  isAllOutFields: Ember.computed('outFields', function() {
    return this.get('outFields') === 'outFields=*';
  }),

  // params
  //
  // defaults
  outFields: 'outFields=*',
  f: 'f=json',

  actions: {
    query() {
      console.log('query!');
    },

    updateOutFields(updatedField) {
      updatedField.toggleProperty('requested');
      console.log(updatedField.get('name'));
      let outFields = '';

      let requestedFields = this.get('fields').
        filterBy('requested', true).
        map(function(field, index, array) {
          return field.get('name');
        });
      console.log(requestedFields);

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
    }
  },

});
