import Ember from 'ember';
import layout from '../templates/components/feature-service-ui';

var fieldsCollection = Ember.Object.extend({
  content: [],
  outFields: Ember.computed.filter('content.@each.requested', function(field, index, array) {
    return field.requested;
  }),
});

var fieldObject = Ember.Object.extend({
  requested: false
});

export default Ember.Component.extend({
  layout: layout,
  tagName: 'div',
  classNames: ['feature-service-ui'],

  dataset: null,
  featureLayerUrl: '',

  fields: Ember.computed('dataset', function() {
    var dataset = this.get('dataset');
    var fields = fieldsCollection.create();
    var f = dataset.attributes.fields.map(function(field, index, array) {
      return fieldObject.create(field);
    });

    fields.get('content').pushObjects(f);

    window.fields = fields;
    return fields;
  }),

  isAllOutFields: Ember.computed.empty('fields.outFields'),

  queryHost: Ember.computed('dataset', function() {
    return this.get('dataset').attributes.url + '/query'
  }),

  //params
  outFields: Ember.computed('fields.outFields', function() {
    let outFields = this.get('fields').get('outFields');

    let qString = outFields.map(function(field, index, array) {
      return field.name;
    }).join(',');

console.log(qString);

    return qString;
  }),

  f: 'json',

  //end of params

  queryString: Ember.computed('outFields', 'f', function() {
    let qString = '';
    if (Ember.computed.empty(this.get('outFields'))) {
      qString += 'outFields=*&';
    } else {
      var outFields = this.get('outFields').map(function(field, index, array) {
        return field.name;
      }).join(',');
      qString += 'outFields=' + outFields + '&';
    }

    qString +=  'f=' + this.get('f');

    return qString;
  }),

  queryUrl: Ember.computed('queryHost', 'queryString', function() {
    return this.get('queryHost') + '?' + this.get('queryString');
  }),

  actions: {
    query() {
      console.log('query!');
    },

    updateOutFields(updatedField) {
      if (updatedField.requested) {
        updatedField.set('requested', false);
      } else {
        updatedField.set('requested', true);
      }
    },

    clearOutFields() {
      this.get('fields').get('content').setEach('requested', false);
    }
  },

});
