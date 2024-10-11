// ==UserScript==
// @name         Bypass DevTools Detection, Unlock Functionality, and Auto Check-in
// @namespace    http://tampermonkey.net/
// @version      1.7
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
    }

    const menu = {
        ids: [], // Lưu trữ ID của các menu

        register() {
            // Xóa các lệnh trước đó
            this.ids.forEach(id => GM_unregisterMenuCommand(id));
            this.ids = []; // Đặt lại danh sách ID menu

            // Đăng ký các lệnh với trạng thái hiện tại
            this.ids.push(GM_registerMenuCommand(`${isDevToolsDetectionBypassed ? '✔️' : '❌'} Bật/Tắt Bỏ Qua Phát Hiện DevTools`, () => {
                isDevToolsDetectionBypassed = !isDevToolsDetectionBypassed;
                GM_setValue('isDevToolsDetectionBypassed', isDevToolsDetectionBypassed);
                showNotification(`Bỏ Qua Phát Hiện DevTools đã ${isDevToolsDetectionBypassed ? 'bật' : 'tắt'}`);
                this.register(); // Cập nhật menu
            }));

            this.ids.push(GM_registerMenuCommand(`${isAutoCheckInEnabled ? '✔️' : '❌'} Bật/Tắt Tự Động Điểm Danh`, () => {
                isAutoCheckInEnabled = !isAutoCheckInEnabled;
                GM_setValue('isAutoCheckInEnabled', isAutoCheckInEnabled);
                showNotification(`Tự Động Điểm Danh đã ${isAutoCheckInEnabled ? 'bật' : 'tắt'}`);
                this.register(); // Cập nhật menu
            }));

            this.ids.push(GM_registerMenuCommand(`${isRightClickEnabled ? '✔️' : '❌'} Bật/Tắt Chuột Phải`, () => {
                isRightClickEnabled = !isRightClickEnabled;
                GM_setValue('isRightClickEnabled', isRightClickEnabled);
                showNotification(`Chuột Phải đã ${isRightClickEnabled ? 'bật' : 'tắt'}`);
                this.register(); // Cập nhật menu
                location.reload();
            }));

            this.ids.push(GM_registerMenuCommand(`${isKeyboardShortcutsEnabled ? '✔️' : '❌'} Bật/Tắt Phím Chức Năng`, () => {
                isKeyboardShortcutsEnabled = !isKeyboardShortcutsEnabled;
                GM_setValue('isKeyboardShortcutsEnabled', isKeyboardShortcutsEnabled);
                showNotification(`Phím Chức Năng đã ${isKeyboardShortcutsEnabled ? 'bật' : 'tắt'}`);
                this.register(); // Cập nhật menu
                location.reload();
            }));
        }
    };

    menu.register(); // Đăng ký menu ban đầu

    // Bỏ qua hạn chế chuột phải
    if (isRightClickEnabled) {
        document.addEventListener('contextmenu', function(event) {
            event.stopPropagation(); // Ngăn chặn hành động mặc định
        }, true);
    }

    // Bỏ qua hạn chế phím tắt
    if (isKeyboardShortcutsEnabled) {
        document.addEventListener('keydown', function(event) {
            // Danh sách các phím tắt bị vô hiệu hóa
            const disabledKeys = [
                { keyCode: 123 }, // F12
                { ctrlKey: true, shiftKey: true, keyCode: 73 }, // Ctrl+Shift+I
                { ctrlKey: true, shiftKey: true, keyCode: 74 }, // Ctrl+Shift+J
                { ctrlKey: true, shiftKey: true, keyCode: 67 }, // Ctrl+Shift+C
                { ctrlKey: true, keyCode: 85 }, // Ctrl+U
                { ctrlKey: true, keyCode: 83 }, // Ctrl+S
                { ctrlKey: true, keyCode: 80 }, // Ctrl+P
                { ctrlKey: true, keyCode: 65 }, // Ctrl+A
                { ctrlKey: true, keyCode: 67 }, // Ctrl+C
                { ctrlKey: true, keyCode: 86 }, // Ctrl+V
                { ctrlKey: true, shiftKey: true, keyCode: 86 } // Ctrl+Shift+V
            ];

            // Kiểm tra nếu phím được nhấn là một trong các phím bị vô hiệu hóa
            for (const key of disabledKeys) {
                let disable = true;
                for (const prop in key) {
                    if (event[prop] !== key[prop]) {
                        disable = false;
                        break;
                    }
                }
                if (disable) {
                    event.stopPropagation(); // Ngăn chặn hành động mặc định
                    return false; // Ngăn chặn hành động mặc định của trình duyệt
                }
            }
        }, true);
    }

    // Khôi phục khả năng sao chép, dán và cắt
    document.addEventListener('copy', event => {
        event.stopPropagation(); // Ngăn chặn hành động mặc định
    });

    document.addEventListener('cut', event => {
        event.stopPropagation(); // Ngăn chặn hành động mặc định
    });

    document.addEventListener('paste', event => {
        event.stopPropagation(); // Ngăn chặn hành động mặc định
    });

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
            debugger; // Triggers if dev tools are opened

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
