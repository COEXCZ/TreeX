$ ->

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

  
    # right click context menu
    tree.bind "tree.contextmenu", (event) ->
      # The clicked node is 'event.node'
      #node = event.node
      #console.log node
      #alert node.name + " id: " + node.id + " cls: " + node.cls
      #console.log event.click_event
      
      # get node info
      node = event.node
      nodeCls = node.cls.split(' ')
      nodeType = node.type

      # get contextmenu position
      parentOffset = $(event.click_event.target).closest('ul.jqtree-tree .jqtree-element').offset(); 
      relX = event.click_event.pageX - parentOffset.left;
      relY = event.click_event.pageY - parentOffset.top;

      contextmenu = ''

      # determine node type
      if node.type == 'modResource' || node.type == 'modDocument' || node.type == 'modContext'
        
        contextmenu = $('<div class="js-contextmenu contextmenu" style="top: '+(relY-5)+'px; left: '+(relX-5)+'px;"><ul></ul></div>')
        
        if nodeCls.indexOf('pnew_modDocument') != -1
          contextmenuItem = $('<li><a href="' + treexSettings.create_form_url + '&parent=' + node.id + '">aaa</a></li>')
          contextmenu.append(contextmenuItem)


      contextmenu.bind('mouseleave', ->
        $(this).remove()
      )
    
      $('.js-contextmenu').remove()
    
      $(event.click_event.target).closest('ul.jqtree-tree .jqtree-element').append(contextmenu)


        
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
    
    node = event.node
    $(node).addClass 'icon-folder-open'
    # TODO: finish on open/close folder icon replacing


  # left click
  tree.bind "tree.click", (event) ->
    
    # The clicked node is 'event.node'
    node = event.node
    if node.type == 'modResource' || node.type == 'modDocument'
      window.location.href = treexSettings.update_form_url + '&resource=' + node.pk

  
 
