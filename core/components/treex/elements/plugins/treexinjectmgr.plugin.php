<?php
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

$eventName = $modx->event->name;
switch($eventName) {
    case 'OnWebLogin':
        if ($user->id) {
            if (!$user->hasSessionContext('mgr')) {
                $user->addSessionContext('mgr');
            }
        }

        break;

    case 'OnWebLogout':
        if ($user->id) {
            if (!empty($_REQUEST['service']) && $_REQUEST['service'] == 'logout') {
                $user->removeSessionContext('mgr');
            }
        }

        break;

}