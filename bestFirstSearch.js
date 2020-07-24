async function bestFirstSearch(state, diagonalMovement = false){

    var parent = new Array(state.rows);
    var closedList = new Array(state.rows);
    for(let i=0;i<state.rows;i++){
        closedList[i]  = new Array(state.cols);
        parent[i] = new Array(state.cols); 
    }
    for(let i=0;i<state.rows;i++){
        for(let j=0;j<state.cols;j++){
            closedList[i][j] = 0; 
            parent[i][j] = [-1,-1];
        }
    }

    var foundDest = false;
    const openList = new PriorityQueue((a, b) => a[2] < b[2]);
    var hVal = heuristicVal([state.start.y, state.start.x], [state.end.y, state.end.x] , diagonalMovement, state.heuristic); 
    openList.push([state.start.y , state.start.x, hVal]);
    closedList[state.start.y][state.start.x] = 1;
    parent[state.start.y][state.start.x] = [state.start.y, state.start.x];
    
    while(!openList.isEmpty()){
        await state.sleep(0);
        var [y, x, h] = openList.pop();
        closedList[y][x] = 2;

        if((y === state.end.y)&&(x === state.end.x)){
            foundDest = true;
            break;
        }

        if(!(((y === state.start.y)&&(x === state.start.x))||((y === state.end.y)&&(x === state.end.x)))){
            state.context.fillStyle = "rgb(0,255,255)";
            state.fillRect(x, y);
        }

        var neighbours = getNeighbours(state, [y, x], diagonalMovement);
        for(let i=0;i<neighbours.length;i++){
            var [ny, nx] = neighbours[i];
            if((closedList[ny][nx] === 0)&&(state.matrix[ny][nx] !== 1)){
                parent[ny][nx]=[y,x];
                var newH = heuristicVal([ny, nx], [state.end.y, state.end.x], diagonalMovement, state.heuristic); 
                openList.push([ny,nx,newH]);
                closedList[ny][nx] = 1;
                parent[ny][nx] = [y, x];
                if(!((ny === state.end.y)&&(nx === state.end.x))){
                    state.context.fillStyle = "rgb(0,255,0,0.7)";
                    state.fillRect(nx, ny);
                }
            }
        }
    }
    if(foundDest){
        var distance = getPathbest(state, parent);
        return distance.toFixed(2);;
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


  function getPathbest(state, parent){
    let row = state.end.y;
    let col = state.end.x;
    let p = parent[row][col];
    state.context.beginPath();
    state.moveTo(col, row);
    var shortestPath = 0;
    let prev1 = row;
    let prev2 = col;
    while(!((p[0]===row)&&(p[1]===col))){
         row = p[0];
         col = p[1];
         p = parent[row][col];
         state.lineTo(col, row);
         let dist1 = Math.abs(prev1-row)+Math.abs(prev2-col);
         shortestPath+=Math.sqrt(dist1); 
         prev1 = row;
         prev2 = col;
    }
    state.context.strokeStyle = "yellow";
    state.context.lineWidth = 3;
    state.context.stroke();
    console.log(shortestPath);
    return shortestPath;
}


  function heuristicVal(curNode,endNode,diagonalMovement,heuristic = "Manhattan"){
    if(heuristic === "Manhattan"){
      var hVal = Math.abs(curNode[0]-endNode[0])+Math.abs(curNode[1]-endNode[1]);
      return hVal;   
    }
    else if(heuristic === "Euclidean"){
      var a = (curNode[0]-endNode[0])*(curNode[0]-endNode[0]);
      var b = (curNode[1]-endNode[1])*(curNode[1]-endNode[1]);
      var hVal = Math.sqrt(a+b);
      return hVal;
    }
    else if(heuristic === "Octile"){
      var dx = Math.abs(curNode[0]-endNode[0]);
      var dy = Math.abs(curNode[1]-endNode[1]);
      var hVal = (dx + dy) + (Math.sqrt(2)-2)*Math.min(dx,dy);
      return hVal;
    }
    else if(heuristic === "Chebyshev"){
      var dx = Math.abs(curNode[0]-endNode[0]);
      var dy = Math.abs(curNode[1]-endNode[1]);
      var hVal = (dx + dy)-Math.min(dx,dy);
      return hVal;
    }
  }

}
