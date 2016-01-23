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

    return fields;
  }),

  isAllOutFields: Ember.computed.empty('fields.outFields'),

  params: Ember.Object.create({
    outFields: {},
    f: 'json',
  }),

  queryHost: Ember.computed('dataset', function() {
    return this.get('dataset').attributes.url + '/query'
  }),

  queryString: '',

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

      this._outFieldsQueryString();
    },

    clearOutFields() {
      this.get('fields').get('content').setEach('requested', false);
      this._outFieldsQueryString();
    }
  },

  _outFieldsQueryString: function() {
    var _params;
    console.log(this.get('isAllOutFields'));
    if (this.get('isAllOutFields')) {
      this.set('queryString', 'outFields=*');
    } else {
      _params = this.get('fields').get('outFields').map(function(field, index, array) {
        return field.name;
      });
    }

    var qs = 'outFields=' + _params;
    console.log(qs);

    this.set('queryString', qs);
  },

});
