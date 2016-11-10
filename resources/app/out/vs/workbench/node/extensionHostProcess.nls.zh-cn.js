/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
define("vs/workbench/node/extensionHostProcess.nls.zh-cn", {
	"vs/base/common/processes": [
		"错误: 可执行信息必须定义字符串类型的命令。",
		"警告: isShellCommand 的类型必须为布尔型。正在忽略值 {0}。",
		"警告: args 的类型必须为 string[]。正在忽略值 {0}。",
		"警告: options.cwd 的类型必须为字符串。正在忽略值 {0}。",
	],
	"vs/base/common/severity": [
		"错误",
		"警告",
		"信息",
	],
	"vs/base/node/processes": [
		"无法对 UNC 驱动器执行 shell 命令。",
	],
	"vs/platform/extensions/common/abstractExtensionService": [
		"无法激活扩展”{1}“。原因：未知依赖关系”{0}“。",
		"无法激活扩展”{1}“。原因: 无法激活依赖关系”{0}“。",
		"无法激活扩展”{0}“。原因: 依赖关系多于 10 级(最可能是依赖关系循环)。",
		"激活扩展“{0}”失败: {1}。",
	],
	"vs/platform/extensions/common/extensionsRegistry": [
		"对于 VS Code 扩展程序，指定该扩展程序与之兼容的 VS Code 版本。不能为 *. 例如: ^0.10.5 表示最低兼容 VS Code 版本 0.10.5。",
		"VS Code 扩展的发布服务器。",
		"VS Code 库中使用的扩展的显示名称。",
		"VS Code 库用于对扩展进行分类的类别。",
		"VS Code 商城使用的横幅。",
		"VS Code 商城页标题上的横幅颜色。",
		"横幅中使用的字体颜色主题。",
		"由此包表示的 VS Code 扩展的所有贡献。",
		"在 Marketplace 中设置扩展，将其标记为“预览”。",
		"VS Code 扩展的激活事件。",
		"在 Marketplace 的扩展页边栏中显示的徽章数组。",
		"徽章图像 URL。",
		"徽章链接。",
		"徽章说明。",
		"其他扩展的依赖关系。扩展的标识符始终是 ${publisher}.${name}。例如: vscode.csharp。",
		"包作为 VS Code 扩展发布前执行的脚本。",
		"128 x 128 像素图标的路径。",
	],
	"vs/workbench/api/node/extHostDiagnostics": [
		"未显示 {0} 个进一步的错误和警告。",
	],
	"vs/workbench/node/extensionHostMain": [
		"路径 {0} 未指向有效的扩展测试运行程序。",
	]
});