# GPTz

a Zoom bot that answers questions using ChatGPT

## Configure

Run `npm install` to install node dependencies which also runs `postinstall` script to auto-generate `.env` file with default values. Enter other secrets manually:

* PORT [auto generated](server port to run the express app. default: `8080`)
* APP_NAME [auto generated](name of the bot as to show on Zoom client. default: `GPTz`)
* ZOOM_MEETING_SDK_KEY (`Client ID` from Zoom Meeting SDK App. [See Details](https://developers.zoom.us/docs/meeting-sdk/create/https:/))
* ZOOM_MEETING_SDK_SECRET (`Client Secret` from Zoom Meeting SDK App. [See Details](https://developers.zoom.us/docs/meeting-sdk/create/https:/))
* ZOOM_REDIRECT_URL (app host url root without tailing /)
* SESSION_SECRET [auto generated](used to encrypt session variables)
* OPENAI_KEY (`Api Key` from OpenAI Account. [See Details](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-keyhttps:/))

## Available Scripts

In the project directory, you can run:

### `npm run prepare`

Generates `.env` file in project root with Secrets necessary to run the app.

### `npm start`

Runs the app.
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm run serve`

Serves the app using ngrok. NOTE: If you change the default port in `.env`, don't forget to change the same for this script in `package.json`
