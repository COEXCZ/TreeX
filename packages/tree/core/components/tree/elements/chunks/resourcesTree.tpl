[[-chunk resourcesTree]]
<link rel="stylesheet" href="[[++tree.assets_url:isnot=``:then=`[[++tree.assets_url]]`:else=`[[++assets_url]]components/tree/`]]css/tree.css" />
<!--[if lt IE 9]>
    <script src="[[++tree.assets_url:isnot=``:then=`[[++tree.assets_url]]`:else=`[[++assets_url]]components/tree/`]]js/vendor/jquery/jquery-1.10.2.min.js"></script>
<![endif]-->
<!--[if gte IE 9]><!-->
    <script src="[[++tree.assets_url:isnot=``:then=`[[++tree.assets_url]]`:else=`[[++assets_url]]components/tree/`]]js/vendor/jquery/jquery-2.0.3.min.js"></script>
<!--<![endif]-->
<script src="[[++tree.assets_url:isnot=``:then=`[[++tree.assets_url]]`:else=`[[++assets_url]]components/tree/`]]js/vendor/modernizr.dev.js"></script>
<script src="[[++tree.assets_url:isnot=``:then=`[[++tree.assets_url]]`:else=`[[++assets_url]]components/tree/`]]js/vendor/jqtree/jquery.treex.js"></script>

<div class="js-tree jqtree bonsai" data-url="[[++tree.assets_url:isnot=``:then=`[[++tree.assets_url]]`:else=`[[++assets_url]]components/tree/`]]connector.php?action=web/resource/getnodes&id=web"></div>

<script>
	[[- http://127.0.0.1/tree/packages/tree/assets/components/tree/connector.php?action=web/resource/getnodes&id=web&children=1 ]]
	[[-var dataUrl = '[[++tree.assets_url:isnot=``:then=`[[++tree.assets_url]]`:else=`[[++assets_url]]components/tree/`]]connector.php?action=web/resource/getnodes&id=web&children=1';]]
</script>

<script src="[[++tree.assets_url:isnot=``:then=`[[++tree.assets_url]]`:else=`[[++assets_url]]components/tree/`]]js/treeInit.js"></script>
