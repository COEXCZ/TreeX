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
$response['object']['content'] = str_replace('[', '&#91;', $response['object']['content']);
$response['object']['content'] = str_replace(']', '&#93;', $response['object']['content']);

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


unset($response['object']['id']);

$hook->setValues($response['object']);

return true;