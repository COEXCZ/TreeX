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
     * Run the processor, returning a modProcessorResponse object.
     * @return modProcessorResponse
     */
    public function run() {
        if (!$this->checkPermissions()) {
            $o = $this->failure($this->modx->lexicon('permission_denied'));
        } else {
            $topics = $this->getLanguageTopics();
            foreach ($topics as $topic) {
                $this->modx->lexicon->load($topic);
            }

            $files = $_FILES;

            $uploaded = array();
            $succ = 0;

            foreach($files as $file) {
                $this->file = $file;
                $initialized = $this->initialize();
                if ($initialized !== true) {
                    $o = $this->failure($initialized);
                } else {
                    $process = $this->process();

                    if (!isset($process['error'])) {
                        $succ++;
                        $uploaded[] = $process;
                    } else {
                        $o = $process;
                    }

                }
            }

            if ($succ == 0) {
                $o = $this->modx->toJSON($o);
            } else {
                $o = $this->modx->toJSON($uploaded);
            }

        }


        $response = new modProcessorResponse($this->modx,$o);
        return $response;
    }

    /**
     * Sets properties
     *
     * @return bool|string
     */
    public function setup() {
        $this->isParent = $this->getProperty('parent', 0);
        $this->resource = $this->getProperty('resource', 0);

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
    abstract public function setUploadDir();

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
     * @return array
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

        return $this->prepareOutput();
    }

    public function failure($msg = '',$object = null) {
        $response = array(
            'error' => true,
            'msg' => $msg
        );

        return $response;
    }
}

return 'TreeXUploadProcessor';
