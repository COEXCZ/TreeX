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
     'id' => 5,
     'name' => 'TreeXCheckPolicy',
     'description' => 'Redactor\'s init script',
     'snippet' => getSnippetContent($sources['snippets'].'treexcheckpolicy.snippet.php'),
),'',true,true);

$snippets[6]= $modx->newObject('modSnippet');
$snippets[6]->fromArray(array(
     'id' => 6,
     'name' => 'deleteResource',
     'description' => 'Deletes a MODX resource in front-end manager',
     'snippet' => getSnippetContent($sources['snippets'].'deleteresource.snippet.php'),
),'',true,true);

return $snippets;
