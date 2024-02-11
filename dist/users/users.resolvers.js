"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersResolver = void 0;
const type_graphql_1 = require("type-graphql");
const users_schema_1 = require("./users.schema");
let UsersResolver = class UsersResolver {
    constructor() {
        this.users = [
            { id: 1, name: "John Doe", email: "johndoe@gmail.com" },
            { id: 2, name: "Jane Doe", email: "janedoe@gmail.com" },
            { id: 3, name: "Mike Doe", email: "mikedoe@gmail.com" },
        ];
    }
    async getUsers() {
        return this.users;
    }
    async getUser(id) {
        const user = this.users.find(u => u.id === id);
        return user;
    }
    async createUser(input) {
        const user = {
            id: this.users.length + 1,
            ...input,
        };
        this.users.push(user);
        return user;
    }
    async updateUser(id, input) {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new Error("User not found");
        }
        const updatedUser = {
            ...user,
            ...input,
        };
        this.users = this.users.map(u => (u.id === id ? updatedUser : u));
        return updatedUser;
    }
};
exports.UsersResolver = UsersResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [users_schema_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUsers", null);
__decorate([
    (0, type_graphql_1.Query)(() => users_schema_1.User),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => users_schema_1.User),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_schema_1.UserInput]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => users_schema_1.User),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, users_schema_1.UserInput]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "updateUser", null);
exports.UsersResolver = UsersResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => users_schema_1.User)
], UsersResolver);
