# Discord SelfBot Voice Channel Manager 🎤

A Node.js application that manages multiple Discord user tokens to join voice channels with customizable status updates. This bot manager allows for automated voice channel presence with rotating status effects.

## ✨ Features

- Manage multiple Discord user tokens simultaneously
- Automatic voice channel joining
- Random status rotation (online, idle, dnd, invisible)
- Voice state effects (Muted, Defend, MuteAndDefened, UnmuteAndundefened)
- Configurable delays and intervals
- Graceful shutdown handling

## 📋 Requirements

- Node.js 16.6.0 or higher
- Discord.js-selfbot-v13
- @discordjs/voice

## 📥 Installation

1. Clone the repository:
```bash
git clone https://github.com/9de/Discord-Voice-Joiner.git
cd discord-voice-manager
```

2. Install dependencies:
```bash
npm install discord.js-selfbot-v13 @discordjs/voice
```

3. Set up configuration files (see Configuration section)

## ⚙️ Configuration

### tokens.txt
Create a `tokens.txt` file with your Discord tokens and channel IDs in the following format:
```
token1:channelId1
token2:channelId2
token3:channelId3
```

### config.json
Create a `config.json` file with your guild (server) ID:
```json
{
    "guildid": "YOUR_GUILD_ID"
}
```

## 🔧 Configuration Constants

The application uses the following default settings:
```javascript
{
    TOKEN_FILE: 'tokens.txt',
    CONFIG_FILE: 'config.json',
    DELAY_BETWEEN_LOGINS: 5000,        // 5 seconds
    STATUS_UPDATE_INTERVAL: 300000,     // 5 minutes
    STATUS_OPTIONS: ['online', 'idle', 'dnd', 'invisible'],
    VOICE_EVENTS: ['Muted', 'Defend', 'MuteAndDefened', 'UnmuteAndundefened']
}
```

## 🚀 Usage

Run the application:
```bash
node index.js
```

The bot manager will:
1. Load tokens from `tokens.txt`
2. Connect each account to the specified voice channel
3. Rotate statuses at random intervals
4. Handle voice states automatically

## 📝 Logging

The application provides detailed console logging:
- ✅ Successful connections
- 🎤 Voice channel joins
- ❌ Error messages
- 👋 Shutdown notifications

## ⚠️ Error Handling

The application includes:
- Token validation
- Connection error handling
- Automatic cleanup on errors
- Graceful shutdown process

## 🛑 Shutdown

To properly shutdown the application:
- Press `Ctrl + C`
- All connections will be cleaned up
- Status intervals will be cleared
- Clients will be properly destroyed

## ⚠️ Important Notes

1. Using self-bots is against Discord's Terms of Service. Use at your own risk.
2. Ensure your tokens are kept private and secure.
3. Be mindful of Discord's rate limits when configuring delays.
4. Monitor console output for any connection issues.

## 📃 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

If you encounter issues:
1. Verify your tokens are valid
2. Check the channel and guild IDs
3. Ensure you have proper permissions
4. Review console logs for error messages
5. Verify network connectivity

## 💡 Suggestions

- Keep `DELAY_BETWEEN_LOGINS` reasonable to avoid rate limiting
- Monitor CPU and memory usage when running many instances
- Regular token validation is recommended
- Keep your Discord.js-selfbot-v13 package updated

For additional support or questions, please open an issue in the repository.
