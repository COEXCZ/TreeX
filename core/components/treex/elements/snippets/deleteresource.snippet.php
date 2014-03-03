<?php
/**
 * deleteResource
 *
 * DESCRIPTION
 *
 * deletes a MODX resource 
 *
 * USAGE:
 * send a POST request with deleted resource ID to document with this sn ippet included
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

// do action only if proper POST parameter is set 
if (!empty($_POST['resource'])) {
    $resourceId = intval($_POST['resource']);
    if ($resourceId > 0) {
        $processorResponse = $modx->runProcessor('resource/delete', array('id' => $resourceId));
        $response = $processorResponse->getResponse();
        
        if ($response['success'] !== true) {
            return $modx->lexicon('treex.resource_delete_err');
        } else {
            return $modx->lexicon('treex.resource_deleted');
        }
    }
}
