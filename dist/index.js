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
const voice_1 = require("@discordjs/voice");
const STREAM_URL = 'https://audio.bfmtv.com/rmcradio_128.mp3';
class Mp3 {
    constructor() {
        this.voiceConnection = null;
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildVoiceStates,
                discord_js_1.GatewayIntentBits.GuildMessages
            ]
        });
        this.events();
        this.cmd();
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
                case 'join':
                    yield this.join(interaction);
                    break;
                case 'leave':
                    yield this.leave(interaction);
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
                new discord_js_1.SlashCommandBuilder()
                    .setName('join')
                    .setDescription('Join vocal channel'),
                new discord_js_1.SlashCommandBuilder()
                    .setName('leave')
                    .setDescription('Leave vocal channel'),
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
            }
        });
    }
    join(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const member = interaction.member, voiceChannel = member.voice.channel;
                if (!voiceChannel) {
                    yield interaction.reply("You must join a voice channel");
                    return;
                }
                if (!this.voiceConnection || this.voiceConnection.state.status === voice_1.VoiceConnectionStatus.Disconnected) {
                    this.voiceConnection = (0, voice_1.joinVoiceChannel)({
                        channelId: voiceChannel.id,
                        guildId: interaction.guildId,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                        selfDeaf: false,
                        selfMute: false
                    });
                    this.voiceConnection.on(voice_1.VoiceConnectionStatus.Ready, () => __awaiter(this, void 0, void 0, function* () {
                        console.log(`Join voice channel: ${voiceChannel.name}`);
                        yield interaction.reply(`Join voice channel: ${voiceChannel.name}`);
                        const player = (0, voice_1.createAudioPlayer)({
                            behaviors: {
                                noSubscriber: voice_1.NoSubscriberBehavior.Pause,
                            },
                        });
                        try {
                            const resource = (0, voice_1.createAudioResource)(STREAM_URL, {
                                inputType: voice_1.StreamType.Arbitrary,
                                inlineVolume: true,
                            });
                            player.play(resource);
                            this.voiceConnection.subscribe(player);
                        }
                        catch (streamError) {
                            console.error('Error creating audio resource:', streamError);
                            return;
                        }
                        player.on(voice_1.AudioPlayerStatus.Playing, () => {
                            console.log('mp3 is now playing');
                        });
                        player.on(voice_1.AudioPlayerStatus.Idle, () => {
                            console.log('No resource left');
                        });
                        player.on('error', error => {
                            console.error('Player error:', error);
                        });
                    }));
                    this.voiceConnection.on(voice_1.VoiceConnectionStatus.Disconnected, () => __awaiter(this, void 0, void 0, function* () {
                        console.log('Disconnect from voice channel');
                    }));
                    this.voiceConnection.on('error', (error) => {
                        console.error('Error in voice channel:', error);
                    });
                }
            }
            catch (error) {
                console.error('Cannot join vocal channel:', error);
                yield interaction.reply('Cannot join vocal channel');
            }
        });
    }
    leave(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.voiceConnection || this.voiceConnection.state.status === voice_1.VoiceConnectionStatus.Destroyed) {
                    yield interaction.reply("Bot isn't connected to any voice channel");
                    return;
                }
                try {
                    this.voiceConnection.destroy();
                    this.voiceConnection = null;
                    console.log('Disconnect from voice channel');
                    yield interaction.reply('Disconnect from voice channel');
                }
                catch (disconnectError) {
                    console.error('Error during disconnect:', disconnectError);
                    yield interaction.reply('Error during disconnect');
                }
            }
            catch (error) {
                console.error('Cannot leave voice channel:', error);
            }
        });
    }
}
const BOT_TOKEN = process.env.DISCORD_TOKEN || '';
const bot = new Mp3();
bot.start(BOT_TOKEN);
