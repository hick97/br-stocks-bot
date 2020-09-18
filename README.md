<h1 align="center">Bot do Investidor (@brstocksbot) 🤖</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

>  A Telegram bot to provide analysis about your favorite brazilian stocks 

### :iphone: [Beta version](https://t.me/brstocksbot)
### :iphone: [Instagram](https://t.me/brstocksbot)

## Enviroment

- Create an `.env` file similar to `.env.example`;
- Add `mongoose.connect('mongodb://localhost/yourDatabaseName')` in DB_MONGO_URI
- Add your [Telegram key](https://telegram.me/BotFather) in TELEGRAM_KEY
- Add your [Alpha Vantage key](https://www.alphavantage.co/support/#api-key) in ALPHA_VANTAGE_KEY
- Add your [Sentry DNS](https://sentry.io/auth/login/) in SENTRY_DSN

## Install

```sh
yarn install
```

## Usage

```sh
yarn run start
```

## Development mode

```sh
yarn run dev
```

## Connecting your bot

```sh
curl -F "url=https://your-bot-domain/message"  https://api.telegram.org/bot<your_api_token>/setWebhook
```



## Author

👤 **Henrique Augusto**

* [Website](https://linktr.ee/hick97)
* [Github](https://github.com/hick97)
* [LinkedIn](https://linkedin.com/in/henrique-augusto-84b490133)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_