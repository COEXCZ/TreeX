[[-chunk resourcesTree]]
<link rel="stylesheet" href="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]css/tree.css" />
<!--[if lt IE 9]>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<![endif]-->
<!--[if gte IE 9]><!-->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<!--<![endif]-->
<script src="http://modernizr.com/downloads/modernizr-latest.js"></script>
<script src="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]js/vendor/jqtreex/jquery.treex.js"></script>

<div class="js-tree jqtree bonsai" data-url="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]connector.php"></div>
<!-- <div class="js-tree jqtree bonsai" data-url="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]connector.php?action=web/resource/getnodes&id=web"></div> -->

<script>
	[[- http://127.0.0.1/tree/packages/tree/assets/components/tree/connector.php?action=web/resource/getnodes&id=web&children=1 ]]
	[[-var dataUrl = '[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]connector.php?action=web/resource/getnodes&id=web&children=1';]]
</script>

<script src="[[++treex.assets_url:isnot=``:then=`[[++treex.assets_url]]`:else=`[[++assets_url]]components/treex/`]]js/treeInit.js"></script>
