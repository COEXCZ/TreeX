<?php

abstract class TreeXUploadProcessor extends modProcessor {
    /** @var integer $isParent */
    public $isParent;

    /** @var integer $resource */
    public $resource;

    /** @var array $file */
    public $file;

    /** @var string $uploadDir */
    public $uploadDir;

    /** @var string $uploadDirUrl */
    public $uploadDirUrl;

    /** @var array $uploadedFile */
    public $uploadedFile;

    /**
     * Sets properties
     *
     * @return bool|string
     */
    public function setup() {
        $this->isParent = $this->getProperty('parent', 0);
        $this->resource = $this->getProperty('resource', 0);
        $this->file = $_FILES['file'];

        return true;
    }

    /**
     * Validates file
     *
     * @return bool
     */
    public function validateFile() {
        return true;
    }

    /**
     * Sets upload dir path and upload dir URL
     *
     * @return bool|string
     */
    public function setUploadDir() {
        $this->uploadDir = $this->modx->treex->getOption('upload_path', null, 'D:/Web/www/coex/TTU/treex/assets/');
        $this->uploadDirUrl = $this->modx->treex->getOption('upload_path_url', null, '/treex/assets/');

        $this->uploadDir .= $this->resource . '/';
        $this->uploadDirUrl .= $this->resource . '/';

        return true;
    }

    /**
     * Handle file upload
     *
     * @return bool|string
     */
    public function uploadFile() {
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir);
        }

        $filename = time() . '_' . $this->file['name'];
        $file = $this->uploadDir . $filename;

        move_uploaded_file($this->file['tmp_name'], $file);

        $this->uploadedFile = array('name' => $filename);

        return true;
    }

    /**
     * Prepare output array
     *
     * @return array
     */
    abstract public function prepareOutput();

    /**
     * Run processor
     *
     * @return mixed
     */
    public function process() {
        $setup = $this->setup();
        if ($setup !== true) {
            return $this->failure($setup);
        }

        $validateFile = $this->validateFile();
        if ($validateFile !== true) {
            return $this->failure($validateFile);
        }

        $setUploadDir = $this->setUploadDir();
        if ($setUploadDir !== true) {
            return $this->failure($setUploadDir);
        }

        $uploadFile = $this->uploadFile();
        if ($uploadFile !== true) {
            return $this->failure($uploadFile);
        }

        return $this->modx->toJSON($this->prepareOutput());
    }

    public function failure($msg = '',$object = null) {
        $response = array(
            'error' => true,
            'msg' => $msg
        );

        return $this->modx->toJSON($response);
    }
}

return 'TreeXUploadProcessor';
