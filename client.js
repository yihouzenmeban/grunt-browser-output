(function gruntTerminalBrowser(ssl) {
    if (typeof ssl === 'undefined') {
        var scripts = document.getElementsByTagName('script');
        var path = scripts[scripts.length - 1].src;
        var indexOfSsl = path.indexOf('ssl=');
        ssl = (indexOfSsl === -1 ? false : path.substr(indexOfSsl + 4, 4) === 'true');
    }

    var state = document.readyState;
    if (state !== 'interactive' && state !== 'complete') {
        setTimeout(gruntTerminalBrowser.bind(this, ssl), 100);
        return false;
    }

    if (typeof WebSocket === 'undefined') {
        console.log('grunt-terminal-browser - websockets not available');
        return false;
    }

    var protocol = ssl ? 'wss' : 'ws';
    var connection = new WebSocket(protocol + '://' + location.hostname + ':37901');
    connection.onmessage = function (e) {
        var data = JSON.parse(e.data);
        var pre = document.querySelector('#grunt-terminal-browser>pre');
        if (data.line) {
            pre.insertAdjacentHTML('beforeEnd', data.line);
            pre.scrollTop = pre.scrollHeight;
        }
        if (data.removeLine) {
            pre.removeChild(pre.children[pre.children.length - 1]);
        }
        if (data.isError) {
            document.querySelector('#grunt-terminal-browser').style.display = 'block';
        }

        // need to delete the lines over time else the browser will get bogged down
        while (pre.children.length > 300) {
            pre.removeChild(pre.children[0]);
        }
    };


    function createElemStyle(name, styleObj) {
        var element = document.createElement(name);
        for (var key in styleObj) {
            element.style[key] = styleObj[key];
        }
        return element;
    }


    var wrap = createElemStyle('div', {
        fontFamily: 'Monaco, Consolas, monospace, Microsoft Yahei',
        color: '#E8E8E8',
        backgroundColor: 'rgba(0,0,0,0.85)',
        fontSize: '13px',
        position: 'fixed',
        zIndex: 9999,
        padding: '10px',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        dir: 'ltr',
        display: 'none'
    });
    wrap.id = 'grunt-terminal-browser';


    var pre = createElemStyle('pre', {
        position: 'absolute',
        backgroundColor: 'transparent',
        fontFamily: 'Monaco, Consolas, monospace, Microsoft Yahei',
        overflowY: 'scroll',
        background: 'transparent',
        lineHeight: '1.2',
        fontSize: '13px',
        padding: '10px',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    });
    wrap.appendChild(pre);


    var toolbar = createElemStyle('div', {
        position: 'absolute',
        top: '5px',
        right: '25px',
        zIndex: 10000
    });
    wrap.appendChild(toolbar);

    var link = document.createElement('a');
    link.style.color = 'grey';
    link.href = 'http://github.com/yihouzenmeban/grunt-terminal-browser';
    link.innerHTML = 'adapted from grunt-browser-output';
    toolbar.appendChild(link);

    var sep = document.createElement('span');
    sep.innerHTML = ' | ';
    toolbar.appendChild(sep);

    link = document.createElement('a');
    link.style.color = 'grey';
    link.href = '#';
    link.innerHTML = 'clear';
    link.addEventListener('click', function (e) {
        e.preventDefault();
        pre.innerHTML = '';
    });
    toolbar.appendChild(link);

    sep = document.createElement('span');
    sep.innerHTML = ' | ';
    toolbar.appendChild(sep);

    link = document.createElement('a');
    link.style.color = 'grey';
    link.href = '#';
    link.innerHTML = 'close';
    link.addEventListener('click', function (e) {
        e.preventDefault();
        elem.style.display = 'none';
    });
    toolbar.appendChild(link);

    document.body.appendChild(wrap);
})();
