/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
var vscode = require('vscode');
var child_process_1 = require('child_process');
var path_1 = require('path');
function listProcesses() {
    return new Promise(function (resolve, reject) {
        var NODE = new RegExp('^(?:node|iojs|gulp)$', 'i');
        if (process.platform === 'win32') {
            var CMD_PID_1 = new RegExp('^(.+) ([0-9]+)$');
            var EXECUTABLE_ARGS_1 = new RegExp('^(?:"([^"]+)"|([^ ]+))(?: (.+))?$');
            var stdout_1 = '';
            var stderr_1 = '';
            var cmd = child_process_1.spawn('cmd');
            cmd.stdout.on('data', function (data) {
                stdout_1 += data.toString();
            });
            cmd.stderr.on('data', function (data) {
                stderr_1 += data.toString();
            });
            cmd.on('exit', function () {
                if (stderr_1.length > 0) {
                    reject(stderr_1);
                }
                else {
                    var items = [];
                    var lines = stdout_1.split('\r\n');
                    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                        var line = lines_1[_i];
                        var matches = CMD_PID_1.exec(line.trim());
                        if (matches && matches.length === 3) {
                            var cmd_1 = matches[1].trim();
                            var pid = matches[2];
                            // remove leading device specifier
                            if (cmd_1.indexOf('\\??\\') === 0) {
                                cmd_1 = cmd_1.replace('\\??\\', '');
                            }
                            var executable_path = void 0;
                            var args = void 0;
                            var matches2 = EXECUTABLE_ARGS_1.exec(cmd_1);
                            if (matches2 && matches2.length >= 2) {
                                if (matches2.length >= 3) {
                                    executable_path = matches2[1] || matches2[2];
                                }
                                else {
                                    executable_path = matches2[1];
                                }
                                if (matches2.length === 4) {
                                    args = matches2[3];
                                }
                            }
                            if (executable_path) {
                                var executable_name = path_1.basename(executable_path);
                                if (!NODE.test(executable_name)) {
                                    continue;
                                }
                                items.push({
                                    label: executable_name,
                                    description: pid,
                                    detail: cmd_1,
                                    pid: pid
                                });
                            }
                        }
                    }
                    ;
                    resolve(items);
                }
            });
            cmd.stdin.write('wmic process get ProcessId,CommandLine \n');
            cmd.stdin.end();
        }
        else {
            var PID_CMD_1 = new RegExp('^\\s*([0-9]+)\\s+(.+)$');
            var MAC_APPS_1 = new RegExp('^.*/(.*).(?:app|bundle)/Contents/.*$');
            child_process_1.exec('ps -ax -o pid=,command=', function (err, stdout, stderr) {
                if (err || stderr) {
                    reject(err || stderr.toString());
                }
                else {
                    var items = [];
                    var lines = stdout.toString().split('\n');
                    for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
                        var line = lines_2[_i];
                        var matches = PID_CMD_1.exec(line);
                        if (matches && matches.length === 3) {
                            var pid = matches[1];
                            var cmd = matches[2];
                            var parts = cmd.split(' '); // this will break paths with spaces
                            var executable_path = parts[0];
                            var executable_name = path_1.basename(executable_path);
                            if (!NODE.test(executable_name)) {
                                continue;
                            }
                            var application = cmd;
                            // try to show the correct name for OS X applications and bundles
                            var matches2 = MAC_APPS_1.exec(cmd);
                            if (matches2 && matches2.length === 2) {
                                application = matches2[1];
                            }
                            else {
                                application = executable_name;
                            }
                            items.unshift({
                                label: application,
                                description: pid,
                                detail: cmd,
                                pid: pid
                            });
                        }
                    }
                    resolve(items);
                }
            });
        }
    });
}
function activate(context) {
    var disposable = vscode.commands.registerCommand('extension.pickNodeProcess', function () {
        return listProcesses().then(function (items) {
            var options = {
                placeHolder: "Pick the node.js or gulp process to attach to",
                matchOnDescription: true,
                matchOnDetail: true
            };
            return vscode.window.showQuickPick(items, options).then(function (item) {
                return item ? item.pid : null;
            });
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;

//# sourceMappingURL=data:application/json;base64,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LEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUVKLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQXBCZSxnQkFBUSxXQW9CdkIsQ0FBQTtBQUVEO0FBQ0EsQ0FBQztBQURlLGtCQUFVLGFBQ3pCLENBQUEiLCJmaWxlIjoibm9kZS9leHRlbnNpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29weXJpZ2h0IChDKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgKiBhcyB2c2NvZGUgZnJvbSAndnNjb2RlJztcbmltcG9ydCB7IHNwYXduLCBleGVjIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgeyBiYXNlbmFtZSB9IGZyb20gJ3BhdGgnO1xuXG5pbnRlcmZhY2UgUHJvY2Vzc0l0ZW0gZXh0ZW5kcyB2c2NvZGUuUXVpY2tQaWNrSXRlbSB7XG5cdHBpZDogc3RyaW5nO1x0Ly8gcGF5bG9hZCBmb3IgdGhlIFF1aWNrUGljayBVSVxufVxuXG5mdW5jdGlvbiBsaXN0UHJvY2Vzc2VzKCkgOiBQcm9taXNlPFByb2Nlc3NJdGVtW10+IHtcblxuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG5cdFx0Y29uc3QgTk9ERSA9IG5ldyBSZWdFeHAoJ14oPzpub2RlfGlvanN8Z3VscCkkJywgJ2knKTtcblxuXHRcdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG5cblx0XHRcdGNvbnN0IENNRF9QSUQgPSBuZXcgUmVnRXhwKCdeKC4rKSAoWzAtOV0rKSQnKTtcblx0XHRcdGNvbnN0IEVYRUNVVEFCTEVfQVJHUyA9IG5ldyBSZWdFeHAoJ14oPzpcIihbXlwiXSspXCJ8KFteIF0rKSkoPzogKC4rKSk/JCcpO1xuXG5cdFx0XHRsZXQgc3Rkb3V0ID0gJyc7XG5cdFx0XHRsZXQgc3RkZXJyID0gJyc7XG5cblx0XHRcdGNvbnN0IGNtZCA9IHNwYXduKCdjbWQnKTtcblxuXHRcdFx0Y21kLnN0ZG91dC5vbignZGF0YScsIGRhdGEgPT4ge1xuXHRcdFx0XHRzdGRvdXQgKz0gZGF0YS50b1N0cmluZygpO1xuXHRcdFx0fSk7XG5cdFx0XHRjbWQuc3RkZXJyLm9uKCdkYXRhJywgZGF0YSA9PiB7XG5cdFx0XHRcdHN0ZGVyciArPSBkYXRhLnRvU3RyaW5nKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Y21kLm9uKCdleGl0JywgKCkgPT4ge1xuXG5cdFx0XHRcdGlmIChzdGRlcnIubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdHJlamVjdChzdGRlcnIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGl0ZW1zIDogUHJvY2Vzc0l0ZW1bXT0gW107XG5cblx0XHRcdFx0XHRjb25zdCBsaW5lcyA9IHN0ZG91dC5zcGxpdCgnXFxyXFxuJyk7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBtYXRjaGVzID0gQ01EX1BJRC5leGVjKGxpbmUudHJpbSgpKTtcblx0XHRcdFx0XHRcdGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID09PSAzKSB7XG5cblx0XHRcdFx0XHRcdFx0bGV0IGNtZCA9IG1hdGNoZXNbMV0udHJpbSgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBwaWQgPSBtYXRjaGVzWzJdO1xuXG5cdFx0XHRcdFx0XHRcdC8vIHJlbW92ZSBsZWFkaW5nIGRldmljZSBzcGVjaWZpZXJcblx0XHRcdFx0XHRcdFx0aWYgKGNtZC5pbmRleE9mKCdcXFxcPz9cXFxcJykgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRjbWQgPSBjbWQucmVwbGFjZSgnXFxcXD8/XFxcXCcsICcnKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGxldCBleGVjdXRhYmxlX3BhdGggOiBzdHJpbmc7XG5cdFx0XHRcdFx0XHRcdGxldCBhcmdzIDogc3RyaW5nO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBtYXRjaGVzMiA9IEVYRUNVVEFCTEVfQVJHUy5leGVjKGNtZCk7XG5cdFx0XHRcdFx0XHRcdGlmIChtYXRjaGVzMiAmJiBtYXRjaGVzMi5sZW5ndGggPj0gMikge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChtYXRjaGVzMi5sZW5ndGggPj0gMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXhlY3V0YWJsZV9wYXRoID0gbWF0Y2hlczJbMV0gfHwgbWF0Y2hlczJbMl07XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGV4ZWN1dGFibGVfcGF0aCA9IG1hdGNoZXMyWzFdO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZiAobWF0Y2hlczIubGVuZ3RoID09PSA0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhcmdzID0gbWF0Y2hlczJbM107XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKGV4ZWN1dGFibGVfcGF0aCkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgZXhlY3V0YWJsZV9uYW1lID0gYmFzZW5hbWUoZXhlY3V0YWJsZV9wYXRoKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIU5PREUudGVzdChleGVjdXRhYmxlX25hbWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpdGVtcy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBleGVjdXRhYmxlX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogcGlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGV0YWlsOiBjbWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRwaWQ6IHBpZFxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHJlc29sdmUoaXRlbXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Y21kLnN0ZGluLndyaXRlKCd3bWljIHByb2Nlc3MgZ2V0IFByb2Nlc3NJZCxDb21tYW5kTGluZSBcXG4nKTtcblx0XHRcdGNtZC5zdGRpbi5lbmQoKTtcblxuXHRcdH0gZWxzZSB7XHQvLyBPUyBYICYgTGludXhcblxuXHRcdFx0Y29uc3QgUElEX0NNRCA9IG5ldyBSZWdFeHAoJ15cXFxccyooWzAtOV0rKVxcXFxzKyguKykkJyk7XG5cdFx0XHRjb25zdCBNQUNfQVBQUyA9IG5ldyBSZWdFeHAoJ14uKi8oLiopLig/OmFwcHxidW5kbGUpL0NvbnRlbnRzLy4qJCcpO1xuXG5cdFx0XHRleGVjKCdwcyAtYXggLW8gcGlkPSxjb21tYW5kPScsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG5cblx0XHRcdFx0aWYgKGVyciB8fCBzdGRlcnIpIHtcblx0XHRcdFx0XHRyZWplY3QoZXJyIHx8IHN0ZGVyci50b1N0cmluZygpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBpdGVtcyA6IFByb2Nlc3NJdGVtW109IFtdO1xuXG5cdFx0XHRcdFx0Y29uc3QgbGluZXMgPSBzdGRvdXQudG9TdHJpbmcoKS5zcGxpdCgnXFxuJyk7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1hdGNoZXMgPSBQSURfQ01ELmV4ZWMobGluZSk7XG5cdFx0XHRcdFx0XHRpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA9PT0gMykge1xuXG5cdFx0XHRcdFx0XHRcdGNvbnN0IHBpZCA9IG1hdGNoZXNbMV07XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGNtZCA9IG1hdGNoZXNbMl07XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHBhcnRzID0gY21kLnNwbGl0KCcgJyk7IC8vIHRoaXMgd2lsbCBicmVhayBwYXRocyB3aXRoIHNwYWNlc1xuXHRcdFx0XHRcdFx0XHRjb25zdCBleGVjdXRhYmxlX3BhdGggPSBwYXJ0c1swXTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZXhlY3V0YWJsZV9uYW1lID0gYmFzZW5hbWUoZXhlY3V0YWJsZV9wYXRoKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoIU5PREUudGVzdChleGVjdXRhYmxlX25hbWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRsZXQgYXBwbGljYXRpb24gPSBjbWQ7XG5cdFx0XHRcdFx0XHRcdC8vIHRyeSB0byBzaG93IHRoZSBjb3JyZWN0IG5hbWUgZm9yIE9TIFggYXBwbGljYXRpb25zIGFuZCBidW5kbGVzXG5cdFx0XHRcdFx0XHRcdGNvbnN0IG1hdGNoZXMyID0gTUFDX0FQUFMuZXhlYyhjbWQpO1xuXHRcdFx0XHRcdFx0XHRpZiAobWF0Y2hlczIgJiYgbWF0Y2hlczIubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdFx0YXBwbGljYXRpb24gPSBtYXRjaGVzMlsxXTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRhcHBsaWNhdGlvbiA9IGV4ZWN1dGFibGVfbmFtZTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGl0ZW1zLnVuc2hpZnQoe1x0XHQvLyBidWlsZCB1cCBsaXN0IHJldmVydGVkXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IGFwcGxpY2F0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBwaWQsXG5cdFx0XHRcdFx0XHRcdFx0ZGV0YWlsOiBjbWQsXG5cdFx0XHRcdFx0XHRcdFx0cGlkOiBwaWRcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmVzb2x2ZShpdGVtcyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZShjb250ZXh0OiB2c2NvZGUuRXh0ZW5zaW9uQ29udGV4dCkge1xuXG5cdGxldCBkaXNwb3NhYmxlID0gdnNjb2RlLmNvbW1hbmRzLnJlZ2lzdGVyQ29tbWFuZCgnZXh0ZW5zaW9uLnBpY2tOb2RlUHJvY2VzcycsICgpID0+IHtcblxuXHRcdHJldHVybiBsaXN0UHJvY2Vzc2VzKCkudGhlbihpdGVtcyA9PiB7XG5cblx0XHRcdGxldCBvcHRpb25zIDogdnNjb2RlLlF1aWNrUGlja09wdGlvbnMgPSB7XG5cdFx0XHRcdHBsYWNlSG9sZGVyOiBcIlBpY2sgdGhlIG5vZGUuanMgb3IgZ3VscCBwcm9jZXNzIHRvIGF0dGFjaCB0b1wiLFxuXHRcdFx0XHRtYXRjaE9uRGVzY3JpcHRpb246IHRydWUsXG5cdFx0XHRcdG1hdGNoT25EZXRhaWw6IHRydWVcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB2c2NvZGUud2luZG93LnNob3dRdWlja1BpY2soaXRlbXMsIG9wdGlvbnMpLnRoZW4oaXRlbSA9PiB7XG5cdFx0XHRcdHJldHVybiBpdGVtID8gaXRlbS5waWQgOiBudWxsO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0fSk7XG5cblx0Y29udGV4dC5zdWJzY3JpcHRpb25zLnB1c2goZGlzcG9zYWJsZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
