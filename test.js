const test = require('tape');
const translate = require(__dirname + '/emoji-translate.js');

test('isMaybeAlreadyAnEmoji', function (t) {
  t.equal(translate.isMaybeAlreadyAnEmoji('batman'), false, 'batman is not an emoji');
  t.equal(translate.isMaybeAlreadyAnEmoji('🐳'), true, '🐳 is an emoji');
  t.equal(translate.isMaybeAlreadyAnEmoji('🤞🏿'), true, '🤞🏿 is an emoji');
  t.equal(translate.isMaybeAlreadyAnEmoji('👩🏽‍🏫'), true, '👩🏽‍🏫 is an emoji');
  t.end();
});

test('getAllEmojiForWord', function (t) {
  t.equal(translate.getAllEmojiForWord('👀')[0], '👀', '👀 is translated to 👀');
  let allCats = translate.getAllEmojiForWord('cat');
  t.equal(allCats.length > 2, true, 'cat is translated to many things');
  t.equal(allCats.indexOf('🐱') !== -1, true, 'cat is translated to 🐱');
  t.equal(allCats.indexOf('🙀') !== -1, true, 'cat is translated to 🙀');
  t.equal(allCats.indexOf('👻') === -1, true, 'cat is not translated to 👻');
  t.end();
});

test('getEmojiForWord', function (t) {
  t.equal(translate.getEmojiForWord('👀'), '👀', '👀 is translated to 👀');
  let allCats = translate.getAllEmojiForWord('cat');
  let translatedCat = translate.getEmojiForWord('cat');
  t.equal(typeof(translatedCat) === "string", true, 'cat is translated to a string');
  t.equal(allCats.indexOf(translatedCat) !== -1, true, 'cat is translated to something in the list');
  t.end();
});

test('translate', function (t) {
  let sentence = "the house is on fire and the cat is eating the cake";
  let translatedWithWords = translate.translate(sentence);
  let translatedWithoutWords = translate.translate(sentence, true);
  t.equal(translatedWithWords !== '', true, 'sentence can be translated to something with words');
  t.equal(translatedWithoutWords !== '', true, 'sentence can be translated to something without words');
  t.equal(translatedWithWords !== translatedWithoutWords, true, 'those two things are different');

  t.end();
});

test('punctuation', function(t) {
  // Exclamation marks should be preserved
  t.equal(2, translate.translate('YES! victory!').match(/!/g).length);
  t.equal(null, translate.translate('YES! victory!', true).match(/!/g));
  t.end();
});

test('flags', function(t) {
  // these should not be flags.
  t.equal('im', translate.translate('im').trim());
  t.equal('in', translate.translate('in').trim());

  // YES should not have a flag.
  t.equal(-1, translate.getAllEmojiForWord('yes').indexOf('🇾🇪'));
  t.end();
});

test('hard coded words', function(t) {
  t.notEqual('i am', translate.translate('i am').trim());
  t.notEqual('she he is', translate.translate('she he is').trim());
  t.notEqual('we they are', translate.translate('we they are').trim());
  t.equal('🙌', translate.translate('thanks').trim());
  t.end();
});

test('ing verbs', function(t) {
  // English sucks. Dance+ing = dancing, run+ing = running, eat+ing = eating;
  t.notEqual('saving', translate.translate('saving').trim());
  t.notEqual('running', translate.translate('running').trim());
  t.notEqual('eating', translate.translate('eating').trim());
  t.end();
});

test('omg what is real', function(t) {
  t.notEqual('hi', translate.translate('hi').trim());
  t.notEqual('', translate.translate('welcome back, emoji robot! ready to take over the world?', true));
  t.end();
});

test('Can instantiate with custom emoji mappings', function(t) {
    const customSpecificKeyword = 'foobarbaz';
    const customMapping = {
        "wave": {
            "keywords": ["howdy"]
        },
        "nonexistent_emoji": {
            "keywords": [customSpecificKeyword],
            "char": "X",
            "fitzpatrick_scale": false,
            "category": "fantasy"
        }
    };
    translate.addCustomEmojiMapping(customMapping);

    let allHowdy = translate.getAllEmojiForWord('howdy');
    t.equal(allHowdy.length > 0, true, 'howdy is translated to at least one thing');
    t.equal(allHowdy.indexOf('👋') !== 1, true, 'howdy is translated to 👋');



    let nonExistent = translate.getAllEmojiForWord(customSpecificKeyword);
    t.equal(nonExistent.length > 0, true, 'previously non existent emoji have been mapped');

    let allCats = translate.getAllEmojiForWord('cat');
    t.equal(allCats.length > 2, true, 'cat is not overridden and still translated');

    t.end();
});