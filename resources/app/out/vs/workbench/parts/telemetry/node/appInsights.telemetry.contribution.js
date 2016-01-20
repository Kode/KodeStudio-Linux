define(["require", "exports", 'vs/platform/platform', 'vs/platform/telemetry/common/abstractTelemetryService', 'vs/workbench/parts/telemetry/node/nodeAppInsightsTelemetryAppender', 'vs/platform/instantiation/common/descriptors'], function (require, exports, Platform, AbstractTelemetryService, AppInsightsTelemetryAppender, descriptors_1) {
    var descriptor = descriptors_1.createSyncDescriptor(AppInsightsTelemetryAppender.NodeAppInsightsTelemetryAppender);
    Platform.Registry.as(AbstractTelemetryService.Extenstions.TelemetryAppenders).registerTelemetryAppenderDescriptor(descriptor);
});
//# sourceMappingURL=appInsights.telemetry.contribution.js.map