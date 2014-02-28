[[-chunk resourcesTree]]
<link rel="stylesheet" href="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]css/tree.css" />

<script>
    var treexSettings = {
        create_form_url: '[[++site_url]][[~[[++treex.create_form_id]]]]',
        update_form_url: '[[++site_url]][[~[[++treex.update_form_id]]]]',
        translate_newdocument: '[[%document_new? &namespace=`modx` &topic=`resource`]]'
    };
</script>

<script src="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]js/vendor/jquery.cookie/jquery.cookie.js"></script>
<script src="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]js/vendor/jqtreex/jquery.treex.js"></script>

<div class="js-tree jqtree bonsai" data-url="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]connector.php"></div>
<!-- <div class="js-tree jqtree bonsai" data-url="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]connector.php?action=web/resource/getnodes&id=web"></div> -->

<script>
	[[- http://127.0.0.1/tree/packages/tree/assets/components/tree/connector.php?action=web/resource/getnodes&id=web&children=1 ]]
	[[-var dataUrl = '[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]connector.php?action=web/resource/getnodes&id=web&children=1';]]
</script>

<script src="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]js/treeInit.js"></script>
