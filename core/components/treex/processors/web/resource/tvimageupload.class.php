<?php
require('imageupload.class.php');

/**
 * Uploads Template Variable Images / files
 * 
 * @param integer    $resource     ID of Resource
 * @param string     $file         ID of file $_FILES[$file]....
 *
 * @package treex
 * @subpackage processors.resource
 */

class TreeXTvImageUploadProcessor extends TreeXImageUploadProcessor {

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

                $this->file = $_FILES[$this->getProperty('file', 0)];
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

            if ($succ == 0) {
                $o = $this->modx->toJSON($o);
            } else {
                $o = $this->modx->toJSON($uploaded);
            }

        }


        $response = new modProcessorResponse($this->modx,$o);
        return $response;
    }

}

return 'TreeXTvImageUploadProcessor';
