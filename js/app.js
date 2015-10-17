/************************

@authorName: Ray Masaki
@dateCreated: 10.14.2015
@lastUpdated: 10.15.2015
@projectName: Pickment

************************/

console.log('Loaded');

/*
## 1. User clicks start
## 2. hides intro div
## 3. reveals level count div
## 4. level count div hides after 1 second
## 5. level count var is set in header
6. Set timer
## 7. game shows colorWord from an array with random colorVal from array
## 8. mouse has corresponding colorVal = colorWord
## 9. user clicks on colorWord that is equal to colorVal
## 10. if correct goes to next level
## 11. if incorrect reveals intro div with updated highscore and start replaced with play again
*/



/************************

Remaining Bugs:

- Timer not running
  - Timer should start at a larger number and decrement every level
    - 10 > 9.5 > 9 > 8.5 etc.
  - After level 10(?) it should stop decrementing (maybe 5 seconds)
- Random improvements:
  - ## Jason: Create a random set that displays based on the set so there aren't dupes
  - Two words should not be overlapping
  - ## Random word should not include currentColor name besides the correct answer
  - ## colorWord should not be the same as colorHex
  - ## Random word should not be random word color
- Visual Improvements:
  - sweet gradient animation on the intro screen
  - transition of the logo animating into the screen
  - pressed state for the word
  - better hover state for the word
  - ## every 10 levels make the font size slightly smaller?


************************/




/******************* Global Variables *******************/

// May not be color safe look at 16bit colors
var colorVals = [{
  colorName: 'red',
  colorHex: '#F44336'
}, {
  colorName: 'pink',
  colorHex: '#E91E63'
}, {
  colorName: 'purple',
  colorHex: '#9C27B0'
}, {
  colorName: 'indigo',
  colorHex: '#3F51B5'
}, {
  colorName: 'blue',
  colorHex: '#2196F3'
}, {
  colorName: 'cyan',
  colorHex: '#00BCD4'
}, {
  colorName: 'teal',
  colorHex: '#009688'
}, {
  colorName: 'green',
  colorHex: '#4CAF50'
}, {
  colorName: 'lime',
  colorHex: '#CDDC39'
}, {
  colorName: 'yellow',
  colorHex: '#FFEB3B'
}, {
  colorName: 'gold',
  colorHex: '#FFC400'
}, {
  colorName: 'orange',
  colorHex: '#FF6D00'
}, {
  colorName: 'brown',
  colorHex: '#795548'
}, {
  colorName: 'grey',
  colorHex: '#9E9E9E'
}];

var pickerColor = 'default';
var $game = $('#game');
var currentColor = null;
var timer = 2;
var colorLen = colorVals.length;
var levelCount = 0;
var currentHex = null;
var previousScore = 0;
var tileArray = [];


/******************* Make Tiles *******************/

var makeTiles = function() {

  var $tileContainer = $('<div id="tile-container">');

  for (var i = 0; i < 150; i++) {
    var $tileHeight = ($(window).height() * 0.9) / 15;
    var $tileWidth = ($(window).width() * 0.9) / 10;

    var $tile = $('<div class="tile">');
    $tile.attr('tile-num', i);
    $tile.css('width', $tileWidth);
    $tile.css('height', $tileHeight);

    tileArray.push(i);

    $tileContainer.append($tile);
  }

  $('#game-container').append($tileContainer);
  // randomize(tileArray);

};

/******************* Shuffle colorVal Array *******************/

/*
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */

function randomize(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  array = array;
}

/******************* Show Intro *******************/

var showIntro = function() {

    $('#intro').fadeIn('fast');

    var $highscore = $('p.highscore');

    if (levelCount > previousScore) {
      previousScore = levelCount;
      $highscore.text("highscore: level " + previousScore);
    }

    var $startButton = $('.start-button');
    $startButton.text("play again");

    levelCount = 0;
    $game.empty();
};


/******************* Game *******************/

$(document).ready(function() {

  makeTiles();

  /******************* Intro *******************/

  var $startButton = $('.start-button');
  var $intro = $('#intro');

  // Clicking start button will fade out intro and show level count intro
  $startButton.click(function(e) {
    $intro.fadeOut('fast');
    levelCountIntro();
  });

  /* Level Count */

  var $levelCountIntro = $('#level-count > h1');


  // level count intro fades out after 1 second
  var levelCountIntro = function() {
    levelCount++;



    // Grabs the hex for the current color
    for (var j = 0; j < colorVals.length; j++) {
      if (colorVals[j].colorName === currentColor) {
        currentHex = colorVals[j].colorHex;
      }
    }

    $('#level-count').css('background', currentHex);

    $levelCountIntro.text("Level " + levelCount);

    setTimeout(function() {
      $('#level-count').fadeOut('fast');
    }, 1000);

    randomize(colorVals);
    changePickerColor();

    var newLevel = Level();
    newLevel.updateLevel();
    newLevel.createCell(levelCount);
    newLevel.checkSize(levelCount);
    newLevel.levelTimer(timer);
  };

  /* Picker Color */

  var changePickerColor = function() {
    // var randomColor = Math.floor(Math.random() * colorLen);


    var newColorHex = colorVals[0].colorHex;
    var cursorColor = colorVals[0].colorName;
    currentColor = cursorColor;

    $('body').css('cursor', '-webkit-image-set( url(images/picker_' + cursorColor + '.svg) 1x, url(images/picker_' + cursorColor + '.svg) 2x), auto');

  };

  $('body').on('click', '.color-word', function(e) {
    var clickedColor = e.target.innerHTML;
    var newLevel = Level();
    newLevel.checkWin(clickedColor);
  });

  $('body').on('mouseout', '.color-word', function() {
    $(this).removeClass('animated');
  });

  $('body').on('mouseover', '.color-word', function() {
    $(this).addClass('animated');
  });

  // var randomColorGen = function() {
  //   return Math.floor(Math.random() * colorLen);
  // };

  /*
  colorWord logic:
  - number of colorWord is equal to level number
  - currentColors is an array of colorVals
  - display each colorWord with a noncorresponding colorVal
  - assign mouseColor with one of the colorVals
  - mouseColor clicks colorWord proceed to next level
  */

  /******************* Level Constructor *******************/

  var Level = function() {

    return {

      /* Create Cell */

      createCell: function(level) {

        randomize(tileArray);

        for (var i = 0; i < level; i++) {

          // creates a cell with text
          var $newCell = $('<div class="cell">');
          var $colorText = $('<h1 class="color-word">');

          $newCell.append($colorText);

          if (i === 0) {

            // create the correct color word
            $colorText.text(currentColor);
            $colorText.css('color', colorVals[i + 1].colorHex);

          } else if (i === 1) {

            // create a colorWord with the color of the currentColor
            $colorText.text(colorVals[i].colorName);

            $colorText.css('color', colorVals[i - 1].colorHex);

          } else if (i > 12) {

            $colorText.text(colorVals[i - 12].colorName);
            $colorText.css('color', colorVals[i - 13].colorHex);

          } else {

            $colorText.text(colorVals[i].colorName);
            $colorText.css('color', colorVals[i + 1].colorHex);

          }

          /* Random Placement */

          var randomTileNum = tileArray[i];

          var $randomTile = $('*[tile-num="' + randomTileNum + '"]');
          var placementX = $randomTile.position().left;
          var placementY = $randomTile.position().top;

          $newCell.css('top', placementY);
          $newCell.css('left', placementX);

          // within each cell make a colorWord
          $game.append($newCell);
        }
      },

      /* Level Incrementer */

      updateLevel: function() {
        $('.level-num > p').text('level: ' + levelCount);
      },

      levelTimer: function(time) {

        // set Interval for every 100 millisecond

        $('.timer > p').text(time + ' sec');

      },

      /* Update Size */

      checkSize: function(level) {
        var $cellText = $('.color-word');
        if (level >= 10 && level <= 20) {
          console.log('level 10-20');
          $cellText.css('font-size', '0.8em');
        } else if (level > 20 && level <= 30) {
          console.log('level 20-30');
          $cellText.css('font-size', '0.6em');
        } else if (level > 30) {
          console.log('level 30+');
          $cellText.css('font-size', '0.4em');
        }
      },

      /* Check Win */

      checkWin: function(colorText) {

        if (colorText === currentColor) {
          $('#level-count').show();
          $game.empty();

          levelCountIntro();
        } else {
          var $levelCountIntro = $('#level-count > h1');
          $levelCountIntro.text("wrong!");
          $('#level-count').show();
          $('#level-count').css('background', currentHex);

          setTimeout(showIntro, 1000);
        }

      }

    };

  };

});
