<?php

define('ACCESS_KEY', 'CHANGE_ME');
define('TORRENT_PATH', '/path/to/torrents/watch/');

header('Access-Control-Allow-Origin: *');
header('Content-Type application/json');

$ret = false;

if(ACCESS_KEY === 'CHANGE_ME') {
    $ret = false;
}
elseif(!isset($_REQUEST['key']) || sha1($_REQUEST['key']) !== sha1(ACCESS_KEY)) {
    $ret = false;
}
else {
    if(isset($_REQUEST['url'])) {
        $ret = copy($_REQUEST['url'], TORRENT_PATH.time().'.torrent');
    }
}

echo json_encode($ret);