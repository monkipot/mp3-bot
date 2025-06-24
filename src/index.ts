import 'dotenv/config';
import {
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
} from 'discord.js';

class Mp3 {
    private client: Client;

    constructor() {
        this.client = new Client({
            intents: []
        });

        this.events();
        this.cmd();
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
            }
        });
    }

    private async cmd(): Promise<void> {
        const cmd: SlashCommandBuilder[] = [
            new SlashCommandBuilder()
                .setName('hello')
                .setDescription('Seems pretty obvious'),
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

    public async start(token: string): Promise<void> {
        try {
            console.log("Starting bot");
            await this.client.login(token);
        } catch (error) {
            console.error('Login error:', error);
        }
    }
}

const BOT_TOKEN = process.env.DISCORD_TOKEN || '';
const bot = new Mp3();
bot.start(BOT_TOKEN);
