"use strict";
exports.__esModule = true;
exports.AuthService = void 0;
var tslib_1 = require("tslib");
var default_1 = tslib_1.__importDefault(require("@tkey/default"));
var service_provider_torus_1 = tslib_1.__importDefault(require("@tkey/service-provider-torus"));
var storage_layer_torus_1 = tslib_1.__importDefault(require("@tkey/storage-layer-torus"));
var security_questions_1 = tslib_1.__importDefault(require("@tkey/security-questions"));
var share_transfer_1 = tslib_1.__importDefault(require("@tkey/share-transfer"));
var web_storage_1 = tslib_1.__importDefault(require("@tkey/web-storage"));
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.prototype.getTKeyDetails = function (tKey) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var details;
            return tslib_1.__generator(this, function (_a) {
                details = tKey.getKeyDetails();
                return [2 /*return*/, details];
            });
        });
    };
    AuthService.prototype.init = function (directParams) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var serviceProvider, webStorageModule, securityQuestionsModule, shareTransferModule, storageLayer, tKey;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serviceProvider = new service_provider_torus_1["default"]({
                            customAuthArgs: directParams
                        });
                        webStorageModule = new web_storage_1["default"]();
                        securityQuestionsModule = new security_questions_1["default"](true);
                        shareTransferModule = new share_transfer_1["default"]();
                        storageLayer = new storage_layer_torus_1["default"]({
                            hostUrl: "https://metadata.tor.us"
                        });
                        tKey = new default_1["default"]({
                            serviceProvider: serviceProvider,
                            storageLayer: storageLayer,
                            modules: {
                                webStorage: webStorageModule,
                                securityQuestions: securityQuestionsModule,
                                shareTransfer: shareTransferModule
                            }
                        });
                        return [4 /*yield*/, tKey.serviceProvider.init({
                                skipSw: false
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, tKey];
                }
            });
        });
    };
    AuthService.prototype.createWallet = function (tKey, verifierMap) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loginResponse, res, details, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.triggerSSOLogin(tKey, verifierMap)];
                    case 1:
                        loginResponse = _a.sent();
                        return [4 /*yield*/, tKey._initializeNewKey({ initializeModules: true })];
                    case 2:
                        res = _a.sent();
                        console.log("response from _initializeNewKey", res);
                        return [4 /*yield*/, this.getTKeyDetails(tKey)];
                    case 3:
                        details = _a.sent();
                        if (details.requiredShares <= 0) {
                            console.log("All shares are present, you can reconstruct your private key and do operations on the tKey", tKey.getKeyDetails());
                        }
                        else {
                            console.log("You need to generate more shares to reconstruct your private key");
                        }
                        return [2 /*return*/, {
                                tKey: tKey,
                                loginResponse: loginResponse,
                                tKeyDetails: details
                            }];
                    case 4:
                        error_1 = _a.sent();
                        console.error(error_1, "Error calling triggerSSOLogin");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //This function generates a new share with password that user chooses
    AuthService.prototype.generateNewShareWithPassword = function (tKey, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(password.length > 10)) return [3 /*break*/, 2];
                        return [4 /*yield*/, tKey.modules.securityQuestions.generateNewShareWithSecurityQuestions(password, "whats your password?")];
                    case 1:
                        result = _a.sent();
                        console.log("Successfully generated new share with password.");
                        return [2 /*return*/, { result: result, msg: "Successfully set password share" }];
                    case 2: return [2 /*return*/, { result: {}, msg: "Error, could not set password share, password needs to be mininum 10 chars" }];
                }
            });
        });
    };
    AuthService.prototype.inputShareFromSecurityQuestions = function (tKey, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Importing Share from Security Question", tKey, 'TKEY MODULES', tKey);
                        if (!(password.length > 10 && tKey)) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, tKey.initialize()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tKey.modules.securityQuestions.inputShareFromSecurityQuestions(password)];
                    case 3:
                        _a.sent();
                        console.log("Imported Share using the security question");
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.log('ERROOÖÖÖÖÖ ', error_2, 'TKEEY:', tKey);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        console.log("Error", "Password must be > 10 characters", "error");
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.loginUsingSSO = function (tKey, verifierMap) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loginResponse, webStorageModule, indexes, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.triggerSSOLogin(tKey, verifierMap)];
                    case 1:
                        loginResponse = _a.sent();
                        return [4 /*yield*/, tKey.initialize()];
                    case 2:
                        _a.sent();
                        webStorageModule = tKey.modules["webStorage"];
                        return [4 /*yield*/, webStorageModule.inputShareFromWebStorage()];
                    case 3:
                        _a.sent();
                        indexes = tKey.getCurrentShareIndexes();
                        console.log("Total number of available shares: " + indexes.length, 'Shareinfo:', indexes);
                        return [2 /*return*/, loginResponse];
                    case 4:
                        error_3 = _a.sent();
                        console.error(error_3, "caught");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.loginUsingPassword = function (tKey, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var securityQuestionsModule, indexes, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, tKey.initialize()];
                    case 1:
                        _a.sent();
                        securityQuestionsModule = tKey.modules["securityQuestions"];
                        return [4 /*yield*/, securityQuestionsModule.inputShareFromSecurityQuestions(password)];
                    case 2:
                        _a.sent();
                        indexes = tKey.getCurrentShareIndexes();
                        console.log("Total number of available shares: " + indexes.length, 'Shareinfo:', indexes);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error(error_4, "Error logging in using password");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.triggerSSOLogin = function (tKey, verifierMap) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var jwtParams, _a, typeOfLogin, clientId, verifier, loginResponse, error_5;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        jwtParams = {};
                        _a = verifierMap.google, typeOfLogin = _a.typeOfLogin, clientId = _a.clientId, verifier = _a.verifier;
                        return [4 /*yield*/, tKey.serviceProvider.triggerLogin({
                                typeOfLogin: typeOfLogin,
                                verifier: verifier,
                                clientId: clientId,
                                jwtParams: jwtParams
                            })];
                    case 1:
                        loginResponse = _b.sent();
                        console.log('Login response:', loginResponse);
                        return [2 /*return*/, loginResponse
                            // setConsoleText(loginResponse);
                        ];
                    case 2:
                        error_5 = _b.sent();
                        console.log(error_5, 'GOT IN CATCH SSO');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
