// ==UserScript==
// @name         Bypass DevTools Detection, Unlock Functionality, and Auto Check-in
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bỏ qua phát hiện DevTools, mở khóa các chức năng và tự động điểm danh trên https://loulxgame.com/
// @author       hieuck
// @match        https://loulxgame.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Feature toggles
    let bypassDevTools = true;
    let unlockRightClick = true;
    let autoCheckInEnabled = true;

    // Inject submenu for feature toggling
    function createSubMenu() {
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '10px';
        menu.style.right = '10px';
        menu.style.backgroundColor = 'rgba(0,0,0,0.7)';
        menu.style.color = 'white';
        menu.style.padding = '10px';
        menu.style.zIndex = '9999';
        menu.style.borderRadius = '5px';
        menu.innerHTML = `
            <strong>Feature Toggle</strong><br>
            <label><input type="checkbox" id="toggleDevTools" ${bypassDevTools ? 'checked' : ''}> Bypass DevTools</label><br>
            <label><input type="checkbox" id="toggleRightClick" ${unlockRightClick ? 'checked' : ''}> Unlock Right Click</label><br>
            <label><input type="checkbox" id="toggleAutoCheckIn" ${autoCheckInEnabled ? 'checked' : ''}> Auto Check-in</label>
        `;
        document.body.appendChild(menu);

        // Add event listeners for toggling
        document.getElementById('toggleDevTools').addEventListener('change', function() {
            bypassDevTools = this.checked;
        });

        document.getElementById('toggleRightClick').addEventListener('change', function() {
            unlockRightClick = this.checked;
        });

        document.getElementById('toggleAutoCheckIn').addEventListener('change', function() {
            autoCheckInEnabled = this.checked;
        });
    }

    // Bypass DevTools detection
    function bypassDevToolsDetection() {
        if (!bypassDevTools) return;
        let callbacks = [];
        let timeLimit = 50;
        let open = false;

        function loop() {
            const startTime = new Date();

            if (window._debugger === undefined) {
                window._debugger = function() {};
            }
            window._debugger(); // Fake debugger call

            if (new Date() - startTime > timeLimit) {
                if (!open) {
                    callbacks.forEach(function(fn) {
                        fn.call(null);
                    });
                }
                open = true;
                console.log('DevTools detected but bypassed.');
            } else {
                open = false;
            }
        }

        setInterval(loop, 100); // Check every 100ms
    }

    // Unlock right click
    function unlockRightClickFunction() {
        if (!unlockRightClick) return;
        document.addEventListener('contextmenu', function(event) {
            event.stopPropagation();
        }, true);
    }

    // Auto check-in
    function autoCheckIn() {
        if (!autoCheckInEnabled) return;

        const checkInButton = document.querySelector('.checkin-details-link');

        if (checkInButton && checkInButton.innerHTML.includes("Đã điểm danh")) {
            console.log('Already checked in.');
            return;
        }

        if (checkInButton) {
            checkInButton.click();
            console.log('Auto check-in performed.');
        } else {
            console.log('Check-in button not found.');
        }
    }

    // Initialization
    window.addEventListener('load', function() {
        createSubMenu();

        if (window.location.href === 'https://loulxgame.com/') {
            setTimeout(function() {
                bypassDevToolsDetection();
                unlockRightClickFunction();
                autoCheckIn();
            }, 1000); // Delay for 1 second
        }
    });
})();
