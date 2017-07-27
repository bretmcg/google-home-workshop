/**
 * @license
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const ApiAiApp = require('actions-on-google').ApiAiApp;
const fetch = require('node-fetch');

function addIntent(app) {
  let number1 = parseInt(app.getArgument('number1'));
  let number2 = parseInt(app.getArgument('number2'));
  console.log(`Adding ${number1} to ${number2}`);
  //app.ask(`${number1 + number2}, the answer is.`);
  app.ask(app.buildRichResponse()
    .addSimpleResponse(`${number1 + number2}, the answer is.`)
    .addBasicCard(app.buildBasicCard(`Addition (often signified by
        the plus symbol "+") is one of the four basic operations of
        arithmetic, with the others being subtraction, multiplication
        and division. The addition of two whole numbers is the total
        amount of those quantities combined.`)
      .setTitle('Addition')
      .addButton('Read more', 'https://en.wikipedia.org/wiki/Addition')
      .setImage('https://raw.github.com/bretmcg/google-home-workshop/master/docs/img/calculate-potato.jpg', 'A calculating potato.')
    )
  );
}

function multiplyIntent(app) {
  let number1 = parseInt(app.getArgument('number1'));
  let number2 = parseInt(app.getArgument('number2'));
  console.log(`Multiplying ${number1} and ${number2}`);
  app.ask(app.buildRichResponse()
    .addSimpleResponse(`${number1 * number2}, the answer is.`)
    .addBasicCard(app.buildBasicCard(`The multiplication sign (×), 
      often attributed to William Oughtred (who first used it in
      an appendix to the 1618 edition of John Napier's Mirifici
      Logarithmorum Canonis Descriptio), apparently had been in
      occasional use since the mid 16th century.`)
      .setTitle('Multiplication')
      .addButton('Read more')
      .setImage('https://raw.github.com/bretmcg/playground-bretmcg/master/docs/img/calculate-potato.jpg', 'A calculating potato.')
    )
  );
}

function translateIntent(app) {
  let phrase = app.getArgument('phrase');
  let translateUrl = `http://api.funtranslations.com/translate/yoda.json?text=${encodeURI(phrase)}`;
  console.log(`Translating ${phrase} to Yodish...`);

  fetch(translateUrl)
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data));
      let translation = data.contents.translated;
      app.ask(translation);
    })
    .catch(err => {
      console.log(err);
      app.ask('Too strong, the dark side of the force was.');
    });
}

function eyeColorIntent(app) {
  let name = app.getArgument('name');
  let searchUrl = `https://swapi.co/api/people/?search=${encodeURI(name)}`;

  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data, null, '\t'));
      if (data.count === 0) {
        app.ask(`${name}: that name, I know not.`);
      } else {
        app.ask(`${data.results[0].eye_color} eyes, ${name} has.`);
      }
    }).catch(err => {
      console.log(err);
      app.ask('Too strong, the dark side of the force was.');
    });
}

function heightIntent(app) {
  let name = app.getArgument('name');
  let searchUrl = `https://swapi.co/api/people/?search=${encodeURI(name)}`;

  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data, null, '\t'));
      if (data.count === 0) {
        app.ask(`${name}: that name, I know not.`);
      } else {
        let cm = data.results[0].height;
        let feet = (cm / 30.48).toFixed(2);
        app.ask(`${cm} cm (${feet} feet) tall, ${name} is.`);
      }
    }).catch(err => {
      console.log(err);
      app.ask('Too strong, the dark side of the force was.');
    });
}

exports.yodabot = function(request, response) {
  const app = new ApiAiApp({request, response});
  var actionMap = new Map();
  actionMap.set("eyes.color", eyeColorIntent);
  actionMap.set("character.height", heightIntent);
  actionMap.set("yoda.translate", translateIntent);
  actionMap.set("math.add", addIntent);
  actionMap.set("math.multiply", multiplyIntent);
  app.handleRequest(actionMap);
}
