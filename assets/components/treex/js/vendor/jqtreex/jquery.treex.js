//@ sourceMappingURL=jquery.treex.map
/*
Copyright 2013 Marco Braak

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


(function() {
  var $, BorderDropHint, DragAndDropHandler, DragElement, FolderElement, GhostDropHint, HitAreasGenerator, JqTreeWidget, KeyHandler, MouseWidget, Node, NodeElement, Position, SaveStateHandler, ScrollHandler, SelectNodeHandler, SimpleWidget, VisibleNodeIterator, html_escape, indexOf, json_escapable, json_meta, json_quote, json_str, _indexOf, _ref, _ref1, _ref2,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = this.jQuery;

  SimpleWidget = (function() {
    SimpleWidget.prototype.defaults = {};

    function SimpleWidget(el, options) {
      this.$el = $(el);
      this.options = $.extend({}, this.defaults, options);
    }

    SimpleWidget.prototype.destroy = function() {
      return this._deinit();
    };

    SimpleWidget.prototype._init = function() {
      return null;
    };

    SimpleWidget.prototype._deinit = function() {
      return null;
    };

    SimpleWidget.register = function(widget_class, widget_name) {
      var callFunction, createWidget, destroyWidget, getDataKey;
      getDataKey = function() {
        return "simple_widget_" + widget_name;
      };
      createWidget = function($el, options) {
        var data_key, el, widget, _i, _len;
        data_key = getDataKey();
        for (_i = 0, _len = $el.length; _i < _len; _i++) {
          el = $el[_i];
          widget = new widget_class(el, options);
          if (!$.data(el, data_key)) {
            $.data(el, data_key, widget);
          }
          widget._init();
        }
        return $el;
      };
      destroyWidget = function($el) {
        var data_key, el, widget, _i, _len, _results;
        data_key = getDataKey();
        _results = [];
        for (_i = 0, _len = $el.length; _i < _len; _i++) {
          el = $el[_i];
          widget = $.data(el, data_key);
          if (widget && (widget instanceof SimpleWidget)) {
            widget.destroy();
          }
          _results.push($.removeData(el, data_key));
        }
        return _results;
      };
      callFunction = function($el, function_name, args) {
        var el, result, widget, widget_function, _i, _len;
        result = null;
        for (_i = 0, _len = $el.length; _i < _len; _i++) {
          el = $el[_i];
          widget = $.data(el, getDataKey());
          if (widget && (widget instanceof SimpleWidget)) {
            widget_function = widget[function_name];
            if (widget_function && (typeof widget_function === 'function')) {
              result = widget_function.apply(widget, args);
            }
          }
        }
        return result;
      };
      return $.fn[widget_name] = function() {
        var $el, args, argument1, function_name, options;
        argument1 = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        $el = this;
        if (argument1 === void 0 || typeof argument1 === 'object') {
          options = argument1;
          return createWidget($el, options);
        } else if (typeof argument1 === 'string' && argument1[0] !== '_') {
          function_name = argument1;
          if (function_name === 'destroy') {
            return destroyWidget($el);
          } else {
            return callFunction($el, function_name, args);
          }
        }
      };
    };

    return SimpleWidget;

  })();

  this.SimpleWidget = SimpleWidget;

  /*
  This widget does the same a the mouse widget in jqueryui.
  */


  MouseWidget = (function(_super) {
    __extends(MouseWidget, _super);

    function MouseWidget() {
      _ref = MouseWidget.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MouseWidget.is_mouse_handled = false;

    MouseWidget.prototype._init = function() {
      this.$el.bind('mousedown.mousewidget', $.proxy(this._mouseDown, this));
      this.$el.bind('touchstart.mousewidget', $.proxy(this._touchStart, this));
      this.is_mouse_started = false;
      this.mouse_delay = 0;
      this._mouse_delay_timer = null;
      this._is_mouse_delay_met = true;
      return this.mouse_down_info = null;
    };

    MouseWidget.prototype._deinit = function() {
      var $document;
      this.$el.unbind('mousedown.mousewidget');
      this.$el.unbind('touchstart.mousewidget');
      $document = $(document);
      $document.unbind('mousemove.mousewidget');
      return $document.unbind('mouseup.mousewidget');
    };

    MouseWidget.prototype._mouseDown = function(e) {
      var result;
      if (e.which !== 1) {
        return;
      }
      result = this._handleMouseDown(e, this._getPositionInfo(e));
      if (result) {
        e.preventDefault();
      }
      return result;
    };

    MouseWidget.prototype._handleMouseDown = function(e, position_info) {
      if (MouseWidget.is_mouse_handled) {
        return;
      }
      if (this.is_mouse_started) {
        this._handleMouseUp(position_info);
      }
      this.mouse_down_info = position_info;
      if (!this._mouseCapture(position_info)) {
        return;
      }
      this._handleStartMouse();
      this.is_mouse_handled = true;
      return true;
    };

    MouseWidget.prototype._handleStartMouse = function() {
      var $document;
      $document = $(document);
      $document.bind('mousemove.mousewidget', $.proxy(this._mouseMove, this));
      $document.bind('touchmove.mousewidget', $.proxy(this._touchMove, this));
      $document.bind('mouseup.mousewidget', $.proxy(this._mouseUp, this));
      $document.bind('touchend.mousewidget', $.proxy(this._touchEnd, this));
      if (this.mouse_delay) {
        return this._startMouseDelayTimer();
      }
    };

    MouseWidget.prototype._startMouseDelayTimer = function() {
      var _this = this;
      if (this._mouse_delay_timer) {
        clearTimeout(this._mouse_delay_timer);
      }
      this._mouse_delay_timer = setTimeout(function() {
        return _this._is_mouse_delay_met = true;
      }, this.mouse_delay);
      return this._is_mouse_delay_met = false;
    };

    MouseWidget.prototype._mouseMove = function(e) {
      return this._handleMouseMove(e, this._getPositionInfo(e));
    };

    MouseWidget.prototype._handleMouseMove = function(e, position_info) {
      if (this.is_mouse_started) {
        this._mouseDrag(position_info);
        return e.preventDefault();
      }
      if (this.mouse_delay && !this._is_mouse_delay_met) {
        return true;
      }
      this.is_mouse_started = this._mouseStart(this.mouse_down_info) !== false;
      if (this.is_mouse_started) {
        this._mouseDrag(position_info);
      } else {
        this._handleMouseUp(position_info);
      }
      return !this.is_mouse_started;
    };

    MouseWidget.prototype._getPositionInfo = function(e) {
      return {
        page_x: e.pageX,
        page_y: e.pageY,
        target: e.target,
        original_event: e
      };
    };

    MouseWidget.prototype._mouseUp = function(e) {
      return this._handleMouseUp(this._getPositionInfo(e));
    };

    MouseWidget.prototype._handleMouseUp = function(position_info) {
      var $document;
      $document = $(document);
      $document.unbind('mousemove.mousewidget');
      $document.unbind('touchmove.mousewidget');
      $document.unbind('mouseup.mousewidget');
      $document.unbind('touchend.mousewidget');
      if (this.is_mouse_started) {
        this.is_mouse_started = false;
        this._mouseStop(position_info);
      }
    };

    MouseWidget.prototype._mouseCapture = function(position_info) {
      return true;
    };

    MouseWidget.prototype._mouseStart = function(position_info) {
      return null;
    };

    MouseWidget.prototype._mouseDrag = function(position_info) {
      return null;
    };

    MouseWidget.prototype._mouseStop = function(position_info) {
      return null;
    };

    MouseWidget.prototype.setMouseDelay = function(mouse_delay) {
      return this.mouse_delay = mouse_delay;
    };

    MouseWidget.prototype._touchStart = function(e) {
      var touch;
      if (e.originalEvent.touches.length > 1) {
        return;
      }
      touch = e.originalEvent.changedTouches[0];
      return this._handleMouseDown(e, this._getPositionInfo(touch));
    };

    MouseWidget.prototype._touchMove = function(e) {
      var touch;
      if (e.originalEvent.touches.length > 1) {
        return;
      }
      touch = e.originalEvent.changedTouches[0];
      return this._handleMouseMove(e, this._getPositionInfo(touch));
    };

    MouseWidget.prototype._touchEnd = function(e) {
      var touch;
      if (e.originalEvent.touches.length > 1) {
        return;
      }
      touch = e.originalEvent.changedTouches[0];
      return this._handleMouseUp(this._getPositionInfo(touch));
    };

    return MouseWidget;

  })(SimpleWidget);

  this.Tree = {};

  $ = this.jQuery;

  Position = {
    getName: function(position) {
      return Position.strings[position - 1];
    },
    nameToIndex: function(name) {
      var i, _i, _ref1;
      for (i = _i = 1, _ref1 = Position.strings.length; 1 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
        if (Position.strings[i - 1] === name) {
          return i;
        }
      }
      return 0;
    }
  };

  Position.BEFORE = 1;

  Position.AFTER = 2;

  Position.INSIDE = 3;

  Position.NONE = 4;

  Position.strings = ['before', 'after', 'inside', 'none'];

  this.Tree.Position = Position;

  Node = (function() {
    function Node(o, is_root, node_class) {
      if (is_root == null) {
        is_root = false;
      }
      if (node_class == null) {
        node_class = Node;
      }
      this.setData(o);
      this.children = [];
      this.parent = null;
      if (is_root) {
        this.id_mapping = {};
        this.tree = this;
        this.node_class = node_class;
      }
    }

    Node.prototype.setData = function(o) {
      var key, value, _results;
      if (typeof o !== 'object') {
        return this.name = o;
      } else {
        _results = [];
        for (key in o) {
          value = o[key];
          if (key === 'text') {
            _results.push(this.name = value);
          } else {
            _results.push(this[key] = value);
          }
        }
        return _results;
      }
    };

    Node.prototype.initFromData = function(data) {
      var addChildren, addNode,
        _this = this;
      addNode = function(node_data) {
        _this.setData(node_data);
        if (node_data.children) {
          return addChildren(node_data.children);
        }
      };
      addChildren = function(children_data) {
        var child, node, _i, _len;
        for (_i = 0, _len = children_data.length; _i < _len; _i++) {
          child = children_data[_i];
          node = new _this.tree.node_class('');
          node.initFromData(child);
          _this.addChild(node);
        }
        return null;
      };
      addNode(data);
      return null;
    };

    /*
    Create tree from data.
    
    Structure of data is:
    [
        {
            label: 'node1',
            children: [
                { label: 'child1' },
                { label: 'child2' }
            ]
        },
        {
            label: 'node2'
        }
    ]
    */


    Node.prototype.loadFromData = function(data) {
      var node, o, _i, _len;
      this.removeChildren();
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        o = data[_i];
        node = new this.tree.node_class(o);
        this.addChild(node);
        if (typeof o === 'object' && o.children) {
          node.loadFromData(o.children);
        }
      }
      return null;
    };

    /*
    Add child.
    
    tree.addChild(
        new Node('child1')
    );
    */


    Node.prototype.addChild = function(node) {
      this.children.push(node);
      return node._setParent(this);
    };

    /*
    Add child at position. Index starts at 0.
    
    tree.addChildAtPosition(
        new Node('abc'),
        1
    );
    */


    Node.prototype.addChildAtPosition = function(node, index) {
      this.children.splice(index, 0, node);
      return node._setParent(this);
    };

    Node.prototype._setParent = function(parent) {
      this.parent = parent;
      this.tree = parent.tree;
      return this.tree.addNodeToIndex(this);
    };

    /*
    Remove child. This also removes the children of the node.
    
    tree.removeChild(tree.children[0]);
    */


    Node.prototype.removeChild = function(node) {
      node.removeChildren();
      return this._removeChild(node);
    };

    Node.prototype._removeChild = function(node) {
      this.children.splice(this.getChildIndex(node), 1);
      return this.tree.removeNodeFromIndex(node);
    };

    /*
    Get child index.
    
    var index = getChildIndex(node);
    */


    Node.prototype.getChildIndex = function(node) {
      return $.inArray(node, this.children);
    };

    /*
    Does the tree have children?
    
    if (tree.hasChildren()) {
        //
    }
    */


    Node.prototype.hasChildren = function() {
      return this.children.length !== 0;
    };

    Node.prototype.isFolder = function() {
      return this.hasChildren() || this.load_on_demand;
    };

    /*
    Iterate over all the nodes in the tree.
    
    Calls callback with (node, level).
    
    The callback must return true to continue the iteration on current node.
    
    tree.iterate(
        function(node, level) {
           console.log(node.name);
    
           // stop iteration after level 2
           return (level <= 2);
        }
    );
    */


    Node.prototype.iterate = function(callback) {
      var _iterate,
        _this = this;
      _iterate = function(node, level) {
        var child, result, _i, _len, _ref1;
        if (node.children) {
          _ref1 = node.children;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            child = _ref1[_i];
            result = callback(child, level);
            if (_this.hasChildren() && result) {
              _iterate(child, level + 1);
            }
          }
          return null;
        }
      };
      _iterate(this, 0);
      return null;
    };

    /*
    Move node relative to another node.
    
    Argument position: Position.BEFORE, Position.AFTER or Position.Inside
    
    // move node1 after node2
    tree.moveNode(node1, node2, Position.AFTER);
    */


    Node.prototype.moveNode = function(moved_node, target_node, position) {
      if (moved_node.isParentOf(target_node)) {
        return;
      }
      moved_node.parent._removeChild(moved_node);
      if (position === Position.AFTER) {
        return target_node.parent.addChildAtPosition(moved_node, target_node.parent.getChildIndex(target_node) + 1);
      } else if (position === Position.BEFORE) {
        return target_node.parent.addChildAtPosition(moved_node, target_node.parent.getChildIndex(target_node));
      } else if (position === Position.INSIDE) {
        return target_node.addChildAtPosition(moved_node, 0);
      }
    };

    /*
    Get the tree as data.
    */


    Node.prototype.getData = function() {
      var getDataFromNodes,
        _this = this;
      getDataFromNodes = function(nodes) {
        var data, k, node, tmp_node, v, _i, _len;
        data = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          tmp_node = {};
          for (k in node) {
            v = node[k];
            if ((k !== 'parent' && k !== 'children' && k !== 'element' && k !== 'tree') && Object.prototype.hasOwnProperty.call(node, k)) {
              tmp_node[k] = v;
            }
          }
          if (node.hasChildren()) {
            tmp_node.children = getDataFromNodes(node.children);
          }
          data.push(tmp_node);
        }
        return data;
      };
      return getDataFromNodes(this.children);
    };

    Node.prototype.getNodeByName = function(name) {
      var result;
      result = null;
      this.iterate(function(node) {
        if (node.name === name) {
          result = node;
          return false;
        } else {
          return true;
        }
      });
      return result;
    };

    Node.prototype.addAfter = function(node_info) {
      var child_index, node;
      if (!this.parent) {
        return null;
      } else {
        node = new this.tree.node_class(node_info);
        child_index = this.parent.getChildIndex(this);
        this.parent.addChildAtPosition(node, child_index + 1);
        return node;
      }
    };

    Node.prototype.addBefore = function(node_info) {
      var child_index, node;
      if (!this.parent) {
        return null;
      } else {
        node = new this.tree.node_class(node_info);
        child_index = this.parent.getChildIndex(this);
        this.parent.addChildAtPosition(node, child_index);
        return node;
      }
    };

    Node.prototype.addParent = function(node_info) {
      var child, new_parent, original_parent, _i, _len, _ref1;
      if (!this.parent) {
        return null;
      } else {
        new_parent = new this.tree.node_class(node_info);
        new_parent._setParent(this.tree);
        original_parent = this.parent;
        _ref1 = original_parent.children;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          child = _ref1[_i];
          new_parent.addChild(child);
        }
        original_parent.children = [];
        original_parent.addChild(new_parent);
        return new_parent;
      }
    };

    Node.prototype.remove = function() {
      if (this.parent) {
        this.parent.removeChild(this);
        return this.parent = null;
      }
    };

    Node.prototype.append = function(node_info) {
      var node;
      node = new this.tree.node_class(node_info);
      this.addChild(node);
      return node;
    };

    Node.prototype.prepend = function(node_info) {
      var node;
      node = new this.tree.node_class(node_info);
      this.addChildAtPosition(node, 0);
      return node;
    };

    Node.prototype.isParentOf = function(node) {
      var parent;
      parent = node.parent;
      while (parent) {
        if (parent === this) {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    };

    Node.prototype.getLevel = function() {
      var level, node;
      level = 0;
      node = this;
      while (node.parent) {
        level += 1;
        node = node.parent;
      }
      return level;
    };

    Node.prototype.getNodeById = function(node_id) {
      return this.id_mapping[node_id];
    };

    Node.prototype.addNodeToIndex = function(node) {
      if (node.id != null) {
        return this.id_mapping[node.id] = node;
      }
    };

    Node.prototype.removeNodeFromIndex = function(node) {
      if (node.id != null) {
        return delete this.id_mapping[node.id];
      }
    };

    Node.prototype.removeChildren = function() {
      var _this = this;
      this.iterate(function(child) {
        _this.tree.removeNodeFromIndex(child);
        return true;
      });
      return this.children = [];
    };

    Node.prototype.getPreviousSibling = function() {
      var previous_index;
      if (!this.parent) {
        return null;
      } else {
        previous_index = this.parent.getChildIndex(this) - 1;
        if (previous_index >= 0) {
          return this.parent.children[previous_index];
        } else {
          return null;
        }
      }
    };

    Node.prototype.getNextSibling = function() {
      var next_index;
      if (!this.parent) {
        return null;
      } else {
        next_index = this.parent.getChildIndex(this) + 1;
        if (next_index < this.parent.children.length) {
          return this.parent.children[next_index];
        } else {
          return null;
        }
      }
    };

    return Node;

  })();

  this.Tree.Node = Node;

  /*
  Copyright 2013 Marco Braak
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  */


  JqTreeWidget = (function(_super) {
    __extends(JqTreeWidget, _super);

    function JqTreeWidget() {
      _ref1 = JqTreeWidget.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    JqTreeWidget.prototype.defaults = {
      autoOpen: false,
      saveState: false,
      dragAndDrop: false,
      selectable: true,
      useContextMenu: true,
      onCanSelectNode: null,
      onSetStateFromStorage: null,
      onGetStateFromStorage: null,
      onCreateLi: null,
      onIsMoveHandle: null,
      onCanMove: null,
      onCanMoveTo: null,
      onLoadFailed: null,
      autoEscape: true,
      dataUrl: null,
      closedIcon: '&#x25ba;',
      openedIcon: '&#x25bc;',
      slide: true,
      nodeClass: Node,
      dataFilter: null,
      keyboardSupport: true
    };

    JqTreeWidget.prototype.toggle = function(node, slide) {
      if (slide == null) {
        slide = true;
      }
      if (node.is_open) {
        return this.closeNode(node, slide);
      } else {
        return this.openNode(node, slide);
      }
    };

    JqTreeWidget.prototype.getTree = function() {
      return this.tree;
    };

    JqTreeWidget.prototype.selectNode = function(node) {
      return this._selectNode(node, false);
    };

    JqTreeWidget.prototype._selectNode = function(node, must_toggle) {
      var canSelect, deselected_node, openParents, saveState,
        _this = this;
      if (must_toggle == null) {
        must_toggle = false;
      }
      if (!this.select_node_handler) {
        return;
      }
      canSelect = function() {
        if (_this.options.onCanSelectNode) {
          return _this.options.selectable && _this.options.onCanSelectNode(node);
        } else {
          return _this.options.selectable;
        }
      };
      openParents = function() {
        var parent;
        parent = node.parent;
        if (parent && parent.parent && !parent.is_open) {
          return _this.openNode(parent, false);
        }
      };
      saveState = function() {
        if (_this.options.saveState) {
          return _this.save_state_handler.saveState();
        }
      };
      if (!node) {
        this._deselectCurrentNode();
        saveState();
        return;
      }
      if (!canSelect()) {
        return;
      }
      if (this.select_node_handler.isNodeSelected(node)) {
        if (must_toggle) {
          this._deselectCurrentNode();
          this._triggerEvent('tree.select', {
            node: null,
            previous_node: node
          });
        }
      } else {
        deselected_node = this.getSelectedNode();
        this._deselectCurrentNode();
        this.addToSelection(node);
        this._triggerEvent('tree.select', {
          node: node,
          deselected_node: deselected_node
        });
        openParents();
      }
      return saveState();
    };

    JqTreeWidget.prototype.getSelectedNode = function() {
      return this.select_node_handler.getSelectedNode();
    };

    JqTreeWidget.prototype.toJson = function() {
      return JSON.stringify(this.tree.getData());
    };

    JqTreeWidget.prototype.loadData = function(data, parent_node) {
      return this._loadData(data, parent_node);
    };

    JqTreeWidget.prototype.loadDataFromUrl = function(url, parent_node, on_finished) {
      if ($.type(url) !== 'string') {
        on_finished = parent_node;
        parent_node = url;
        url = null;
      }
      return this._loadDataFromUrl(url, parent_node, on_finished);
    };

    JqTreeWidget.prototype._loadDataFromUrl = function(url_info, parent_node, on_finished) {
      var $el, addLoadingClass, parseUrlInfo, removeLoadingClass,
        _this = this;
      $el = null;
      addLoadingClass = function() {
        var folder_element;
        if (!parent_node) {
          $el = _this.element;
        } else {
          folder_element = new FolderElement(parent_node, _this);
          $el = folder_element.getLi();
        }
        return $el.addClass('jqtree-loading');
      };
      removeLoadingClass = function() {
        if ($el) {
          return $el.removeClass('jqtree-loading');
        }
      };
      parseUrlInfo = function() {
        if ($.type(url_info) === 'string') {
          url_info = {
            url: url_info
          };
        }
        if (!url_info.method) {
          return url_info.method = 'get';
        }
      };
      addLoadingClass();
      if (!url_info) {
        url_info = this._getDataUrlInfo(parent_node);
      }
      parseUrlInfo();
      return $.ajax({
        url: url_info.url,
        data: url_info.data,
        type: url_info.method.toUpperCase(),
        cache: false,
        dataType: 'json',
        success: function(response) {
          var data;
          if ($.isArray(response) || typeof response === 'object') {
            data = response;
          } else {
            data = $.parseJSON(response);
          }
          if (_this.options.dataFilter) {
            data = _this.options.dataFilter(data);
          }
          removeLoadingClass();
          _this._loadData(data, parent_node);
          if (on_finished && $.isFunction(on_finished)) {
            return on_finished();
          }
        },
        error: function(response) {
          removeLoadingClass();
          if (_this.options.onLoadFailed) {
            return _this.options.onLoadFailed(response);
          }
        }
      });
    };

    JqTreeWidget.prototype._loadData = function(data, parent_node) {
      var n, selected_nodes_under_parent, _i, _len;
      this._triggerEvent('tree.load_data', {
        tree_data: data
      });
      if (!parent_node) {
        this._initTree(data);
      } else {
        selected_nodes_under_parent = this.select_node_handler.getSelectedNodes(parent_node);
        for (_i = 0, _len = selected_nodes_under_parent.length; _i < _len; _i++) {
          n = selected_nodes_under_parent[_i];
          this.select_node_handler.removeFromSelection(n);
        }
        parent_node.loadFromData(data);
        parent_node.load_on_demand = false;
        this._refreshElements(parent_node.parent);
      }
      if (this.is_dragging) {
        return this.dnd_handler.refreshHitAreas();
      }
    };

    JqTreeWidget.prototype.getNodeById = function(node_id) {
      return this.tree.getNodeById(node_id);
    };

    JqTreeWidget.prototype.getNodeByName = function(name) {
      return this.tree.getNodeByName(name);
    };

    JqTreeWidget.prototype.openNode = function(node, slide, on_finished) {
      if (slide == null) {
        slide = true;
      }
      return this._openNode(node, slide, on_finished);
    };

    JqTreeWidget.prototype._openNode = function(node, slide, on_finished) {
      var doOpenNode, parent,
        _this = this;
      if (slide == null) {
        slide = true;
      }
      doOpenNode = function(_node, _slide, _on_finished) {
        var folder_element;
        folder_element = new FolderElement(_node, _this);
        return folder_element.open(_on_finished, _slide);
      };
      if (node.isFolder()) {
        if (node.load_on_demand) {
          return this._loadFolderOnDemand(node, slide, on_finished);
        } else {
          parent = node.parent;
          while (parent && !parent.is_open) {
            if (parent.parent) {
              doOpenNode(parent, false, null);
            }
            parent = parent.parent;
          }
          doOpenNode(node, slide, on_finished);
          return this._saveState();
        }
      }
    };

    JqTreeWidget.prototype._loadFolderOnDemand = function(node, slide, on_finished) {
      var _this = this;
      if (slide == null) {
        slide = true;
      }
      return this._loadDataFromUrl(null, node, function() {
        return _this._openNode(node, slide, on_finished);
      });
    };

    JqTreeWidget.prototype.closeNode = function(node, slide) {
      if (slide == null) {
        slide = true;
      }
      if (node.isFolder()) {
        new FolderElement(node, this).close(slide);
        return this._saveState();
      }
    };

    JqTreeWidget.prototype.isDragging = function() {
      return this.is_dragging;
    };

    JqTreeWidget.prototype.refreshHitAreas = function() {
      return this.dnd_handler.refreshHitAreas();
    };

    JqTreeWidget.prototype.addNodeAfter = function(new_node_info, existing_node) {
      var new_node;
      new_node = existing_node.addAfter(new_node_info);
      this._refreshElements(existing_node.parent);
      return new_node;
    };

    JqTreeWidget.prototype.addNodeBefore = function(new_node_info, existing_node) {
      var new_node;
      new_node = existing_node.addBefore(new_node_info);
      this._refreshElements(existing_node.parent);
      return new_node;
    };

    JqTreeWidget.prototype.addParentNode = function(new_node_info, existing_node) {
      var new_node;
      new_node = existing_node.addParent(new_node_info);
      this._refreshElements(new_node.parent);
      return new_node;
    };

    JqTreeWidget.prototype.removeNode = function(node) {
      var parent;
      parent = node.parent;
      if (parent) {
        this.select_node_handler.removeFromSelection(node, true);
        node.remove();
        return this._refreshElements(parent.parent);
      }
    };

    JqTreeWidget.prototype.appendNode = function(new_node_info, parent_node) {
      var is_already_folder_node, node;
      if (!parent_node) {
        parent_node = this.tree;
      }
      is_already_folder_node = parent_node.isFolder();
      node = parent_node.append(new_node_info);
      if (is_already_folder_node) {
        this._refreshElements(parent_node);
      } else {
        this._refreshElements(parent_node.parent);
      }
      return node;
    };

    JqTreeWidget.prototype.prependNode = function(new_node_info, parent_node) {
      var node;
      if (!parent_node) {
        parent_node = this.tree;
      }
      node = parent_node.prepend(new_node_info);
      this._refreshElements(parent_node);
      return node;
    };

    JqTreeWidget.prototype.updateNode = function(node, data) {
      var id_is_changed;
      id_is_changed = data.id && data.id !== node.id;
      if (id_is_changed) {
        this.tree.removeNodeFromIndex(node);
      }
      node.setData(data);
      if (id_is_changed) {
        this.tree.addNodeToIndex(node);
      }
      this._refreshElements(node.parent);
      return this._selectCurrentNode();
    };

    JqTreeWidget.prototype.moveNode = function(node, target_node, position) {
      var position_index;
      position_index = Position.nameToIndex(position);
      this.tree.moveNode(node, target_node, position_index);
      return this._refreshElements();
    };

    JqTreeWidget.prototype.getStateFromStorage = function() {
      return this.save_state_handler.getStateFromStorage();
    };

    JqTreeWidget.prototype.addToSelection = function(node) {
      this.select_node_handler.addToSelection(node);
      return this._getNodeElementForNode(node).select();
    };

    JqTreeWidget.prototype.getSelectedNodes = function() {
      return this.select_node_handler.getSelectedNodes();
    };

    JqTreeWidget.prototype.isNodeSelected = function(node) {
      return this.select_node_handler.isNodeSelected(node);
    };

    JqTreeWidget.prototype.removeFromSelection = function(node) {
      this.select_node_handler.removeFromSelection(node);
      return this._getNodeElementForNode(node).deselect();
    };

    JqTreeWidget.prototype.scrollToNode = function(node) {
      var $element, top;
      $element = $(node.element);
      top = $element.offset().top - this.$el.offset().top;
      return this.scroll_handler.scrollTo(top);
    };

    JqTreeWidget.prototype.getState = function() {
      return this.save_state_handler.getState();
    };

    JqTreeWidget.prototype.setState = function(state) {
      this.save_state_handler.setState(state);
      return this._refreshElements();
    };

    JqTreeWidget.prototype._init = function() {
      JqTreeWidget.__super__._init.call(this);
      this.element = this.$el;
      this.mouse_delay = 300;
      this.is_initialized = false;
      if (typeof SaveStateHandler !== "undefined" && SaveStateHandler !== null) {
        this.save_state_handler = new SaveStateHandler(this);
      } else {
        this.options.saveState = false;
      }
      if (typeof SelectNodeHandler !== "undefined" && SelectNodeHandler !== null) {
        this.select_node_handler = new SelectNodeHandler(this);
      }
      if (typeof DragAndDropHandler !== "undefined" && DragAndDropHandler !== null) {
        this.dnd_handler = new DragAndDropHandler(this);
      } else {
        this.options.dragAndDrop = false;
      }
      if (typeof ScrollHandler !== "undefined" && ScrollHandler !== null) {
        this.scroll_handler = new ScrollHandler(this);
      }
      if ((typeof KeyHandler !== "undefined" && KeyHandler !== null) && (typeof SelectNodeHandler !== "undefined" && SelectNodeHandler !== null)) {
        this.key_handler = new KeyHandler(this);
      }
      this._initData();
      this.element.click($.proxy(this._click, this));
      this.element.dblclick($.proxy(this._dblclick, this));
      if (this.options.useContextMenu) {
        return this.element.bind('contextmenu', $.proxy(this._contextmenu, this));
      }
    };

    JqTreeWidget.prototype._deinit = function() {
      this.element.empty();
      this.element.unbind();
      this.key_handler.deinit();
      this.tree = null;
      return JqTreeWidget.__super__._deinit.call(this);
    };

    JqTreeWidget.prototype._initData = function() {
      if (this.options.data) {
        return this._loadData(this.options.data);
      } else {
        return this._loadDataFromUrl(this._getDataUrlInfo());
      }
    };

    JqTreeWidget.prototype._getDataUrlInfo = function(node) {
      var data_url, getUrlFromString,
        _this = this;
      data_url = this.options.dataUrl || this.element.data('url');
      getUrlFromString = function() {
        var data, selected_node_id, url_info;
        url_info = {
          url: data_url
        };
        data = {
          action: 'web/resource/getnodes'
        };
        if (node && node.id) {
          data['node'] = node.id;
        } else {
          selected_node_id = _this._getNodeIdToBeSelected();
          if (selected_node_id) {
            data['selected_node'] = selected_node_id;
          }
        }
        url_info['data'] = data;
        return url_info;
      };
      if ($.isFunction(data_url)) {
        return data_url(node);
      } else if ($.type(data_url) === 'string') {
        return getUrlFromString();
      } else {
        return data_url;
      }
    };

    JqTreeWidget.prototype._getNodeIdToBeSelected = function() {
      if (this.options.saveState) {
        return this.save_state_handler.getNodeIdToBeSelected();
      } else {
        return null;
      }
    };

    JqTreeWidget.prototype._initTree = function(data) {
      this.tree = new this.options.nodeClass(null, true, this.options.nodeClass);
      if (this.select_node_handler) {
        this.select_node_handler.clear();
      }
      this.tree.loadFromData(data);
      this._openNodes();
      this._refreshElements();
      if (!this.is_initialized) {
        this.is_initialized = true;
        return this._triggerEvent('tree.init');
      }
    };

    JqTreeWidget.prototype._openNodes = function() {
      var max_level;
      if (this.options.saveState) {
        if (this.save_state_handler.restoreState()) {
          return;
        }
      }
      if (this.options.autoOpen === false) {
        return;
      } else if (this.options.autoOpen === true) {
        max_level = -1;
      } else {
        max_level = parseInt(this.options.autoOpen);
      }
      return this.tree.iterate(function(node, level) {
        if (node.hasChildren()) {
          node.is_open = true;
        }
        return level !== max_level;
      });
    };

    JqTreeWidget.prototype._refreshElements = function(from_node) {
      var $element, createFolderLi, createLi, createNodeLi, createUl, doCreateDomElements, escapeIfNecessary, is_root_node, node_element,
        _this = this;
      if (from_node == null) {
        from_node = null;
      }
      escapeIfNecessary = function(value) {
        if (_this.options.autoEscape) {
          return html_escape(value);
        } else {
          return value;
        }
      };
      createUl = function(is_root_node) {
        var class_string;
        if (is_root_node) {
          class_string = 'jqtree-tree';
        } else {
          class_string = '';
        }
        return $("<ul class=\"jqtree_common " + class_string + "\"></ul>");
      };
      createLi = function(node) {
        var $li;
        if (node.isFolder()) {
          $li = createFolderLi(node);
        } else {
          $li = createNodeLi(node);
        }
        if (_this.options.onCreateLi) {
          _this.options.onCreateLi(node, $li);
        }
        return $li;
      };
      createNodeLi = function(node) {
        var class_string, escaped_name, li_classes;
        li_classes = ['jqtree_common'];
        if (_this.select_node_handler && _this.select_node_handler.isNodeSelected(node)) {
          li_classes.push('jqtree-selected');
        }
        class_string = li_classes.join(' ');
        escaped_name = escapeIfNecessary(node.name);
        return $("<li class=\"" + class_string + "\"><div class=\"jqtree-element jqtree_common\"><span class=\"jqtree-title jqtree_common\">" + escaped_name + "</span></div></li>");
      };
      createFolderLi = function(node) {
        var button_char, button_classes, escaped_name, folder_classes, getButtonClasses, getFolderClasses;
        getButtonClasses = function() {
          var classes;
          classes = ['jqtree-toggler'];
          if (!node.is_open) {
            classes.push('jqtree-closed');
          }
          return classes.join(' ');
        };
        getFolderClasses = function() {
          var classes;
          classes = ['jqtree-folder'];
          if (!node.is_open) {
            classes.push('jqtree-closed');
          }
          if (_this.select_node_handler && _this.select_node_handler.isNodeSelected(node)) {
            classes.push('jqtree-selected');
          }
          return classes.join(' ');
        };
        button_classes = getButtonClasses();
        folder_classes = getFolderClasses();
        escaped_name = escapeIfNecessary(node.name);
        if (node.is_open) {
          button_char = _this.options.openedIcon;
        } else {
          button_char = _this.options.closedIcon;
        }
        return $("<li class=\"jqtree_common " + folder_classes + "\"><div class=\"jqtree-element jqtree_common\"><a class=\"jqtree_common " + button_classes + "\">" + button_char + "</a><span class=\"jqtree_common jqtree-title\">" + escaped_name + "</span></div></li>");
      };
      doCreateDomElements = function($element, children, is_root_node, is_open) {
        var $li, $ul, child, _i, _len;
        $ul = createUl(is_root_node);
        $element.append($ul);
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          $li = createLi(child);
          $ul.append($li);
          child.element = $li[0];
          $li.data('node', child);
          if (child.hasChildren()) {
            doCreateDomElements($li, child.children, false, child.is_open);
          }
        }
        return null;
      };
      if (from_node && from_node.parent) {
        is_root_node = false;
        node_element = this._getNodeElementForNode(from_node);
        node_element.getUl().remove();
        $element = node_element.$element;
      } else {
        from_node = this.tree;
        $element = this.element;
        $element.empty();
        is_root_node = true;
      }
      doCreateDomElements($element, from_node.children, is_root_node, is_root_node);
      return this._triggerEvent('tree.refresh');
    };

    JqTreeWidget.prototype._click = function(e) {
      var click_target, event, node;
      click_target = this._getClickTarget(e.target);
      if (click_target) {
        if (click_target.type === 'button') {
          this.toggle(click_target.node, this.options.slide);
          e.preventDefault();
          return e.stopPropagation();
        } else if (click_target.type === 'label') {
          node = click_target.node;
          event = this._triggerEvent('tree.click', {
            node: node
          });
          if (!event.isDefaultPrevented()) {
            return this._selectNode(node, true);
          }
        }
      }
    };

    JqTreeWidget.prototype._dblclick = function(e) {
      var click_target;
      click_target = this._getClickTarget(e.target);
      if (click_target && click_target.type === 'label') {
        return this._triggerEvent('tree.dblclick', {
          node: click_target.node
        });
      }
    };

    JqTreeWidget.prototype._getClickTarget = function(element) {
      var $button, $el, $target, node;
      $target = $(element);
      $button = $target.closest('.jqtree-toggler');
      if ($button.length) {
        node = this._getNode($button);
        if (node) {
          return {
            type: 'button',
            node: node
          };
        }
      } else {
        $el = $target.closest('.jqtree-element');
        if ($el.length) {
          node = this._getNode($el);
          if (node) {
            return {
              type: 'label',
              node: node
            };
          }
        }
      }
      return null;
    };

    JqTreeWidget.prototype._getNode = function($element) {
      var $li;
      $li = $element.closest('li');
      if ($li.length === 0) {
        return null;
      } else {
        return $li.data('node');
      }
    };

    JqTreeWidget.prototype._getNodeElementForNode = function(node) {
      if (node.isFolder()) {
        return new FolderElement(node, this);
      } else {
        return new NodeElement(node, this);
      }
    };

    JqTreeWidget.prototype._getNodeElement = function($element) {
      var node;
      node = this._getNode($element);
      if (node) {
        return this._getNodeElementForNode(node);
      } else {
        return null;
      }
    };

    JqTreeWidget.prototype._contextmenu = function(e) {
      var $div, node;
      $div = $(e.target).closest('ul.jqtree-tree .jqtree-element');
      if ($div.length) {
        node = this._getNode($div);
        if (node) {
          e.preventDefault();
          e.stopPropagation();
          this._triggerEvent('tree.contextmenu', {
            node: node,
            click_event: e
          });
          return false;
        }
      }
    };

    JqTreeWidget.prototype._saveState = function() {
      if (this.options.saveState) {
        return this.save_state_handler.saveState();
      }
    };

    JqTreeWidget.prototype._mouseCapture = function(position_info) {
      if (this.options.dragAndDrop) {
        return this.dnd_handler.mouseCapture(position_info);
      } else {
        return false;
      }
    };

    JqTreeWidget.prototype._mouseStart = function(position_info) {
      if (this.options.dragAndDrop) {
        return this.dnd_handler.mouseStart(position_info);
      } else {
        return false;
      }
    };

    JqTreeWidget.prototype._mouseDrag = function(position_info) {
      var result;
      if (this.options.dragAndDrop) {
        result = this.dnd_handler.mouseDrag(position_info);
        if (this.scroll_handler) {
          this.scroll_handler.checkScrolling();
        }
        return result;
      } else {
        return false;
      }
    };

    JqTreeWidget.prototype._mouseStop = function(position_info) {
      if (this.options.dragAndDrop) {
        return this.dnd_handler.mouseStop(position_info);
      } else {
        return false;
      }
    };

    JqTreeWidget.prototype._triggerEvent = function(event_name, values) {
      var event;
      event = $.Event(event_name);
      $.extend(event, values);
      this.element.trigger(event);
      return event;
    };

    JqTreeWidget.prototype.testGenerateHitAreas = function(moving_node) {
      this.dnd_handler.current_item = this._getNodeElementForNode(moving_node);
      this.dnd_handler.generateHitAreas();
      return this.dnd_handler.hit_areas;
    };

    JqTreeWidget.prototype._selectCurrentNode = function() {
      var node, node_element;
      node = this.getSelectedNode();
      if (node) {
        node_element = this._getNodeElementForNode(node);
        if (node_element) {
          return node_element.select();
        }
      }
    };

    JqTreeWidget.prototype._deselectCurrentNode = function() {
      var node;
      node = this.getSelectedNode();
      if (node) {
        return this.removeFromSelection(node);
      }
    };

    return JqTreeWidget;

  })(MouseWidget);

  SimpleWidget.register(JqTreeWidget, 'tree');

  NodeElement = (function() {
    function NodeElement(node, tree_widget) {
      this.init(node, tree_widget);
    }

    NodeElement.prototype.init = function(node, tree_widget) {
      this.node = node;
      this.tree_widget = tree_widget;
      return this.$element = $(node.element);
    };

    NodeElement.prototype.getUl = function() {
      return this.$element.children('ul:first');
    };

    NodeElement.prototype.getSpan = function() {
      return this.$element.children('.jqtree-element').find('span.jqtree-title');
    };

    NodeElement.prototype.getLi = function() {
      return this.$element;
    };

    NodeElement.prototype.addDropHint = function(position) {
      if (position === Position.INSIDE) {
        return new BorderDropHint(this.$element);
      } else {
        return new GhostDropHint(this.node, this.$element, position);
      }
    };

    NodeElement.prototype.select = function() {
      return this.getLi().addClass('jqtree-selected');
    };

    NodeElement.prototype.deselect = function() {
      return this.getLi().removeClass('jqtree-selected');
    };

    return NodeElement;

  })();

  FolderElement = (function(_super) {
    __extends(FolderElement, _super);

    function FolderElement() {
      _ref2 = FolderElement.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    FolderElement.prototype.open = function(on_finished, slide) {
      var $button, doOpen,
        _this = this;
      if (slide == null) {
        slide = true;
      }
      if (!this.node.is_open) {
        this.node.is_open = true;
        $button = this.getButton();
        $button.removeClass('jqtree-closed');
        $button.html(this.tree_widget.options.openedIcon);
        doOpen = function() {
          _this.getLi().removeClass('jqtree-closed');
          if (on_finished && $.isFunction(on_finished)) {
            on_finished();
          }
          return _this.tree_widget._triggerEvent('tree.open', {
            node: _this.node
          });
        };
        if (slide) {
          return this.getUl().slideDown('fast', doOpen);
        } else {
          this.getUl().show();
          return doOpen();
        }
      }
    };

    FolderElement.prototype.close = function(slide) {
      var $button, doClose,
        _this = this;
      if (slide == null) {
        slide = true;
      }
      if (this.node.is_open) {
        this.node.is_open = false;
        $button = this.getButton();
        $button.addClass('jqtree-closed');
        $button.html(this.tree_widget.options.closedIcon);
        doClose = function() {
          _this.getLi().addClass('jqtree-closed');
          return _this.tree_widget._triggerEvent('tree.close', {
            node: _this.node
          });
        };
        if (slide) {
          return this.getUl().slideUp('fast', doClose);
        } else {
          this.getUl().hide();
          return doClose();
        }
      }
    };

    FolderElement.prototype.getButton = function() {
      return this.$element.children('.jqtree-element').find('a.jqtree-toggler');
    };

    FolderElement.prototype.addDropHint = function(position) {
      if (!this.node.is_open && position === Position.INSIDE) {
        return new BorderDropHint(this.$element);
      } else {
        return new GhostDropHint(this.node, this.$element, position);
      }
    };

    return FolderElement;

  })(NodeElement);

  html_escape = function(string) {
    return ('' + string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
  };

  _indexOf = function(array, item) {
    var i, value, _i, _len;
    for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
      value = array[i];
      if (value === item) {
        return i;
      }
    }
    return -1;
  };

  indexOf = function(array, item) {
    if (array.indexOf) {
      return array.indexOf(item);
    } else {
      return _indexOf(array, item);
    }
  };

  this.Tree.indexOf = indexOf;

  this.Tree._indexOf = _indexOf;

  if (!((this.JSON != null) && (this.JSON.stringify != null) && typeof this.JSON.stringify === 'function')) {
    json_escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    json_meta = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\'
    };
    json_quote = function(string) {
      json_escapable.lastIndex = 0;
      if (json_escapable.test(string)) {
        return '"' + string.replace(json_escapable, function(a) {
          var c;
          c = json_meta[a];
          return (typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4));
        }) + '"';
      } else {
        return '"' + string + '"';
      }
    };
    json_str = function(key, holder) {
      var i, k, partial, v, value, _i, _len;
      value = holder[key];
      switch (typeof value) {
        case 'string':
          return json_quote(value);
        case 'number':
          if (isFinite(value)) {
            return String(value);
          } else {
            return 'null';
          }
        case 'boolean':
        case 'null':
          return String(value);
        case 'object':
          if (!value) {
            return 'null';
          }
          partial = [];
          if (Object.prototype.toString.apply(value) === '[object Array]') {
            for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
              v = value[i];
              partial[i] = json_str(i, value) || 'null';
            }
            return (partial.length === 0 ? '[]' : '[' + partial.join(',') + ']');
          }
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = json_str(k, value);
              if (v) {
                partial.push(json_quote(k) + ':' + v);
              }
            }
          }
          return (partial.length === 0 ? '{}' : '{' + partial.join(',') + '}');
      }
    };
    if (this.JSON == null) {
      this.JSON = {};
    }
    this.JSON.stringify = function(value) {
      return json_str('', {
        '': value
      });
    };
  }

  SaveStateHandler = (function() {
    function SaveStateHandler(tree_widget) {
      this.tree_widget = tree_widget;
    }

    SaveStateHandler.prototype.saveState = function() {
      var state;
      state = JSON.stringify(this.getState());
      if (this.tree_widget.options.onSetStateFromStorage) {
        return this.tree_widget.options.onSetStateFromStorage(state);
      } else if (this.supportsLocalStorage()) {
        return localStorage.setItem(this.getCookieName(), state);
      } else if ($.cookie) {
        $.cookie.raw = true;
        return $.cookie(this.getCookieName(), state, {
          path: '/'
        });
      }
    };

    SaveStateHandler.prototype.restoreState = function() {
      var state;
      state = this.getStateFromStorage();
      if (state) {
        this.setState($.parseJSON(state));
        return true;
      } else {
        return false;
      }
    };

    SaveStateHandler.prototype.getStateFromStorage = function() {
      if (this.tree_widget.options.onGetStateFromStorage) {
        return this.tree_widget.options.onGetStateFromStorage();
      } else if (this.supportsLocalStorage()) {
        return localStorage.getItem(this.getCookieName());
      } else if ($.cookie) {
        $.cookie.raw = true;
        return $.cookie(this.getCookieName());
      } else {
        return null;
      }
    };

    SaveStateHandler.prototype.getState = function() {
      var data, item, open_nodes, parsePath, selected_node, selected_node_id, _i, _len;
      open_nodes = [];
      parsePath = function(node) {
        var childs, item, _i, _len, _ref3;
        childs = [];
        _ref3 = node.children;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          item = _ref3[_i];
          if (item.is_open) {
            childs.push({
              id: item.id,
              childs: parsePath(item)
            });
          }
        }
        return childs;
      };
      data = this.tree_widget.tree.getData();
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        if (item.is_open) {
          open_nodes.push({
            id: item.id,
            childs: parsePath(item)
          });
        }
      }
      open_nodes = JSON.stringify(open_nodes);
      /*
       # old engine for open nodes saving action
      @tree_widget.tree.iterate((node) =>
          if (node.is_open and node.id and node.hasChildren())
              nodePath = []
              nodePath.push(node.id)
              nodeParent = node.parent
              while nodeParent && nodeParent.id
                  nodePath.push(nodeParent.id)
                  if !nodeParent.is_open
                      nodePath = []
                      break
                  nodeParent = nodeParent.parent
         
              nodePath = nodePath.reverse()
              open_nodes.push(nodePath)
          return true
      )
      */

      selected_node = this.tree_widget.getSelectedNode();
      if (selected_node) {
        selected_node_id = selected_node.id;
      } else {
        selected_node_id = '';
      }
      return {
        open_nodes: open_nodes,
        selected_node: selected_node_id
      };
    };

    SaveStateHandler.prototype.setState = function(state) {
      var elm, error, open_nodes, parsePath, selected_node, selected_node_id;
      if (state) {
        open_nodes = state.open_nodes;
        try {
          open_nodes = JSON.parse(open_nodes);
        } catch (_error) {
          error = _error;
        }
        selected_node_id = state.selected_node;
        elm = this;
        parsePath = function(nodes) {
          var item, node, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = nodes.length; _i < _len; _i++) {
            item = nodes[_i];
            node = elm.tree_widget.getNodeById(item.id);
            if (typeof node !== "undefined") {
              _results.push(elm.tree_widget._openNode(node, true, function() {
                return parsePath(item.childs);
              }));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
        parsePath(open_nodes);
        /*
        # old engine for open nodes loading action
        for key, nodeId of open_nodes
            
            node = @tree_widget.getNodeById(nodeId)
        
            #console.log node
        
            if typeof node isnt "undefined"
                @tree_widget.openNode(node)
        */

        if (selected_node_id && this.tree_widget.select_node_handler) {
          this.tree_widget.select_node_handler.clear();
          selected_node = this.tree_widget.getNodeById(selected_node_id);
          if (selected_node) {
            return this.tree_widget.select_node_handler.addToSelection(selected_node);
          }
        }
      }
    };

    SaveStateHandler.prototype.getCookieName = function() {
      if (typeof this.tree_widget.options.saveState === 'string') {
        return this.tree_widget.options.saveState;
      } else {
        return 'tree';
      }
    };

    SaveStateHandler.prototype.supportsLocalStorage = function() {
      var testSupport;
      testSupport = function() {
        var error, key;
        if (typeof localStorage === "undefined" || localStorage === null) {
          return false;
        } else {
          try {
            key = '_storage_test';
            sessionStorage.setItem(key, true);
            sessionStorage.removeItem(key);
          } catch (_error) {
            error = _error;
            return false;
          }
          return true;
        }
      };
      if (this._supportsLocalStorage == null) {
        this._supportsLocalStorage = testSupport();
      }
      return this._supportsLocalStorage;
    };

    SaveStateHandler.prototype.getNodeIdToBeSelected = function() {
      var state, state_json;
      state_json = this.getStateFromStorage();
      if (state_json) {
        state = $.parseJSON(state_json);
        return state.selected_node;
      } else {

      }
    };

    return SaveStateHandler;

  })();

  SelectNodeHandler = (function() {
    function SelectNodeHandler(tree_widget) {
      this.tree_widget = tree_widget;
      this.clear();
    }

    SelectNodeHandler.prototype.getSelectedNode = function() {
      var selected_nodes;
      selected_nodes = this.getSelectedNodes();
      if (selected_nodes.length) {
        return selected_nodes[0];
      } else {
        return false;
      }
    };

    SelectNodeHandler.prototype.getSelectedNodes = function() {
      var id, node, selected_nodes;
      if (this.selected_single_node) {
        return [this.selected_single_node];
      } else {
        selected_nodes = [];
        for (id in this.selected_nodes) {
          node = this.tree_widget.getNodeById(id);
          if (node) {
            selected_nodes.push(node);
          }
        }
        return selected_nodes;
      }
    };

    SelectNodeHandler.prototype.isNodeSelected = function(node) {
      if (node.id) {
        return this.selected_nodes[node.id];
      } else if (this.selected_single_node) {
        return this.selected_single_node.element === node.element;
      } else {
        return false;
      }
    };

    SelectNodeHandler.prototype.clear = function() {
      this.selected_nodes = {};
      return this.selected_single_node = null;
    };

    SelectNodeHandler.prototype.removeFromSelection = function(node, include_children) {
      var _this = this;
      if (include_children == null) {
        include_children = false;
      }
      if (!node.id) {
        if (node.element === this.selected_single_node.element) {
          return this.selected_single_node = null;
        }
      } else {
        delete this.selected_nodes[node.id];
        if (include_children) {
          return node.iterate(function(n) {
            delete _this.selected_nodes[node.id];
            return true;
          });
        }
      }
    };

    SelectNodeHandler.prototype.addToSelection = function(node) {
      if (node.id) {
        return this.selected_nodes[node.id] = true;
      } else {
        return this.selected_single_node = node;
      }
    };

    return SelectNodeHandler;

  })();

  DragAndDropHandler = (function() {
    function DragAndDropHandler(tree_widget) {
      this.tree_widget = tree_widget;
      this.hovered_area = null;
      this.$ghost = null;
      this.hit_areas = [];
      this.is_dragging = false;
    }

    DragAndDropHandler.prototype.mouseCapture = function(position_info) {
      var $element, node_element;
      $element = $(position_info.target);
      if (this.tree_widget.options.onIsMoveHandle && !this.tree_widget.options.onIsMoveHandle($element)) {
        return null;
      }
      node_element = this.tree_widget._getNodeElement($element);
      if (node_element && this.tree_widget.options.onCanMove) {
        if (!this.tree_widget.options.onCanMove(node_element.node)) {
          node_element = null;
        }
      }
      this.current_item = node_element;
      return this.current_item !== null;
    };

    DragAndDropHandler.prototype.mouseStart = function(position_info) {
      var offset;
      this.refreshHitAreas();
      offset = $(position_info.target).offset();
      this.drag_element = new DragElement(this.current_item.node, position_info.page_x - offset.left, position_info.page_y - offset.top, this.tree_widget.element);
      this.is_dragging = true;
      this.current_item.$element.addClass('jqtree-moving');
      return true;
    };

    DragAndDropHandler.prototype.mouseDrag = function(position_info) {
      var area, can_move_to;
      this.drag_element.move(position_info.page_x, position_info.page_y);
      area = this.findHoveredArea(position_info.page_x, position_info.page_y);
      can_move_to = this.canMoveToArea(area);
      if (area) {
        if (this.hovered_area !== area) {
          this.hovered_area = area;
          if (this.mustOpenFolderTimer(area)) {
            this.startOpenFolderTimer(area.node);
          }
          if (can_move_to) {
            this.updateDropHint();
          }
        }
      } else {
        this.removeHover();
        this.removeDropHint();
        this.stopOpenFolderTimer();
      }
      return true;
    };

    DragAndDropHandler.prototype.canMoveToArea = function(area) {
      var position_name;
      if (!area) {
        return false;
      } else if (this.tree_widget.options.onCanMoveTo) {
        position_name = Position.getName(area.position);
        return this.tree_widget.options.onCanMoveTo(this.current_item.node, area.node, position_name);
      } else {
        return true;
      }
    };

    DragAndDropHandler.prototype.mouseStop = function(position_info) {
      this.moveItem(position_info);
      this.clear();
      this.removeHover();
      this.removeDropHint();
      this.removeHitAreas();
      if (this.current_item) {
        this.current_item.$element.removeClass('jqtree-moving');
      }
      this.is_dragging = false;
      return false;
    };

    DragAndDropHandler.prototype.refreshHitAreas = function() {
      this.removeHitAreas();
      return this.generateHitAreas();
    };

    DragAndDropHandler.prototype.removeHitAreas = function() {
      return this.hit_areas = [];
    };

    DragAndDropHandler.prototype.clear = function() {
      this.drag_element.remove();
      return this.drag_element = null;
    };

    DragAndDropHandler.prototype.removeDropHint = function() {
      if (this.previous_ghost) {
        return this.previous_ghost.remove();
      }
    };

    DragAndDropHandler.prototype.removeHover = function() {
      return this.hovered_area = null;
    };

    DragAndDropHandler.prototype.generateHitAreas = function() {
      var hit_areas_generator;
      hit_areas_generator = new HitAreasGenerator(this.tree_widget.tree, this.current_item.node, this.getTreeDimensions().bottom);
      return this.hit_areas = hit_areas_generator.generate();
    };

    DragAndDropHandler.prototype.findHoveredArea = function(x, y) {
      var area, dimensions, high, low, mid;
      dimensions = this.getTreeDimensions();
      if (x < dimensions.left || y < dimensions.top || x > dimensions.right || y > dimensions.bottom) {
        return null;
      }
      low = 0;
      high = this.hit_areas.length;
      while (low < high) {
        mid = (low + high) >> 1;
        area = this.hit_areas[mid];
        if (y < area.top) {
          high = mid;
        } else if (y > area.bottom) {
          low = mid + 1;
        } else {
          return area;
        }
      }
      return null;
    };

    DragAndDropHandler.prototype.mustOpenFolderTimer = function(area) {
      var node;
      node = area.node;
      return node.isFolder() && !node.is_open && area.position === Position.INSIDE;
    };

    DragAndDropHandler.prototype.updateDropHint = function() {
      var node_element;
      if (!this.hovered_area) {
        return;
      }
      this.removeDropHint();
      node_element = this.tree_widget._getNodeElementForNode(this.hovered_area.node);
      return this.previous_ghost = node_element.addDropHint(this.hovered_area.position);
    };

    DragAndDropHandler.prototype.startOpenFolderTimer = function(folder) {
      var openFolder,
        _this = this;
      openFolder = function() {
        return _this.tree_widget._openNode(folder, _this.tree_widget.options.slide, function() {
          _this.refreshHitAreas();
          return _this.updateDropHint();
        });
      };
      return this.open_folder_timer = setTimeout(openFolder, 500);
    };

    DragAndDropHandler.prototype.stopOpenFolderTimer = function() {
      if (this.open_folder_timer) {
        clearTimeout(this.open_folder_timer);
        return this.open_folder_timer = null;
      }
    };

    DragAndDropHandler.prototype.moveItem = function(position_info) {
      var doMove, event, moved_node, position, previous_parent, target_node,
        _this = this;
      if (this.hovered_area && this.hovered_area.position !== Position.NONE && this.canMoveToArea(this.hovered_area)) {
        moved_node = this.current_item.node;
        target_node = this.hovered_area.node;
        position = this.hovered_area.position;
        previous_parent = moved_node.parent;
        if (position === Position.INSIDE) {
          this.hovered_area.node.is_open = true;
        }
        doMove = function() {
          _this.tree_widget.tree.moveNode(moved_node, target_node, position);
          _this.tree_widget.element.empty();
          return _this.tree_widget._refreshElements();
        };
        event = this.tree_widget._triggerEvent('tree.move', {
          move_info: {
            moved_node: moved_node,
            target_node: target_node,
            position: Position.getName(position),
            previous_parent: previous_parent,
            do_move: doMove,
            original_event: position_info.original_event
          }
        });
        if (!event.isDefaultPrevented()) {
          return doMove();
        }
      }
    };

    DragAndDropHandler.prototype.getTreeDimensions = function() {
      var offset;
      offset = this.tree_widget.element.offset();
      return {
        left: offset.left,
        top: offset.top,
        right: offset.left + this.tree_widget.element.width(),
        bottom: offset.top + this.tree_widget.element.height() + 16
      };
    };

    return DragAndDropHandler;

  })();

  VisibleNodeIterator = (function() {
    function VisibleNodeIterator(tree) {
      this.tree = tree;
    }

    VisibleNodeIterator.prototype.iterate = function() {
      var is_first_node, _iterateNode,
        _this = this;
      is_first_node = true;
      _iterateNode = function(node, next_node) {
        var $element, child, children_length, i, must_iterate_inside, _i, _len, _ref3;
        must_iterate_inside = (node.is_open || !node.element) && node.hasChildren();
        if (node.element) {
          $element = $(node.element);
          if (!$element.is(':visible')) {
            return;
          }
          if (is_first_node) {
            _this.handleFirstNode(node, $element);
            is_first_node = false;
          }
          if (!node.hasChildren()) {
            _this.handleNode(node, next_node, $element);
          } else if (node.is_open) {
            if (!_this.handleOpenFolder(node, $element)) {
              must_iterate_inside = false;
            }
          } else {
            _this.handleClosedFolder(node, next_node, $element);
          }
        }
        if (must_iterate_inside) {
          children_length = node.children.length;
          _ref3 = node.children;
          for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
            child = _ref3[i];
            if (i === (children_length - 1)) {
              _iterateNode(node.children[i], null);
            } else {
              _iterateNode(node.children[i], node.children[i + 1]);
            }
          }
          if (node.is_open) {
            return _this.handleAfterOpenFolder(node, next_node, $element);
          }
        }
      };
      return _iterateNode(this.tree, null);
    };

    VisibleNodeIterator.prototype.handleNode = function(node, next_node, $element) {};

    VisibleNodeIterator.prototype.handleOpenFolder = function(node, $element) {};

    VisibleNodeIterator.prototype.handleClosedFolder = function(node, next_node, $element) {};

    VisibleNodeIterator.prototype.handleAfterOpenFolder = function(node, next_node, $element) {};

    VisibleNodeIterator.prototype.handleFirstNode = function(node, $element) {};

    return VisibleNodeIterator;

  })();

  HitAreasGenerator = (function(_super) {
    __extends(HitAreasGenerator, _super);

    function HitAreasGenerator(tree, current_node, tree_bottom) {
      HitAreasGenerator.__super__.constructor.call(this, tree);
      this.current_node = current_node;
      this.tree_bottom = tree_bottom;
    }

    HitAreasGenerator.prototype.generate = function() {
      this.positions = [];
      this.last_top = 0;
      this.iterate();
      return this.generateHitAreas(this.positions);
    };

    HitAreasGenerator.prototype.getTop = function($element) {
      return $element.offset().top;
    };

    HitAreasGenerator.prototype.addPosition = function(node, position, top) {
      this.positions.push({
        top: top,
        node: node,
        position: position
      });
      return this.last_top = top;
    };

    HitAreasGenerator.prototype.handleNode = function(node, next_node, $element) {
      var top;
      top = this.getTop($element);
      if (node === this.current_node) {
        this.addPosition(node, Position.NONE, top);
      } else {
        this.addPosition(node, Position.INSIDE, top);
      }
      if (next_node === this.current_node || node === this.current_node) {
        return this.addPosition(node, Position.NONE, top);
      } else {
        return this.addPosition(node, Position.AFTER, top);
      }
    };

    HitAreasGenerator.prototype.handleOpenFolder = function(node, $element) {
      if (node === this.current_node) {
        return false;
      }
      if (node.children[0] !== this.current_node) {
        this.addPosition(node, Position.INSIDE, this.getTop($element));
      }
      return true;
    };

    HitAreasGenerator.prototype.handleClosedFolder = function(node, next_node, $element) {
      var top;
      top = this.getTop($element);
      if (node === this.current_node) {
        return this.addPosition(node, Position.NONE, top);
      } else {
        this.addPosition(node, Position.INSIDE, top);
        if (next_node !== this.current_node) {
          return this.addPosition(node, Position.AFTER, top);
        }
      }
    };

    HitAreasGenerator.prototype.handleAfterOpenFolder = function(node, next_node, $element) {
      if (node === this.current_node || next_node === this.current_node) {
        return this.addPosition(node, Position.NONE, this.last_top);
      } else {
        return this.addPosition(node, Position.AFTER, this.last_top);
      }
    };

    HitAreasGenerator.prototype.handleFirstNode = function(node, $element) {
      if (node !== this.current_node) {
        return this.addPosition(node, Position.BEFORE, this.getTop($(node.element)));
      }
    };

    HitAreasGenerator.prototype.generateHitAreas = function(positions) {
      var group, hit_areas, position, previous_top, _i, _len;
      previous_top = -1;
      group = [];
      hit_areas = [];
      for (_i = 0, _len = positions.length; _i < _len; _i++) {
        position = positions[_i];
        if (position.top !== previous_top && group.length) {
          if (group.length) {
            this.generateHitAreasForGroup(hit_areas, group, previous_top, position.top);
          }
          previous_top = position.top;
          group = [];
        }
        group.push(position);
      }
      this.generateHitAreasForGroup(hit_areas, group, previous_top, this.tree_bottom);
      return hit_areas;
    };

    HitAreasGenerator.prototype.generateHitAreasForGroup = function(hit_areas, positions_in_group, top, bottom) {
      var area_height, area_top, position, _i, _len;
      area_height = (bottom - top) / positions_in_group.length;
      area_top = top;
      for (_i = 0, _len = positions_in_group.length; _i < _len; _i++) {
        position = positions_in_group[_i];
        hit_areas.push({
          top: area_top,
          bottom: area_top + area_height,
          node: position.node,
          position: position.position
        });
        area_top += area_height;
      }
      return null;
    };

    return HitAreasGenerator;

  })(VisibleNodeIterator);

  DragElement = (function() {
    function DragElement(node, offset_x, offset_y, $tree) {
      this.offset_x = offset_x;
      this.offset_y = offset_y;
      this.$element = $("<span class=\"jqtree-title jqtree-dragging\">" + node.name + "</span>");
      this.$element.css("position", "absolute");
      $tree.append(this.$element);
    }

    DragElement.prototype.move = function(page_x, page_y) {
      return this.$element.offset({
        left: page_x - this.offset_x,
        top: page_y - this.offset_y
      });
    };

    DragElement.prototype.remove = function() {
      return this.$element.remove();
    };

    return DragElement;

  })();

  GhostDropHint = (function() {
    function GhostDropHint(node, $element, position) {
      this.$element = $element;
      this.node = node;
      this.$ghost = $('<li class="jqtree_common jqtree-ghost"><span class="jqtree_common jqtree-circle"></span><span class="jqtree_common jqtree-line"></span></li>');
      if (position === Position.AFTER) {
        this.moveAfter();
      } else if (position === Position.BEFORE) {
        this.moveBefore();
      } else if (position === Position.INSIDE) {
        if (node.isFolder() && node.is_open) {
          this.moveInsideOpenFolder();
        } else {
          this.moveInside();
        }
      }
    }

    GhostDropHint.prototype.remove = function() {
      return this.$ghost.remove();
    };

    GhostDropHint.prototype.moveAfter = function() {
      return this.$element.after(this.$ghost);
    };

    GhostDropHint.prototype.moveBefore = function() {
      return this.$element.before(this.$ghost);
    };

    GhostDropHint.prototype.moveInsideOpenFolder = function() {
      return $(this.node.children[0].element).before(this.$ghost);
    };

    GhostDropHint.prototype.moveInside = function() {
      this.$element.after(this.$ghost);
      return this.$ghost.addClass('jqtree-inside');
    };

    return GhostDropHint;

  })();

  BorderDropHint = (function() {
    function BorderDropHint($element) {
      var $div, width;
      $div = $element.children('.jqtree-element');
      width = $element.width() - 4;
      this.$hint = $('<span class="jqtree-border"></span>');
      $div.append(this.$hint);
      this.$hint.css({
        width: width,
        height: $div.height() - 4
      });
    }

    BorderDropHint.prototype.remove = function() {
      return this.$hint.remove();
    };

    return BorderDropHint;

  })();

  ScrollHandler = (function() {
    function ScrollHandler(tree_widget) {
      this.tree_widget = tree_widget;
      this.previous_top = -1;
      this._initScrollParent();
    }

    ScrollHandler.prototype._initScrollParent = function() {
      var $scroll_parent, getParentWithOverflow, setDocumentAsScrollParent,
        _this = this;
      getParentWithOverflow = function() {
        var css_value, css_values, parent, scroll_parent, _i, _j, _len, _len1, _ref3, _ref4;
        css_values = ['overflow', 'overflow-y'];
        scroll_parent = null;
        _ref3 = _this.tree_widget.$el.parents();
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          parent = _ref3[_i];
          for (_j = 0, _len1 = css_values.length; _j < _len1; _j++) {
            css_value = css_values[_j];
            if ((_ref4 = $.css(parent, css_value)) === 'auto' || _ref4 === 'scroll') {
              return $(parent);
            }
          }
        }
        return null;
      };
      setDocumentAsScrollParent = function() {
        _this.scroll_parent_top = 0;
        return _this.$scroll_parent = null;
      };
      if (this.tree_widget.$el.css('position') === 'fixed') {
        setDocumentAsScrollParent();
      }
      $scroll_parent = getParentWithOverflow();
      if ($scroll_parent && $scroll_parent.length && $scroll_parent[0].tagName !== 'HTML') {
        this.$scroll_parent = $scroll_parent;
        return this.scroll_parent_top = this.$scroll_parent.offset().top;
      } else {
        return setDocumentAsScrollParent();
      }
    };

    ScrollHandler.prototype.checkScrolling = function() {
      var hovered_area;
      hovered_area = this.tree_widget.dnd_handler.hovered_area;
      if (hovered_area && hovered_area.top !== this.previous_top) {
        this.previous_top = hovered_area.top;
        if (this.$scroll_parent) {
          return this._handleScrollingWithScrollParent(hovered_area);
        } else {
          return this._handleScrollingWithDocument(hovered_area);
        }
      }
    };

    ScrollHandler.prototype._handleScrollingWithScrollParent = function(area) {
      var distance_bottom;
      distance_bottom = this.scroll_parent_top + this.$scroll_parent[0].offsetHeight - area.bottom;
      if (distance_bottom < 20) {
        this.$scroll_parent[0].scrollTop += 20;
        this.tree_widget.refreshHitAreas();
        return this.previous_top = -1;
      } else if ((area.top - this.scroll_parent_top) < 20) {
        this.$scroll_parent[0].scrollTop -= 20;
        this.tree_widget.refreshHitAreas();
        return this.previous_top = -1;
      }
    };

    ScrollHandler.prototype._handleScrollingWithDocument = function(area) {
      var distance_top;
      distance_top = area.top - $(document).scrollTop();
      if (distance_top < 20) {
        return $(document).scrollTop($(document).scrollTop() - 20);
      } else if ($(window).height() - (area.bottom - $(document).scrollTop()) < 20) {
        return $(document).scrollTop($(document).scrollTop() + 20);
      }
    };

    ScrollHandler.prototype.scrollTo = function(top) {
      var tree_top;
      if (this.$scroll_parent) {
        return this.$scroll_parent[0].scrollTop = top;
      } else {
        tree_top = this.tree_widget.$el.offset().top;
        return $(document).scrollTop(top + tree_top);
      }
    };

    ScrollHandler.prototype.isScrolledIntoView = function(element) {
      var $element, element_bottom, element_top, view_bottom, view_top;
      $element = $(element);
      if (this.$scroll_parent) {
        view_top = 0;
        view_bottom = this.$scroll_parent.height();
        element_top = $element.offset().top - this.scroll_parent_top;
        element_bottom = element_top + $element.height();
      } else {
        view_top = $(window).scrollTop();
        view_bottom = view_top + $(window).height();
        element_top = $element.offset().top;
        element_bottom = element_top + $element.height();
      }
      return (element_bottom <= view_bottom) && (element_top >= view_top);
    };

    return ScrollHandler;

  })();

  KeyHandler = (function() {
    var DOWN, LEFT, RIGHT, UP;

    LEFT = 37;

    UP = 38;

    RIGHT = 39;

    DOWN = 40;

    function KeyHandler(tree_widget) {
      this.tree_widget = tree_widget;
      if (tree_widget.options.keyboardSupport) {
        $(document).bind('keydown.jqtree', $.proxy(this.handleKeyDown, this));
      }
    }

    KeyHandler.prototype.deinit = function() {
      return $(document).unbind('keydown.jqtree');
    };

    KeyHandler.prototype.handleKeyDown = function(e) {
      var current_node, key, moveDown, moveLeft, moveRight, moveUp, selectNode,
        _this = this;
      if ($(document.activeElement).is('textarea,input')) {
        return true;
      }
      current_node = this.tree_widget.getSelectedNode();
      selectNode = function(node) {
        if (node) {
          _this.tree_widget.selectNode(node);
          if (_this.tree_widget.scroll_handler && (!_this.tree_widget.scroll_handler.isScrolledIntoView($(node.element).find('.jqtree-element')))) {
            _this.tree_widget.scrollToNode(node);
          }
          return false;
        } else {
          return true;
        }
      };
      moveDown = function() {
        return selectNode(_this.getNextNode(current_node));
      };
      moveUp = function() {
        return selectNode(_this.getPreviousNode(current_node));
      };
      moveRight = function() {
        if (current_node.hasChildren() && !current_node.is_open) {
          _this.tree_widget.openNode(current_node);
          return false;
        } else {
          return true;
        }
      };
      moveLeft = function() {
        if (current_node.hasChildren() && current_node.is_open) {
          _this.tree_widget.closeNode(current_node);
          return false;
        } else {
          return true;
        }
      };
      if (!current_node) {
        return true;
      } else {
        key = e.which;
        switch (key) {
          case DOWN:
            return moveDown();
          case UP:
            return moveUp();
          case RIGHT:
            return moveRight();
          case LEFT:
            return moveLeft();
        }
      }
    };

    KeyHandler.prototype.getNextNode = function(node, include_children) {
      var next_sibling;
      if (include_children == null) {
        include_children = true;
      }
      if (include_children && node.hasChildren() && node.is_open) {
        return node.children[0];
      } else {
        if (!node.parent) {
          return null;
        } else {
          next_sibling = node.getNextSibling();
          if (next_sibling) {
            return next_sibling;
          } else {
            return this.getNextNode(node.parent, false);
          }
        }
      }
    };

    KeyHandler.prototype.getPreviousNode = function(node) {
      var previous_sibling;
      if (!node.parent) {
        return null;
      } else {
        previous_sibling = node.getPreviousSibling();
        if (previous_sibling) {
          if (!previous_sibling.hasChildren() || !previous_sibling.is_open) {
            return previous_sibling;
          } else {
            return this.getLastChild(previous_sibling);
          }
        } else {
          if (node.parent.parent) {
            return node.parent;
          } else {
            return null;
          }
        }
      }
    };

    KeyHandler.prototype.getLastChild = function(node) {
      var last_child;
      if (!node.hasChildren()) {
        return null;
      } else {
        last_child = node.children[node.children.length - 1];
        if (!last_child.hasChildren() || !last_child.is_open) {
          return last_child;
        } else {
          return this.getLastChild(last_child);
        }
      }
    };

    return KeyHandler;

  })();

}).call(this);
