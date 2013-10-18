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

                var target;
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
                        wysiwyg.redactor('sync');
                    }
                });

            }
        });
    });
</script>

<style>
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
</style>
