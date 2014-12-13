// ==UserScript==
// @name         SendToSeedbox - AnimeBytes
// @namespace    https://github.com/kimoi
// @version      0.1
// @description  Adds a button to send a torrent directly to your seedbox
// @match        https://animebytes.tv/torrents.php*
// @grant        none
// ==/UserScript==

var targetUrl = 'http://your-domain.com/sendtoseedbox.php'; // location of php script on your webserver
var key = 'CHANGE_ME'; // ACCESS_KEY paramater in php script

// get all "DL" links
var downloadLinks = document.querySelectorAll('.group_torrent a[href*="/torrents.php?action=download"]');

for(var i in downloadLinks) {
    var downloadLink = downloadLinks[i];
    addLink(downloadLink);
}

function addLink(downloadLink) {
    var parent = downloadLink.parentNode;
    if(!parent) {
        return;
    }
    
    // create the SB link
    var trigger = document.createElement('a');
    trigger.innerText = 'SB';
    trigger.style.cursor = 'pointer'; // for hover state
    trigger.torrentUrl = downloadLink.href;
    trigger.onclick = triggerClickHandler;
    trigger.disable = triggerDisable;
    trigger.loading = false; // to disable spam-clicking
    
    parent.insertBefore(trigger, downloadLink);
    
    // add the pipe between the SB and DL buttons
    var pipe = document.createTextNode(' | ');
    parent.insertBefore(pipe, downloadLink);
}

function triggerClickHandler() {
    if(this.disabled || this.loading) {
        return false;
    }
    
    this.loading = true;
    
    var trigger = this;
    var req = new XMLHttpRequest();
    var postData = 'url=' + encodeURIComponent(this.torrentUrl);
    postData += '&key=' + encodeURIComponent(key);
    
    req.open('POST', targetUrl, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // required for POST
    
    req.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.UNSENT) {
            alert('Error: ' + this.statusText);
        }
        else if(this.readyState === XMLHttpRequest.DONE) {
            this.loading = false;
            
            if(this.status === 200) {
                trigger.disable();
            }
            else {
                alert('Error sending torrent');
            }
        }
    };
    
    req.send(postData);
}

function triggerDisable() {
    this.style.color = getComputedStyle(this.parentNode).color;
    this.style.cursor = 'initial';
    this.disabled = true;
}