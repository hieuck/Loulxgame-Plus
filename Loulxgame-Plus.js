// ==UserScript==
// @name         Bypass DevTools Detection, Unlock Functionality, and Auto Check-in
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Bỏ qua phát hiện DevTools, mở khóa các chức năng và tự động điểm danh trên https://loulxgame.com/
// @author       hieuck
// @match        https://loulxgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=loulxgame.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL  https://update.greasyfork.org/scripts/512247/Bypass%20DevTools%20Detection%2C%20Unlock%20Functionality%2C%20and%20Auto%20Check-in.user.js
// @updateURL    https://raw.githubusercontent.com/hieuck/Loulxgame-Plus/refs/heads/main/Loulxgame-Plus.js
// ==/UserScript==

(function() {
    'use strict';

    // Toggle states
    let isDevToolsDetectionBypassed = GM_getValue('isDevToolsDetectionBypassed', true);
    let isAutoCheckInEnabled = GM_getValue('isAutoCheckInEnabled', true);
    let isRightClickEnabled = GM_getValue('isRightClickEnabled', true);
    let isKeyboardShortcutsEnabled = GM_getValue('isKeyboardShortcutsEnabled', true);

    // Hàm thông báo
    function showNotification(message) {
        console.log(message); // Hiển thị thông báo trên console
        alert(message); // Thông báo dạng alert
    }

    // Đăng ký menu
    function registerMenuCommands() {
        const devToolsSymbol = isDevToolsDetectionBypassed ? '✔️' : '❌';
        const checkInSymbol = isAutoCheckInEnabled ? '✔️' : '❌';
        const rightClickSymbol = isRightClickEnabled ? '✔️' : '❌';
        const keyboardShortcutsSymbol = isKeyboardShortcutsEnabled ? '✔️' : '❌';

        // Xóa các lệnh trước đó
        GM_unregisterMenuCommand('Toggle DevTools Detection Bypass');
        GM_unregisterMenuCommand('Toggle Auto Check-in');
        GM_unregisterMenuCommand('Toggle Right Click');
        GM_unregisterMenuCommand('Toggle Keyboard Shortcuts');

        // Đăng ký các lệnh với trạng thái hiện tại
        GM_registerMenuCommand(`${devToolsSymbol} Bật/Tắt Bỏ Qua Phát Hiện DevTools`, () => {
            isDevToolsDetectionBypassed = !isDevToolsDetectionBypassed;
            GM_setValue('isDevToolsDetectionBypassed', isDevToolsDetectionBypassed);
            showNotification(`Bỏ Qua Phát Hiện DevTools đã ${isDevToolsDetectionBypassed ? 'bật' : 'tắt'}`);
            registerMenuCommands(); // Cập nhật menu
        });

        GM_registerMenuCommand(`${checkInSymbol} Bật/Tắt Tự Động Điểm Danh`, () => {
            isAutoCheckInEnabled = !isAutoCheckInEnabled;
            GM_setValue('isAutoCheckInEnabled', isAutoCheckInEnabled);
            showNotification(`Tự Động Điểm Danh đã ${isAutoCheckInEnabled ? 'bật' : 'tắt'}`);
            registerMenuCommands(); // Cập nhật menu
        });

        GM_registerMenuCommand(`${rightClickSymbol} Bật/Tắt Chuột Phải`, () => {
            isRightClickEnabled = !isRightClickEnabled;
            GM_setValue('isRightClickEnabled', isRightClickEnabled);
            showNotification(`Chuột Phải đã ${isRightClickEnabled ? 'bật' : 'tắt'}`);
            registerMenuCommands(); // Cập nhật menu
        });

        GM_registerMenuCommand(`${keyboardShortcutsSymbol} Bật/Tắt Phím Chức Năng`, () => {
            isKeyboardShortcutsEnabled = !isKeyboardShortcutsEnabled;
            GM_setValue('isKeyboardShortcutsEnabled', isKeyboardShortcutsEnabled);
            showNotification(`Phím Chức Năng đã ${isKeyboardShortcutsEnabled ? 'bật' : 'tắt'}`);
            registerMenuCommands(); // Cập nhật menu
        });
    }

    registerMenuCommands(); // Đăng ký menu ban đầu

    // Mở khóa chuột phải
    if (isRightClickEnabled) {
        document.addEventListener('contextmenu', function(event) {
            event.stopPropagation(); // Ngăn chặn hành động mặc định
        }, true);
    }

    // Mở khóa phím tắt
    if (isKeyboardShortcutsEnabled) {
        document.addEventListener('keydown', function(event) {
            const allowedKeys = [123, 73, 74, 67, 85, 83, 80, 65, 67, 86]; // F12, Ctrl+Shift+I, Ctrl+Shift+J, ...
            if (allowedKeys.includes(event.keyCode)) {
                event.stopPropagation(); // Ngăn chặn hành động mặc định
            }
        }, true);
    }

    // Ghi đè hàm debugger
    if (isDevToolsDetectionBypassed) {
        window.debugger = function() {
            // Không làm gì khi gọi debugger
        };
    }

    // Ngăn chặn phát hiện DevTools
    (function() {
        if (!isDevToolsDetectionBypassed) return; // Nếu chức năng bỏ qua bị tắt, thoát

        let callbacks = [];
        let timeLimit = 50;
        let open = false;

        function loop() {
            const startTime = new Date();
            if (window._debugger === undefined) {
                window._debugger = function() {};
            }

            window._debugger(); // Gọi hàm giả mạo

            if (new Date() - startTime > timeLimit) {
                if (!open) {
                    callbacks.forEach(function(fn) {
                        fn.call(null);
                    });
                }
                open = true;
                console.log('Phát hiện DevTools, nhưng đã được xử lý.');
            } else {
                open = false;
            }
        }

        setInterval(loop, 100); // Kiểm tra mỗi 100ms

        // Phương thức thêm listener
        window.addListener = function(fn) {
            callbacks.push(fn);
        };

        // Phương thức xóa listener
        window.cancelListener = function(fn) {
            callbacks = callbacks.filter(function(v) {
                return v !== fn;
            });
        };
    })();

    // Hàm tự động điểm danh
    function autoCheckIn() {
        if (!isAutoCheckInEnabled) return; // Nếu tự động điểm danh bị tắt, thoát

        const checkInButton = document.querySelector('.checkin-details-link');

        if (checkInButton && checkInButton.innerHTML.includes("Đã điểm danh")) {
            console.log('Đã điểm danh hôm nay. Dừng lại.');
            return; // Dừng lại nếu đã điểm danh
        }

        if (checkInButton) {
            checkInButton.click();
            console.log('Đã điểm danh tự động!');
        } else {
            console.log('Nút điểm danh không tìm thấy.');
        }
    }

    // Chờ trang tải xong trước khi điểm danh
    window.addEventListener('load', function() {
        if (window.location.href === 'https://loulxgame.com/') {
            setTimeout(autoCheckIn, 1000); // Tự động điểm danh sau 1 giây
        }
    });
})();
