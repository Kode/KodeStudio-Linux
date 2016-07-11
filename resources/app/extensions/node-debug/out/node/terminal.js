/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Path = require('path');
var FS = require('fs');
var CP = require('child_process');
var nls = require('vscode-nls');
var localize = nls.loadMessageBundle(__filename);
var Terminal = (function () {
    function Terminal() {
    }
    Terminal.launchInTerminal = function (dir, args, envVars) {
        return this.terminalService().launchInTerminal(dir, args, envVars);
    };
    Terminal.killTree = function (processId) {
        return this.terminalService().killTree(processId);
    };
    /*
     * Is the given runtime executable on the PATH.
     */
    Terminal.isOnPath = function (program) {
        return this.terminalService().isOnPath(program);
    };
    Terminal.terminalService = function () {
        if (!this._terminalService) {
            if (process.platform === 'win32') {
                this._terminalService = new WindowsTerminalService();
            }
            else if (process.platform === 'darwin') {
                this._terminalService = new MacTerminalService();
            }
            else if (process.platform === 'linux') {
                this._terminalService = new LinuxTerminalService();
            }
            else {
                this._terminalService = new DefaultTerminalService();
            }
        }
        return this._terminalService;
    };
    return Terminal;
}());
exports.Terminal = Terminal;
var TerminalError = (function () {
    function TerminalError(message, linkId) {
        this.message = message;
        this.linkId = linkId;
    }
    return TerminalError;
}());
exports.TerminalError = TerminalError;
var DefaultTerminalService = (function () {
    function DefaultTerminalService() {
    }
    DefaultTerminalService.prototype.launchInTerminal = function (dir, args, envVars) {
        return new Promise(function (resolve, reject) {
            reject(new TerminalError(localize(0, null, process.platform)));
        });
    };
    DefaultTerminalService.prototype.killTree = function (pid) {
        // on linux and OS X we kill all direct and indirect child processes as well
        return new Promise(function (resolve, reject) {
            try {
                var cmd = Path.join(__dirname, './terminateProcess.sh');
                var result = CP.spawnSync(cmd, [pid.toString()]);
                if (result.error) {
                    reject(result.error);
                }
                else {
                    resolve();
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DefaultTerminalService.prototype.isOnPath = function (program) {
        try {
            if (!FS.existsSync(DefaultTerminalService.WHICH)) {
                CP.execSync(DefaultTerminalService.WHICH + " '" + program + "'");
            }
            return true;
        }
        catch (Exception) {
        }
        return false;
    };
    DefaultTerminalService.TERMINAL_TITLE = localize(1, null);
    DefaultTerminalService.WHICH = '/usr/bin/which';
    return DefaultTerminalService;
}());
var WindowsTerminalService = (function (_super) {
    __extends(WindowsTerminalService, _super);
    function WindowsTerminalService() {
        _super.apply(this, arguments);
    }
    WindowsTerminalService.prototype.launchInTerminal = function (dir, args, envVars) {
        return new Promise(function (resolve, reject) {
            var title = "\"" + dir + " - " + WindowsTerminalService.TERMINAL_TITLE + "\"";
            var command = "\"\"" + args.join('" "') + "\" & pause\""; // use '|' to only pause on non-zero exit code
            var cmdArgs = [
                '/c', 'start', title, '/wait',
                'cmd.exe', '/c', command
            ];
            // merge environment variables into a copy of the process.env
            var env = extendObject(extendObject({}, process.env), envVars);
            var options = {
                cwd: dir,
                env: env,
                windowsVerbatimArguments: true
            };
            var cmd = CP.spawn(WindowsTerminalService.CMD, cmdArgs, options);
            cmd.on('error', reject);
            resolve(cmd);
        });
    };
    WindowsTerminalService.prototype.killTree = function (pid) {
        // when killing a process in Windows its child processes are *not* killed but become root processes.
        // Therefore we use TASKKILL.EXE
        return new Promise(function (resolve, reject) {
            var cmd = "taskkill /F /T /PID " + pid;
            try {
                CP.execSync(cmd);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    };
    WindowsTerminalService.prototype.isOnPath = function (program) {
        try {
            CP.execSync(WindowsTerminalService.WHERE + " " + program);
            return true;
        }
        catch (Exception) {
        }
        return false;
    };
    WindowsTerminalService.CMD = 'cmd.exe';
    WindowsTerminalService.WHERE = 'where';
    return WindowsTerminalService;
}(DefaultTerminalService));
var LinuxTerminalService = (function (_super) {
    __extends(LinuxTerminalService, _super);
    function LinuxTerminalService() {
        _super.apply(this, arguments);
    }
    LinuxTerminalService.prototype.launchInTerminal = function (dir, args, envVars) {
        return new Promise(function (resolve, reject) {
            if (!FS.existsSync(LinuxTerminalService.LINUX_TERM)) {
                reject(new TerminalError(localize(2, null, LinuxTerminalService.LINUX_TERM), 20002));
                return;
            }
            var bashCommand = quote(args) + "; echo; read -p \"" + LinuxTerminalService.WAIT_MESSAGE + "\" -n1;";
            var termArgs = [
                '--title', ("\"" + LinuxTerminalService.TERMINAL_TITLE + "\""),
                '-x', 'bash', '-c',
                ("''" + bashCommand + "''") // wrapping argument in two sets of ' because node is so "friendly" that it removes one set...
            ];
            // merge environment variables into a copy of the process.env
            var env = extendObject(extendObject({}, process.env), envVars);
            var options = {
                cwd: dir,
                env: env
            };
            var cmd = CP.spawn(LinuxTerminalService.LINUX_TERM, termArgs, options);
            cmd.on('error', reject);
            cmd.on('exit', function (code) {
                if (code === 0) {
                    resolve(); // since cmd is not the terminal process but just a launcher, we do not pass it in the resolve to the caller
                }
                else {
                    reject(new TerminalError(localize(3, null, LinuxTerminalService.LINUX_TERM, code)));
                }
            });
        });
    };
    LinuxTerminalService.LINUX_TERM = '/usr/bin/gnome-terminal'; //private const string LINUX_TERM = "/usr/bin/x-terminal-emulator";
    LinuxTerminalService.WAIT_MESSAGE = localize(4, null);
    return LinuxTerminalService;
}(DefaultTerminalService));
var MacTerminalService = (function (_super) {
    __extends(MacTerminalService, _super);
    function MacTerminalService() {
        _super.apply(this, arguments);
    }
    MacTerminalService.prototype.launchInTerminal = function (dir, args, envVars) {
        return new Promise(function (resolve, reject) {
            // first fix the PATH so that 'runtimePath' can be found if installed with 'brew'
            // Utilities.FixPathOnOSX();
            // On OS X we do not launch the program directly but we launch an AppleScript that creates (or reuses) a Terminal window
            // and then launches the program inside that window.
            var osaArgs = [
                Path.join(__dirname, './TerminalHelper.scpt'),
                '-t', MacTerminalService.TERMINAL_TITLE,
                '-w', dir,
            ];
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var a = args_1[_i];
                osaArgs.push('-pa');
                osaArgs.push(a);
            }
            if (envVars) {
                for (var key in envVars) {
                    osaArgs.push('-e');
                    osaArgs.push(key + '=' + envVars[key]);
                }
            }
            var stderr = '';
            var osa = CP.spawn(MacTerminalService.OSASCRIPT, osaArgs);
            osa.on('error', reject);
            osa.stderr.on('data', function (data) {
                stderr += data.toString();
            });
            osa.on('exit', function (code) {
                if (code === 0) {
                    resolve(); // since cmd is not the terminal process but just the osa tool, we do not pass it in the resolve to the caller
                }
                else {
                    if (stderr) {
                        reject(new TerminalError(stderr));
                    }
                    else {
                        reject(new TerminalError(localize(5, null, MacTerminalService.OSASCRIPT, code)));
                    }
                }
            });
        });
    };
    MacTerminalService.OSASCRIPT = '/usr/bin/osascript'; // osascript is the AppleScript interpreter on OS X
    return MacTerminalService;
}(DefaultTerminalService));
// ---- private utilities ----
/**
 * Quote args if necessary and combine into a space separated string.
 */
function quote(args) {
    var r = '';
    for (var _i = 0, args_2 = args; _i < args_2.length; _i++) {
        var a = args_2[_i];
        if (a.indexOf(' ') >= 0) {
            r += '"' + a + '"';
        }
        else {
            r += a;
        }
        r += ' ';
    }
    return r;
}
function extendObject(objectCopy, object) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            objectCopy[key] = object[key];
        }
    }
    return objectCopy;
}

//# sourceMappingURL=data:application/json;base64,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O0FBRTlCOztHQUVHO0FBQ0gsZUFBZSxJQUFjO0lBQzVCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNYLEdBQUcsQ0FBQyxDQUFVLFVBQUksRUFBSixhQUFJLEVBQUosa0JBQUksRUFBSixJQUFJLENBQUM7UUFBZCxJQUFJLENBQUMsYUFBQTtRQUNULEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDcEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNSLENBQUM7UUFDRCxDQUFDLElBQUksR0FBRyxDQUFDO0tBQ1Q7SUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1YsQ0FBQztBQUVELHNCQUEwQixVQUFhLEVBQUUsTUFBUztJQUVqRCxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNGLENBQUM7SUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ25CLENBQUMiLCJmaWxlIjoibm9kZS90ZXJtaW5hbC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAgQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLiBTZWUgTGljZW5zZS50eHQgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgbGljZW5zZSBpbmZvcm1hdGlvbi5cbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgRlMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgQ1AgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBubHMgZnJvbSAndnNjb2RlLW5scyc7XG5cbmNvbnN0IGxvY2FsaXplID0gbmxzLmxvYWRNZXNzYWdlQnVuZGxlKCk7XG5cbmV4cG9ydCBjbGFzcyBUZXJtaW5hbFxue1xuXHRwcml2YXRlIHN0YXRpYyBfdGVybWluYWxTZXJ2aWNlOiBJVGVybWluYWxTZXJ2aWNlO1xuXG5cdHB1YmxpYyBzdGF0aWMgbGF1bmNoSW5UZXJtaW5hbChkaXI6IHN0cmluZywgYXJnczogc3RyaW5nW10sIGVudlZhcnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nOyB9KTogUHJvbWlzZTxDUC5DaGlsZFByb2Nlc3M+IHtcblx0XHRyZXR1cm4gdGhpcy50ZXJtaW5hbFNlcnZpY2UoKS5sYXVuY2hJblRlcm1pbmFsKGRpciwgYXJncywgZW52VmFycyk7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGtpbGxUcmVlKHByb2Nlc3NJZDogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHtcblx0XHRyZXR1cm4gdGhpcy50ZXJtaW5hbFNlcnZpY2UoKS5raWxsVHJlZShwcm9jZXNzSWQpO1xuXHR9XG5cblx0Lypcblx0ICogSXMgdGhlIGdpdmVuIHJ1bnRpbWUgZXhlY3V0YWJsZSBvbiB0aGUgUEFUSC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgaXNPblBhdGgocHJvZ3JhbTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMudGVybWluYWxTZXJ2aWNlKCkuaXNPblBhdGgocHJvZ3JhbSk7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyB0ZXJtaW5hbFNlcnZpY2UoKTogSVRlcm1pbmFsU2VydmljZSB7XG5cdFx0aWYgKCF0aGlzLl90ZXJtaW5hbFNlcnZpY2UpIHtcblx0XHRcdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG5cdFx0XHRcdHRoaXMuX3Rlcm1pbmFsU2VydmljZSA9IG5ldyBXaW5kb3dzVGVybWluYWxTZXJ2aWNlKCk7XG5cdFx0XHR9IGVsc2UgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG5cdFx0XHRcdHRoaXMuX3Rlcm1pbmFsU2VydmljZSA9IG5ldyBNYWNUZXJtaW5hbFNlcnZpY2UoKTtcblx0XHRcdH0gZWxzZSBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jykge1xuXHRcdFx0XHR0aGlzLl90ZXJtaW5hbFNlcnZpY2UgPSBuZXcgTGludXhUZXJtaW5hbFNlcnZpY2UoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX3Rlcm1pbmFsU2VydmljZSA9IG5ldyBEZWZhdWx0VGVybWluYWxTZXJ2aWNlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl90ZXJtaW5hbFNlcnZpY2U7XG5cdH1cbn1cblxuXG5leHBvcnQgY2xhc3MgVGVybWluYWxFcnJvciB7XG5cblx0cHVibGljIG1lc3NhZ2U6IHN0cmluZztcblx0cHVibGljIGxpbmtJZDogbnVtYmVyO1xuXG5cdGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgbGlua0lkPzogbnVtYmVyKSB7XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0XHR0aGlzLmxpbmtJZCA9IGxpbmtJZDtcblx0fVxufVxuXG5pbnRlcmZhY2UgSVRlcm1pbmFsU2VydmljZSB7XG5cdGxhdW5jaEluVGVybWluYWwoZGlyOiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdLCBlbnZWYXJzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZzsgfSk6IFByb21pc2U8Q1AuQ2hpbGRQcm9jZXNzPjtcblx0a2lsbFRyZWUocGlkOiBudW1iZXIpIDogUHJvbWlzZTxhbnk+O1xuXHRpc09uUGF0aChwcm9ncmFtOiBzdHJpbmcpOiBib29sZWFuO1xufVxuXG5jbGFzcyBEZWZhdWx0VGVybWluYWxTZXJ2aWNlIGltcGxlbWVudHMgSVRlcm1pbmFsU2VydmljZSB7XG5cblx0cHJvdGVjdGVkIHN0YXRpYyBURVJNSU5BTF9USVRMRSA9IGxvY2FsaXplKCdjb25zb2xlLnRpdGxlJywgXCJWUyBDb2RlIENvbnNvbGVcIik7XG5cdHByaXZhdGUgc3RhdGljIFdISUNIID0gJy91c3IvYmluL3doaWNoJztcblxuXHRwdWJsaWMgbGF1bmNoSW5UZXJtaW5hbChkaXI6IHN0cmluZywgYXJnczogc3RyaW5nW10sIGVudlZhcnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nOyB9KTogUHJvbWlzZTxDUC5DaGlsZFByb2Nlc3M+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2U8Q1AuQ2hpbGRQcm9jZXNzPiggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0cmVqZWN0KG5ldyBUZXJtaW5hbEVycm9yKGxvY2FsaXplKCdleHRlcm5hbC5jb25zb2xlLm5vdC5pbXBsZW1lbnRlZCcsIFwiRXh0ZXJuYWwgY29uc29sZSBub3QgaW1wbGVtZW50ZWQgb24gJ3swfScuXCIsIHByb2Nlc3MucGxhdGZvcm0pKSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMga2lsbFRyZWUocGlkOiBudW1iZXIpOiBQcm9taXNlPGFueT4ge1xuXG5cdFx0Ly8gb24gbGludXggYW5kIE9TIFggd2Uga2lsbCBhbGwgZGlyZWN0IGFuZCBpbmRpcmVjdCBjaGlsZCBwcm9jZXNzZXMgYXMgd2VsbFxuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPGFueT4oIChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGNtZCA9IFBhdGguam9pbihfX2Rpcm5hbWUsICcuL3Rlcm1pbmF0ZVByb2Nlc3Muc2gnKTtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gKDxhbnk+Q1ApLnNwYXduU3luYyhjbWQsIFsgcGlkLnRvU3RyaW5nKCkgXSk7XG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblx0XHRcdFx0XHRyZWplY3QocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBpc09uUGF0aChwcm9ncmFtOiBzdHJpbmcpOiBib29sZWFuIHtcblxuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIUZTLmV4aXN0c1N5bmMoRGVmYXVsdFRlcm1pbmFsU2VydmljZS5XSElDSCkpIHtcblx0XHRcdFx0Q1AuZXhlY1N5bmMoYCR7RGVmYXVsdFRlcm1pbmFsU2VydmljZS5XSElDSH0gJyR7cHJvZ3JhbX0nYCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0Y2F0Y2ggKEV4Y2VwdGlvbikge1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuY2xhc3MgV2luZG93c1Rlcm1pbmFsU2VydmljZSBleHRlbmRzIERlZmF1bHRUZXJtaW5hbFNlcnZpY2Uge1xuXG5cdHByaXZhdGUgc3RhdGljIENNRCA9ICdjbWQuZXhlJztcblx0cHJpdmF0ZSBzdGF0aWMgV0hFUkUgPSAnd2hlcmUnO1xuXG5cdHB1YmxpYyBsYXVuY2hJblRlcm1pbmFsKGRpcjogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSwgZW52VmFyczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmc7IH0pOiBQcm9taXNlPENQLkNoaWxkUHJvY2Vzcz4ge1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPENQLkNoaWxkUHJvY2Vzcz4oIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuXHRcdFx0Y29uc3QgdGl0bGUgPSBgXCIke2Rpcn0gLSAke1dpbmRvd3NUZXJtaW5hbFNlcnZpY2UuVEVSTUlOQUxfVElUTEV9XCJgO1xuXHRcdFx0Y29uc3QgY29tbWFuZCA9IGBcIlwiJHthcmdzLmpvaW4oJ1wiIFwiJyl9XCIgJiBwYXVzZVwiYDsgLy8gdXNlICd8JyB0byBvbmx5IHBhdXNlIG9uIG5vbi16ZXJvIGV4aXQgY29kZVxuXG5cdFx0XHRjb25zdCBjbWRBcmdzID0gW1xuXHRcdFx0XHQnL2MnLCAnc3RhcnQnLCB0aXRsZSwgJy93YWl0Jyxcblx0XHRcdFx0J2NtZC5leGUnLCAnL2MnLCBjb21tYW5kXG5cdFx0XHRdO1xuXG5cdFx0XHQvLyBtZXJnZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgaW50byBhIGNvcHkgb2YgdGhlIHByb2Nlc3MuZW52XG5cdFx0XHRjb25zdCBlbnYgPSBleHRlbmRPYmplY3QoZXh0ZW5kT2JqZWN0KCB7IH0sIHByb2Nlc3MuZW52KSwgZW52VmFycyk7XG5cblx0XHRcdGNvbnN0IG9wdGlvbnM6IGFueSA9IHtcblx0XHRcdFx0Y3dkOiBkaXIsXG5cdFx0XHRcdGVudjogZW52LFxuXHRcdFx0XHR3aW5kb3dzVmVyYmF0aW1Bcmd1bWVudHM6IHRydWVcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGNtZCA9IENQLnNwYXduKFdpbmRvd3NUZXJtaW5hbFNlcnZpY2UuQ01ELCBjbWRBcmdzLCBvcHRpb25zKTtcblx0XHRcdGNtZC5vbignZXJyb3InLCByZWplY3QpO1xuXG5cdFx0XHRyZXNvbHZlKGNtZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMga2lsbFRyZWUocGlkOiBudW1iZXIpOiBQcm9taXNlPGFueT4ge1xuXG5cdFx0Ly8gd2hlbiBraWxsaW5nIGEgcHJvY2VzcyBpbiBXaW5kb3dzIGl0cyBjaGlsZCBwcm9jZXNzZXMgYXJlICpub3QqIGtpbGxlZCBidXQgYmVjb21lIHJvb3QgcHJvY2Vzc2VzLlxuXHRcdC8vIFRoZXJlZm9yZSB3ZSB1c2UgVEFTS0tJTEwuRVhFXG5cblx0XHRyZXR1cm4gbmV3IFByb21pc2U8YW55PiggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0Y29uc3QgY21kID0gYHRhc2traWxsIC9GIC9UIC9QSUQgJHtwaWR9YDtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdENQLmV4ZWNTeW5jKGNtZCk7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH1cblx0XHRcdGNhdGNoIChlcnIpIHtcblx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgaXNPblBhdGgocHJvZ3JhbTogc3RyaW5nKTogYm9vbGVhbiB7XG5cblx0XHR0cnkge1xuXHRcdFx0Q1AuZXhlY1N5bmMoYCR7V2luZG93c1Rlcm1pbmFsU2VydmljZS5XSEVSRX0gJHtwcm9ncmFtfWApO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGNhdGNoIChFeGNlcHRpb24pIHtcblx0XHRcdC8vIGlnbm9yZVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuY2xhc3MgTGludXhUZXJtaW5hbFNlcnZpY2UgZXh0ZW5kcyBEZWZhdWx0VGVybWluYWxTZXJ2aWNlIHtcblxuXHRwcml2YXRlIHN0YXRpYyBMSU5VWF9URVJNID0gJy91c3IvYmluL2dub21lLXRlcm1pbmFsJztcdC8vcHJpdmF0ZSBjb25zdCBzdHJpbmcgTElOVVhfVEVSTSA9IFwiL3Vzci9iaW4veC10ZXJtaW5hbC1lbXVsYXRvclwiO1xuXHRwcml2YXRlIHN0YXRpYyBXQUlUX01FU1NBR0UgPSBsb2NhbGl6ZSgncHJlc3MuYW55LmtleScsIFwiUHJlc3MgYW55IGtleSB0byBjb250aW51ZS4uLlwiKTtcblxuXHRwdWJsaWMgbGF1bmNoSW5UZXJtaW5hbChkaXI6IHN0cmluZywgYXJnczogc3RyaW5nW10sIGVudlZhcnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nOyB9KTogUHJvbWlzZTxDUC5DaGlsZFByb2Nlc3M+IHtcblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZTxDUC5DaGlsZFByb2Nlc3M+KCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cblx0XHRcdGlmICghRlMuZXhpc3RzU3luYyhMaW51eFRlcm1pbmFsU2VydmljZS5MSU5VWF9URVJNKSkge1xuXHRcdFx0XHRyZWplY3QobmV3IFRlcm1pbmFsRXJyb3IobG9jYWxpemUoJ3Byb2dyYW0ubm90LmZvdW5kJywgXCInezB9JyBub3QgZm91bmRcIiwgTGludXhUZXJtaW5hbFNlcnZpY2UuTElOVVhfVEVSTSksIDIwMDAyKSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYmFzaENvbW1hbmQgPSBgJHtxdW90ZShhcmdzKX07IGVjaG87IHJlYWQgLXAgXCIke0xpbnV4VGVybWluYWxTZXJ2aWNlLldBSVRfTUVTU0FHRX1cIiAtbjE7YDtcblxuXHRcdFx0Y29uc3QgdGVybUFyZ3MgPSBbXG5cdFx0XHRcdCctLXRpdGxlJywgYFwiJHtMaW51eFRlcm1pbmFsU2VydmljZS5URVJNSU5BTF9USVRMRX1cImAsXG5cdFx0XHRcdCcteCcsICdiYXNoJywgJy1jJyxcblx0XHRcdFx0YCcnJHtiYXNoQ29tbWFuZH0nJ2AgXHQvLyB3cmFwcGluZyBhcmd1bWVudCBpbiB0d28gc2V0cyBvZiAnIGJlY2F1c2Ugbm9kZSBpcyBzbyBcImZyaWVuZGx5XCIgdGhhdCBpdCByZW1vdmVzIG9uZSBzZXQuLi5cblx0XHRcdF07XG5cblx0XHRcdC8vIG1lcmdlIGVudmlyb25tZW50IHZhcmlhYmxlcyBpbnRvIGEgY29weSBvZiB0aGUgcHJvY2Vzcy5lbnZcblx0XHRcdGNvbnN0IGVudiA9IGV4dGVuZE9iamVjdChleHRlbmRPYmplY3QoIHsgfSwgcHJvY2Vzcy5lbnYpLCBlbnZWYXJzKTtcblxuXHRcdFx0Y29uc3Qgb3B0aW9uczogYW55ID0ge1xuXHRcdFx0XHRjd2Q6IGRpcixcblx0XHRcdFx0ZW52OiBlbnZcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGNtZCA9IENQLnNwYXduKExpbnV4VGVybWluYWxTZXJ2aWNlLkxJTlVYX1RFUk0sIHRlcm1BcmdzLCBvcHRpb25zKTtcblx0XHRcdGNtZC5vbignZXJyb3InLCByZWplY3QpO1xuXHRcdFx0Y21kLm9uKCdleGl0JywgKGNvZGU6IG51bWJlcikgPT4ge1xuXHRcdFx0XHRpZiAoY29kZSA9PT0gMCkge1x0Ly8gT0tcblx0XHRcdFx0XHRyZXNvbHZlKCk7XHQvLyBzaW5jZSBjbWQgaXMgbm90IHRoZSB0ZXJtaW5hbCBwcm9jZXNzIGJ1dCBqdXN0IGEgbGF1bmNoZXIsIHdlIGRvIG5vdCBwYXNzIGl0IGluIHRoZSByZXNvbHZlIHRvIHRoZSBjYWxsZXJcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZWplY3QobmV3IFRlcm1pbmFsRXJyb3IobG9jYWxpemUoJ3Byb2dyYW0uZmFpbGVkJywgXCJ7MH0gZmFpbGVkIHdpdGggZXhpdCBjb2RlIHsxfVwiLCBMaW51eFRlcm1pbmFsU2VydmljZS5MSU5VWF9URVJNLCBjb2RlKSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufVxuXG5jbGFzcyBNYWNUZXJtaW5hbFNlcnZpY2UgZXh0ZW5kcyBEZWZhdWx0VGVybWluYWxTZXJ2aWNlIHtcblxuXHRwcml2YXRlIHN0YXRpYyBPU0FTQ1JJUFQgPSAnL3Vzci9iaW4vb3Nhc2NyaXB0JztcdC8vIG9zYXNjcmlwdCBpcyB0aGUgQXBwbGVTY3JpcHQgaW50ZXJwcmV0ZXIgb24gT1MgWFxuXG5cdHB1YmxpYyBsYXVuY2hJblRlcm1pbmFsKGRpcjogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSwgZW52VmFyczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmc7IH0pOiBQcm9taXNlPENQLkNoaWxkUHJvY2Vzcz4ge1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPENQLkNoaWxkUHJvY2Vzcz4oIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuXHRcdFx0Ly8gZmlyc3QgZml4IHRoZSBQQVRIIHNvIHRoYXQgJ3J1bnRpbWVQYXRoJyBjYW4gYmUgZm91bmQgaWYgaW5zdGFsbGVkIHdpdGggJ2JyZXcnXG5cdFx0XHQvLyBVdGlsaXRpZXMuRml4UGF0aE9uT1NYKCk7XG5cblx0XHRcdC8vIE9uIE9TIFggd2UgZG8gbm90IGxhdW5jaCB0aGUgcHJvZ3JhbSBkaXJlY3RseSBidXQgd2UgbGF1bmNoIGFuIEFwcGxlU2NyaXB0IHRoYXQgY3JlYXRlcyAob3IgcmV1c2VzKSBhIFRlcm1pbmFsIHdpbmRvd1xuXHRcdFx0Ly8gYW5kIHRoZW4gbGF1bmNoZXMgdGhlIHByb2dyYW0gaW5zaWRlIHRoYXQgd2luZG93LlxuXG5cdFx0XHRjb25zdCBvc2FBcmdzID0gW1xuXHRcdFx0XHRQYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9UZXJtaW5hbEhlbHBlci5zY3B0JyksXG5cdFx0XHRcdCctdCcsIE1hY1Rlcm1pbmFsU2VydmljZS5URVJNSU5BTF9USVRMRSxcblx0XHRcdFx0Jy13JywgZGlyLFxuXHRcdFx0XTtcblxuXHRcdFx0Zm9yIChsZXQgYSBvZiBhcmdzKSB7XG5cdFx0XHRcdG9zYUFyZ3MucHVzaCgnLXBhJyk7XG5cdFx0XHRcdG9zYUFyZ3MucHVzaChhKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGVudlZhcnMpIHtcblx0XHRcdFx0Zm9yIChsZXQga2V5IGluIGVudlZhcnMpIHtcblx0XHRcdFx0XHRvc2FBcmdzLnB1c2goJy1lJyk7XG5cdFx0XHRcdFx0b3NhQXJncy5wdXNoKGtleSArICc9JyArIGVudlZhcnNba2V5XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0bGV0IHN0ZGVyciA9ICcnO1xuXHRcdFx0Y29uc3Qgb3NhID0gQ1Auc3Bhd24oTWFjVGVybWluYWxTZXJ2aWNlLk9TQVNDUklQVCwgb3NhQXJncyk7XG5cdFx0XHRvc2Eub24oJ2Vycm9yJywgcmVqZWN0KTtcblx0XHRcdG9zYS5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuXHRcdFx0XHRzdGRlcnIgKz0gZGF0YS50b1N0cmluZygpO1xuXHRcdFx0fSk7XG5cdFx0XHRvc2Eub24oJ2V4aXQnLCAoY29kZTogbnVtYmVyKSA9PiB7XG5cdFx0XHRcdGlmIChjb2RlID09PSAwKSB7XHQvLyBPS1xuXHRcdFx0XHRcdHJlc29sdmUoKTtcdC8vIHNpbmNlIGNtZCBpcyBub3QgdGhlIHRlcm1pbmFsIHByb2Nlc3MgYnV0IGp1c3QgdGhlIG9zYSB0b29sLCB3ZSBkbyBub3QgcGFzcyBpdCBpbiB0aGUgcmVzb2x2ZSB0byB0aGUgY2FsbGVyXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHN0ZGVycikge1xuXHRcdFx0XHRcdFx0cmVqZWN0KG5ldyBUZXJtaW5hbEVycm9yKHN0ZGVycikpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZWplY3QobmV3IFRlcm1pbmFsRXJyb3IobG9jYWxpemUoJ3Byb2dyYW0uZmFpbGVkJywgXCJ7MH0gZmFpbGVkIHdpdGggZXhpdCBjb2RlIHsxfVwiLCBNYWNUZXJtaW5hbFNlcnZpY2UuT1NBU0NSSVBULCBjb2RlKSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuLy8gLS0tLSBwcml2YXRlIHV0aWxpdGllcyAtLS0tXG5cbi8qKlxuICogUXVvdGUgYXJncyBpZiBuZWNlc3NhcnkgYW5kIGNvbWJpbmUgaW50byBhIHNwYWNlIHNlcGFyYXRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIHF1b3RlKGFyZ3M6IHN0cmluZ1tdKTogc3RyaW5nIHtcblx0bGV0IHIgPSAnJztcblx0Zm9yIChsZXQgYSBvZiBhcmdzKSB7XG5cdFx0aWYgKGEuaW5kZXhPZignICcpID49IDApIHtcblx0XHRcdHIgKz0gJ1wiJyArIGEgKyAnXCInO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyICs9IGE7XG5cdFx0fVxuXHRcdHIgKz0gJyAnO1xuXHR9XG5cdHJldHVybiByO1xufVxuXG5mdW5jdGlvbiBleHRlbmRPYmplY3Q8VD4gKG9iamVjdENvcHk6IFQsIG9iamVjdDogVCk6IFQge1xuXG5cdGZvciAobGV0IGtleSBpbiBvYmplY3QpIHtcblx0XHRpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdG9iamVjdENvcHlba2V5XSA9IG9iamVjdFtrZXldO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBvYmplY3RDb3B5O1xufVxuIl19
