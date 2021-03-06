async function dijkstra(state, diagonalMovement = false){
    let maxi = Number.MAX_SAFE_INTEGER;
    var closedList = new Array(state.rows);
    var cellDetails = new Array(state.rows);
    for(let i=0;i<state.rows;i++){
        closedList[i]  = new Array(state.cols);
        cellDetails[i] = new Array(state.cols); 
    }
    for(let i=0;i<state.rows;i++){
        for(let j=0;j<state.cols;j++){
            closedList[i][j] = 0;
            cellDetails[i][j] = [maxi,maxi,0.0,-1,-1];
        }
    }

    cellDetails[state.start.y][state.start.x] = [0.0, 0.0, 0.0, state.start.y, state.start.x];
    const openList = new PriorityQueue((a, b) => a[2] < b[2]);
    openList.push([state.start.y, state.start.x, 0.0]);
    var foundDest = false;

    while(!openList.isEmpty()){
        await state.sleep(0);
        var [y, x, cost] = openList.pop();
        closedList[y][x] = 1;
        if(!(((y === state.start.y)&&(x === state.start.x))||((y === state.end.y)&&(x === state.end.x)))){
            state.context.fillStyle = "rgb(0,255,255)";
            state.fillRect(x, y);
        }

        var neighbour = getNeighbours(state, [y, x], diagonalMovement,);

        for(let i=0;i<neighbour.length;i++){
            var [ny, nx] = neighbour[i];
            var cell = cellDetails[ny][nx]; 
            if((ny === state.end.y)&&(nx === state.end.x)){
                cellDetails[ny][nx] = [cell[0], cell[1], cell[2], y, x];
                foundDest = true;
                break;
            }
            else if((closedList[ny][nx] === 0) && (state.matrix[ny][nx] !== 1)){
                let gNew = cellDetails[y][x][1] + 1.0;
                let hNew = 0.0;
                let fNew = gNew + hNew;
                
                if((cell[0] === maxi)||(cell[0]>fNew)){
                    openList.push([ny, nx, fNew]);
                    cellDetails[ny][nx] = [fNew, gNew, hNew, y, x];
                    if(!((ny === state.end.y)&&(nx === state.end.x))){
                        state.context.fillStyle = "rgb(0,255,0,0.7)";
                        state.fillRect(nx, ny);
                    }
                }
            }
        }
        if(foundDest){
            break;
        }
    }
    if(foundDest){
        var distance = getPathDij(state, cellDetails);
        return distance.toFixed(2);
    }
    else{
        return -1;
    }


    // HELPERS

    function getNeighbours(state, curNode, diagonalMovement){
      var neighbours = [];
      let dx = [1,0,-1,0];
      let dy = [0,-1,0,1];
      let dx1 = [1,1,0,-1,-1,-1,0,1];
      let dy1 = [0,-1,-1,-1,0,1,1,1];
      if(diagonalMovement){ 
          for(let i=0;i<8;i++){
              let neighborX = curNode[1] + dx1[i];
              let neighborY = curNode[0] + dy1[i];
              if((neighborX>=0)&&(neighborX<state.cols)&&(neighborY>=0)&&(neighborY<state.rows)){
                  neighbours.push([neighborY,neighborX]);
              }
          }
      }
      else{
          for(let i=0;i<4;i++){
              let neighborX = curNode[1] + dx[i];
              let neighborY = curNode[0] + dy[i];
              if((neighborX>=0)&&(neighborX<state.cols)&&(neighborY>=0)&&(neighborY<state.rows)){
                  neighbours.push([neighborY,neighborX]);
              }
          }
      }
      return neighbours;
  }


  function getPathDij(state, cellDetails){
      let row = state.end.y; 
      let col = state.end.x;
      let prev1 = row;
      let prev2 = col;
      var shortestDist = 0; 
      var cell = cellDetails[row][col]; 
      state.context.beginPath();
      state.moveTo(col, row);
      while(!((cell[3] === row) && (cell[4] === col))){
           row = cell[3];
           col = cell[4];
           cell = cellDetails[row][col];
           state.lineTo(col, row);
           let diss = Math.abs(row-prev1)+Math.abs(col-prev2); 
           shortestDist += Math.sqrt(diss);
           prev1 = row;
           prev2 = col;
      }
      state.context.strokeStyle = "yellow";
      state.context.lineWidth = 3;
      state.context.stroke();
      console.log(shortestDist);
      return shortestDist;
  }

}
