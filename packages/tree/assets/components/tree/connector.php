<?php

require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';

require_once MODX_CONNECTORS_PATH.'index.php';

$corePath = $modx->getOption('tree.core_path',null,$modx->getOption('core_path').'components/tree/');


// define allowed actions
$webActions = array(
    'web/resource/getnodes'
);

// if node requested, then append node id to request
/*if (!empty($_REQUEST['node']) && intval($_REQUEST['node']) > 0) {
    $_REQUEST['id'] = $_REQUEST['id'].'_'.$_REQUEST['node'];
}*/

if (!empty($_REQUEST['action']) && in_array($_REQUEST['action'], $webActions)) {
    $version = $modx->getVersionData();
    if (version_compare($version['full_version'],'2.1.1-pl') >= 0) {
        if ($modx->user->hasSessionContext($modx->context->get('key'))) {
            $_SERVER['HTTP_MODAUTH'] = $_SESSION["modx.{$modx->context->get('key')}.user.token"];
        } else {
            $_SESSION["modx.{$modx->context->get('key')}.user.token"] = 0;
            $_SERVER['HTTP_MODAUTH'] = 0;
        }
    } else {
        $_SERVER['HTTP_MODAUTH'] = $modx->site_id;
    }
    $_REQUEST['HTTP_MODAUTH'] = $_SERVER['HTTP_MODAUTH'];
}



/* handle request */
$path = $modx->getOption('processorsPath',$modx->tree->config,$corePath.'processors/');

$result = $modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));

