function datasetFilter (options) {

  /* 
    options: {
      dataset: [{val: 'abc', _id: '123'}, {val: 'def', _id: '456'}]
      queryKey: 'val'
      updateCallback: function() { console.log('dataset updated!') }
    }
  */

  this.seshId = String(Math.round(Math.random()*10000));

  this.setDefaults();

  this.dataset = options.dataset;
  this.updateCallback = options.updateCallback;

  this.engine = new Bloodhound({
    local: this.dataset,
    datumTokenizer: function(d) {
      return Bloodhound.tokenizers.whitespace(d[options.queryKey]);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: this.dataset.length
  });

  this.engine.initialize();

  Deps.autorun(function(c) {
    this.c1 = c;

    var datas = [];
    var filterQuery = Session.get('filterQuery' + this.seshId);

    if ( filterQuery ) {
      this.engine.get(filterQuery, function(datas2) {
        datas2.forEach(function(data) {
          datas.push(data);
        });
      });
    }
    if ( datas.length < 1 ) {
      datas = this.dataset;
    }

    Session.set('filterSet' + this.seshId, datas);

    Deps.afterFlush(this.updateCallback);

  }.bind(this));

}

datasetFilter.prototype.setDefaults = function() {
  Session.setDefault('filterQuery' + this.seshId, "");
  Session.setDefault('filterSet' + this.seshId, []);
}

datasetFilter.prototype.setQuery = function(query) {
  Session.set('filterQuery' + this.seshId, query);
}

datasetFilter.prototype.getResults = function() {
  return Session.get('filterSet' + this.seshId)
}

datasetFilter.prototype.destroy = function() {
  this.c1 && this.c1.stop();
  this.dataset = null;
  this.engine.clear();

  Session.set('filterSet' + this.seshId, []);
  Session.set('filterQuery' + this.seshId, "");
}

Meteor.datasetFilter = datasetFilter;