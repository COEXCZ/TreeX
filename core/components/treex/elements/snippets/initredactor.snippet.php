<?php
/**
 * initRedactor
 *
 * DESCRIPTION
 *
 * Inject Redactor's JS and CSS files to page. Also include Redactor's init script from selected chunk
 *
 * PROPERTIES:
 *
 * &tpl                 string  Chunk name of Redactor's init script. Default initRedactorTpl
 * &fileUploadAction    string  Name of processor that will handle file upload. Default web/resource/fileupload
 * &imageUploadAction   string  Name of processor that will handle image upload. Default web/resource/imageupload
 *
 * USAGE:
 *
 * [[!initRedactor? &tpl=`initRedactorTpl` &action=`web/resource/imageupload`]]
 *
 */

$corePath = $modx->getOption('treex.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/treex/');
$treeX = $modx->getService(
    'treex',
    'TreeX',
    $corePath . 'model/treex/',
    array(
        'core_path' => $corePath
    )
);

$tpl = $modx->getOption('tpl', $scriptProperties, 'initRedactorTpl');
$fileUploadAction = $modx->getOption('fileUploadAction', $scriptProperties, 'web/resource/fileupload');
$imageUploadAction = $modx->getOption('imageUploadAction', $scriptProperties, 'web/resource/imageupload');

$assets = $treeX->getOption('assetsUrl');

$modx->regClientScript($assets . 'js/vendor/redactor/redactor.js');
$modx->regClientCSS($assets . 'css/vendor/redactor/redactor.css');

$resource = (isset($_GET['resource'])) ? intval($_GET['resource']) : 0;
if ($resource > 0) {
    $isParent = false;
} else {
    $isParent = true;
    $resource = (isset($_GET['parent'])) ? intval($_GET['parent']) : 0;
}

$params = array(
    'parent' => $isParent,
    'resource' => $resource,
);

$phs = array(
    'connectorUrl' => $treeX->getOption('connectorUrl'),
    'params' => $modx->toJSON($params),
    'fileUploadAction' => $fileUploadAction,
    'imageUploadAction' => $imageUploadAction
);

$modx->regClientStartupHTMLBlock($modx->getChunk($tpl, $phs));