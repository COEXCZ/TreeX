<?php
/**
 * updateResource
 *
 * DESCRIPTION
 *
 * Custom hook for FormIt that update resource
 *
 * USAGE:
 *
 * [[!FormIt? &hooks=`updateResource`]]
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

$values['id'] = $values['resource_id'];
$values['published'] = isset($values['published']) ? 1 : 0;
$values['content'] = $_POST['content'];

unset($values['resource_id']);

$processorResponse = $modx->runProcessor('resource/update', $values);
$response = $processorResponse->getResponse();

$nodePath = $treeX->getNodePath($response['object']['id'], $response['object']['context_key'], false);
$modx->cacheManager->delete($nodePath);

$modx->sendRedirect($modx->makeUrl($modx->resource->id, '', array('resource' => $response['object']['id'])));

return true;