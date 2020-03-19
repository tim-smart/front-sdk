"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const crypto = require("crypto");
const express = require("express");
const _ = require("lodash");
const querystring = require("querystring");
const request = require("request-promise");
const typed_error_1 = require("typed-error");
const URL = "https://api2.frontapp.com";
class Front {
    constructor(apiKey, apiSecret) {
        this.comment = {
            create: (params, callback) => this.httpCall({ method: "POST", path: "conversations/<conversation_id>/comments" }, params, callback),
            get: (params, callback) => this.httpCall({ method: "GET", path: "comments/<comment_id>" }, params, callback),
            listMentions: (params, callback) => this.httpCall({ method: "GET", path: "comments/<comment_id>/mentions" }, params, callback),
        };
        this.contact = {
            create: (params, callback) => this.httpCall({ method: "POST", path: "contacts" }, params, callback),
            delete: (params, callback) => this.httpCall({ method: "DELETE", path: "contacts/<contact_id>" }, params, callback),
            get: (params, callback) => this.httpCall({ method: "GET", path: "contacts/<contact_id>" }, params, callback),
            update: (params, callback) => this.httpCall({ method: "PATCH", path: "contacts/<contact_id>" }, params, callback),
        };
        this.conversation = {
            get: (params, callback) => this.httpCall({ method: "GET", path: "conversations/<conversation_id>" }, params, callback),
            list: (params, callback) => this.httpCall({ method: "GET", path: "conversations[q:page_token:limit]" }, params, callback),
            listComments: (params, callback) => this.httpCall({ method: "GET", path: "conversations/<conversation_id>/comments" }, params, callback),
            listFollowers: (params, callback) => this.httpCall({ method: "GET", path: "conversations/<conversation_id>/followers" }, params, callback),
            listInboxes: (params, callback) => this.httpCall({ method: "GET", path: "conversations/<conversation_id>/inboxes" }, params, callback),
            listMessages: (params, callback) => this.httpCall({
                method: "GET",
                path: "conversations/<conversation_id>/messages[page_token:limit]",
            }, params, callback),
            listRecent: (callback) => this.httpCall({ method: "GET", path: "conversations" }, null, callback),
            update: (params, callback) => this.httpCall({ method: "PATCH", path: `conversations/${params.conversation_id}` }, _.omit(params, ["conversation_id"]), callback),
        };
        this.inbox = {
            create: (params, callback) => this.httpCall({ method: "POST", path: "inboxes" }, params, callback),
            createChannel: (params, callback) => this.httpCall({ method: "POST", path: "inboxes/<inbox_id>/channels" }, params, callback),
            get: (params, callback) => this.httpCall({ method: "GET", path: "inboxes/<inbox_id>" }, params, callback),
            list: (callback) => this.httpCall({ method: "GET", path: "inboxes" }, null, callback),
            listChannels: (params, callback) => this.httpCall({ method: "GET", path: "inboxes/<inbox_id>/channels" }, params, callback),
            listConversations: (params, callback) => this.httpCall({
                method: "GET",
                path: "inboxes/<inbox_id>/conversations[q:page_token:limit]",
            }, params, callback),
            listTeammates: (params, callback) => this.httpCall({ method: "GET", path: "inboxes/<inbox_id>/teammates" }, params, callback),
        };
        this.message = {
            get: (params, callback) => this.httpCall({ method: "GET", path: "messages/<message_id>" }, params, callback),
            receiveCustom: (params, callback) => this.httpCall({ method: "POST", path: "channels/<channel_id>/incoming_messages" }, params, callback),
            reply: (params, callback) => this.httpCall({ method: "POST", path: "conversations/<conversation_id>/messages" }, params, callback),
            send: (params, callback) => this.httpCall({ method: "POST", path: "channels/<channel_id>/messages" }, params, callback),
        };
        this.teammate = {
            get: (params, callback) => this.httpCall({ method: "GET", path: "teammates/<teammate_id>" }, params, callback),
            list: (callback) => this.httpCall({ method: "GET", path: "teammates" }, null, callback),
            update: (params, callback) => this.httpCall({ method: "PATCH", path: "teammates/<teammate_id>" }, params, callback),
        };
        this.topic = {
            listConversations: (params, callback) => this.httpCall({
                method: "GET",
                path: "topics/<topic_id>/conversations[q:page_token:limit]",
            }, params, callback),
        };
        this.apiKey = apiKey;
        if (apiSecret) {
            this.apiSecret = apiSecret;
        }
    }
    registerEvents(opts, callback) {
        let httpServer;
        let listener;
        const eventQueue = [];
        const requestEvent = () => {
            const eventId = eventQueue[0];
            this.httpCall({ path: "events/<event_id>", method: "GET" }, {
                event_id: eventId,
            })
                .then(r => callback(null, r), err => callback(err))
                .finally(() => {
                eventQueue.shift();
                if (eventQueue.length > 0) {
                    requestEvent();
                }
            });
        };
        const addToEventQueue = (id) => {
            eventQueue.push(id);
            if (eventQueue.length === 1) {
                requestEvent();
            }
        };
        if (!this.apiSecret) {
            throw new Error("No secret key registered");
        }
        if (!opts || (opts.server && opts.port) || (!opts.server && !opts.port)) {
            throw new Error("Pass either an Express instance or a port to listen on");
        }
        if (opts.port && typeof opts.port !== "number") {
            throw new Error("`port` must be a number");
        }
        const hookPath = opts.hookPath || "/fronthook";
        if (opts.server) {
            listener = opts.server;
        }
        else {
            listener = express();
            listener.use(bodyParser.urlencoded({ extended: true }));
            listener.use(bodyParser.json());
            httpServer = listener.listen(opts.port);
        }
        listener.post(hookPath, (req, res) => {
            const eventPreview = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
            const XFrontSignature = req.get("X-Front-Signature");
            if (!XFrontSignature ||
                !this.validateEventSignature(eventPreview, XFrontSignature)) {
                res.sendStatus(401);
                throw new Error("Event Signature does not match registered secret");
            }
            res.sendStatus(200);
            addToEventQueue(eventPreview.id);
        });
        return httpServer;
    }
    getFromLink(url, callback) {
        const path = url.replace(URL, "").replace(/^\//, "");
        return this.httpCall({ method: "GET", path }, null, callback);
    }
    httpCall(details, params, callback, retries = 0) {
        const url = `${URL}/${this.formatPath(details.path, params)}`;
        const body = params || {};
        const requestOpts = {
            body,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
            json: true,
            method: details.method,
            url,
        };
        return request(requestOpts)
            .promise()
            .catch((error) => {
            if (error.statusCode >= 500 && retries < 5) {
                return new Promise(r => {
                    setTimeout(() => {
                        r();
                    }, 300);
                }).then(() => {
                    return this.httpCall(details, params, callback, retries + 1);
                });
            }
            const frontError = new FrontError(error);
            frontError.message += ` at ${url} with body ${JSON.stringify(body)}`;
            throw frontError;
        })
            .asCallback(callback);
    }
    formatPath(path, data = {}) {
        let newPath = path;
        const reSearch = (re, operation) => {
            let matches = path.match(re);
            if (matches) {
                operation(matches);
            }
        };
        reSearch(/<(.*?)>/g, (mandatoryTags) => {
            _.map(mandatoryTags, tag => {
                const tagName = tag.substring(1, tag.length - 1);
                if (!data[tagName]) {
                    throw new Error(`Tag ${tag} not found in parameter data`);
                }
                newPath = newPath.replace(tag, data[tagName]);
            });
        });
        reSearch(/\[(.*?)\]/g, (optionalTags) => {
            if (optionalTags.length > 1) {
                throw new Error(`Front endpoint ${path} is incorrectly defined`);
            }
            const trimmedTags = optionalTags[0];
            const tags = trimmedTags.substring(1, trimmedTags.length - 1).split(":");
            const queryTags = {};
            newPath = newPath.replace(trimmedTags, "");
            _.each(tags, tag => {
                if (tag !== "q" && data[tag]) {
                    queryTags[tag] = data[tag];
                }
            });
            newPath = `${newPath}?${querystring.stringify(queryTags)}`;
            if (_.includes(tags, "q")) {
                newPath += `&${data.q}`;
            }
        });
        return newPath;
    }
    validateEventSignature(data, signature) {
        let hash = "";
        try {
            hash = crypto
                .createHmac("sha1", this.apiSecret)
                .update(JSON.stringify(data))
                .digest("base64");
        }
        catch (err) {
            return false;
        }
        return hash === signature;
    }
}
exports.Front = Front;
class FrontError extends typed_error_1.TypedError {
    constructor(error) {
        super(error);
        const frontError = error.error._error;
        if (frontError) {
            _.each(["status", "title", "message", "details"], key => {
                if (frontError[key]) {
                    this[key] = frontError[key];
                }
            });
        }
    }
}
exports.FrontError = FrontError;

//# sourceMappingURL=index.js.map
