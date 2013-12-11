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
 * &tabsModalTpl        string  Chunk name of Redactor's tabs extension. Default tabsModal
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
$tabsModalTpl = $modx->getOption('tabsModalTpl', $scriptProperties, 'tabsModal');
$fileUploadAction = $modx->getOption('fileUploadAction', $scriptProperties, 'web/resource/fileupload');
$imageUploadAction = $modx->getOption('imageUploadAction', $scriptProperties, 'web/resource/imageupload');
$getImagesAction = $modx->getOption('getImagesAction', $scriptProperties, 'web/resource/getimages');
$getFilesAction = $modx->getOption('getFilesAction', $scriptProperties, 'web/resource/getfiles');

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
    'imageUploadAction' => $imageUploadAction,
    'getImagesAction' => $getImagesAction,
    'getFilesAction' => $getFilesAction,
    'resourceId' => $resource
);

$modx->regClientStartupHTMLBlock($modx->getChunk($tpl, $phs));
$modx->regClientHTMLBlock($modx->getChunk($tabsModalTpl));