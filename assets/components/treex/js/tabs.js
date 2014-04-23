if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

/*
    Redactor Tabs Management plugin for TTU

    init                        Inicialization of plugin
    buttonsInit                 Button init in modal window
    saveTitleButtonInit         Save button init in modal window
    saveButtonInit              Modal Save button init
    sortableInit                Init sortable plugin
    addButtonInit               Add button init for new tabs
    newTab                      New tab function
*/

RedactorPlugins.tabs = {

    init: function()
    {
        var _selfTabs = this; // Whole redactor variable

        var callback = function() {
            var editorHTML = $('.redactor_editor .nav-tabs');

            var tabList = editorHTML.find('li');
            var tabListHtml = $('<div />');

            // Find all tabs in redactor editor
            $(tabList).each(function() {
                var _self = $(this).find('a');

                var item = { href: _self.attr('href'), title: _self.text() };

                // Append new tab to the modal
                tabListHtml.append(_selfTabs.newTab(item));
            });

            // Add all items to modal
            var content = $('#redactor_modal_inner section.tabs-content').html(tabListHtml);

            // Init all buttons and sortable plugin
            _selfTabs.addButtonInit();
            _selfTabs.buttonsInit(content);
            _selfTabs.saveButtonInit();
            _selfTabs.sortableInit();

        };

        // Add button and init to redactor toolbar
        _selfTabs.buttonAdd('tabs', 'Tabs Management', function()
        {
            _selfTabs.modalInit('Tabs Management', '#tabs_modal', 500, callback);

        });

        _selfTabs.buttonAddSeparatorBefore('tabs');

    },
    buttonsInit: function(item) {
        var _selfTabs = this;
        item = $(item);

        // Init remove button
        item.on('click', '.js-tabs-remove', function(event) {
            var _self = $(this);

            _self.parents('.js-tabs-item').addClass('removed');

            event.preventDefault();
        });

        // Init edit button
        item.on('click', '.js-tabs-edit', function(event) {
            var _self = $(this),
                parent = _self.parents('.js-tabs-item'),
                text = parent.find('.tabs-text');

            parent.find('.js-tabs-buttons').hide();
            // Add input with text and save button for edit name of tab
            text.html('<input type="text" value="' + text.text() + '" class="js-input-title" /><button type="submit" class="js-tabs-title-save">Save</button>');

            // Init save button for edit
            _selfTabs.saveTitleButtonInit();

            event.preventDefault();
        });

    },
    saveTitleButtonInit: function() {
        $('.js-tabs-title-save').on('click', function(event) {
            var _self = $(this),
                parent = _self.parents('.js-tabs-item'),
                text = parent.find('.tabs-text'),
                value = parent.find('.js-input-title').val();

            // Replace old title with new title
            parent.find('.js-tabs-buttons').show();
            text.text(value);

            event.preventDefault();
        });

    },
    saveButtonInit: function() {
        var _selfTabs = this;

        $('.js-tabs-save').on('click', function(event) {
            var tabs = $('<ul class="nav nav-tabs" />');

            // If there are no items then remove the tabs div
            if($('.js-tabs-item').length > 0) {
                // Check if the tabs div is created
                if($('.redactor_editor .nav-tabs').length === 0) {
                    $('.redactor_editor').append($('<ul class="nav nav-tabs"></ul>'));
                }

                // Iterate all items in modal window
                $('.js-tabs-item').each(function() {
                    var _self = $(this);
                    var div = $('<div />');

                    // Remove items if there are no longer in the list
                    if(!_self.hasClass('removed')) {
                        // Create list item
                        tabs.append('<li unselectable="on"><a href="' + _self.data('href') + '" data-toggle="tab" unselectable="on">' + _self.find('.tabs-text').text() + '</a></li>');

                        // Does it already exist in editor if not then create new div with default text
                        if($('div' + _self.data('href')).length === 0) {
                            var id = _self.data('href');

                            if (id.substring(0, 1) == '#') {
                              id = id.substring(1);
                            }
                            var container = div.addClass('tab-pane fade').attr('id', id).text('Add text');

                            // Check if the tabs div is created
                            if($('.redactor_editor .tab-content').length === 0) {
                                $('.redactor_editor').append($('<div class="tab-content"></div>'));
                            }

                            $('.redactor_editor .tab-content').append(container);
                        }
                    } else {
                        if($('div' + _self.data('href')).length !== 0) {
                            $('div' + _self.data('href')).remove();
                        }
                    }

                });

                // Replace all tabs
                $('.redactor_editor ul.nav-tabs').replaceWith(tabs);

                // Add active toggle to first item
                $('.redactor_editor ul.nav-tabs>li:first-child').addClass('active');
                $('.redactor_editor .tab-content>.tab-pane:first-child').addClass('active in');
            } else {
                $('.redactor_editor .nav-tabs').remove();
            }

            // Sync editor with textarea
            _selfTabs.sync();

            // Close the modal window
            _selfTabs.modalClose();

            event.preventDefault();
        });

    },
    sortableInit: function() {
        // Init jQuery UI Plugin Sortable
        $("#redactor_modal_inner section.tabs-content > div").sortable({
            axis: "y"
        });
    },
    addButtonInit: function() {
        var _selfTabs = this;

        // Add new tab
        $('.js-tabs-add').on('click', function(event) {
            var timestamp = new Date().getTime();
            // Create tab with timestape and title
            var item = _selfTabs.newTab({href: '#tab-' + timestamp, title: 'Tab'});

            // Append to modal list
            $('#redactor_modal_inner section.tabs-content > div').append(item);

            // And init all the buttons for that item
            _selfTabs.buttonsInit(item);
            _selfTabs.sortableInit();

            event.preventDefault();
        });
    },
    newTab: function(item) {
        var _self = item;

        // New item for the modal list item
        var item = '<div data-href="' + _self.href + '" class="js-tabs-item"><span class="tabs-text">' + _self.title + '</span> <span class="js-tabs-buttons"><a href="" class="js-tabs-edit">Edit</a> <a href="" class="js-tabs-remove">Remove</a></span></div>';

        return item;
    }
};