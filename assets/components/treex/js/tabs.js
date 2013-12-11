if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

RedactorPlugins.tabs = {

    init: function()
    {
        var _selfTabs = this;

        var callback = function() {
            var editorHTML = $('.redactor_editor');

            var tabList = editorHTML.find('ul').find('li');
            var tabListHtml = $('<div />');

            $(tabList).each(function() {
                var _self = $(this).find('a');

                var item = { href: _self.attr('href'), title: _self.text() };

                tabListHtml.append(_selfTabs.newTab(item));
            });

            $('#redactor_modal_inner section.tabs-content').html(tabListHtml);

            _selfTabs.addButtonInit();
            _selfTabs.buttonsInit();
            _selfTabs.saveButtonInit();
            _selfTabs.sortableInit();

        };

        _selfTabs.buttonAdd('tabs', 'Tabs Management', function()
        {
            _selfTabs.modalInit('Tabs Management', '#tabs_modal', 500, callback);

        });

        _selfTabs.buttonAddSeparatorBefore('tabs');

    },
    buttonsInit: function() {
        var _selfTabs = this;

        $('.js-tabs-remove').on('click', function(event) {
            var _self = $(this);

            _self.parents('.js-tabs-item').addClass('removed');

            event.preventDefault();
        });

        $('.js-tabs-edit').on('click', function(event) {
            var _self = $(this),
                parent = _self.parents('.js-tabs-item'),
                text = parent.find('.tabs-text');

            parent.find('.js-tabs-buttons').hide();
            text.html('<input type="text" value="' + text.text() + '" class="js-input-title" /><button type="submit" class="js-tabs-title-save">Save</button>');

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

            parent.find('.js-tabs-buttons').show();
            text.text(value);

            event.preventDefault();
        });

    },
    saveButtonInit: function() {
        var _selfTabs = this;

        $('.js-tabs-save').on('click', function(event) {
            var tabs = $('<ul />');

            $('.js-tabs-item').each(function() {
                var _self = $(this);
                var div = $('<div />');

                if(!_self.hasClass('removed')) {
                    tabs.append('<li><a href="' + _self.data('href') + '">' + _self.find('.tabs-text').text() + '</a></li>');

                    if($('div' + _self.data('href')).length === 0) {
                        var id = _self.data('href');

                        if (id.substring(0, 1) == '#') {
                          id = id.substring(1);
                        }
                        var container = div.attr('id', id).text('Add text');
                        $('.redactor_editor #tabs').append(container);
                    }
                } else {
                    if($('div' + _self.data('href')).length !== 0) {
                        $('div' + _self.data('href')).remove();
                    }
                }

            });

            $('.redactor_editor #tabs>ul').replaceWith(tabs);

            _selfTabs.sync();
            initTabs();

            _selfTabs.modalClose();

            event.preventDefault();
        });

    },
    sortableInit: function() {
        $("#redactor_modal_inner section.tabs-content > div").sortable({
            axis: "y"
        });
    },
    addButtonInit: function() {
        var _selfTabs = this;

        $('.js-tabs-add').on('click', function(event) {
            var timestamp = new Date().getTime();
            var item = _selfTabs.newTab({href: '#tab-' + timestamp, title: 'Tab'});

            $('#redactor_modal_inner section.tabs-content > div').append(item);

            _selfTabs.buttonsInit();
            _selfTabs.sortableInit();

            event.preventDefault();
        });
    },
    newTab: function(item) {
        var _self = item;

        var item = '<div data-href="' + _self.href + '" class="js-tabs-item"><span class="tabs-text">' + _self.title + '</span> <span class="js-tabs-buttons"><a href="" class="js-tabs-edit">Edit</a> <a href="" class="js-tabs-remove">Remove</a></span></div>';

        return item;
    }
}