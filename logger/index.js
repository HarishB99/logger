const task = require('vsts-task-lib/task');
const azure_devops_api = require('azure-devops-node-api');

try {
    console.log();
    console.log(`[i] Logger: Started`);
    console.log();
    const authHandler = azure_devops_api.getBearerHandler(
        task.getEndpointAuthorizationParameter('SystemVssConnection', 'AccessToken', false));
    const connection = new azure_devops_api.WebApi(process.env.SYSTEM_TEAMFOUNDATIONSERVERURI, authHandler);
    connection.getReleaseApi()
    .then(release_api => {
        console.log(`[i] Retrieving release info: Starting`);
        return release_api.getRelease(process.env.SYSTEM_TEAMPROJECT, parseInt(process.env.RELEASE_RELEASEID))
    }).then(release => {
        console.log(`[+] Retrieving release info: Release info obtained. Printing out Release info...`);
        return console.log(`Release info: ${JSON.stringify(release)}`);
    }).then(() => {
        return connection.getNotificationApi(connection.serverUrl, authHandler);
    }).then(notification_api => {
        console.log(`[i] Retrieving notification subscriptions: Starting`);
        return notification_api.listSubscriptions();
    }).then(subscriptions => {
        console.log(`[+] Retrieving notification subscriptions: Complete. Printing out subscriptions as JSON...`);
        return console.log(`Notification subscriptions in JSON: ${JSON.stringify(subscriptions)}`);
    }).then(() => {
        console.log(`[+] Logger: Completed`);
    }).catch(error => {
        console.error(`[-] Logger: Error encounterd`);
        console.error(`[-] Reason: ${error}`);
    });
} catch (error) {
    console.error(`[-] Program crashed. An unexpected error occurred: ${error}`);
}