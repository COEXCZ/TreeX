$ ->

  # if there are "seo" urls, thed use "?"" sign in url, otherwise use "&" sign because there is "?" sign placed
  if treexSettings.create_form_url.indexOf('?') != -1
    treexSettings.urls_params_connector = '&'
  else
    treexSettings.urls_params_connector = '?'

  # do redirect with simple POST data function
  doPost = (postUrl, postParam, postData) ->
    form = $("<form action=\"" + postUrl + "\" method=\"post\" style=\"display: none;\">" + "<input type=\"hidden\" name=\"" + postParam + "\" value=\"" + postData + "\" />" + "</form>")
    $('body').append form
    $(form).submit()
    return

  #remove tags from string
  cleanString = (string) ->
    string.replace(/<\/?[^>]+(>|$)/g, " ");

  # initialize tree engine
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
    openFolderDelay: 2000

    onCreateLi: (node, $li) ->
      $li.find(".jqtree-title").addClass node.cls
      $li.find(".jqtree-toggler").addClass "icon-caret-down"

  
    # right click context menu
    tree.bind "tree.contextmenu", (event) ->
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
          contextmenuItem = $('<li><a href="' + treexSettings.create_form_url + treexSettings.urls_params_connector + 'parent=' + node.id + '">' + treexSettings.translate_newdocument + '</a></li>')
          contextmenu.append(contextmenuItem)

        if nodeCls.indexOf('pdelete') != -1
          contextmenuItem = $('<li><a href="' + treexSettings.delete_form_url + '" class="js-treex-pdelete" data-resource="' + node.pk + '">' + treexSettings.translate_deletedocument + '</a></li>')
          contextmenu.append(contextmenuItem)
          
          # resource delete action
          deleteButton = contextmenuItem.find('.js-treex-pdelete')
          $(deleteButton).on 'click', ->
            target = $(this).attr('href')
            resource = $(this).data('resource')
            if confirm cleanString treexSettings.translate_deletedocument_confirm
              doPost target, 'resource', resource 
            false               

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
      data = action: 'web/resource/sort', node: nodeId, position: position, target:targetId, prev: parentPrevId, ctx: 'editor'
      
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
    
    # function is used in callback of method below
    loadUrl = (node) ->
      if node.type == 'modResource' || node.type == 'modDocument'
        window.location.href = treexSettings.update_form_url + treexSettings.urls_params_connector + 'resource=' + node.pk

    if node.load_on_demand == true
      tree.tree('openNode', node, true,  -> loadUrl node);
    else
      loadUrl node
  