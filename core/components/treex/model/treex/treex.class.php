<?php
/**
 * The base class for TreeX.
 *
 * @package treex.model
 */
class TreeX {
    /** @var \modX $modx */
    public $modx;
    /** @var array $chunks */
    public $chunks = array();
    /** @var array $options */
    public $options = array();

    public function __construct(&$modx, array $options = array()) {
        $this->modx =& $modx;
        $corePath = $this->getOption('core_path', $options, MODX_CORE_PATH . 'components/treex/');
        $assetsUrl = $this->getOption('assets_url', $options, MODX_ASSETS_URL . 'components/treex/');
        $connectorUrl = $assetsUrl . 'connector.php';
        $this->options = array_merge(
            array(
                'assetsUrl' => $assetsUrl,
                'connectorUrl' => $connectorUrl,
                'corePath' => $corePath,
                'modelPath' => $corePath . 'model/',
                'processorsPath' => $corePath . 'processors/',
            ),
            $options
        );
        $this->modx->addPackage('treex', $this->getOption('modelPath'));
        $this->modx->lexicon->load('treex:default');
    }

    /**
     * Get local options configured for this instance.
     *
     * @return array An array of local config options.
     */
    public function getOptions() {
        return $this->options;
    }

    /**
     * Get the value of a config option.
     *
     * NOTE: If the option is not found locally, the key is prepended with
     * 'treex.' before searching again, both locally and then in modX settings.
     *
     * @param string $key The option identifier.
     * @param array|null $options An optional array of option overrides.
     * @param mixed $default The default value to use if no option is found.
     * @param bool $skipEmpty Determine if empty string values should be skipped.
     *
     * @return mixed The value of the config option.
     */
    public function getOption($key, $options = null, $default = null, $skipEmpty = false) {
        if (is_array($options) && array_key_exists($key, $options) && (!$skipEmpty || ($skipEmpty && $options[$key] !== ''))) {
            $value = $options[$key];
        } elseif (is_array($this->options) && array_key_exists($key, $this->options) && (!$skipEmpty || ($skipEmpty && $this->options[$key] !== ''))) {
            $value = $this->options[$key];
        } else {
            $value = $this->modx->getOption("treex.{$key}", $options, $default, $skipEmpty);
        }
        return $value;
    }

    /**
     * Set a config option for this instance.
     *
     * @param string $key The option identifier.
     * @param mixed $value The value to assign to the option.
     *
     * @throws InvalidArgumentException If the option key is not a valid string identifier.
     */
    public function setOption($key, $value) {
        if (!is_string($key) || $key === '') throw new InvalidArgumentException("Attempt to set value for an invalid option key");
        $this->options[$key] = $value;
    }
}
