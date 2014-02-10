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

// get values
$values = $hook->getValues();

$values['id'] = $values['resource_id'];
$values['published'] = isset($values['published']) ? 1 : 0;
$values['content'] = $_POST['content'];

// update template first
$resource = $modx->getObject('modResource', $values['id']);
$processorResponse = $modx->runProcessor('resource/update', array('id' => $values['resource_id'], 'template' => $values['template']));
$response = $processorResponse->getResponse();

// get resource (script loads resource again because there was a problem with resource TVs listing by new template set above (object returned old template data without it))
$resource = $modx->getObject('modResource', $values['id']);

// get all TVs
$templateVars = $resource->getMany('TemplateVars');
$templateVarsList = array();
foreach ($templateVars as $tvId => $templateVar) {
 	$templateVarsList['tv' . $templateVar->get('id')] = $templateVar->get('value');
}
// END get all TVs

// prepare to find TVs defined in form, but not defined for resource template
$missingTvs = array();

// upload TV image('s')
foreach ($_FILES as $formVar => $file) {
	// only if TV
	if (strpos($formVar,'tv') !== false) {
		// only if TV is defined for resource
		if (array_key_exists ($formVar, $templateVarsList)) {
			// only if uploaded new file
			if (!empty($file['name']) && !empty($file['tmp_name'])) {
				$processorResponse = $modx->runProcessor('web/resource/tvimageupload', array('resource' => $values['resource_id'], 'file' => $formVar), array('processors_path' => $modx->getOption('treex.core_path', null, $modx->getOption('core_path') . 'components/treex/') . 'processors/')); 
				$response = json_decode($processorResponse->response, true);
				$values[$formVar] = $response[0]['filelink'];
			} else {
				$values[$formVar] = $templateVarsList[$formVar];
			}
		} else {
			//$missingTvs[] = $formVar;
		}
	}
} 
// END upload  TVimage('s')

// check if all TVs exist
foreach ($values as $formVar => $value) {
    if (strpos($formVar,'tv') !== false) {
		// only if TV is defined for resource
		if (!array_key_exists ($formVar, $templateVarsList) && $formVar != 'tvs') {
            $missingTvs[] = $formVar;
        }
    }
}


// unset variables marked to delete
foreach ($_POST['delete'] as $value) {
	$values[$value] = '';
}
// END unset variables marked to delete

unset($values['resource_id']);

$processorResponse = $modx->runProcessor('resource/update', $values);
$response = $processorResponse->getResponse();

$nodePath = $treeX->getNodePath($response['object']['id'], $response['object']['context_key'], false);
$modx->cacheManager->delete($nodePath);

// test therea are some errors
if (count($missingTvs) == 0) {
	$modx->sendRedirect($modx->makeUrl($modx->resource->id, '', array('resource' => $response['object']['id'])));
	return true;
} else {
	$modx->sendRedirect($modx->makeUrl($modx->resource->id, '', array('resource' => $response['object']['id'], 'error' => $modx->lexicon('treex.tv_nf') . implode(', ', $missingTvs))));
	return true;
}

