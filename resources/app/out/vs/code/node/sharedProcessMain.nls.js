/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/*---------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
define("vs/code/node/sharedProcessMain.nls", {
	"vs/base/common/errors": [
		"{0}. Error code: {1}",
		"Permission Denied (HTTP {0})",
		"Permission Denied",
		"{0} (HTTP {1}: {2})",
		"{0} (HTTP {1})",
		"Unknown Connection Error ({0})",
		"An unknown connection error occurred. Either you are no longer connected to the internet or the server you are connected to is offline.",
		"{0}: {1}",
		"An unknown error occurred. Please consult the log for more details.",
		"A system error occured ({0})",
		"An unknown error occurred. Please consult the log for more details.",
		"{0} ({1} errors in total)",
		"An unknown error occurred. Please consult the log for more details.",
		"Not Implemented",
		"Illegal argument: {0}",
		"Illegal argument",
		"Illegal state: {0}",
		"Illegal state",
		"Failed to load a required file. Either you are no longer connected to the internet or the server you are connected to is offline. Please refresh the browser to try again.",
		"Failed to load a required file. Please restart the application to try again. Details: {0}"
	],
	"vs/base/common/json": [
		"Invalid symbol",
		"Invalid number format",
		"Property name expected",
		"Value expected",
		"Colon expected",
		"Comma expected",
		"Closing brace expected",
		"Closing bracket expected",
		"End of file expected"
	],
	"vs/base/common/severity": [
		"Error",
		"Warning",
		"Info"
	],
	"vs/base/node/zip": [
		"{0} not found inside zip."
	],
	"vs/code/node/argv": [
		"Open a diff editor. Requires to pass two file paths as arguments.",
		"Disable all installed extensions.",
		"Open the file at path at the line and column (add :line[:column] to path).",
		"The locale to use (e.g. en-US or zh-TW).",
		"Force a new instance of Code.",
		"Start with the 'Developer: Startup Performance' command enabled.",
		"Force opening a file or folder in the last active window.",
		"Specifies the directory that user data is kept in, useful when running as root.",
		"Print verbose output (implies --wait).",
		"Wait for the window to be closed before returning.",
		"Set the root path for extensions.",
		"List the installed extensions.",
		"Installs an extension.",
		"Uninstalls an extension.",
		"Print version.",
		"Print usage."
	],
	"vs/platform/configuration/common/configurationRegistry": [
		"Contributes configuration settings.",
		"A summary of the settings. This label will be used in the settings file as separating comment.",
		"Description of the configuration properties.",
		"if set, 'configuration.type' must be set to 'object",
		"'configuration.title' must be a string",
		"'configuration.properties' must be an object"
	],
	"vs/platform/extensionManagement/common/extensionManagement": [
		"Extensions"
	],
	"vs/platform/extensionManagement/node/extensionManagementService": [
		"Extension invalid: package.json is not a JSON file.",
		"Extension invalid: manifest name mismatch.",
		"Extension invalid: manifest publisher mismatch.",
		"Extension invalid: manifest version mismatch.",
		"Please restart Code before reinstalling {0}.",
		"Couldn't find a compatible version of {0} with this version of Code.",
		"Could not find extension"
	],
	"vs/platform/extensions/common/extensionsRegistry": [
		"Got empty extension description",
		"property `{0}` is mandatory and must be of type `string`",
		"property `{0}` is mandatory and must be of type `string`",
		"property `{0}` is mandatory and must be of type `string`",
		"property `{0}` is mandatory and must be of type `object`",
		"property `{0}` is mandatory and must be of type `string`",
		"property `{0}` can be omitted or must be of type `string[]`",
		"property `{0}` can be omitted or must be of type `string[]`",
		"properties `{0}` and `{1}` must both be specified or must both be omitted",
		"property `{0}` can be omitted or must be of type `string`",
		"Expected `main` ({0}) to be included inside extension's folder ({1}). This might make the extension non-portable.",
		"properties `{0}` and `{1}` must both be specified or must both be omitted",
		"The display name for the extension used in the VS Code gallery.",
		"The categories used by the VS Code gallery to categorize the extension.",
		"Banner used in the VS Code marketplace.",
		"The banner color on the VS Code marketplace page header.",
		"The color theme for the font used in the banner.",
		"The publisher of the VS Code extension.",
		"Activation events for the VS Code extension.",
		"Dependencies to other extensions. The identifier of an extension is always ${publisher}.${name}. For example: vscode.csharp.",
		"Script executed before the package is published as a VS Code extension.",
		"All contributions of the VS Code extension represented by this package."
	],
	"vs/platform/extensions/node/extensionValidator": [
		"Could not parse `engines.vscode` value {0}. Please use, for example: ^0.10.0, ^1.2.3, ^0.11.0, ^0.10.x, etc.",
		"Version specified in `engines.vscode` ({0}) is not specific enough. For vscode versions before 1.0.0, please define at a minimum the major and minor desired version. E.g. ^0.10.0, 0.10.x, 0.11.0, etc.",
		"Version specified in `engines.vscode` ({0}) is not specific enough. For vscode versions after 1.0.0, please define at a minimum the major desired version. E.g. ^1.10.0, 1.10.x, 1.x.x, 2.x.x, etc.",
		"Extension is not compatible with Code {0}. Extension requires: {1}.",
		"Extension version is not semver compatible."
	],
	"vs/platform/telemetry/common/telemetryService": [
		"Telemetry",
		"Enable usage data and errors to be sent to Microsoft."
	]
});