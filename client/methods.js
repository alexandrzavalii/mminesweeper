createGrid = function(rows,cols){

//remove previous board
    $('table.grid').remove();
    grid = simpleGrid(rows,cols);
    document.getElementById("board").appendChild(grid);

    function simpleGrid ( rows, cols ){
      var grid = document.createElement('table');
      grid.className = 'grid';
      for (var r=0;r<rows;++r){
          var tr = grid.appendChild(document.createElement('tr'));
          for (var c=0;c<cols;++c){
              var cell = tr.appendChild(document.createElement('td'));
                cell.className= r; //row number
          }
      }
      return grid;
    }
};

populateBombs = function(category){
  var bombs;
  var placeBombs = [];

    if(category ==='medium'){
      bombs = 20;
    }else if(category==='hard'){
      bombs = 30;
    }else{
      bombs = 10;
    }

    randomPosition(bombs);
    function randomPosition(bombs) {
            var xposition = [];
            var yposition = [];
            for (var i=0; i<bombs; i++) {
                var x = Math.floor(Math.random() * 10); //generate new x point
                var y = Math.floor(Math.random() * 10); //generate new x point

                var location = xposition.indexOf(x);
                if (location > -1) { //if newly generated x point is already in the xposition array (if it was    already previously generated
                    if (y == yposition[location]) { //if the newly generated y points equals the same y point in  the same location as x, except in the yposition array
                        while ( y == yposition[location]) {
                            y = Math.floor(Math.random() * 10);
                        }
                    }
                }
                xposition.push(x);
                yposition.push(y);

                placeBombs[(placeBombs.length)] = [x,y];

            }
        }


        return placeBombs;
};

checkClick = function(x,y){
  for(var i = 0; i<placeBombs.length; i++){

    if(x == placeBombs[i][0] && y == placeBombs[i][1]){
        event.target.innerHTML = "X";
        event.target.className ="bomb"
        return true;
     }
  }
  return false;
};

clickNext = function clickNext(x,y){
//count the number of bombs arround cell
  var bombsArround = 0;
   for(i in placeToCheck){
     for(var n = 0; n<placeBombs.length; n++){
       if(checkArround(n,x + placeToCheck[i][0],y+ placeToCheck[i][1])){
         bombsArround++;
       }
     }
   }
//save to the array of clicked cells;
clickedPlaces[(clickedPlaces.length)] =  [x,y,bombsArround];
clickedPlacesThisTurn[(clickedPlacesThisTurn.length)] =  [x,y,bombsArround];
//if no bombs are arround
if(bombsArround == 0){
  for(var i in placeToCheck){
//check if we are not exceeding the size of the table
    if(x + placeToCheck[i][0] >= 0 &&
       x + placeToCheck[i][0] <= cols-1 &&
       y + placeToCheck[i][1] >= 0 &&
       y + placeToCheck[i][1] <= rows-1 ){

         var x1 = x + placeToCheck[i][0];
         var y1 = y + placeToCheck[i][1];

         var alreadyClicked = false;
           for(n in clickedPlaces){
             if(clickedPlaces[n][0] == x1 && clickedPlaces[n][1] == y1){
                alreadyClicked = true;
             }
           }
           if (!alreadyClicked){
             clickNext(x1, y1);
           }
       }
  }
}
return clickedPlacesThisTurn;
};

checkArround = function checkArround(i,x,y){
  if(placeBombs[i][0] == x && placeBombs[i][1] == y){
     return true;
  }else{
    return false;
  }
};

displayResult = function displayResult(checkedPlaces){
  console.log("looops",checkedPlaces.length);
  for(var i=0; i<checkedPlaces.length; i++){
    if(checkedPlaces[i][2] > 0){
      $('table.grid tr:eq(' + checkedPlaces[i][1] + ') td:eq(' + checkedPlaces[i][0] + ')').addClass( "hasBomb" ).text(checkedPlaces[i][2]);
    }else{
     $('table.grid tr:eq(' + checkedPlaces[i][1] + ') td:eq(' + checkedPlaces[i][0] + ')').addClass( "noBomb" );
    }
  }
};

gameover = function gameover(){
  for(var i =0; i<placeBombs.length; i++)
      $('table.grid tr:eq(' + placeBombs[i][1] + ') td:eq(' + placeBombs[i][0] + ')').addClass( "bomb" ).text('X');
};
