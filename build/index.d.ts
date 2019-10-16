/// <reference types="node" />
import * as Promise from 'bluebird';
import * as express from 'express';
import { Server } from 'http';
import TypedError = require('typed-error');
export declare class Front {
    comment: {
        create: (params: CommentRequest.Create, callback?: Callback<Comment> | undefined) => Promise<Comment>;
        get: (params: CommentRequest.Get, callback?: Callback<Comment> | undefined) => Promise<Comment>;
        listMentions: (params: CommentRequest.ListMentions, callback?: Callback<CommentMentions> | undefined) => Promise<CommentMentions>;
    };
    contact: {
        create: (params: ContactRequest.Create, callback?: Callback<Contact> | undefined) => Promise<Contact>;
        delete: (params: ContactRequest.Delete, callback?: Callback<void> | undefined) => Promise<void>;
        get: (params: ContactRequest.Get, callback?: Callback<Contact> | undefined) => Promise<Contact>;
        update: (params: ContactRequest.Update, callback?: Callback<void> | undefined) => Promise<void>;
    };
    conversation: {
        get: (params: ConversationRequest.Get, callback?: Callback<Conversation> | undefined) => Promise<Conversation>;
        list: (params?: ConversationRequest.List | undefined, callback?: Callback<Conversations> | undefined) => Promise<Conversations>;
        listComments: (params: ConversationRequest.ListComments, callback?: Callback<ConversationComments> | undefined) => Promise<ConversationComments>;
        listFollowers: (params: ConversationRequest.ListFollowers, callback?: Callback<ConversationFollowers> | undefined) => Promise<ConversationFollowers>;
        listInboxes: (params: ConversationRequest.ListInboxes, callback?: Callback<ConversationInboxes> | undefined) => Promise<ConversationInboxes>;
        listMessages: (params: ConversationRequest.ListMessages, callback?: Callback<ConversationMessages> | undefined) => Promise<ConversationMessages>;
        listRecent: (callback?: Callback<Conversations> | undefined) => Promise<Conversations>;
        update: (params: ConversationRequest.Update, callback?: Callback<void> | undefined) => Promise<void>;
    };
    inbox: {
        create: (params: InboxRequest.Create, callback?: Callback<InboxCreation> | undefined) => Promise<InboxCreation>;
        createChannel: (params: InboxRequest.CreateChannel, callback?: Callback<Channel> | undefined) => Promise<Channel>;
        get: (params: InboxRequest.Get, callback?: Callback<Inbox> | undefined) => Promise<Inbox>;
        list: (callback?: Callback<Inboxes> | undefined) => Promise<Inboxes>;
        listChannels: (params: InboxRequest.ListChannels, callback?: Callback<InboxChannels> | undefined) => Promise<InboxChannels>;
        listConversations: (params: InboxRequest.ListConversations, callback?: Callback<InboxConversations> | undefined) => Promise<InboxConversations>;
        listTeammates: (params: InboxRequest.ListTeammates, callback?: Callback<InboxTeammates> | undefined) => Promise<InboxTeammates>;
    };
    message: {
        get: (params: MessageRequest.Get, callback?: Callback<Message> | undefined) => Promise<Message>;
        receiveCustom: (params: MessageRequest.ReceiveCustom, callback?: Callback<ConversationReference> | undefined) => Promise<ConversationReference>;
        reply: (params: MessageRequest.Reply, callback?: Callback<Message> | undefined) => Promise<Message>;
        send: (params: MessageRequest.Send, callback?: Callback<Message> | undefined) => Promise<Message>;
    };
    teammate: {
        get: (params: TeammateRequest.Get, callback?: Callback<Author> | undefined) => Promise<Author>;
        list: (callback?: Callback<Teammates> | undefined) => Promise<Teammates>;
        update: (params: TeammateRequest.Update, callback?: Callback<void> | undefined) => Promise<void>;
    };
    topic: {
        listConversations: (params: TopicRequest.ListConversations, callback?: Callback<TopicConversations> | undefined) => Promise<TopicConversations>;
    };
    private apiKey;
    private apiSecret;
    constructor(apiKey: string, apiSecret?: string);
    registerEvents(opts: EventHookOptions, callback: EventCallback): Server | void;
    getFromLink(url: string, callback?: Callback<Object>): Promise<Object>;
    private httpCall;
    private formatPath;
    private validateEventSignature;
}
export declare type Callback<T> = (err: Error | null, response: T | null) => void;
export interface Attachment {
    filename: string;
    url: string;
    contentType: string;
    size: number;
    metadata: any;
}
export interface Author {
    _links: Links;
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    is_available: boolean;
}
export interface ConversationReference {
    conversation_reference: string;
    status?: string;
}
export declare class FrontError extends TypedError {
    name: string;
    status: number;
    title: string;
    message: string;
    details?: string[];
    [key: string]: number | string | string[] | void;
    constructor(error: any);
}
export interface Event {
    _links: Links;
    id: string;
    type: string;
    emitted_at: number;
    source: {
        _meta: {
            type: any;
        };
        data?: any;
    };
    target?: {
        _meta: {
            type: any;
        };
        data?: any;
    };
    conversation: Conversation;
}
export interface Links {
    self: string;
    related: {
        channels?: string;
        comments?: string;
        conversation?: string;
        conversations?: string;
        contact?: string;
        events?: string;
        followers?: string;
        inboxes?: string;
        messages?: string;
        message_replied_to?: string;
        mentions?: string;
        teammates?: string;
    };
}
export interface Pagination {
    limit: number;
    next?: string;
    prev?: string;
}
export interface Recipient {
    _links: Links;
    handle: string;
    role: string;
}
export interface Sender {
    contact_id?: string;
    name?: string;
    handle: string;
}
export interface Status {
    status: string;
}
export interface Tag {
    _links: Links;
    id: string;
    name: string;
}
export interface Channel {
    _links: Links;
    address: string;
    id: string;
    send_as: string;
    settings?: ChannelSettings;
    type: string;
}
export interface ChannelSettings {
    webhook_url: string;
}
export interface Comment {
    _links: Links;
    author: Author;
    body: string;
    id: string;
    posted_at: string;
}
export interface CommentMentions {
    _pagination: Pagination;
    _links: Links;
    _results: Author[];
}
export declare namespace CommentRequest {
    interface Create {
        conversation_id: string;
        author_id: string;
        body: string;
        [key: string]: string;
    }
    interface Get {
        comment_id: string;
        [key: string]: string;
    }
    interface ListMentions {
        comment_id: string;
        [key: string]: string;
    }
}
export interface Contact {
    _links: Links;
    id: string;
    name: string;
    description: string;
    avatar_url: string;
    is_spammer: boolean;
    links: string[];
    handles: Array<{
        handle: string;
        source: string;
    }>;
    groups: Array<{
        _links: Links;
        id: string;
        name: string;
        is_private: boolean;
    }>;
    updated_at: number;
    custom_fields: {
        [key: string]: string;
    };
    is_private: boolean;
}
export declare namespace ContactRequest {
    interface Create {
        handles: Array<{
            handle: string;
            source: string;
        }>;
        name?: string;
        description?: string;
        is_spammer?: boolean;
        links?: string[];
        group_names?: string[];
        custom_fields?: {
            [key: string]: string;
        };
    }
    interface Get {
        contact_id: string;
    }
    interface Update {
        contact_id: string;
        name?: string;
        description?: string;
        avatar?: string;
        is_spammer?: boolean;
        links?: string[];
        group_names?: string[];
        custom_fields?: {
            [key: string]: string;
        };
    }
    interface Delete {
        contact_id: string;
    }
}
export interface Conversation {
    _links: Links;
    id: string;
    subject: string;
    status: string;
    assignee: Author;
    recipient: Recipient;
    tags: Tag[];
    last_message: Message;
    created_at: number;
}
export interface Conversations {
    _pagination: Pagination;
    _links: Links;
    _results: Conversation[];
}
export interface ConversationComments {
    _pagination: Pagination;
    _links: Links;
    _results: Comment[];
}
export interface ConversationInboxes {
    _pagination: Pagination;
    _links: Links;
    _results: Inbox[];
}
export interface ConversationFollowers {
    _pagination: Pagination;
    _links: Links;
    _results: Author[];
}
export interface ConversationMessages {
    _pagination: Pagination;
    _links: Links;
    _results: Message[];
}
export declare namespace ConversationRequest {
    interface List {
        q?: string;
        page_token?: string;
        limit?: number;
        [key: string]: string | number | void;
    }
    interface Get {
        conversation_id: string;
        [key: string]: string;
    }
    interface Update {
        conversation_id: string;
        assignee_id?: string;
        inbox_id?: string;
        status?: string;
        tags?: string[];
        [key: string]: string | string[] | void;
    }
    interface ListComments {
        conversation_id: string;
        [key: string]: string;
    }
    interface ListInboxes {
        conversation_id: string;
        [key: string]: string;
    }
    interface ListFollowers {
        conversation_id: string;
        [key: string]: string;
    }
    interface ListMessages {
        conversation_id: string;
        page_token?: string;
        limit?: number;
        [key: string]: string | number | void;
    }
}
export interface Inbox {
    _links: Links;
    address: string;
    id: string;
    name: string;
    send_as: string;
    type: string;
}
export interface Inboxes {
    _pagination: Pagination;
    _links: Links;
    _results: Inbox[];
}
export interface InboxCreation {
    id: string;
    name: string;
}
export interface InboxChannels {
    _pagination: Pagination;
    _links: Links;
    _results: Channel[];
}
export interface InboxConversations {
    _pagination: Pagination;
    _links: Links;
    _results: Conversation[];
}
export interface InboxTeammates {
    _pagination: Pagination;
    _links: Links;
    _results: Author[];
}
export declare namespace InboxRequest {
    interface Create {
        name: string;
        teammate_ids?: string[];
        [key: string]: string | string[] | void;
    }
    interface CreateChannel {
        inbox_id: string;
        type: 'smtp' | 'imap' | 'twilio' | 'twitter' | 'facebook' | 'smooch' | 'intercom' | 'truly' | 'custom';
        settings: {
            webhook_url: string;
        };
    }
    interface Get {
        inbox_id: string;
        [key: string]: string;
    }
    interface ListChannels {
        inbox_id: string;
        [key: string]: string;
    }
    interface ListConversations {
        inbox_id: string;
        q?: string;
        page_token?: string;
        limit?: number;
        [key: string]: string | number | void;
    }
    interface ListTeammates {
        inbox_id: string;
        [key: string]: string;
    }
}
export interface Message {
    _links: Links;
    id: string;
    type: string;
    is_inbound: boolean;
    is_draft: boolean;
    error_type?: string;
    created_at: number;
    blurb: string;
    author: Author;
    recipients: Recipient[];
    body: string;
    text: string;
    attachments: Attachment[];
    metadata: any;
}
export declare namespace MessageRequest {
    interface MessageOptions {
        tags?: string[];
        archive?: boolean;
        [key: string]: string[] | boolean | void;
    }
    interface Get {
        message_id: string;
        [key: string]: string;
    }
    interface SendBase {
        author_id?: string;
        subject?: string;
        body: string;
        text?: string;
        options?: MessageOptions;
        cc?: string[];
        bcc?: string[];
        [key: string]: string | string[] | MessageOptions | void;
    }
    interface Send extends SendBase {
        channel_id: string;
        to: string[];
        [key: string]: string | string[] | MessageOptions | void;
    }
    interface Reply extends SendBase {
        conversation_id: string;
        to?: string[];
        channel_id?: string;
        [key: string]: string | string[] | MessageOptions | void;
    }
    interface ReceiveCustom {
        channel_id: string;
        sender: Sender;
        subject?: string;
        body: string;
        body_format?: string;
        metadata?: any;
        [key: string]: string | any | void;
    }
}
export declare type Teammate = Author;
export interface Teammates {
    _links: Links;
    _results: Teammate[];
}
export declare namespace TeammateRequest {
    interface Get {
        teammate_id: string;
    }
    interface Update {
        teammate_id: string;
        username?: string;
        first_name?: string;
        last_name?: string;
        is_admin?: boolean;
        is_available?: boolean;
    }
}
export interface TopicConversations {
    _pagination: Pagination;
    _links: Links;
    _results: Conversation[];
}
export declare namespace TopicRequest {
    interface ListConversations {
        topic_id: string;
        q?: string;
        page_token?: string;
        limit?: number;
        [key: string]: string | number | void;
    }
}
export declare type EventCallback = (error: Error | null, event?: Event) => void;
export interface EventHookOptions {
    server?: express.Application;
    port?: number;
    hookPath?: string;
}
export declare type RequestData = CommentRequest.Create | CommentRequest.Get | CommentRequest.ListMentions | ConversationRequest.List | ConversationRequest.Get | ConversationRequest.Update | ConversationRequest.ListComments | ConversationRequest.ListFollowers | ConversationRequest.ListInboxes | ConversationRequest.ListMessages | InboxRequest.Create | InboxRequest.Get | InboxRequest.ListChannels | InboxRequest.ListConversations | InboxRequest.ListTeammates | MessageRequest.Get | MessageRequest.Send | MessageRequest.Reply | MessageRequest.ReceiveCustom | TopicRequest.ListConversations;
export declare type ResponseData = Attachment | Author | Links | Recipient | Sender | Tag | ConversationReference | Comment | CommentMentions | Conversation | Conversations | ConversationComments | ConversationInboxes | ConversationFollowers | ConversationMessages | Inbox | Inboxes | InboxCreation | InboxChannels | InboxConversations | InboxTeammates | Message | TopicConversations;
