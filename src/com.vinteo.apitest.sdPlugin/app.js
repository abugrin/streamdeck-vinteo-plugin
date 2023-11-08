/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const myAction = new Action('com.vinteo.apitest.action');


/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(({actionInfo, appInfo, connection, messageType, port, uuid}) => {
    console.log('Stream Deck connected!');
});

myAction.onKeyUp(({action, context, device, event, payload}) => {
    const settings = payload.settings
    console.log('Server: ', settings.server)
    console.log('Login: ', settings.login)
    console.log('Password: ', settings.password)
    const request = {
        username: settings.login,
        password: settings.password
    }

    const opts = {
        cache: 'no-cache',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: '{"username" : "' + settings.login + '", "password" : "' + settings.password + '"}',
    };
    console.log('Request Body: ', opts)
    fetch(settings.server + '/api/v1/auth/jwt', opts).then(resp => {
        resp.json().then(
            json => {
                console.log(json)
                const participants = settings.participants.split(', ')
                console.log(participants)
                const conference = {
                    conference: settings.conference,
                    participants: participants

                }
                console.log(JSON.stringify(conference))
                fetch(settings.server + '/api/v1/call', {
                    cache: 'no-cache',
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${json.data.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(conference)
                }).then(res => {
                    console.log('Conference resp: ', res.json())})
            }
        )
    })
})
;

myAction.onDialRotate(({action, context, device, event, payload}) => {
    console.log('Your dial code goes here!');
});

myAction.onDidReceiveSettings(jsn => onSettings(jsn))

const onSettings = (jsn) => {
    console.log("jsn:", jsn.payload)
}
