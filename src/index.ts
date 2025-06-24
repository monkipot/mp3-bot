import 'dotenv/config';
import {
    ChatInputCommandInteraction,
    Client, GatewayIntentBits,
    GuildMember,
    SlashCommandBuilder,
    VoiceChannel,
} from 'discord.js';
import {
    joinVoiceChannel,
    VoiceConnectionStatus,
} from '@discordjs/voice';

class Mp3 {
    private client: Client;
    private voiceConnection: any = null;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages
            ]
        });

        this.events();
        this.cmd();
    }

    public async start(token: string): Promise<void> {
        try {
            console.log("Starting bot");
            await this.client.login(token);
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    private events(): void {
        this.client.once('ready', () => {
            console.log(`Bot connected`);
        });

        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            const {commandName} = interaction;

            switch (commandName) {
                case 'hello':
                    await this.hello(interaction);
                    break;
                case 'join':
                    await this.join(interaction);
                    break;
            }
        });
    }

    private async cmd(): Promise<void> {
        const cmd: SlashCommandBuilder[] = [
            new SlashCommandBuilder()
                .setName('hello')
                .setDescription('Seems pretty obvious'),
            new SlashCommandBuilder()
                .setName('join')
                .setDescription('Join vocal channel'),
        ];

        this.client.on('ready', async () => {
            if (!this.client.application) return;
            try {
                await this.client.application.commands.set(cmd);
                console.log('Commands registered');
            } catch (error) {
                console.error('Cannot register commands:', error);
            }
        });
    }

    private async hello(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            await interaction.reply('Hello dumb people');
        } catch (error) {
            console.error('Cannot say hello:', error);
            await interaction.reply('sfdzersqdzer zqsdfv qazefr zedsfAGB ZD Fsd');
        }
    }

    private async join(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const member = interaction.member as GuildMember,
                voiceChannel = member.voice.channel as VoiceChannel;

            if (!voiceChannel) {
                await interaction.reply("You must join a voice channel");
                return;
            }

            if (!this.voiceConnection || this.voiceConnection.state.status === VoiceConnectionStatus.Disconnected) {
                this.voiceConnection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: interaction.guildId!,
                    adapterCreator: interaction.guild!.voiceAdapterCreator,
                    selfDeaf: false,
                    selfMute: false
                });

                this.voiceConnection.on(VoiceConnectionStatus.Ready, async () => {
                    console.log(`Join voice channel: ${voiceChannel.name}`);
                    await interaction.reply(`Join voice channel: ${voiceChannel.name}`);
                });

                this.voiceConnection.on(VoiceConnectionStatus.Disconnected, async () => {
                    console.log('Disconnect from voice channel');
                });

                this.voiceConnection.on('error', (error: Error) => {
                    console.error('Error in voice channel:', error);
                });
            }
        } catch (error) {
            console.error('Cannot join vocal channel:', error);
        }
    }
}

const BOT_TOKEN = process.env.DISCORD_TOKEN || '';
const bot = new Mp3();
bot.start(BOT_TOKEN);
