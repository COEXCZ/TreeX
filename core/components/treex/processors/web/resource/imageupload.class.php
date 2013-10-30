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

class TreeXImageUploadProcessor extends TreeXUploadProcessor {

    /**
     * Sets upload dir path and upload dir URL
     *
     * @return bool|string
     */
    public function setUploadDir() {
        $this->uploadDir = $this->modx->treex->getOption('upload_images_path', null, '/assets/images/');
        $this->uploadDirUrl = $this->modx->treex->getOption('upload_images_path_url', null, '/assets/images/');

        $this->uploadDir .= $this->resource . '/';
        $this->uploadDirUrl .= $this->resource . '/';

        return true;
    }

    public function validateFile() {

        if ($this->file['type'] == 'image/png'
            || $this->file['type'] == 'image/jpg'
            || $this->file['type'] == 'image/gif'
            || $this->file['type'] == 'image/jpeg'
            || $this->file['type'] == 'image/pjpeg')
        {
            return parent::validateFile();
        } else {
            return $this->modx->lexicon('treex.bad_image_format');
        }
    }

    /**
     * Prepare output array
     *
     * @return array
     */
    public function prepareOutput() {
        return array('filelink' => $this->uploadDirUrl . $this->uploadedFile['name']);
    }
}

return 'TreeXImageUploadProcessor';
