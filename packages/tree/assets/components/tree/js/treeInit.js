// Generated by CoffeeScript 1.6.3
(function() {
  $(function() {
    /*
    data = [
      id: 1
      label: "node1"
      elmClass: "icon-folder icon-doctype icon-folder-open"
      children: [
        id: 2
        label: "child1"
        elmClass: "icon-filetype icon-doctype icon-columns"
      ,
        id: 3
        label: "child2"
        elmClass: "icon-filetype icon-doctype icon-columns"
      ]
    ,
      id: 4
      label: "node2"
      elmClass: "icon-folder icon-doctype icon-folder-open"
      children: [
        id: 5
        label: "child3"
      ]
    ,
      id: 6
      label: "node3"
      elmClass: "icon-folder icon-doctype icon-folder-open"
      children: []
    ]
    */

    /*
    json = (->
      json = null
      $.ajax
        async: false
        global: false
        url: dataUrl
        dataType: "json"
        success: (data) ->
          json = data
    
      json
    )()
    */

    var tree;
    tree = $(".js-tree");
    tree.tree({
      autoOpen: false,
      dragAndDrop: true,
      saveState: true,
      closedIcon: "",
      openedIcon: "",
      onCreateLi: function(node, $li) {
        $li.find(".jqtree-title").addClass(node.cls);
        return $li.find(".jqtree-toggler").addClass("icon-caret-down");
      }
    });
    tree.bind("tree.contextmenu", function(event) {
      var node;
      node = event.node;
      return alert(node.name + " id: " + node.id + " cls: " + node.cls);
    });
    tree.bind("tree.move", function(event) {
      console.log("moved_node", event.move_info.moved_node);
      console.log("target_node", event.move_info.target_node);
      console.log("position", event.move_info.position);
      return console.log("previous_parent", event.move_info.previous_parent);
    });
    tree.bind("tree.open", function(event) {
      var node;
      node = event.node;
      return $(node).addClass('icon-folder-open');
    });
    return tree.bind("tree.click", function(event) {
      var node;
      node = event.node;
      return alert(node.name + " id: " + node.id + " clicked");
    });
  });

}).call(this);
