function datasetFilter (options) {

  /* 
    options: {
      dataset: [{val: 'abc', _id: '123'}, {val: 'def', _id: '456'}]
      queryKey: 'val' or ['val', '_id']
      updateCallback: function() { console.log('dataset updated!') }
    }
  */

  this.dataDependency = new Deps.Dependency;

  this.dataset = this.filteredSet = options.dataset;
  this.updateCallback = options.updateCallback;

  this.query = '';

  this.engine = new Bloodhound({
    local: this.dataset,
    datumTokenizer: function(d) {
      var tokens  = '';
      if ( typeof options.queryKey === 'string') {
        tokens = d[options.queryKey];
      } else {
        options.queryKey.forEach(function(key) {
          tokens += d[key] + ' '
        });
      }
      return Bloodhound.tokenizers.whitespace(tokens);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: this.dataset.length
  });

  this.engine.initialize();
}

datasetFilter.prototype.setQuery = function(query) {
  this.query = query;

  var datas = [];
  if ( this.query ) {
    this.engine.get(this.query, function(datas2) {
      datas2.forEach(function(data) {
        datas.push(data);
      });
    });
  }
  if ( datas.length < 1 && ( !this.query || !this.query.length ) ) {
    this.filteredSet = this.dataset;
  } else {
    this.filteredSet = datas;
  }

  this.dataDependency.changed();

  if ( this.updateCallback )
    Deps.afterFlush(this.updateCallback);
}

datasetFilter.prototype.getResults = function() {
  this.dataDependency.depend();
  return this.filteredSet
}

datasetFilter.prototype.updateDataset = function(newQueryKey, newDataset) {
  this.dataset = this.filteredSet = newDataset;
  
  this.engine.clear();

  this.engine = new Bloodhound({
    local: this.dataset,
    datumTokenizer: function(d) {
      return Bloodhound.tokenizers.whitespace(d[newQueryKey]);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: this.dataset.length
  });

  this.engine.initialize();

  this.setQuery(this.query);
}

datasetFilter.prototype.destroy = function() {
  this.dataset = this.filteredSet = this.dataDependency = null;
  this.engine.clear();
}

DatasetFilter = datasetFilter;