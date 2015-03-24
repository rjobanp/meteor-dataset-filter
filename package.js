Package.describe({
  summary: "Reactive filtering for client-side data powered by twitter typeahead.js bloodhound engine",
  version: "0.0.6",
  git: "https://github.com/rosh93/meteor-dataset-filter.git"
});

Package.on_use(function(api, where) {
  api.versionsFrom("METEOR@0.9.0");
  api.use('jquery', 'client');
  api.add_files('bloodhound.js', 'client');
  api.add_files('dataset_filter.js', 'client');
  api.export('DatasetFilter', 'client');
});
