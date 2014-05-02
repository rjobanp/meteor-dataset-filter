Package.describe({
  summary: "Reactive filtering for client-side data powered by twitter typeahead.js bloodhound engine"
});

Package.on_use(function(api, where) {
  api.use('jquery', 'client');
  api.add_files('bloodhound.js', 'client');
  api.add_files('dataset_filter.js', 'client');
});