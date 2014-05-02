[![LICENSE](http://img.shields.io/badge/LICENSE-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# meteor-dataset-filter

Reactive filtering for client-side data powered by twitter typeahead.js bloodhound engine

## API

```javascript
  /*
    Initialization
  */
  new Meteor.datasetFilter({
    dataset: users, // dataset can be any array of objects
    queryKey: 'name', // the field to query matches on
    updateCallback: function() {
      // optional callback to run each time data is filtered
      // useful for updating a scrollbar or resizing operations, etc.
    }
  });

  /*
    Methods
  */

  getResults()
    // returns array of filtered result objects
    // reactive variable, use in a helper or deps.autorun, etc.

  setQuery()
    // set the query to filter on
    // see typeahead.js bloodhound docs for more info on filtering

  destroy()
    // cleanup method when done
```

## Usage

### Static Dataset

```javascript
Template.userList.created = function() {

  var users = [
    {name: 'Barack Obama', email: 'barack@whitehouse.gov', phone: '555-555-0816'},
    {name: 'George W. Bush', email: 'gw@whitehouse.gov', phone: '555-555-0008'},
    {name: 'Bill Clinton', email: 'bill@whitehouse.gov', phone: '555-555-9200'}
  ];

  usersFilter = new Meteor.datasetFilter({
    dataset: users,
    queryKey: 'name',
    updateCallback: function() {
      $('#user-list-area').resize();
    }
  });

}

Template.userList.filteredUsers = function() {
  return usersFilter.getResults()
}

Template.userList.events({
  'input #filter-users': function(event, template) {
    usersFilter.setQuery($(e.currentTarget).val())
  }
});

Template.userList.destroyed = function() {
  usersFilter.destroy();
}
```

```html
<template name="userList">

  <input type="text" id="filter-users" placeholder="Filter">

  <div id="user-list-area">
    {{#each filteredUsers}}
      <p>{{name}}<br>{{email}}<br>{{phone}}</p>
    {{/each}}
  </div>

</template>
```

### Reactive Dataset

```javascript
Template.userList.created = function() {

  Deps.autorun(function() {

    // Clean up the last filter object
    if (typeof usersFilter === 'object') {
      usersFilter.destroy();
    }
    
    var users = Users.find({
      type: 'president',
      party: Session.get('politicalParty')
    }).fetch();

    usersFilter = new Meteor.datasetFilter({
      dataset: users,
      queryKey: 'name'
    });

  });

}


Template.userList.filteredUsers = function() {
  return usersFilter.getResults()
}

Template.userList.events({
  'input #filter-users': function(event, template) {
    usersFilter.setQuery($(e.currentTarget).val())
  }
});

Template.userList.destroyed = function() {
  usersFilter.destroy();
}
```

```html
<template name="userList">

  <input type="text" id="filter-users" placeholder="Filter">

  <div id="user-list-area">
    {{#each filteredUsers}}
      <p>{{name}}<br>{{email}}<br>{{phone}}</p>
    {{/each}}
  </div>

</template>
```

