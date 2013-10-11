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
 
$values = $hook->getValues();

$values['id'] = $values['resource_id'];
$values['published'] = isset($values['published']) ? 1 : 0;

unset($values['resource_id']);

$processorResponse = $modx->runProcessor('resource/update', $values);
$response = $processorResponse->getResponse();

$modx->sendRedirect($modx->makeUrl($modx->resource->id, '', array('resource' => $response['object']['id'])));

return false;