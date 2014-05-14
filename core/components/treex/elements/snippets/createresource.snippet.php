<?php
/**
 * createResource
 *
 * DESCRIPTION
 *
 * Custom hook for FormIt that create a resource
 *
 * USAGE:
 *
 * [[!FormIt? &hooks=`createResource`]]
 *
 */
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

$values = $hook->getValues();

$values['published'] = isset($values['published']) ? 1 : 0;
$values['hidemenu'] = isset($values['hidemenu']) ? 1 : 0;
$values['content'] = $_POST['content'];
$values['syncsite'] = 1;


// clean and prepare content data
if (isset($values['class_key']) && $values['class_key'] == 'modWebLink') {
    $values['content'] = trim(strip_tags($values['content']));
} else {
    $values['class_key'] = 'modDocument';
    $values['content'] = preg_replace('/\[\[!?[^!\$][^\]]+(\s*&[^=]+=`[^`]*`\s*)*\]\]/U', '', $values['content']);
}


$processorResponse = $modx->runProcessor('resource/create', $values);
$response = $processorResponse->getResponse();

$updateId = $modx->getOption('treex.update_form_id', null, 1);
$nodePath = $treeX->getNodePath($response['object']['id'], $response['object']['context_key'], false);

$removed = $modx->cacheManager->delete($nodePath);
if(!$removed) {
    $nodePathItems = explode('/', $nodePath);
    array_pop($nodePathItems);

    $nodePathItems = implode('/', $nodePathItems);
    $nodePathItems = substr($nodePathItems, 0, -4);

    $modx->cacheManager->delete($nodePathItems);
}

$modx->sendRedirect($modx->makeUrl($updateId, '', array('resource' => $response['object']['id'])));

return true;