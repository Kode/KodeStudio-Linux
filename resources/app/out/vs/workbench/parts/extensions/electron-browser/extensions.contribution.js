/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", 'vs/platform/platform', 'vs/platform/instantiation/common/extensions', 'vs/workbench/browser/parts/statusbar/statusbar', 'vs/workbench/parts/extensions/electron-browser/extensionsWidgets', 'vs/workbench/parts/extensions/common/extensions', 'vs/workbench/parts/extensions/node/vsoGalleryService', 'vs/workbench/common/contributions', 'vs/workbench/parts/extensions/electron-browser/extensionsWorkbenchExtension'], function (require, exports, platform, extensions_1, statusbar, extensionsWidgets_1, extensions_2, vsoGalleryService_1, contributions_1, extensionsWorkbenchExtension_1) {
    // Register Gallery Service
    extensions_1.registerSingleton(extensions_2.IGalleryService, vsoGalleryService_1.GalleryService);
    // Register Extensions Workbench Extension
    platform.Registry.as(contributions_1.Extensions.Workbench).registerWorkbenchContribution(extensionsWorkbenchExtension_1.ExtensionsWorkbenchExtension);
    // Register Statusbar item
    platform.Registry.as(statusbar.Extensions.Statusbar).registerStatusbarItem(new statusbar.StatusbarItemDescriptor(extensionsWidgets_1.ExtensionsStatusbarItem, statusbar.StatusbarAlignment.LEFT, 10 /* Low Priority */));
});
//# sourceMappingURL=extensions.contribution.js.map