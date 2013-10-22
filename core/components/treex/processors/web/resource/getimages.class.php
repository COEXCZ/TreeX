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

        $images = array();

        $directory = $this->modx->treex->getOption('upload_path', null, 'D:/Web/www/coex/TTU/treex/assets/');
        $url = $this->modx->treex->getOption('upload_path_url', null, '/treex/assets/');

        $directory  .= $resourceId . '/';
        $url        .= $resourceId . '/';

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
