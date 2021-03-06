<?php
/**
 * Add plugins to build
 *
 * @package treex
 * @subpackage build
 */
$plugins = array();
$events = array();

$plugins[0]= $modx->newObject('modPlugin');
$plugins[0]->fromArray(array(
    'id' => 0,
    'name' => 'TreeXInvalidateCache',
    'description' => 'Invalidate TreeX\'s cache',
    'plugincode' => getSnippetContent($sources['plugins'].'treexinvalidatecache.plugin.php'),
),'',true,true);

$events[0] = array();
$events[0]['OnDocFormSave']= $modx->newObject('modPluginEvent');
$events[0]['OnDocFormSave']->fromArray(array(
        'event' => 'OnDocFormSave',
        'priority' => 0,
        'propertyset' => 0,
    ),'',true,true);

$events[0]['OnDocFormDelete']= $modx->newObject('modPluginEvent');
$events[0]['OnDocFormDelete']->fromArray(array(
        'event' => 'OnDocFormDelete',
        'priority' => 0,
        'propertyset' => 0,
    ),'',true,true);

$events[0]['OnResourceUndelete']= $modx->newObject('modPluginEvent');
$events[0]['OnResourceUndelete']->fromArray(array(
        'event' => 'OnResourceUndelete',
        'priority' => 0,
        'propertyset' => 0,
    ),'',true,true);

$events[0]['OnResourceSort']= $modx->newObject('modPluginEvent');
$events[0]['OnResourceSort']->fromArray(array(
        'event' => 'OnResourceSort',
        'priority' => 0,
        'propertyset' => 0,
    ),'',true,true);

$events[0]['OnDocPublished']= $modx->newObject('modPluginEvent');
$events[0]['OnDocPublished']->fromArray(array(
        'event' => 'OnDocPublished',
        'priority' => 0,
        'propertyset' => 0,
    ),'',true,true);

$events[0]['OnDocUnPublished']= $modx->newObject('modPluginEvent');
$events[0]['OnDocUnPublished']->fromArray(array(
        'event' => 'OnDocUnPublished',
        'priority' => 0,
        'propertyset' => 0,
    ),'',true,true);

$plugins[0]->addMany($events[0]);


$plugins[1]= $modx->newObject('modPlugin');
$plugins[1]->fromArray(array(
    'id' => 0,
    'name' => 'TreeXInjectMgr',
    'description' => 'Inject mgr context on web login',
    'plugincode' => getSnippetContent($sources['plugins'].'treexinjectmgr.plugin.php'),
),'',true,true);


$events[1] = array();
$events[1]['OnWebLogin']= $modx->newObject('modPluginEvent');
$events[1]['OnWebLogin']->fromArray(array(
    'event' => 'OnWebLogin',
    'priority' => 0,
    'propertyset' => 0,
),'',true,true);

$events[1]['OnWebLogout']= $modx->newObject('modPluginEvent');
$events[1]['OnWebLogout']->fromArray(array(
    'event' => 'OnWebLogout',
    'priority' => 0,
    'propertyset' => 0,
),'',true,true);


$plugins[1]->addMany($events[1]);

return $plugins;
