// Generated by CoffeeScript 1.6.3
(function() {
  $(function() {
    var tree;
    if (treexSettings.create_form_url.indexOf('?') !== -1) {
      treexSettings.urls_params_connector = '&';
    } else {
      treexSettings.urls_params_connector = '?';
    }
    tree = $(".js-tree");
    tree.tree({
      autoOpen: false,
      dragAndDrop: true,
      saveState: true,
      closedIcon: "",
      openedIcon: "",
      autoOpen: true,
      onCreateLi: function(node, $li) {
        $li.find(".jqtree-title").addClass(node.cls);
        return $li.find(".jqtree-toggler").addClass("icon-caret-down");
      }
    }, tree.bind("tree.contextmenu", function(event) {
      var contextmenu, contextmenuItem, node, nodeCls, nodeType, parentOffset, relX, relY;
      node = event.node;
      nodeCls = node.cls.split(' ');
      nodeType = node.type;
      parentOffset = $(event.click_event.target).closest('ul.jqtree-tree .jqtree-element').offset();
      relX = event.click_event.pageX - parentOffset.left;
      relY = event.click_event.pageY - parentOffset.top;
      contextmenu = '';
      if (node.type === 'modResource' || node.type === 'modDocument' || node.type === 'modContext') {
        contextmenu = $('<div class="js-contextmenu contextmenu" style="top: ' + (relY - 5) + 'px; left: ' + (relX - 5) + 'px;"><ul></ul></div>');
        if (nodeCls.indexOf('pnew_modDocument') !== -1) {
          contextmenuItem = $('<li><a href="' + treexSettings.create_form_url + treexSettings.urls_params_connector + 'parent=' + node.id + '">' + treexSettings.translate_newdocument + '</a></li>');
          contextmenu.append(contextmenuItem);
        }
      }
      contextmenu.bind('mouseleave', function() {
        return $(this).remove();
      });
      $('.js-contextmenu').remove();
      return $(event.click_event.target).closest('ul.jqtree-tree .jqtree-element').append(contextmenu);
    }), tree.bind("tree.move", function(event) {
      var data, data_url, nodeId, parentPrevId, position, targetId,
        _this = this;
      nodeId = event.move_info.moved_node.id;
      targetId = event.move_info.target_node.id;
      parentPrevId = event.move_info.previous_parent.id;
      position = event.move_info.position;
      if (position === 'inside') {
        position = 0;
      } else if (position === 'after') {
        position = 1;
      }
      data_url = tree.dataUrl || tree.data('url');
      data = {
        action: 'web/resource/sort',
        node: nodeId,
        position: position,
        target: targetId,
        prev: parentPrevId
      };
      return $.ajax({
        url: data_url,
        data: data,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function(response) {},
        error: function(response) {}
      });
    }));
    tree.bind("tree.open", function(event) {
      var node;
      node = event.node;
      return $(node).addClass('icon-folder-open');
    });
    return tree.bind("tree.click", function(event) {
      var node;
      node = event.node;
      if (node.type === 'modResource' || node.type === 'modDocument') {
        return window.location.href = treexSettings.update_form_url + treexSettings.urls_params_connector + 'resource=' + node.pk;
      }
    });
  });

}).call(this);
