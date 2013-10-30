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
        $this->uploadDir = $this->modx->treex->getOption('upload_files_path', null, '/assets/files/');
        $this->uploadDirUrl = $this->modx->treex->getOption('upload_files_path_url', null, '/assets/files/');

        $this->uploadDir .= $this->resource . '/';
        $this->uploadDirUrl .= $this->resource . '/';

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
        return array(
            'filelink' => $this->uploadDirUrl . $this->uploadedFile['name'],
            'filename' => $this->uploadedFile['name']
        );
    }
}

return 'TreeXFileUploadProcessor';
