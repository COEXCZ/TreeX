<?php
/**
 * Add snippets to build
 * 
 * @package treex
 * @subpackage build
 */
$snippets = array();

$snippets[0]= $modx->newObject('modSnippet');
$snippets[0]->fromArray(array(
    'id' => 0,
    'name' => 'fetchResource',
    'description' => 'Fetch resource data',
    'snippet' => getSnippetContent($sources['snippets'].'fetchresource.snippet.php'),
),'',true,true);

$snippets[1]= $modx->newObject('modSnippet');
$snippets[1]->fromArray(array(
     'id' => 1,
     'name' => 'updateResource',
     'description' => 'Update resource',
     'snippet' => getSnippetContent($sources['snippets'].'updateresource.snippet.php'),
),'',true,true);

$snippets[2]= $modx->newObject('modSnippet');
$snippets[2]->fromArray(array(
     'id' => 2,
     'name' => 'createResource',
     'description' => 'Create resource',
     'snippet' => getSnippetContent($sources['snippets'].'createresource.snippet.php'),
),'',true,true);

$snippets[3]= $modx->newObject('modSnippet');
$snippets[3]->fromArray(array(
     'id' => 3,
     'name' => 'setParent',
     'description' => 'Sets parent resoruce',
     'snippet' => getSnippetContent($sources['snippets'].'setparent.snippet.php'),
),'',true,true);

$snippets[4]= $modx->newObject('modSnippet');
$snippets[4]->fromArray(array(
     'id' => 4,
     'name' => 'initRedactor',
     'description' => 'Redactor\'s init script',
     'snippet' => getSnippetContent($sources['snippets'].'initredactor.snippet.php'),
),'',true,true);

$snippets[5]= $modx->newObject('modSnippet');
$snippets[5]->fromArray(array(
     'id' => 4,
     'name' => 'injectMgr',
     'description' => 'If user is manager, then inject mgr context (when you log in via Login EXTRA)',
     'snippet' => getSnippetContent($sources['snippets'].'injectmgr.snippet.php'),
),'',true,true);


return $snippets;
