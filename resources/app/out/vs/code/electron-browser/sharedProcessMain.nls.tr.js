/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
define("vs/code/electron-browser/sharedProcessMain.nls.tr", {
	"vs/base/common/severity": [
		"Hata",
		"Uyarı",
		"Bilgi",
	],
	"vs/base/node/zip": [
		"{0}, zip içerisinde bulunamadı.",
	],
	"vs/platform/configuration/common/configurationRegistry": [
		"Varsayılan Yapılandırma Geçersiz Kılmaları",
		"{0} dili için geçersiz kılınacak düzenleyici ayarlarını yapılandırın.",
		"Bir dil için geçersiz kılınacak düzenleyici ayarlarını yapılandırın.",
		"\'{0}\' kaydedilemiyor. Bu, dile özgü düzenleyici ayarlarını tanımlamak için \'\\\\[.*\\\\]$\' özellik kalıbı ile eşleşir. \'configurationDefaults\' ögesini kullanın.",
		"\'{0}\' kaydedilemiyor. Bu özellik zaten kayıtlı.",
	],
	"vs/platform/extensionManagement/common/extensionManagement": [
		"Eklentiler",
		"Tercihler",
	],
	"vs/platform/extensionManagement/node/extensionGalleryService": [
		"Eklenti bulunamadı",
		"{0} eklentisinin Code\'un bu sürümüyle uyumlu bir sürümü bulunamadı.",
	],
	"vs/platform/extensionManagement/node/extensionManagementService": [
		"Eklenti geçersiz: package.json bir JSON dosyası değil.",
		"{0} eklentisini yeniden yüklemeden önce lütfen Code\'u yeniden başlatın.",
		"{0} eklentisini yeniden yüklemeden önce lütfen Code\'u yeniden başlatın.",
		"\'{0}\' eklentisini yüklediğinizde onun bağımlılıkları da yüklenir. Devam etmek istiyor musunuz?",
		"Evet",
		"Hayır",
		"{0} eklentisini yeniden yüklemeden önce lütfen Code\'u yeniden başlatın.",
		"Yalnızca \'{0}\' eklentisini mi yoksa bağımlılıklarını da kaldırmak ister misiniz?",
		"Sadece Eklenti",
		"Tümü",
		"İptal",
		"\'{0}\' eklentisini kaldırmak istediğinizden emin misiniz?",
		"Tamam",
		"İptal",
		"\'{0}\' eklentisi kaldırılamıyor. \'{1}\' eklentisi buna bağlı.",
		"\'{0}\' eklentisi kaldırılamıyor. \'{1}\' ve \'{2}\' eklentileri buna bağlı.",
		"\'{0}\' eklentisi kaldırılamıyor. \'{1}, \'{2}\' eklentileri ve diğerleri buna bağlı.",
		"Eklenti bulunamadı",
	],
	"vs/platform/extensions/node/extensionValidator": [
		"`engines.vscode` değeri {0} ayrıştırılamadı. Lütfen örnekte verilenlere benzer ifadeler kullanın: ^0.10.0, ^1.2.3, ^0.11.0, ^0.10.x, vb.",
		"`engines.vscode`da belirtilen sürüm ({0}) yeterince belirli değil. vscode 1.0.0\'dan önceki sürümler için, lütfen istenecek minimum majör ve minör sürüm numarasını tanımlayın. Örneğin: ^0.10.0, 0.10.x, 0.11.0, vb.",
		"`engines.vscode`da belirtilen sürüm ({0}) yeterince belirli değil. vscode 1.0.0\'dan sonraki sürümler için, lütfen istenecek minimum majör sürüm numarasını tanımlayın. Örneğin: ^1.10.0, 1.10.x, 1.x.x, 2.x.x, vb.",
		"Eklenti, Code {0} ile uyumlu değil. Gereken sürüm: {1}.",
		"Boş eklenti açıklaması alındı",
		"`{0}` özelliği zorunludur ve `string` türünde olmalıdır",
		"`{0}` özelliği zorunludur ve `string` türünde olmalıdır",
		"`{0}` özelliği zorunludur ve `string` türünde olmalıdır",
		"`{0}` özelliği zorunludur ve `object` türünde olmalıdır",
		"`{0}` özelliği zorunludur ve `string` türünde olmalıdır",
		"`{0}` özelliği atlanabilir veya `string[]` türünde olmalıdır",
		"`{0}` özelliği atlanabilir veya `string[]` türünde olmalıdır",
		"`{0}` ve `{1}` özelliklerinin ikisi birden belirtilmeli veya ikisi birden atlanmalıdır",
		"`{0}` özelliği atlanabilir veya `string` türünde olmalıdır",
		"`main` ({0}) yolunun eklentinin klasörü içine ({1}) eklenmiş olacağı beklendi. Bu, eklentiyi taşınamaz yapabilir.",
		"`{0}` ve `{1}` özelliklerinin ikisi birden belirtilmeli veya ikisi birden atlanmalıdır",
		"Eklenti sürümü semver ile uyumlu değil.",
	],
	"vs/platform/message/common/message": [
		"Kapat",
		"Daha Sonra",
		"İptal",
	],
	"vs/platform/request/node/request": [
		"HTTP",
		"Kullanılacak proxy ayarı. Ayarlanmazsa, http_proxy ve https_proxy ortam değişkenlerinden alınır",
		"Proxy sunucu sertifikasının verilen Sertifika Yetkilileri listesine göre doğrulanması gerekip gerekmediği.",
		"Her ağ isteği için \'Proxy-Authorization\' başlığı olarak gönderilecek değer.",
	],
	"vs/platform/telemetry/common/telemetryService": [
		"Telemetri",
		"Kullanım verileri ve hataların Microsoft\'a gönderilmesini etkinleştirin.",
	]
});