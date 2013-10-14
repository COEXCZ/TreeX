<?php
/**
 * Sorts the resource tree
 *
 * @param string    $node       Currently moved node's identifier in format ctx_id
 * @param string    $target     Target node's identifier in format ctx_id
 * @param string    $prev       Previous parent node's identifier in format ctx_id
 * @param integer   $after      If 1 node is moved after target, if 0 node is moved as first into the target
 *
 * @package treex
 * @subpackage processors.resource
 */
class TreeXSortProcessor extends modProcessor {
    /** @var modResource $node */
    private $node;

    /** @var modResource|string $target */
    private $target;

    /** @var int $after */
    private $after;

    public function checkPermissions() {
        return $this->modx->hasPermission('save_document');
    }

    public function getLanguageTopics() {
        return array('resource');
    }


    public function process() {
        $setup = $this->setup();
        if ($setup !== true) {
            return $this->failure($setup);
        }

        if ($this->after == 0) {
            $moved = $this->moveAsFirst();
            if ($moved !== true) {
                return $this->failure($moved);
            }
        } else {
            $this->moveAfter();
        }

        return $this->success();
    }

    /**
     * Sets private variables that are used to count new menu indexes
     *
     * @return bool|string
     */
    public function setup() {
        $this->after = $this->getProperty('position');

        $node = $this->getProperty('node');
        $target = $this->getProperty('target');

        $node = explode('_', $node);
        $target = explode('_', $target);

        $this->node = $this->modx->getObject('modResource', $node[1]);
        $this->target = ($target[1] == 0) ? $target[0] : $this->modx->getObject('modResource', $target[1]);

        if (empty($this->node) || empty($this->target)) {
            return $this->modx->lexicon('treex.resource_nf');
        }

        return true;
    }

    /**
     * Makes $node as first children of $target
     *
     * @return bool|string
     */
    public function moveAsFirst() {
        if ($this->target instanceof modResource) {
            $children = $this->target->getMany('Children');
            $parent = $this->target->id;
            $context = $this->target->context_key;
        } else {
            $children = $this->modx->getCollection('modResource', array('context_key' => $this->target, 'parent' => 0));
            $parent = 0;
            $context = $this->target;
        }

        $newMenuIndex = 1;
        /** @var modResource $child */
        foreach ($children as $child) {
            $child->set('menuindex', $newMenuIndex);
            if (!$child->save()) {
                return $this->modx->lexicon('treex.unable_save_resource');
            }

            $newMenuIndex++;
        }

        $this->node->set('parent', $parent);
        $this->node->set('context_key', $context);
        $this->node->set('menuindex', 0);
        if (!$this->node->save()) {
            return $this->modx->lexicon('treex.unable_save_resource');
        }

        return true;
    }

    /**
     * Move $node after $target
     *
     * @return bool|string
     */
    public function moveAfter() {
        if ($this->target instanceof modResource) {
            $c = $this->modx->newQuery('modResource');
            $c->where(array(
                'context_key' => $this->target->context_key,
                'parent' => $this->target->parent,
                'menuindex:>' => $this->target->menuindex,
                'id:!=' => $this->node->id
            ));
            $c->sortby('menuindex');

            $resources = $this->modx->getCollection('modResource', $c);
        } else {
            return $this->modx->lexicon('treex.get_context_insteadof_resource');
        }

        $newMenuIndex = $this->target->menuindex + 2;
        /** @var modResource $resource */
        foreach ($resources as $resource) {
            $resource->set('menuindex', $newMenuIndex);
            if (!$resource->save()) {
                return $this->modx->lexicon('treex.unable_save_resource');
            }

            $newMenuIndex++;
        }

        $this->node->set('parent', $this->target->parent);
        $this->node->set('context_key', $this->target->context_key);
        $this->node->set('menuindex', $this->target->menuindex + 1);

        if (!$this->node->save()) {
            return $this->modx->lexicon('treex.unable_save_resource');
        }

        return true;
    }
}
return 'TreeXSortProcessor';
