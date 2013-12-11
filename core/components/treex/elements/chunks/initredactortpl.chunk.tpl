<script src="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]js/tabs.js"></script>
<script type="text/javascript">
    $(document).ready(function(){
        var wysiwyg = $('textarea').redactor({
            plugins: ['tabs'],
            paragraphy: false,
            convertDivs: false,
            imageUpload: '[[+connectorUrl]]?action=[[+imageUploadAction]]',
            fileUpload: '[[+connectorUrl]]?action=[[+fileUploadAction]]',
            imageGetJson: '[[+connectorUrl]]?action=[[+getImagesAction]]&resource=[[+resourceId]]',
            fileGetJson: '[[+connectorUrl]]?action=[[+getFilesAction]]&resource=[[+resourceId]]',
            browseFiles: true,
            linkResource: false,
            uploadFields: [[+params]],
            searchImages: false,
            observeLinks: false,
            imageUploadErrorCallback: function(json){
                alert(json.msg);
            },
            fileUploadErrorCallback: function(json){
                alert(json.msg);
            },
            initCallback: initTabs
        });
    });

    function initTabs() {

        var target;
        var _self = this;
        /*prepared to save active tab */
        /*if ($('.redactor_editor #tabs > ul li a.tab-active').length > 0) {
            target = $('.redactor_editor #tabs > ul li a.tab-active').attr('href');
        } else {
            $('.redactor_editor #tabs > ul li a:first').addClass('tab-active');
            target = $('.redactor_editor #tabs > ul li a:first').attr('href');
        }*/
        $('.redactor_editor #tabs > ul li a').removeClass('tab-active');
        $('.redactor_editor #tabs > div').removeClass('tab-active');
        $('.redactor_editor #tabs > ul li a:first').addClass('tab-active');
        target = $('.redactor_editor #tabs > ul li a:first').attr('href');
        $(target).addClass('tab-active');

        $('.redactor_editor #tabs > ul li a').on('click', function() {
            $(this).parents('ul').find('li a').removeClass('tab-active');
            $(this).addClass('tab-active');
            target = $(this).attr('href');
            $('.redactor_editor #tabs > div.tab-active').removeClass('tab-active');
            $(target).addClass('tab-active');
            /*wysiwyg.redactor('sync');*/
            return false;
        });

        return $(".redactor_editor #tabs > ul").sortable({
            axis: "x",
            stop: function() {
                _self.sync();
            }
        });
    }
</script>

<style>
    /* custom toggler */
    .redactor_editor #tabs>ul li {
        display: -moz-inline-stack;
        display: inline-block;
        vertical-align: middle;
        *vertical-align: auto;
        zoom: 1;
        *display: inline;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .redactor_editor #tabs>ul li a {
        display: -moz-inline-stack;
        display: inline-block;
        vertical-align: middle;
        *vertical-align: auto;
        zoom: 1;
        *display: inline;
        margin: 0 1px;
        padding: 5px 20px;
        cursor: pointer;
        background: #eeeeee;
        border: solid #cccccc 1px;
        border-bottom: none;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px 10px 0 0;
        border-radius: 10px 10px 0 0;
    }
    .redactor_editor #tabs>ul li a:hover { border-color: #888888 }
    .redactor_editor #tabs>ul li a.tab-active { background: #ffffff }
    .redactor_editor #tabs div { display: none }
    .redactor_editor #tabs div.tab-active { display: block }

    .tabs-content .js-tabs-item.removed {
        display: none;
    }

    body .redactor_toolbar li a.redactor_btn_tabs  {
        background: url([[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]css/i/tabs-ico.png) no-repeat 3px 3px;
    }
    .js-tabs-item {
        background-color: #ebebeb;
        border: 1px solid #d7d7d7;
        border-radius: 3px;
        margin-bottom: 3px;
        line-height: 30px;
        background-image: url([[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]css/i/tabs-ico.png);
        background-position: 4px 4px;
        background-repeat: no-repeat;
        padding-left: 30px;
        padding-right: 10px;
    }
    #redactor_modal section.tabs-content, #redactor_modal section.tabs-add-new-item {
        padding: 20px 13px 0 13px;
    }
    .js-tabs-buttons {
        float: right;
    }
    .js-tabs-add {
        background: url([[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]css/i/tabs-add.png) no-repeat 6px;
        padding-left: 30px;
        line-height: 18px;
        display: inline-block;
    }
</style>