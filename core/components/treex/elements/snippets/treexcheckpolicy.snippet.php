<?php
/**
 * TreeXCheckPolicy
 *
 */

if (!isset($_GET['resource'])) return;

/** @var modResource $resource */
$resource = $modx->getObject('modResource', intval($_GET['resource']));

if ($resource) {
    return $resource->checkPolicy('save');
}

return;