const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs').promises; // Using promise-based fs
const path = require('path');

// Configuration
const CONFIG = {
    TOKEN_FILE: 'tokens.txt',
    CONFIG_FILE: 'config.json',
    DELAY_BETWEEN_LOGINS: 5000,
    STATUS_UPDATE_INTERVAL: 300 * 1000,
    STATUS_OPTIONS: ['online', 'idle', 'dnd', 'invisible'],
    VOICE_EVENTS: ['Muted', 'Defend', 'MuteAndDefened', 'UnmuteAndundefened']
};

class BotManager {
    constructor() {
        this.activeClients = new Map();
    }

    async loadConfig() {
        try {
            const configPath = path.join(process.cwd(), CONFIG.CONFIG_FILE);
            const config = require(configPath);
            if (!config.guildid) {
                throw new Error('Guild ID not found in config.json');
            }
            return config;
        } catch (error) {
            throw new Error(`Failed to load config: ${error.message}`);
        }
    }

    async parseTokenFile(content) {
        return content
            .toString()
            .replaceAll('\r', '')
            .trim()
            .split('\n')
            .map((line, index) => {
                const [token, channelId] = line.split(':');
                if (!token || !channelId) {
                    throw new Error(`Invalid format in line ${index + 1}`);
                }
                return { token, channelId };
            });
    }

    async connectToVoice(client, channelId, guildId) {
        try {
            const connection = joinVoiceChannel({
                channelId,
                guildId,
                adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator,
                selfDeaf: false,
                selfMute: true,
                group: client.user.id
            });

            return connection;
        } catch (error) {
            throw new Error(`Failed to join voice channel: ${error.message}`);
        }
    }

    updateBotStatus(client) {
        const randomStatus = CONFIG.STATUS_OPTIONS[Math.floor(Math.random() * CONFIG.STATUS_OPTIONS.length)];
        const randomEvent = CONFIG.VOICE_EVENTS[Math.floor(Math.random() * CONFIG.VOICE_EVENTS.length)];
        
        try {
            client.user.setStatus(randomStatus);
            console.log(`Updated ${client.user.username}'s status to ${randomStatus} with event ${randomEvent}`);
        } catch (error) {
            console.error(`Failed to update status for ${client.user.username}:`, error.message);
        }
    }

    async initializeBot(token, channelId) {
        try {
            const client = new Client({ checkUpdate: false });
            const config = await this.loadConfig();

            client.on('ready', async () => {
                console.log(`✅ ${client.user.username} is ready!`);
                
                try {
                    const voiceConnection = await this.connectToVoice(client, channelId, config.guildid);
                    console.log(`🎤 ${client.user.username} joined voice channel`);

                    // Set up status update interval
                    const statusInterval = setInterval(
                        () => this.updateBotStatus(client),
                        CONFIG.STATUS_UPDATE_INTERVAL
                    );

                    // Store client and interval for cleanup
                    this.activeClients.set(client.user.id, { client, statusInterval, voiceConnection });
                } catch (error) {
                    console.error(`❌ Voice connection failed for ${client.user.username}:`, error.message);
                }
            });

            client.on('error', (error) => {
                console.error(`❌ Error in client ${token.slice(0, 8)}...:`, error.message);
                this.cleanup(client.user?.id);
            });

            await client.login(token);
        } catch (error) {
            console.error(`❌ Failed to initialize bot with token ${token.slice(0, 8)}...:`, error.message);
        }
    }

    cleanup(clientId) {
        if (this.activeClients.has(clientId)) {
            const { client, statusInterval, voiceConnection } = this.activeClients.get(clientId);
            clearInterval(statusInterval);
            voiceConnection?.destroy();
            client?.destroy();
            this.activeClients.delete(clientId);
        }
    }

    async start() {
        try {
            // Ensure token file exists
            try {
                await fs.access(CONFIG.TOKEN_FILE);
            } catch {
                await fs.writeFile(CONFIG.TOKEN_FILE, '');
                console.log('📝 Created empty tokens.txt file');
                return;
            }

            // Read and parse tokens
            const fileContent = await fs.readFile(CONFIG.TOKEN_FILE);
            const tokens = await this.parseTokenFile(fileContent);

            // Initialize bots sequentially
            for (const { token, channelId } of tokens) {
                await this.initializeBot(token, channelId);
                await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_LOGINS));
            }
        } catch (error) {
            console.error('❌ Failed to start bot manager:', error.message);
        }
    }
}

// Start the application
const manager = new BotManager();
manager.start().catch(console.error);

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down bot manager...');
    for (const clientId of manager.activeClients.keys()) {
        manager.cleanup(clientId);
    }
    process.exit(0);
});
