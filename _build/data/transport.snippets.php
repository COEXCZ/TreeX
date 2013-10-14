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



return $snippets;
