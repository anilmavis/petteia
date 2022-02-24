class Tavola {
  #width;
  #height;
  #pieces;
  #x1;
  #y1;
  
  constructor(width = 8, height = 8) {
    this.#width = width;
    this.#height = height;
    this.#pieces = [];
    
    for (let x = 0; x < this.#width; x++) {
      this.#pieces[x] = [];
      
      for (let y = 0; y < this.#height; y++) {
        this.#pieces[x][y] = 0;
      }
    }
  }
  
  get width() {
    return this.#width;
  }
  
  get height() {
    return this.#height;
  }
  
  #contains(x, y) {
    return 0 <= x && x < this.#width && 0 <= y && y < this.#height;
  }
  
  put(x, y, colour) {
    if (this.#contains(x, y)) {
      this.#pieces[x][y] = colour;
    }
  }
  
  #get(x, y) {
    return this.#contains(x, y) ? this.#pieces[x][y] : 0;
  }
  
  #isLegal(x1, y1, x2, y2) {
    if (this.#get(x1, y1) != 0 && this.#get(x2, y2) == 0) {
      if (x1 == x2) {
        if (y1 < y2) {
          for (let y = y1 + 1; y < y2; y++) {
            if (this.#get(x1, y) != 0) {
              return false;
            }
          }
        } else {
          for (let y = y2; y < y1; y++) {
            if (this.#get(x1, y) != 0) {
              return false;
            }
          }
        }
        return true;
      } else if (y1 == y2) {
        if (x1 < x2) {
          for (let x = x1 + 1; x < x2; x++) {
            if (this.#get(x, y1) != 0) {
              return false;
            }
          }
        } else {
          for (let x = x2; x < x1; x++) {
            if (this.#get(x, y1) != 0) {
              return false;
            }
          }
        }
        return true;
      }
    }
    return false;
  }
  
  #isCaptured(x, y) {
    const piece = -this.#get(x, y);
    return 0 < x && x + 1 < this.#width && 0 < y && y + 1 < this.#height && this.#get(x - 1, y) == piece && this.#get(x + 1, y) == piece || this.#get(x, y - 1) == piece && this.#get(x, y + 1) == piece;
  }
  
  move(x1, y1, x2, y2) {
    if (this.#isLegal(x1, y1, x2, y2)) {
      this.put(x2, y2, this.#get(x1, y1));
      this.put(x1, y1, 0);
      
      if (this.#isCaptured(x2 - 1, y2)) {
        this.put(x2 - 1, y2, 0);
      }
      
      if (this.#isCaptured(x2 + 1, y2)) {
        this.put(x2 + 1, y2, 0);
      }
      
      if (this.#isCaptured(x2, y2 - 1)) {
        this.put(x2, y2 - 1, 0);
      }
      
      if (this.#isCaptured(x2, y2 + 1)) {
        this.put(x2, y2 + 1, 0);
      }
      this.draw();
    }
  }
  
  #click(x, y) {
    if (this.#x1 === undefined) {
      if (this.#get(x, y) != 0) {
        this.#x1 = x;
        this.#y1 = y;
      }
    } else {
      this.move(this.#x1, this.#y1, x, y)
      this.#x1 = undefined;
      this.#y1 = undefined;
    }
  }
  
  draw() {
    let table = document.getElementsByTagName("table")[0];
    
    if (table !== undefined) {
      table.remove();
    }
    table = document.createElement("table");
    table.style.margin = "auto";
    table.style.borderCollapse = "collapse";
    table.style.background = "#222";
    
    for (let y = 0; y < this.#height; y++) {
      const row = document.createElement("tr");
      
      for (let x = 0; x < this.#width; x++) {
        const data = document.createElement("td");
        data.addEventListener("click", this.#click.bind(this, x, y));
        data.style.width = "64px";
        data.style.height = "64px";
        data.style.border = "1px solid black";
        
        if (this.#pieces[x][y] == -1) {
          const piece = document.createElement("div")
          piece.style.width = "32px";
          piece.style.height = "32px";
          piece.style.margin = "auto";
          piece.style.background = "#333";
          data.appendChild(piece);
        } else if (this.#pieces[x][y] == 1) {
          const piece = document.createElement("div")
          piece.style.width = "32px";
          piece.style.height = "32px";
          piece.style.margin = "auto";
          piece.style.background = "#777";
          data.appendChild(piece);
        }
        row.appendChild(data);
      }
      table.appendChild(row);
    }
    document.body.appendChild(table);
    document.body.style.background = "#111";
  }
}
