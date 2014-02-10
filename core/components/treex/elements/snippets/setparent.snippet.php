<?php
/**
 * setparent
 *
 * DESCRIPTION
 *
 * Custom pre hook for FormIt that sets parent id from GET parent param
 *
 * USAGE:
 *
 * [[!FormIt? &preHooks=`setParent`]]
 *
 */

//global $hook;

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

$parent = (isset($_GET['parent'])) ? $_GET['parent'] : '';

if ($parent != '') {
    $parent = explode('_', $parent);

    if ($parent[1] == 0) {
        $parent = $parent[0];
    } else {
        $parent = $parent[1];
    }
}

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

    //$hook->setValue('templateOptions', implode('', $options));
    $modx->setPlaceholder('templateOptionsPlaceholder', implode('', $options));
}


$hook->setValues(array('parent' => $parent));

//print_r($hook->getValue('templateOptions')); die();

return true;