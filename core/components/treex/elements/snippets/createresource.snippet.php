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

$values['published'] = isset($values['published']) ? 1 : 0;
$values['parent'] = $_GET['parent'];

$processorResponse = $modx->runProcessor('resource/create', $values);
$response = $processorResponse->getResponse();

$updateId = $modx->getOption('treex.update_form_id', null, 1);

$modx->sendRedirect($modx->makeUrl($updateId, '', array('resource' => $response['object']['id'])));

return true;