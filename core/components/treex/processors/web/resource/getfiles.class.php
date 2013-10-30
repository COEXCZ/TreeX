<?php
/**
 * Return list of uploaded files
 *
 * @param integer    $parent       Indicates if Resource is parent or not (creating or updating resource)
 * @param integer    $resource     ID of Resource
 *
 * @package treex
 * @subpackage processors.resource
 */

class TreeXFilesListProcessor extends modProcessor {


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

        $directory = $this->modx->treex->getOption('upload_files_path', null, '/assets/files/');
        $url = $this->modx->treex->getOption('upload_files_path_url', null, '/assets/files/');

        $directory .= $groupId . '/';
        $url.= $groupId . '/';


        if (!is_dir($directory)) {
            return false;
        }

        /** @var RecursiveDirectoryIterator $it */
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory));

        while($it->valid()) {

            if (!$it->isDot() && !$it->isDir()) {

                $fileName = explode('_', $it->getFilename());
                array_shift($fileName);
                $fileName = implode('_', $fileName);
                $fileName = explode('.', $fileName);
                array_pop($fileName);
                $fileName = implode('.', $fileName);

                $images[] = array(
                    'file' => $url . $it->getFilename(),
                    'filename' => $fileName,
                    'title' => $fileName,
                );
            }

            $it->next();
        }

        return $this->modx->toJSON($images);
    }
}

return 'TreeXFilesListProcessor';
