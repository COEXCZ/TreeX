<?php
/**
 * Loads system settings into build
 *
 * @package treex
 * @subpackage build
 */
$settings = array();

$settings['treex.update_form_id']= $modx->newObject('modSystemSetting');
$settings['treex.update_form_id']->fromArray(array(
    'key' => 'treex.update_form_id',
    'value' => '',
    'xtype' => 'textfield',
    'namespace' => 'treex',
    'area' => '',
),'',true,true);

$settings['treex.create_form_id']= $modx->newObject('modSystemSetting');
$settings['treex.create_form_id']->fromArray(array(
    'key' => 'treex.create_form_id',
    'value' => '',
    'xtype' => 'textfield',
    'namespace' => 'treex',
    'area' => '',
),'',true,true);


return $settings;
