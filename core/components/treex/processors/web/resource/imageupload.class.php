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
