<?php
$corePath = $modx->getOption('treex.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/treex/');
/** @var TreeX $treeX */
$treeX = $modx->getService(
    'treex',
    'TreeX',
    $corePath . 'model/treex/',
    array(
        'core_path' => $corePath
    )
);

$eventName = $modx->event->name;
switch($eventName) {
    case 'OnDocFormSave':
        $nodePath = $treeX->getNodePath($resource->id, $resource->context_key, false);

        $removed = $modx->cacheManager->delete($nodePath);
        if(!$removed) {
            $nodePathItems = explode('/', $nodePath);
            array_pop($nodePathItems);

            $nodePathItems = implode('/', $nodePathItems);
            $nodePathItems = substr($nodePathItems, 0, -4);

            $modx->cacheManager->delete($nodePathItems);
        }

        break;
    case 'OnDocUnPublished':
    case 'OnDocPublished':
    case 'OnResourceUndelete':
    case 'OnDocFormDelete':
        $nodePath = $treeX->getNodePath($resource->id, $resource->context_key, false);
        $nodePathItems = explode('/', $nodePath);
        array_pop($nodePathItems);

        $nodePathItems = implode('/', $nodePathItems);
        $nodePathItems = substr($nodePathItems, 0, -4);

        $modx->cacheManager->delete($nodePath);
        $modx->cacheManager->delete($nodePathItems);
        break;
    case 'OnResourceSort':
        foreach($nodes as $mode) {
            $nodePath = $treeX->getNodePath($mode->id, $mode->context, false);
            $nodePathItems = explode('/', $nodePath);
            array_pop($nodePathItems);

            $nodePathItems = implode('/', $nodePathItems);
            $nodePathItems = substr($nodePathItems, 0, -4);

            $modx->cacheManager->delete($nodePath);
            $modx->cacheManager->delete($nodePathItems);
        }
        break;
}
