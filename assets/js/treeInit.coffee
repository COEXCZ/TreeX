﻿$ ->
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

  tree = $(".js-tree")
  tree.tree
    data: data
    autoOpen: false
    dragAndDrop: true
    saveState: true
    closedIcon: ""
    openedIcon: ""
    onCreateLi: (node, $li) ->
      
      #console.log($li.hasClass('jqtree-folder'));
      $li.addClass "folder"  if $li.hasClass("jqtree-folder")
      $li.find(".jqtree-title").addClass node.elmClass
      $li.find(".jqtree-toggler").addClass "icon-caret-down"

  
  #$li.hasClass('jqtree-folder').addClass('folder');
  #$li.find('.jqtree-element').append(
  #                '<a href="#node-'+ node.id +'" class="edit" data-node-id="'+
  #                node.id +'">edit</a>'
  #            );
  
  # right click context menu
  tree.bind "tree.contextmenu", (event) ->
    
    # The clicked node is 'event.node'
    node = event.node
    alert node.name + " id: " + node.id + " class: " + node.elmClass

  tree.bind "tree.move", (event) ->
    console.log "moved_node", event.move_info.moved_node
    console.log "target_node", event.move_info.target_node
    console.log "position", event.move_info.position
    console.log "previous_parent", event.move_info.previous_parent

