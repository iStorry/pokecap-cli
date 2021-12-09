const axios = require('axios');

module.exports = {
    users: (id) => `https://api.twitch.tv/helix/users?login=${id}`,
    streams: (id) => `https://api.twitch.tv/helix/streams?user_login=${id}`,
    headers: (token) => {
        return {
            'Client-ID': 'q6batx0epp608isickayubi39itsckt',
            'Authorization': `Bearer ${token}`,
        }
    },

    async request(url, token) {
        try {
            const res = await axios.get(url, { headers: this.headers(token) });
            return res.data;
        } catch (err) {
            throw new Error(err);
        }
    }
}