<?php
/**
 * fetchResource
 *
 * DESCRIPTION
 *
 * Custom pre hook for FormIt that fetch resource with ID from resource GET parameter
 *
 * USAGE:
 *
 * [[!FormIt? &preHooks=`fetchResource`]]
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

$id = (isset($_GET['resource'])) ? intval($_GET['resource']) : 0;

if ($id == 0) {
    $hook->addError('title','Resource not found.');
    return false;
}


$processorResponse = $modx->runProcessor('resource/get', array('id' => $id));
$response = $processorResponse->getResponse();

$response['object']['resource_id'] = $response['object']['id'];
$response['object']['published'] = ($response['object']['published'] == true) ? 1 : 0;

unset($response['object']['id']);

$hook->setValues($response['object']);

return true;