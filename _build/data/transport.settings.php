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

$settings['treex.upload_images_path']= $modx->newObject('modSystemSetting');
$settings['treex.upload_images_path']->fromArray(array(
    'key' => 'treex.upload_images_path',
    'value' => '',
    'xtype' => 'textfield',
    'namespace' => 'treex',
    'area' => 'upload',
),'',true,true);

$settings['treex.upload_images_path_url']= $modx->newObject('modSystemSetting');
$settings['treex.upload_images_path_url']->fromArray(array(
    'key' => 'treex.upload_images_path_url',
    'value' => '',
    'xtype' => 'textfield',
    'namespace' => 'treex',
    'area' => 'upload',
),'',true,true);

$settings['treex.upload_files_path']= $modx->newObject('modSystemSetting');
$settings['treex.upload_files_path']->fromArray(array(
    'key' => 'treex.upload_files_path',
    'value' => '',
    'xtype' => 'textfield',
    'namespace' => 'treex',
    'area' => 'upload',
),'',true,true);

$settings['treex.upload_files_path_url']= $modx->newObject('modSystemSetting');
$settings['treex.upload_files_path_url']->fromArray(array(
    'key' => 'treex.upload_files_path_url',
    'value' => '',
    'xtype' => 'textfield',
    'namespace' => 'treex',
    'area' => 'upload',
),'',true,true);

$settings['treex.delete_form_id']= $modx->newObject('modSystemSetting');
$settings['treex.delete_form_id']->fromArray(array(
    'key' => 'treex.delete_form_id',
    'value' => '12122',
    'xtype' => 'textfield',
    'namespace' => 'treex',
    'area' => '',
),'',true,true);


return $settings;
