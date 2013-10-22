<?php
// if user is manager, then inject mgr context
if ($user->hasSessionContext('mgr')) {
    echo $modx->user->addSessionContext('mgr');
}