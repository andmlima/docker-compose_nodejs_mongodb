"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as Hapi from 'hapi';
var Joi = __importStar(require("@hapi/joi"));
var Inert = __importStar(require("@hapi/inert"));
var Vision = __importStar(require("@hapi/vision"));
var Hapi = __importStar(require("@hapi/hapi"));
var mongodb_1 = require("mongodb");
var HapiSwagger = require('hapi-swagger');
var port = process.env.PORT || 3000;
var server = new Hapi.Server({
    port: port,
    routes: {
        cors: {
            origin: ['*'],
        },
    },
});
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, connectionString, connection, db;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                host = process.env.MONGO_URL || 'localhost';
                connectionString = "mongodb://" + host + "/heroes";
                return [4 /*yield*/, mongodb_1.MongoClient.connect(connectionString, {
                        useNewUrlParser: true,
                    })];
            case 1:
                connection = _a.sent();
                console.log('mongo db is running');
                db = connection.db('heroes').collection('hero');
                return [4 /*yield*/, server.register([
                        Inert,
                        Vision,
                        {
                            plugin: HapiSwagger,
                            options: {
                                info: {
                                    title: 'Node.js with MongoDB Example - Erick Wendel',
                                    version: 'v1.0',
                                },
                            },
                        },
                    ])];
            case 2:
                _a.sent();
                server.route([
                    {
                        method: 'GET',
                        path: '/',
                        config: {
                            handler: function (r, reply) { return reply.redirect('/documentation'); },
                        },
                    },
                    {
                        method: 'GET',
                        path: '/heroes',
                        config: {
                            handler: function () {
                                return db.find().toArray();
                            },
                            description: 'List All heroes',
                            notes: 'heroes from database',
                            tags: ['api'],
                        },
                    },
                    {
                        method: 'POST',
                        path: '/heroes',
                        config: {
                            handler: function (req) {
                                var payload = req.payload;
                                return db.insert(payload);
                            },
                            description: 'Create a hero',
                            notes: 'create a hero',
                            tags: ['api'],
                            validate: {
                                payload: {
                                    name: Joi.string().required(),
                                    power: Joi.string().required(),
                                },
                            },
                        },
                    },
                    {
                        method: 'PUT',
                        path: '/heroes/{id}',
                        config: {
                            handler: function (req) {
                                var payload = req.payload;
                                var id = req.params.id;
                                return db.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: payload });
                            },
                            description: 'Update a hero',
                            notes: 'Update a hero',
                            tags: ['api'],
                            validate: {
                                params: {
                                    id: Joi.string().required(),
                                },
                                payload: {
                                    name: Joi.string(),
                                    power: Joi.string(),
                                },
                            },
                        },
                    },
                    {
                        method: 'DELETE',
                        path: '/heroes/{id}',
                        config: {
                            handler: function (req) {
                                return db.deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) });
                            },
                            description: 'Delete a hero',
                            notes: 'Delete a hero',
                            tags: ['api'],
                            validate: {
                                params: {
                                    id: Joi.string().required(),
                                },
                            },
                        },
                    },
                ]);
                return [4 /*yield*/, server.start()];
            case 3:
                _a.sent();
                console.log('server running at', port);
                return [2 /*return*/];
        }
    });
}); })();
