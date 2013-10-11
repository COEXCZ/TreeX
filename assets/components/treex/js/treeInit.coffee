$ ->
  ###
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
  ###
  ###
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
  ###
  tree = $(".js-tree")
  tree.tree
    #NOTE: data are placed via 'data-url' param to enable dynamic nodes children loading
    #data: json 
    autoOpen: false
    dragAndDrop: true
    saveState: true
    closedIcon: ""
    openedIcon: ""
    autoOpen: true

    onCreateLi: (node, $li) ->
      
      #console.log($li.hasClass('jqtree-folder'));
      #$li.addClass "folder"  if $li.hasClass("jqtree-folder")
      $li.find(".jqtree-title").addClass node.cls
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
      alert node.name + " id: " + node.id + " cls: " + node.cls


    # move element event
    tree.bind "tree.move", (event) ->
      # prepare params
      nodeId = event.move_info.moved_node.id
      targetId = event.move_info.target_node.id
      parentPrevId = event.move_info.previous_parent.id
      position = event.move_info.position

      # translate position param
      if position is 'inside'
        position = 0
      else if position is 'after'
        position = 1

      #prepare url data
      data_url = tree.dataUrl or tree.data('url')
      data = action: 'web/resource/sort', node: nodeId, position: position, target:targetId, prev: parentPrevId
      
      # do request
      $.ajax(
          url: data_url
          data: data
          type: 'GET'
          cache: false
          dataType: 'json'         
          
          success: (response) =>
              
          error: (response) =>          
      )
      


  # node opened
  tree.bind "tree.open", (event) ->
    
    for(var i in localStorage)
    {
      console.log(localStorage[i]);
    }
    node = event.node
    $(node).addClass 'icon-folder-open'
    # TODO: finish on open/close folder icon replacing


  # left click
  tree.bind "tree.click", (event) ->
    
    # The clicked node is 'event.node'
    node = event.node
    window.location.href = node.page.replace('&amp;','&'); 

  
