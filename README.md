# Quackstream

This is a tool i wrote for a Hackathon at my School, which i helped organize. The Tool is general purpose for any hackathon that wants to display their hackers commits live as a nice gimmick.

## Setup
### As a Developer or Organizer
1. Ensure Docker is installed, otherwise install it first.
2. get the docker Image
```shell
  docker pull ghcr.io/poisonlocket/quackstream:latest
```
3. Run the image, port 8000 is exposed for the backend, port 3000 for the frontend
```shell
  docker run -itd -p 3000:3000 -p 8000:8000 ghcr.io/poisonlocket/quackstream:latest 
```
4. Ensure that your endpoints are available on the public internet and on different domains, for testing i recommend the npm package localtunnel.
5. Tell all the repository owners to use the participant setup guide to integrate their repositorys with Quackstream via Github Webhooks and provide them with the domain where the backend of the service is hosted, while they are doing this take a quick break and get some coffee or feed the rubber ducks at your local desk.


### As a Participant and Repository Owner
1. Go into your repository Settings and Select Webhooks
2. Change the payload url to the provided url by the organizers
3. Ensure /webhook is at the end of the url, if not add it in to reach the webhook route.
4. Set the content type to ```application/json```
5. Ensure that https is enabled, the webhook only sends the push event and the webhook is marked active
6. Update your webhook at the bottom of the page
7. push something to your repo, you can use the --allow-empty flag for an empty git commit, write a small commit message like ```quacking code now``.
8. check the recent deliveries tab to see if your webhook was able to deliver the commit data successfully, then check the big screen where the commits are displayed.
9. You are done and the webhook is setup, go report back to the organizers.

```
        ,----,
   ___.`      `,
   `===  D     :
     `'.      .'
        )    (                   ,
       /      \_________________/|
      /                          |
     |                           ;
     |               _____       /
     |      \       ______7    ,'
     |       \    ______7     /
      \       `-,____7      ,'   
^~^~^~^`\                  /~^~^~^~^ #Quack
  ~^~^~^ `----------------' ~^~^~^
 ~^~^~^~^~^^~^~^~^~^~^~^~^~^~^~^~
```