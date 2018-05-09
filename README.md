# UCL Treausre Hunt Technical Guide

The UCL Treasure Hunt is a small family of repositories which contains two phonegap apps and a server script.
* The server is found is located at : https://github.com/alexjb1993/server
* The question creation app is located at : https://github.com/alexjb1993/questions
* The mobile quiz app is located at : https://github.com/alexjb1993/quiz

## Server

For each app to function the httpServer.js file must be running:

* Use 'git clone https://github.com/alexjb1993/server.git' to download the repository
* Navigate to the repository using 'cd server'
* Run the node.js server in the background using 'node httpServer.js &'

Once the server is running one of the phone gap apps can be served.

## Question Creator

* Use 'git clone https://github.com/alexjb1993/questions.git' to download the repository.
* Navigate to the repository with 'cd questions/ucesrid'
* Run the app using 'phonegap serve'

## Mobile Quiz

* Use 'git clone https://github.com/alexjb1993/quiz.git' to download the repository.
* Navigate to the repository with 'cd quiz/ucesrid'
* Run the app using 'phonegap serve'

## Troubleshooting

* Both apps are not compatible with windows or apple phones at present.
* Both apps are only compatible with newer model android mobile phones. Older models may experience bugs.
* The question creator app is optimised for desktop pages and does not display correctly in mobile, but is still functional.
* The quiz creator app is optimised for mobile pages and does not display correctly in desktop pages. The user is also unable to use location services so cannot answer questions.
