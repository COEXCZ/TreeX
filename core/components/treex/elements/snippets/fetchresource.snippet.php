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

if (isset($_POST['resource_id'])) {
    $id = intval($_POST['resource_id']); 
} elseif (isset($_GET['resource'])) {
    $id = intval($_GET['resource']);
}  else {
    $id = 0;
}

if ($id == 0) {
    $hook->addError('title', $modx->lexicon('treex.resource_nf'));
    return false;
}

if (!empty($_GET['error'])) {
    $hook->addError('tvs', $_GET['error']);
    //return false;
}

$processorResponse = $modx->runProcessor('resource/get', array('id' => $id));
$response = $processorResponse->getResponse();

$response['object']['resource_id'] = $response['object']['id'];
$response['object']['published'] = ($response['object']['published'] == true) ? 1 : 0;
$response['object']['content'] = str_replace('[', '&#91;', $response['object']['content']);
$response['object']['content'] = str_replace(']', '&#93;', $response['object']['content']);


// get all TVs
$resource = $modx->getObject('modResource', $response['object']['resource_id']);
$templateVars = $resource->getMany('TemplateVars');
foreach ($templateVars as $tvId => $templateVar) {
    $response['object']['tv' . $templateVar->get('id')] = $templateVar->get('value');
}
// END get all TVs


if ($modx->user && $modx->user->id > 0) {
    $userGroups = $modx->user->getUserGroups();

    $c = $modx->newQuery('modAccessCategory');
    $c->where(array(
        'principal_class' => 'modUserGroup',
        'principal:IN' => $userGroups,
    ));

    $categoriesAccess = $modx->getIterator('modAccessCategory', $c);

    $categories = array();

    foreach ($categoriesAccess as $category) {
        $categories[] = $category->target;
    }

    $templates = $modx->getIterator('modTemplate', array('category:IN' => $categories));

    $options = array();

    /** @var modTemplate $template */
    foreach ($templates as $template) {
        $options[] = '<option value="' . $template->id . '" [[!+fi.template:FormItIsSelected=`' . $template->id . '`]]>' . $template->templatename . '</option>';
    }

    $response['object']['templateOptions'] = implode('', $options);

}
//var_dump($response['object']); die();

unset($response['object']['id']);
$hook->setValues($response['object']);
$modx->setPlaceholder('templateOptionsPlaceholder', $response['object']['templateOptions']);

return true;