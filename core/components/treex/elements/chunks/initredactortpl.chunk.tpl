<script type="text/javascript">
    $(document).ready(function(){
        var wysiwyg = $('textarea').redactor({
            paragraphy: false,
            convertDivs: false,
            imageUpload: '[[+connectorUrl]]?action=[[+imageUploadAction]]',
            fileUpload: '[[+connectorUrl]]?action=[[+fileUploadAction]]',
            uploadFields: [[+params]],
            imageUploadErrorCallback: function(json){
                alert(json.msg);
            },
            fileUploadErrorCallback: function(json){
                alert(json.msg);
            },
            initCallback: function(){
                var tabs = $( "#tabs" ).tabs();
                tabs.find( ".ui-tabs-nav" ).sortable({
                    axis: "x",
                    stop: function() {
                        tabs.tabs( "refresh" );
                        wysiwyg.redactor('sync');
                    }
                });
            }
        });
    });
</script>
