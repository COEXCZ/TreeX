<?php
/**
 * Get nodes for the resource tree
 *
 * @package treex
 * @subpackage processors.web.resource
 */
class TreeXGetNodesProcessor extends modProcessor {
    /** @var int $defaultRootId */
    public $defaultRootId;
    public $itemClass;
    public $node;
    public $contextKey = false;
    public $startNode = 0;
    public $items = array();
    public $actions = array();
    public $permissions = array();

    public function checkPermissions() {
        return $this->modx->hasPermission('resource_tree');
    }
    public function getLanguageTopics() {
        return array('resource','context');
    }

    public function initialize() {
        $this->setDefaultProperties(array(
            'sortBy' => $this->modx->getOption('tree_default_sort',null,'menuindex'),
            'sortDir' => 'ASC',
            'stringLiterals' => false,
            'noMenu' => false,
            'debug' => false,
            'nodeField' => $this->modx->getOption('resource_tree_node_name',null,'pagetitle'),
            'qtipField' => $this->modx->getOption('resource_tree_node_tooltip',null,''),
            'currentResource' => false,
            'currentAction' => false,
        ));
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @return mixed
     */
    public function process() {
        $this->getRootNode();

        $nodePath = $this->modx->treex->getNodePath($this->startNode, $this->contextKey);
        if($nodePath !== false) {
            $fromCache = $this->modx->cacheManager->get($nodePath);
            if ($fromCache) {
                return $fromCache;
            }
        }
        $this->prepare();

        if (empty($this->contextKey) || $this->contextKey == 'root') {
            $c = $this->getContextQuery();
        } else {
            $c = $this->getResourceQuery();
        }

        $collection = $this->modx->getCollection($this->itemClass, $c);

        $this->iterate($collection);

        if ($this->getProperty('stringLiterals',false)) {
            $json = $this->modx->toJSON($this->items);

            if($nodePath !== false) {
                $this->modx->cacheManager->set($nodePath, $json);
            }

            return $json;
        } else {
            $json = $this->toJSON($this->items);

            if($nodePath !== false) {
                $this->modx->cacheManager->set($nodePath, $json);
            }

            return $json;
        }
    }

    /**
     * Prepare the tree nodes, by getting the action IDs and permissions
     * @return void
     */
    public function prepare() {
        $this->actions = $this->modx->request->getAllActionIDs();
        $this->permissions = array(
            'save_document' => $this->modx->hasPermission('save_document') ? 'psave' : '',
            'view_document' => $this->modx->hasPermission('view_document') ? 'pview' : '',
            'edit_document' => $this->modx->hasPermission('edit_document') ? 'pedit' : '',
            'delete_document' => $this->modx->hasPermission('delete_document') ? 'pdelete' : '',
            'undelete_document' => $this->modx->hasPermission('undelete_document') ? 'pundelete' : '',
            'publish_document' => $this->modx->hasPermission('publish_document') ? 'ppublish' : '',
            'unpublish_document' => $this->modx->hasPermission('unpublish_document') ? 'punpublish' : '',
            'resource_duplicate' => $this->modx->hasPermission('resource_duplicate') ? 'pduplicate' : '',
            'resource_quick_create' => $this->modx->hasPermission('resource_quick_create') ? 'pqcreate' : '',
            'resource_quick_update' => $this->modx->hasPermission('resource_quick_update') ? 'pqupdate' : '',
            'edit_context' => $this->modx->hasPermission('edit_context') ? 'pedit' : '',
            'new_context' => $this->modx->hasPermission('new_context') ? 'pnew' : '',
            'delete_context' => $this->modx->hasPermission('delete_context') ? 'pdelete' : '',

            'new_context_document' => $this->modx->hasPermission('new_document') ? 'pnewdoc pnew_modDocument' : '',
            'new_context_symlink' => $this->modx->hasPermission('new_symlink') ? 'pnewdoc pnew_modSymLink' : '',
            'new_context_weblink' => $this->modx->hasPermission('new_weblink') ? 'pnewdoc pnew_modWebLink' : '',
            'new_context_static_resource' => $this->modx->hasPermission('new_static_resource') ? 'pnewdoc pnew_modStaticResource' : '',

            'new_static_resource' => $this->modx->hasPermission('new_static_resource') ? 'pnew pnew_modStaticResource' : '',
            'new_symlink' => $this->modx->hasPermission('new_symlink') ? 'pnew pnew_modSymLink' : '',
            'new_weblink' => $this->modx->hasPermission('new_weblink') ? 'pnew pnew_modWebLink' : '',
            'new_document' => $this->modx->hasPermission('new_document') ? 'pnew pnew_modDocument' : '',
        );

    }

    /**
     * Determine the context and root and start nodes for the tree
     *
     * @return void
     */
    public function getRootNode() {
        $this->defaultRootId = $this->modx->getOption('tree_root_id',null,0);

        $id = $this->getProperty('node');
        if (empty($id) || $id == 'root') {
            $this->startNode = $this->defaultRootId;
        } else {
            $parts = explode('_',$id);
            $this->contextKey = isset($parts[0]) ? $parts[0] : false;
            $this->startNode = !empty($parts[1]) ? intval($parts[1]) : 0;
        }

        $this->node = $id;

        if ($this->getProperty('debug')) {
            echo '<p style="width: 800px; font-family: \'Lucida Console\'; font-size: 11px">';
        }
    }

    /**
     * Get the query object for grabbing Contexts in the tree
     * @return xPDOQuery
     */
    public function getContextQuery() {
        $this->itemClass= 'modContext';
        $c= $this->modx->newQuery($this->itemClass, array('key:!=' => 'mgr'));
        if (!empty($this->defaultRootId)) {
            $c->where(array(
                          "(SELECT COUNT(*) FROM {$this->modx->getTableName('modResource')} WHERE context_key = modContext.{$this->modx->escape('key')} AND id IN ({$this->defaultRootId})) > 0",
                      ));
        }
        if ($this->modx->getOption('context_tree_sort',null,false)) {
            $ctxSortBy = $this->modx->getOption('context_tree_sortby',null,'key');
            $ctxSortDir = $this->modx->getOption('context_tree_sortdir',null,'ASC');
            $c->sortby($this->modx->getSelectColumns('modContext','modContext','',array($ctxSortBy)),$ctxSortDir);
        }
        return $c;
    }

    /**
     * Get the query object for grabbing Resources in the tree
     * @return xPDOQuery
     */
    public function getResourceQuery() {
        $resourceColumns = array(
            'id'
            ,'pagetitle'
            ,'longtitle'
            ,'alias'
            ,'description'
            ,'parent'
            ,'published'
            ,'deleted'
            ,'isfolder'
            ,'menuindex'
            ,'menutitle'
            ,'hidemenu'
            ,'class_key'
            ,'context_key'
        );

        $this->itemClass = 'modResource';

        $c = $this->modx->newQuery($this->itemClass);
        $c->leftJoin('modResource', 'Child', array('Child.class_key' => 'modDocument', 'modResource.id = Child.parent'));
        $c->select($this->modx->getSelectColumns('modResource', 'modResource', '', $resourceColumns));
        $c->select(array(
            'childrenCount' => 'COUNT(Child.id)',
        ));

        $c->where(array(
            'class_key' => 'modDocument',
            'context_key' => $this->contextKey,
            'show_in_tree' => true,
        ));

        if (empty($this->startNode) && !empty($this->defaultRootId)) {
            $c->where(array(
                'id:IN' => explode(',', $this->defaultRootId),
                'parent:NOT IN' => explode(',', $this->defaultRootId),
            ));
        } else {
            $c->where(array(
                'parent' => $this->startNode,
            ));
        }


        $c->where(array(
            'deleted' => 0,
        ));

        $c->groupby($this->modx->getSelectColumns('modResource', 'modResource', '', $resourceColumns), '');
        $c->sortby('modResource.'.$this->getProperty('sortBy'),$this->getProperty('sortDir'));

        return $c;
    }

    /**
     * Iterate across the collection of items from the query
     *
     * @param array $collection
     * @return void
     */
    public function iterate(array $collection = array()) {
        /* now process actual tree nodes */
        $item = reset($collection);

        /** @var modContext|modResource $item */
        while ($item) {
            $canList = $item->checkPolicy('list');
            if (!$canList) {
                $item = next($collection);
                continue;
            }

            if ($this->itemClass == 'modContext') {
                $itemArray = $this->prepareContextNode($item);
                if (!empty($itemArray)) {
                    $this->items[] = $itemArray;
                }
            } else {
                $itemArray = $this->prepareResourceNode($item);
                if (!empty($itemArray)) {
                    $this->items[] = $itemArray;
                }
            }

            $item = next($collection);
        }
    }

    /**
     * Prepare a Context for being shown in the tree
     *
     * @param modContext $context
     * @return array
     */
    public function prepareContextNode(modContext $context) {
        $class = array();
        $class[] = 'icon-context';
        $class[] = !empty($this->permissions['edit_context']) ? $this->permissions['edit_context'] : '';
        $class[] = !empty($this->permissions['new_context']) ? $this->permissions['new_context'] : '';
        $class[] = !empty($this->permissions['delete_context']) ? $this->permissions['delete_context'] : '';
        $class[] = !empty($this->permissions['new_context_document']) ? $this->permissions['new_context_document'] : '';
        $class[] = !empty($this->permissions['new_context_symlink']) ? $this->permissions['new_context_symlink'] : '';
        $class[] = !empty($this->permissions['new_context_weblink']) ? $this->permissions['new_context_weblink'] : '';
        $class[] = !empty($this->permissions['new_context_static_resource']) ? $this->permissions['new_context_static_resource'] : '';
        $class[] = !empty($this->permissions['resource_quick_create']) ? $this->permissions['resource_quick_create'] : '';

        $children = $this->modx->getCount('modResource', array('context_key' => $context->key));

        $context->prepare();
        $contextData = array(
            'text' => $context->get('key'),
            'id' => $context->get('key') . '_0',
            'pk' => $context->get('key'),
            'ctx' => $context->get('key'),
            'settings' => array(
                'default_template' => $context->getOption('default_template'),
                'richtext_default' => $context->getOption('richtext_default'),
                'hidemenu_default' => $context->getOption('hidemenu_default'),
                'search_default' => $context->getOption('search_default'),
                'cache_default' => $context->getOption('cache_default'),
                'publish_default' => $context->getOption('publish_default'),
                'default_content_type' => $context->getOption('default_content_type'),
            ),
            'leaf' => false,
            'cls' => implode(' ',$class),
            'qtip' => $context->get('description') != '' ? strip_tags($context->get('description')) : '',
            'type' => 'modContext',
        );

        if ($children > 0) {
            $contextData['load_on_demand'] = true;
        }

        return $contextData;

    }

    /**
     * Prepare a Resource for being shown in the tree
     *
     * @param modResource $resource
     * @return array
     */
    public function prepareResourceNode(modResource $resource) {
        $qtipField = $this->getProperty('qtipField');
        $nodeField = $this->getProperty('nodeField');

        $hasChildren = (int)$resource->get('childrenCount') > 0 && $resource->get('hide_children_in_tree') == 0 ? true : false;

        $class = array();
        $class[] = 'icon-'.strtolower(str_replace('mod','',$resource->get('class_key')));
        $class[] = $resource->isfolder ? 'icon-folder' : 'x-tree-node-leaf icon-resource';

        if (!$resource->get('published')) $class[] = 'unpublished';
        if ($resource->get('deleted')) $class[] = 'deleted';
        if ($resource->get('hidemenu')) $class[] = 'hidemenu';

        if (!empty($this->permissions['save_document'])) $class[] = $this->permissions['save_document'];
        if (!empty($this->permissions['view_document'])) $class[] = $this->permissions['view_document'];
        if (!empty($this->permissions['edit_document'])) $class[] = $this->permissions['edit_document'];
        if (!empty($this->permissions['resource_duplicate'])) $class[] = $this->permissions['resource_duplicate'];

        if ($resource->allowChildrenResources) {
            if (!empty($this->permissions['new_document'])) $class[] = $this->permissions['new_document'];
            if (!empty($this->permissions['new_symlink'])) $class[] = $this->permissions['new_symlink'];
            if (!empty($this->permissions['new_weblink'])) $class[] = $this->permissions['new_weblink'];
            if (!empty($this->permissions['new_static_resource'])) $class[] = $this->permissions['new_static_resource'];
            if (!empty($this->permissions['resource_quick_create'])) $class[] = $this->permissions['resource_quick_create'];
            if (!empty($this->permissions['resource_quick_update'])) $class[] = $this->permissions['resource_quick_update'];
        }

        if (!empty($this->permissions['delete_document'])) $class[] = $this->permissions['delete_document'];
        if (!empty($this->permissions['undelete_document'])) $class[] = $this->permissions['undelete_document'];
        if (!empty($this->permissions['publish_document'])) $class[] = $this->permissions['publish_document'];
        if (!empty($this->permissions['unpublish_document'])) $class[] = $this->permissions['unpublish_document'];
        if ($hasChildren) $class[] = 'haschildren';

        if ($this->getProperty('currentResource') == $resource->id && $this->getProperty('currentAction') == $this->actions['resource/update']) {
            $class[] = 'active-node';
        }

        $qtip = '';
        if (!empty($qtipField)) {
            $qtip = '<b>'.strip_tags($resource->$qtipField).'</b>';
        } else {
            if ($resource->longtitle != '') {
                $qtip = '<b>'.strip_tags($resource->longtitle).'</b><br />';
            }
            if ($resource->description != '') {
                $qtip = '<i>'.strip_tags($resource->description).'</i>';
            }
        }

        $locked = $resource->getLock();
        if ($locked && $locked != $this->modx->user->get('id')) {
            $class[] = 'icon-locked';
            /** @var modUser $lockedBy */
            $lockedBy = $this->modx->getObject('modUser',$locked);
            if ($lockedBy) {
                $qtip .= ' - '.$this->modx->lexicon('locked_by',array('username' => $lockedBy->get('username')));
            }
        }

        $updateId = $this->modx->treex->getOption('update_form_id', null, 1);

        $updateUrl = $this->modx->makeUrl($updateId, $resource->context_key, array('resource' => $resource->id));

        $itemArray = array(
            'text' => strip_tags($resource->$nodeField),
            'id' => $resource->context_key . '_'.$resource->id,
            'pk' => $resource->id,
            'cls' => implode(' ',$class),
            'type' => 'modResource',
            'classKey' => $resource->class_key,
            'ctx' => $resource->context_key,
            'hide_children_in_tree' => $resource->hide_children_in_tree,
            'qtip' => $qtip,
            'page' => $updateUrl,
            'allowDrop' => true,
        );

        if (!$hasChildren) {
            $itemArray['children'] = array();
            $itemArray['expanded'] = true;
        } else {
            $itemArray['load_on_demand'] = true;
        }

        $itemArray = $resource->prepareTreeNode($itemArray);

        return $itemArray;
    }
}
return 'TreeXGetNodesProcessor';
