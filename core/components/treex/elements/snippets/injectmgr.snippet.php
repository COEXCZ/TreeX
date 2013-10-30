<?php

// Snippet handles mgr context (necessarry for front end resource editing)
// Usage: [[!Login]]
//        [[!injectMgr]]

if (!empty($modx->user)) {
	if (!empty($_REQUEST['service']) && $_REQUEST['service'] == 'logout') {
		// if there is logout request, then remove mgr context
		$modx->user->removeSessionContext('mgr');	
	} else {
		// if user is logged, then inject mgr context
		if (!$modx->user->hasSessionContext('mgr')) {
		    $modx->user->addSessionContext('mgr');
		}
	}
}

