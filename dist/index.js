"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
class Mp3 {
    constructor() {
        this.client = new discord_js_1.Client({
            intents: []
        });
        this.events();
        this.cmd();
    }
    events() {
        this.client.once('ready', () => {
            console.log(`Bot connected`);
        });
        this.client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isChatInputCommand())
                return;
            const { commandName } = interaction;
            switch (commandName) {
                case 'hello':
                    yield this.hello(interaction);
                    break;
            }
        }));
    }
    cmd() {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = [
                new discord_js_1.SlashCommandBuilder()
                    .setName('hello')
                    .setDescription('Seems pretty obvious'),
            ];
            this.client.on('ready', () => __awaiter(this, void 0, void 0, function* () {
                if (!this.client.application)
                    return;
                try {
                    yield this.client.application.commands.set(cmd);
                    console.log('Commands registered');
                }
                catch (error) {
                    console.error('Cannot register commands:', error);
                }
            }));
        });
    }
    hello(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield interaction.reply('Hello dumb people');
            }
            catch (error) {
                console.error('Cannot say hello:', error);
                yield interaction.reply('sfdzersqdzer zqsdfv qazefr zedsfAGB ZD Fsd');
            }
        });
    }
    start(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Starting bot");
                yield this.client.login(token);
            }
            catch (error) {
                console.error('Login error:', error);
            }
        });
    }
}
const BOT_TOKEN = process.env.DISCORD_TOKEN || '';
const bot = new Mp3();
bot.start(BOT_TOKEN);
