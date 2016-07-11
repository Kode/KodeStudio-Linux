/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/*---------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
define("vs/code/node/cliProcessMain.nls", {
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
	"vs/code/node/cliProcessMain": [
		"Extension '{0}' not found.",
		"Extension '{0}' is not installed.",
		"Make sure you use the full extension ID, eg: {0}",
		"Extension '{0}' is already installed.",
		"Found '{0}' in the marketplace.",
		"Installing...",
		"Extension '{0}' v{1} was successfully installed!",
		"Uninstalling {0}...",
		"Extension '{0}' was successfully uninstalled!"
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
	"vs/platform/jsonschemas/common/jsonContributionRegistry": [
		"Describes a JSON file using a schema. See json-schema.org for more info.",
		"A unique identifier for the schema.",
		"The schema to verify this document against ",
		"A descriptive title of the element",
		"A long description of the element. Used in hover menus and suggestions.",
		"A default value. Used by suggestions.",
		"A number that should cleanly divide the current value (i.e. have no remainder)",
		"The maximum numerical value, inclusive by default.",
		"Makes the maximum property exclusive.",
		"The minimum numerical value, inclusive by default.",
		"Makes the minimum property exclusive.",
		"The maximum length of a string.",
		"The minimum length of a string.",
		"A regular expression to match the string against. It is not implicitly anchored.",
		"For arrays, only when items is set as an array. If it is a schema, then this schema validates items after the ones specified by the items array. If it is false, then additional items will cause validation to fail.",
		"For arrays. Can either be a schema to validate every element against or an array of schemas to validate each item against in order (the first schema will validate the first element, the second schema will validate the second element, and so on.",
		"The maximum number of items that can be inside an array. Inclusive.",
		"The minimum number of items that can be inside an array. Inclusive.",
		"If all of the items in the array must be unique. Defaults to false.",
		"The maximum number of properties an object can have. Inclusive.",
		"The minimum number of properties an object can have. Inclusive.",
		"An array of strings that lists the names of all properties required on this object.",
		"Either a schema or a boolean. If a schema, then used to validate all properties not matched by 'properties' or 'patternProperties'. If false, then any properties not matched by either will cause this schema to fail.",
		"Not used for validation. Place subschemas here that you wish to reference inline with $ref",
		"A map of property names to schemas for each property.",
		"A map of regular expressions on property names to schemas for matching properties.",
		"A map of property names to either an array of property names or a schema. An array of property names means the property named in the key depends on the properties in the array being present in the object in order to be valid. If the value is a schema, then the schema is only applied to the object if the property in the key exists on the object.",
		"The set of literal values that are valid",
		"Either a string of one of the basic schema types (number, integer, null, array, object, boolean, string) or an array of strings specifying a subset of those types.",
		"Describes the format expected for the value.",
		"An array of schemas, all of which must match.",
		"An array of schemas, where at least one must match.",
		"An array of schemas, exactly one of which must match.",
		"A schema which must not match."
	],
	"vs/platform/telemetry/common/telemetryService": [
		"Telemetry",
		"Enable usage data and errors to be sent to Microsoft."
	]
});