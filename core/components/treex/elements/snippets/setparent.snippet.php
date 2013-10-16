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

$hook->setValues(array('parent' => $parent));

return true;