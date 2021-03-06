<script src="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]js/tabs.js"></script>
<script src="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]js/undo.js"></script>
<script src="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]js/styles.js"></script>
<script type="text/javascript">

    var stylesJSON = [
        {
            "btnName":"largeText",
            "className":"largeText",
            "wrap":"span",
            "spanClass":"largeText",
            "forceBlock":"-1"
        },
        {
            "btnName":"smallText",
            "className":"smallText",
            "wrap":"span",
            "spanClass":"smallText",
            "forceBlock":"-1"
        },
        {
            "btnName":"muted",
            "className":"muted",
            "wrap":"span",
            "spanClass":"muted",
            "forceBlock":"-1"
        },
        {
            "btnName":"text-warning",
            "className":"text-warning",
            "wrap":"span",
            "spanClass":"text-warning",
            "forceBlock":"-1"
        },
        {
            "btnName":"text-error",
            "className":"text-error",
            "wrap":"span",
            "spanClass":"text-error",
            "forceBlock":"-1"
        },
        {
            "btnName":"text-info",
            "className":"text-info",
            "wrap":"span",
            "spanClass":"text-info",
            "forceBlock":"-1"
        },
        {
            "btnName":"text-success",
            "className":"text-success",
            "wrap":"span",
            "spanClass":"text-success",
            "forceBlock":"-1"
        }
    ];


    $(document).ready(function(){
        var wysiwyg = $('textarea.rd').redactor({
            plugins: ['undo', 'tabs', 'styles'],
            stylesJson: stylesJSON,
            paragraphy: false,
            convertDivs: false,
            imageUpload: '[[+connectorUrl]]?action=[[+imageUploadAction]]',
            fileUpload: '[[+connectorUrl]]?action=[[+fileUploadAction]]',
            imageGetJson: '[[+connectorUrl]]?action=[[+getImagesAction]]&resource=[[+resourceId]]',
            fileGetJson: '[[+connectorUrl]]?action=[[+getFilesAction]]&resource=[[+resourceId]]',
            browseFiles: true,
            linkResource: false,
            linkProtocol: false,
            uploadFields: [[+params]],
            searchImages: false,
            observeLinks: false,
            buttons: ['html', '|', 'formatting', '|', 'bold', 'italic', 'underline', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|', 'image', 'video', 'file', 'table', 'link', '|', 'alignment', '|', 'horizontalrule', '|'],
            imageUploadErrorCallback: function(json){
                alert(json.msg);
            },
            fileUploadErrorCallback: function(json){
                alert(json.msg);
            },
            initCallback: function(){
        		var code = $('<div/>').html(this.get());
        		$(code).find('.nav>li, .nav>li>a').attr('unselectable', 'on');           		
        		this.set($(code).html());
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
    .redactor_toolbar li a.redactor_btn_undo {
        background-image: url([[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]css/i/fe-undo.png);
    }

    .redactor_toolbar li a.redactor_btn_redo {
        background-image: url([[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]css/i/fe-redo.png);
    }

    body .redactor_toolbar li a.redactor_btn_styles { background-position: -675px; }

    [[-
    .largeText {font-size: 24px;}
    .smallText {font-size: 9px;}
    .muted {color: grey;}
    .text-warning {background: orange;}
    .text-error {background: red;}
    .text-info {background: blue;}
    .text-success {background: green;}
    ]]

</style>