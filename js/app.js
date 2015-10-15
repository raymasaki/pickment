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
5. level count var is set in header and timer begins countdown
6. game shows colorWord from an array with random colorVal from array
7. mouse has corresponding colorVal = colorWord
8. user clicks on colorWord that is equal to colorVal
9. if correct goes to next level
10. if incorrect reveals intro div with updated highscore and start replaced with play again
*/

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
  colorHex: '#FFC107'
}, {
  colorName: 'orange',
  colorHex: '#FF9800'
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


/* Game */

$(document).ready(function() {

  /******************* Intro *******************/

  var $startButton = $('.start-button');
  var $intro = $('#intro');

  // Clicking start button will fade out intro and show level count intro
  $startButton.click(function(e) {
    $intro.fadeOut('fast');
    levelCountIntro();
  });

  /* Level Count */

  var levelCount = 0;

  var $levelCountIntro = $('#level-count > h1');


  // level count intro fades out after 1 second
  var levelCountIntro = function() {
    levelCount++;

    $levelCountIntro.text("Level " + levelCount);

    setTimeout(function() {
      $('#level-count').fadeOut('fast');
    }, 1000);

    changePickerColor();

    var newLevel = Level();
    newLevel.updateLevel();
    newLevel.createCell(levelCount);
  };

  /* Picker Color */

  var colorLen = colorVals.length;

  var changePickerColor = function() {
    var randomColor = Math.floor(Math.random() * colorLen);

    var newColorHex = colorVals[randomColor].colorHex;
    var cursorColor = colorVals[randomColor].colorName;
    currentColor = cursorColor;

    $('body').css('cursor', '-webkit-image-set( url(images/picker_' + cursorColor + '.svg) 1x, url(images/picker_' + cursorColor + '.svg) 2x), auto');

  };

  $('body').on('click', '.color-word', function(e) {
    var clickedColor = e.target.innerHTML;
    var newLevel = Level();
    newLevel.checkWin(clickedColor);
  });

  var randomColorGen = function () {
    return Math.floor(Math.random() * colorLen);
  };

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
        for (var i = 0; i < level; i++) {

          // creates a new random color
          var randomColor = randomColorGen();

          // creates a cell with text
          var $newCell = $('<div class="cell">');
          var $colorText = $('<h1 class="color-word">');

          $newCell.append($colorText);

          // on the first loop
          if (i === 0) {
            // create the correct color word
            $colorText.text(currentColor);
            $colorText.css('color', colorVals[randomColor].colorHex);
          } else if (i == 1) {
            // create a colorWord with the color of the currentColor
            $colorText.text(colorVals[randomColor].colorName);

            var currentHex = null;
            
            // Grabs the hex for the current color
            for (var j = 0; j < colorVals.length; j++) {
              if (colorVals[j].colorName === currentColor) {
                currentHex = colorVals[j].colorHex;
              }
            }

            $colorText.css('color', currentHex);
          } else {
            $colorText.text(colorVals[randomColor].colorName);
            $colorText.css('color', colorVals[randomColor].colorHex);
          }

          $newCell.css('top', (Math.random() * $(window).height() * 0.8));
          $newCell.css('left', (Math.random() * $(window).width() * 0.8));

          // within each cell make a colorWord
          $game.append($newCell);
        }
      },

      /* Level Incrementer */

      updateLevel: function() {
        $('.level-num > p').text('level: ' + levelCount);
      },

      /* Check Win */

      checkWin: function (colorText) {

        if (colorText === currentColor){
          console.log("Correct");
          $('#level-count').show();
          $game.empty();
          levelCountIntro();
        } else {
          console.log("Wrong");
        }
      }

    };

  };

});
