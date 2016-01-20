/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'assert', 'vs/platform/instantiation/common/instantiation', 'vs/platform/instantiation/common/instantiationService', 'vs/platform/instantiation/common/descriptors'], function (require, exports, assert, instantiation, instantiationService, descriptors_1) {
    var Target1 = (function () {
        function Target1(platformServices) {
            this.platformServices = platformServices;
            assert.ok(!!platformServices.editorService);
        }
        Target1.prototype.validate = function () {
            try {
                this.platformServices.editorService;
                return false;
            }
            catch (e) {
                return e instanceof Error;
            }
        };
        return Target1;
    })();
    exports.Target1 = Target1;
    var Target2 = (function () {
        function Target2(platformServices, far) {
            this.platformServices = platformServices;
            this.far = far;
            assert.ok(!!platformServices.editorService);
        }
        Target2.prototype.validate = function () {
            if (!this.far) {
                return false;
            }
            try {
                this.platformServices.editorService;
                return false;
            }
            catch (e) {
                return e instanceof Error;
            }
        };
        return Target2;
    })();
    exports.Target2 = Target2;
    var Target3 = (function () {
        function Target3(platformServices) {
            this.platformServices = platformServices;
            assert.ok(!!platformServices.editorService);
            assert.equal(platformServices['far'], 1234);
        }
        return Target3;
    })();
    var Target4 = (function () {
        function Target4(platformServices) {
            this.platformServices = platformServices;
            assert.equal(platformServices.editorService, 1234);
        }
        return Target4;
    })();
    var EvilTarget1 = (function () {
        function EvilTarget1(platformServices) {
            this.platformServices = platformServices;
            platformServices.editorService = null;
        }
        return EvilTarget1;
    })();
    exports.EvilTarget1 = EvilTarget1;
    var IService1 = instantiation.createDecorator('service1');
    var Service1 = (function () {
        function Service1() {
            this.serviceId = IService1;
            this.c = 1;
        }
        return Service1;
    })();
    var IService2 = instantiation.createDecorator('service2');
    var Service2 = (function () {
        function Service2() {
            this.serviceId = IService2;
            this.d = true;
        }
        return Service2;
    })();
    var IService3 = instantiation.createDecorator('service3');
    var Service3 = (function () {
        function Service3() {
            this.serviceId = IService3;
            this.s = 'farboo';
        }
        return Service3;
    })();
    var IDependentService = instantiation.createDecorator('dependentService');
    var DependentService = (function () {
        function DependentService(service) {
            this.serviceId = IDependentService;
            this.name = 'farboo';
            assert.equal(service.c, 1);
        }
        DependentService = __decorate([
            __param(0, IService1)
        ], DependentService);
        return DependentService;
    })();
    var ParameterTarget = (function () {
        function ParameterTarget(service1) {
            assert.ok(service1);
            assert.equal(service1.c, 1);
        }
        ParameterTarget = __decorate([
            __param(0, IService1)
        ], ParameterTarget);
        return ParameterTarget;
    })();
    var ParameterTarget2 = (function () {
        function ParameterTarget2(v, service1) {
            assert.ok(v);
            assert.ok(service1);
            assert.equal(service1.c, 1);
        }
        ParameterTarget2 = __decorate([
            __param(1, IService1)
        ], ParameterTarget2);
        return ParameterTarget2;
    })();
    var TargetOptional = (function () {
        function TargetOptional(service1, service2) {
            assert.ok(service1);
            assert.equal(service1.c, 1);
            assert.ok(service2 === void 0);
        }
        TargetOptional = __decorate([
            __param(0, IService1),
            __param(1, IService2)
        ], TargetOptional);
        return TargetOptional;
    })();
    var DependentServiceTarget = (function () {
        function DependentServiceTarget(d) {
            assert.ok(d);
            assert.equal(d.name, 'farboo');
        }
        DependentServiceTarget = __decorate([
            __param(0, IDependentService)
        ], DependentServiceTarget);
        return DependentServiceTarget;
    })();
    var DependentServiceTarget2 = (function () {
        function DependentServiceTarget2(d, s) {
            assert.ok(d);
            assert.equal(d.name, 'farboo');
            assert.ok(s);
            assert.equal(s.c, 1);
        }
        DependentServiceTarget2 = __decorate([
            __param(0, IDependentService),
            __param(1, IService1)
        ], DependentServiceTarget2);
        return DependentServiceTarget2;
    })();
    var ServiceLoop1 = (function () {
        function ServiceLoop1(s) {
            this.serviceId = IService1;
            this.c = 1;
        }
        ServiceLoop1 = __decorate([
            __param(0, IService2)
        ], ServiceLoop1);
        return ServiceLoop1;
    })();
    var ServiceLoop2 = (function () {
        function ServiceLoop2(s) {
            this.serviceId = IService2;
            this.d = true;
        }
        ServiceLoop2 = __decorate([
            __param(0, IService1)
        ], ServiceLoop2);
        return ServiceLoop2;
    })();
    suite('Instantiation Service', function () {
        var service;
        setup(function () {
            service = instantiationService.create({
                editorService: 'boo',
            });
        });
        test('sync create, platformServices only', function () {
            var instance = service.createInstance(Target1);
            assert.ok(instance.validate());
        });
        test('sync create, platformServices & argument', function () {
            var instance = service.createInstance(Target2, true);
            assert.ok(instance.validate());
        });
        test('sync create, access service defined by child instantiation service', function () {
            var instance = service.createChild({ editorService: 'wee' }).createInstance(Target2, true);
            assert.ok(instance.validate());
        });
        test('sync create, access service defined in a child instantiation service', function () {
            var instance = service.createChild({ someOtherService: 'hey' }).createInstance(Target2, true);
            assert.ok(instance.validate());
        });
        test('sync create, platformServices & static argument', function () {
            var descriptor = descriptors_1.createSyncDescriptor(Target2, true);
            var instance = service.createInstance(descriptor);
            assert.ok(instance.validate());
        });
        test('sync create, register NEW service', function () {
            service.registerService('far', 1234);
            service.createInstance(Target3);
            var child = service.createChild({});
            child.createInstance(Target3);
        });
        test('sync create, override service', function () {
            assert.throws(function () { return service.registerService('editorService', 1234); });
        });
        // test('async create, platformServices only', (done) => {
        // 	var descriptor = new services.AsyncDescriptor<Target1>('vs/platform/instantiation/tests/instantiationService.test', 'Target1');
        // 	service.createInstance(descriptor, true).then((instance) => {
        // 		assert.ok(instance.validate());
        // 		done();
        // 	}, (e) => {
        // 		assert.ok(false, e);
        // 	});
        // });
        // test('async create, platformServices only & argument', (done) => {
        // 	var descriptor = new services.AsyncDescriptor<Target2>('vs/platform/instantiation/tests/instantiationService.test', 'Target1');
        // 	service.createInstance(descriptor, true).then((instance) => {
        // 		assert.ok(instance.validate());
        // 		done();
        // 	}, (e) => {
        // 		assert.ok(false, e);
        // 	});
        // });
        // test('async create, platformServices only & static argument', (done) => {
        // 	var descriptor = new services.AsyncDescriptor<Target2>('vs/platform/instantiation/tests/instantiationService.test', 'Target1', true);
        // 	service.createInstance(descriptor).then((instance) => {
        // 		assert.ok(instance.validate());
        // 		done();
        // 	}, (e) => {
        // 		assert.ok(false, e);
        // 	});
        // });
        // test('async create, illegal ctor name', (done) => {
        // 	var descriptor = new services.AsyncDescriptor<Target2>('vs/platform/instantiation/tests/instantiationService.test', 'TaRget1', true);
        // 	service.createInstance(descriptor).then((instance) => {
        // 		assert.ok(false);
        // 		done();
        // 	}, (e) => {
        // 		assert.ok(e instanceof Error);
        // 	});
        // });
        test('safe on create - don\'t allow service change', function () {
            assert.throws(function () { return service.createInstance(EvilTarget1); });
        });
        test('@Param - simple clase', function () {
            var service = instantiationService.create(Object.create(null));
            service.addSingleton(IService1, new Service1());
            service.addSingleton(IService2, new Service2());
            service.addSingleton(IService3, new Service3());
            service.createInstance(ParameterTarget);
        });
        test('@Param - fixed args', function () {
            var service = instantiationService.create(Object.create(null));
            service.addSingleton(IService1, new Service1());
            service.addSingleton(IService2, new Service2());
            service.addSingleton(IService3, new Service3());
            service.createInstance(ParameterTarget2, true);
        });
        test('@Param - optional', function () {
            var service = instantiationService.create(Object.create(null));
            service.addSingleton(IService1, new Service1());
            // service.addSingleton(IService2, new Service2());
            service.createInstance(TargetOptional);
        });
        // we made this a warning
        // test('@Param - too many args', function () {
        // 	var service = instantiationService.create(Object.create(null));
        // 	service.addSingleton(IService1, new Service1());
        // 	service.addSingleton(IService2, new Service2());
        // 	service.addSingleton(IService3, new Service3());
        // 	assert.throws(() => service.createInstance(ParameterTarget2, true, 2));
        // });
        // test('@Param - too few args', function () {
        // 	var service = instantiationService.create(Object.create(null));
        // 	service.addSingleton(IService1, new Service1());
        // 	service.addSingleton(IService2, new Service2());
        // 	service.addSingleton(IService3, new Service3());
        // 	assert.throws(() => service.createInstance(ParameterTarget2));
        // });
        test('SyncDesc - no dependencies', function () {
            var service = instantiationService.create(Object.create(null));
            service.addSingleton(IService1, new descriptors_1.SyncDescriptor(Service1));
            var service1 = service.getInstance(IService1);
            assert.ok(service1);
            assert.equal(service1.c, 1);
            var service2 = service.getInstance(IService1);
            assert.ok(service1 === service2);
        });
        test('SyncDesc - service with service dependency', function () {
            var service = instantiationService.create(Object.create(null));
            service.addSingleton(IService1, new descriptors_1.SyncDescriptor(Service1));
            service.addSingleton(IDependentService, new descriptors_1.SyncDescriptor(DependentService));
            var d = service.getInstance(IDependentService);
            assert.ok(d);
            assert.equal(d.name, 'farboo');
        });
        test('SyncDesc - target depends on service future', function () {
            var service = instantiationService.create(Object.create(null));
            service.addSingleton(IService1, new descriptors_1.SyncDescriptor(Service1));
            service.addSingleton(IDependentService, new descriptors_1.SyncDescriptor(DependentService));
            var d = service.createInstance(DependentServiceTarget);
            assert.ok(d instanceof DependentServiceTarget);
            var d2 = service.createInstance(DependentServiceTarget2);
            assert.ok(d2 instanceof DependentServiceTarget2);
        });
        test('SyncDesc - explode on loop', function () {
            var service = instantiationService.create(Object.create(null));
            service.addSingleton(IService1, new descriptors_1.SyncDescriptor(ServiceLoop1));
            service.addSingleton(IService2, new descriptors_1.SyncDescriptor(ServiceLoop2));
            assert.throws(function () { return service.getInstance(IService1); });
            assert.throws(function () { return service.getInstance(IService2); });
        });
        test('Invoke - get services', function () {
            var service = instantiationService.create(Object.create(null));
            service.addSingleton(IService1, new Service1());
            service.addSingleton(IService2, new Service2());
            function test(accessor) {
                assert.ok(accessor.get(IService1) instanceof Service1);
                assert.equal(accessor.get(IService1).c, 1);
                return true;
            }
            assert.equal(service.invokeFunction(test), true);
        });
        test('Invoke - keeping accessor NOT allowed', function () {
            var service = instantiationService.create(Object.create(null));
            service.addSingleton(IService1, new Service1());
            service.addSingleton(IService2, new Service2());
            var cached;
            function test(accessor) {
                assert.ok(accessor.get(IService1) instanceof Service1);
                assert.equal(accessor.get(IService1).c, 1);
                cached = accessor;
                return true;
            }
            assert.equal(service.invokeFunction(test), true);
            assert.throws(function () { return cached.get(IService2); });
        });
        test('Invoke - throw error', function () {
            var service = instantiationService.create(Object.create(null));
            service.addSingleton(IService1, new Service1());
            service.addSingleton(IService2, new Service2());
            function test(accessor) {
                throw new Error();
            }
            assert.throws(function () { return service.invokeFunction(test); });
        });
    });
});
//# sourceMappingURL=instantiationService.test.js.map