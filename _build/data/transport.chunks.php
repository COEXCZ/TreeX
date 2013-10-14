<?php
/**
 * @package treex
 * @subpackage build
 */

$chunks = array();

/* course chunks */
$chunks[1]= $modx->newObject('modChunk');
$chunks[1]->fromArray(array(
    'id' => 1,
    'name' => 'resourcesTree',
    'description' => '',
    'snippet' => getSnippetContent($sources['chunks'].'resourcestree.chunk.tpl'),
),'',true,true);

$chunks[2]= $modx->newObject('modChunk');
$chunks[2]->fromArray(array(
    'id' => 2,
    'name' => 'resourceUpdateForm',
    'description' => '',
    'snippet' => getSnippetContent($sources['chunks'].'resourceupdateform.chunk.tpl'),
),'',true,true);

$chunks[3]= $modx->newObject('modChunk');
$chunks[3]->fromArray(array(
    'id' => 3,
    'name' => 'resourceCreateForm',
    'description' => '',
    'snippet' => getSnippetContent($sources['chunks'].'resourcecreateform.chunk.tpl'),
),'',true,true);

return $chunks;
