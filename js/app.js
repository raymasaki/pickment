/************************

@authorName: Ray Masaki
@dateCreated: 10.14.2015
@lastUpdated: 10.14.2015
@projectName: Pickment

************************/

console.log('Loaded');

/*
1. User clicks start
2. hides intro div
3. reveals level count div
4. level count div hides after 1 seconds
5. level count var is set in header and timer begins countdown
6. game shows colorWord from an array with random colorVal from array
7. mouse has corresponding colorVal = colorWord
8. user clicks on colorWord that is equal to colorVal
9. if correct goes to next level
10. if incorrect reveals intro div with updated highscore and start replaced with play again
*/

/*
Logic for creating cells:
- Math.round(square root of level) = how many rows
- level/sqrt = how many per row
- 100 / cells per row = % width of each cell
- level % sqrt = how many cells on the last row
- create a colorWord element in the cell
*/

/*
colorWord logic:
- number of colorWord is equal to level number
- currentColors is an array of colorVals
- display each colorWord with a noncorresponding colorVal
- assign mouseColor with one of the colorVals
- mouseColor clicks colorWord proceed to next level
*/
