<script type="text/javascript">
    $(document).ready(function(){
        $('textarea').redactor({
            imageUpload: '[[+connectorUrl]]?action=[[+imageUploadAction]]',
            fileUpload: '[[+connectorUrl]]?action=[[+fileUploadAction]]',
            uploadFields: [[+params]],
            imageUploadErrorCallback: function(json){
                alert(json.msg);
            },
            fileUploadErrorCallback: function(json){
                alert(json.msg);
            }
        });
    });
</script>
