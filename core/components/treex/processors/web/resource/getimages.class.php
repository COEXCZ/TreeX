<?php
/**
 * Sorts the resource tree
 *
 * @param integer    $parent       Indicates if Resource is parent or not (creating or updating resource)
 * @param integer    $resource     ID of Resource
 *
 * @package treex
 * @subpackage processors.resource
 */

class TreeXImageListProcessor extends modProcessor {


    /**
     * Run the processor and return the result. Override this in your derivative class to provide custom functionality.
     * Used here for pre-2.2-style processors.
     *
     * @return mixed
     */
    public function process() {
        $resourceId = $this->getProperty('resource', 0);

        /** @var modResource $resource */
        $resource = $this->modx->getObject('modResource', $resourceId);

        if (!$resource) {
            return false;
        }

        $images = array();

        $groups = $resource->getGroupsList();
        $groupId = 0;

        /** @var modResourceGroup $group */
        foreach ($groups['collection'] as $group) {
            if ($group->hasAccess($this->modx->user)) {
                $groupId = $group->get('id');

                break;
            }
        }

        $directory = $this->modx->treex->getOption('upload_images_path', null, '/assets/images/');
        $url = $this->modx->treex->getOption('upload_images_path_url', null, '/assets/images/');

        $directory .= $groupId . '/';
        $url.= $groupId . '/';


        if (!is_dir($directory)) {
            return false;
        }

        /** @var RecursiveDirectoryIterator $it */
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory));

        while($it->valid()) {

            if (!$it->isDot() && !$it->isDir()) {

                $images[] = array(
                    "thumb" => $url . $it->getFilename(),
                    "image" => $url . $it->getFilename(),
                    "title" => $it->getFilename()
                );
            }

            $it->next();
        }

        return $this->modx->toJSON($images);
    }
}

return 'TreeXImageListProcessor';
