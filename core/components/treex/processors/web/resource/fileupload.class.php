<?php
require('upload.class.php');

/**
 * Sorts the resource tree
 *
 * @param integer    $parent       Indicates if Resource is parent or not (creating or updating resource)
 * @param integer    $resource     ID of Resource
 *
 * @package treex
 * @subpackage processors.resource
 */

class TreeXFileUploadProcessor extends TreeXUploadProcessor {

    /**
     * Sets upload dir path and upload dir URL
     *
     * @return bool|string
     */
    public function setUploadDir() {
        $resource = $this->modx->getObject('modResource', $this->resource);

        $groups = $resource->getGroupsList();
        $groupId = 0;

        /** @var modResourceGroup $group */
        foreach ($groups['collection'] as $group) {
            if ($group->hasAccess($this->modx->user)) {
                $groupId = $group->get('id');

                break;
            }
        }

        $this->uploadDir = $this->modx->treex->getOption('upload_files_path', null, '/assets/files/');
        $this->uploadDirUrl = $this->modx->treex->getOption('upload_files_path_url', null, '/assets/files/');

        $this->uploadDir .= $groupId . '/';
        $this->uploadDirUrl .= $groupId . '/';

        return true;
    }

    public function validateFile() {

        $ext = explode('.', $this->file['name']);
        $ext = strtolower($ext[count($ext) - 1]);

        if ($ext != 'pdf') {
            return $this->modx->lexicon('treex.bad_file_format');
        }

        return parent::validateFile();
    }

    /**
     * Prepare output array
     *
     * @return array
     */
    public function prepareOutput() {

        $fileName = explode('_', $this->uploadedFile['name']);
        array_shift($fileName);
        $fileName = implode('_', $fileName);
        $fileName = explode('.', $fileName);
        array_pop($fileName);
        $fileName = implode('.', $fileName);

        return array(
            'filelink' => $this->uploadDirUrl . $this->uploadedFile['name'],
            'filename' => $fileName
        );
    }
}

return 'TreeXFileUploadProcessor';
