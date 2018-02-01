"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOM = require("./DOM");
var Utils = require("./Utils");
var Command = require("./Command");
exports.run = function (window, app_component, app_name) {
    var context = Utils.createContext();
    var app = context.createComponent(app_component, app_name);
    var _a = app.init(window.location.hash.slice(1)), viewState = _a[0], commands = _a[1];
    var view = app.render(viewState);
    var lymph_config = window["lymphConfig"] || {
        actionName: "action"
    };
    window.addEventListener(lymph_config.actionName, function (e) {
        console.group("%c", "color: gray; font-weight: lighter;", e.detail.name);
        console.log("%c prev state", "color: #9E9E9E; font-weight: bold;", viewState);
        console.log("%c message", "color: #03A9F4; font-weight: bold;", e.detail);
        var _a = app.update(e.detail, viewState), state = _a[0], commands = _a[1];
        console.log("%c next state", "color: #4CAF50; font-weight: bold;", state);
        console.log("%c commands", "color: #4CAF50; font-weight: bold;", commands);
        viewState = state;
        view = app.render(viewState);
        DOM.updateChildren(window, window.document.body, view);
        Command.process(window, commands);
        console.groupEnd();
    });
    window.addEventListener("hashchange", function (e) {
        window.document.dispatchEvent(new window["CustomEvent"](lymph_config.actionName, {
            detail: { name: ":route-changed", data: window.location.hash.slice(1) },
            bubbles: true,
            cancelable: true
        }));
    });
    // because we never want to do standard submits in SPAs
    window.document.addEventListener("submit", function (e) { return e.preventDefault(); }, true);
    DOM.updateChildren(window, window.document.body, view);
    Command.process(window, commands);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTHltcGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvTHltcGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBNEI7QUFDNUIsK0JBQWdDO0FBQ2hDLG1DQUFvQztBQUV2QixRQUFBLEdBQUcsR0FBRyxVQUFXLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUTtJQUN6RCxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDckMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBRSxhQUFhLEVBQUUsUUFBUSxDQUFFLENBQUE7SUFFMUQsSUFBQSw0Q0FBcUUsRUFBbkUsaUJBQVMsRUFBRSxnQkFBUSxDQUFnRDtJQUV6RSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFFLFNBQVMsQ0FBRSxDQUFBO0lBRWxDLElBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBRSxhQUFhLENBQUUsSUFBSTtRQUM1QyxVQUFVLEVBQUUsUUFBUTtLQUN2QixDQUFBO0lBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFFLFlBQVksQ0FBQyxVQUFVLEVBQUUsVUFBVyxDQUFjO1FBQ3ZFLE9BQU8sQ0FBQyxLQUFLLENBQUUsSUFBSSxFQUFFLG9DQUFvQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLENBQUE7UUFFMUUsT0FBTyxDQUFDLEdBQUcsQ0FBRSxlQUFlLEVBQUUsb0NBQW9DLEVBQUUsU0FBUyxDQUFFLENBQUE7UUFDL0UsT0FBTyxDQUFDLEdBQUcsQ0FBRSxZQUFZLEVBQUUsb0NBQW9DLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBRSxDQUFBO1FBRXJFLElBQUEsb0NBQXVELEVBQXJELGFBQUssRUFBRSxnQkFBUSxDQUFzQztRQUU3RCxPQUFPLENBQUMsR0FBRyxDQUFFLGVBQWUsRUFBRSxvQ0FBb0MsRUFBRSxLQUFLLENBQUUsQ0FBQTtRQUMzRSxPQUFPLENBQUMsR0FBRyxDQUFFLGFBQWEsRUFBRSxvQ0FBb0MsRUFBRSxRQUFRLENBQUUsQ0FBQTtRQUU1RSxTQUFTLEdBQUcsS0FBSyxDQUFBO1FBQ2pCLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFFLFNBQVMsQ0FBRSxDQUFBO1FBRTlCLEdBQUcsQ0FBQyxjQUFjLENBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBRSxDQUFBO1FBRXhELE9BQU8sQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBRSxDQUFBO1FBRW5DLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUN0QixDQUFDLENBQUUsQ0FBQTtJQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBRSxZQUFZLEVBQUUsVUFBVyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUN6QixJQUFJLE1BQU0sQ0FBRSxhQUFhLENBQUUsQ0FBRSxZQUFZLENBQUMsVUFBVSxFQUFFO1lBQ2xELE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBRSxFQUFFO1lBQ3pFLE9BQU8sRUFBRSxJQUFJO1lBQ2IsVUFBVSxFQUFFLElBQUk7U0FDbkIsQ0FBRSxDQUNOLENBQUE7SUFDTCxDQUFDLENBQUUsQ0FBQTtJQUVILHVEQUF1RDtJQUN2RCxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFFLFFBQVEsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBbEIsQ0FBa0IsRUFBRSxJQUFJLENBQUUsQ0FBQTtJQUUzRSxHQUFHLENBQUMsY0FBYyxDQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUUsQ0FBQTtJQUV4RCxPQUFPLENBQUMsT0FBTyxDQUFFLE1BQU0sRUFBRSxRQUFRLENBQUUsQ0FBQTtBQUN2QyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBET00gZnJvbSBcIi4vRE9NXCJcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gXCIuL1V0aWxzXCJcbmltcG9ydCAqIGFzIENvbW1hbmQgZnJvbSBcIi4vQ29tbWFuZFwiXG5cbmV4cG9ydCBjb25zdCBydW4gPSBmdW5jdGlvbiAoIHdpbmRvdywgYXBwX2NvbXBvbmVudCwgYXBwX25hbWUgKSB7XG4gICAgY29uc3QgY29udGV4dCA9IFV0aWxzLmNyZWF0ZUNvbnRleHQoKVxuICAgIGNvbnN0IGFwcCA9IGNvbnRleHQuY3JlYXRlQ29tcG9uZW50KCBhcHBfY29tcG9uZW50LCBhcHBfbmFtZSApXG5cbiAgICBsZXQgWyB2aWV3U3RhdGUsIGNvbW1hbmRzIF0gPSBhcHAuaW5pdCggd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoIDEgKSApXG5cbiAgICBsZXQgdmlldyA9IGFwcC5yZW5kZXIoIHZpZXdTdGF0ZSApXG5cbiAgICBjb25zdCBseW1waF9jb25maWcgPSB3aW5kb3dbIFwibHltcGhDb25maWdcIiBdIHx8IHtcbiAgICAgICAgYWN0aW9uTmFtZTogXCJhY3Rpb25cIlxuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCBseW1waF9jb25maWcuYWN0aW9uTmFtZSwgZnVuY3Rpb24gKCBlOiBDdXN0b21FdmVudCApIHtcbiAgICAgICAgY29uc29sZS5ncm91cCggXCIlY1wiLCBcImNvbG9yOiBncmF5OyBmb250LXdlaWdodDogbGlnaHRlcjtcIiwgZS5kZXRhaWwubmFtZSApXG5cbiAgICAgICAgY29uc29sZS5sb2coIFwiJWMgcHJldiBzdGF0ZVwiLCBcImNvbG9yOiAjOUU5RTlFOyBmb250LXdlaWdodDogYm9sZDtcIiwgdmlld1N0YXRlIClcbiAgICAgICAgY29uc29sZS5sb2coIFwiJWMgbWVzc2FnZVwiLCBcImNvbG9yOiAjMDNBOUY0OyBmb250LXdlaWdodDogYm9sZDtcIiwgZS5kZXRhaWwgKVxuXG4gICAgICAgIGNvbnN0IFsgc3RhdGUsIGNvbW1hbmRzIF0gPSBhcHAudXBkYXRlKCBlLmRldGFpbCwgdmlld1N0YXRlIClcblxuICAgICAgICBjb25zb2xlLmxvZyggXCIlYyBuZXh0IHN0YXRlXCIsIFwiY29sb3I6ICM0Q0FGNTA7IGZvbnQtd2VpZ2h0OiBib2xkO1wiLCBzdGF0ZSApXG4gICAgICAgIGNvbnNvbGUubG9nKCBcIiVjIGNvbW1hbmRzXCIsIFwiY29sb3I6ICM0Q0FGNTA7IGZvbnQtd2VpZ2h0OiBib2xkO1wiLCBjb21tYW5kcyApXG5cbiAgICAgICAgdmlld1N0YXRlID0gc3RhdGVcbiAgICAgICAgdmlldyA9IGFwcC5yZW5kZXIoIHZpZXdTdGF0ZSApXG5cbiAgICAgICAgRE9NLnVwZGF0ZUNoaWxkcmVuKCB3aW5kb3csIHdpbmRvdy5kb2N1bWVudC5ib2R5LCB2aWV3IClcblxuICAgICAgICBDb21tYW5kLnByb2Nlc3MoIHdpbmRvdywgY29tbWFuZHMgKVxuXG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgIH0gKVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIFwiaGFzaGNoYW5nZVwiLCBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgIHdpbmRvdy5kb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgICAgbmV3IHdpbmRvd1sgXCJDdXN0b21FdmVudFwiIF0oIGx5bXBoX2NvbmZpZy5hY3Rpb25OYW1lLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7IG5hbWU6IGA6cm91dGUtY2hhbmdlZGAsIGRhdGE6IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKCAxICkgfSxcbiAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICAgICAgICAgIH0gKVxuICAgICAgICApXG4gICAgfSApXG5cbiAgICAvLyBiZWNhdXNlIHdlIG5ldmVyIHdhbnQgdG8gZG8gc3RhbmRhcmQgc3VibWl0cyBpbiBTUEFzXG4gICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwic3VibWl0XCIsIGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpLCB0cnVlIClcblxuICAgIERPTS51cGRhdGVDaGlsZHJlbiggd2luZG93LCB3aW5kb3cuZG9jdW1lbnQuYm9keSwgdmlldyApXG5cbiAgICBDb21tYW5kLnByb2Nlc3MoIHdpbmRvdywgY29tbWFuZHMgKVxufVxuIl19