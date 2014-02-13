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
            }
        });
    });
</script>

<style>
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