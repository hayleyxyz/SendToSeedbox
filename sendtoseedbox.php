<?php

$config = require('config.php');

header('Access-Control-Allow-Origin: *');
header('Content-Type application/json');

$ret = false;

if($config['access_key'] === 'CHANGE_ME') {
    $ret = false;
}
elseif(!isset($_REQUEST['key']) || sha1($_REQUEST['key']) !== sha1($config['access_key'])) {
    $ret = false;
}
else {
    if(isset($_REQUEST['url'])) {
        $ret = copy($_REQUEST['url'], $config['target_path'].'/'.time().'.torrent');
    }
}

echo json_encode($ret);
