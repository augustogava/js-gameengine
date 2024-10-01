class Debugger {
    constructor() {
        // this.debugDiv = document.getElementById("debugArea");
        this.htmlBuilder();

        if (Globals.isDebug()) {
            this.debugDiv.style.display = 'block';
        } else {
            this.debugDiv.style.display = 'none';
        }

        this.PROJECTION_STEP = 3;
        this.IGNORE_THRESHOLD = 0;
        this.MAX_LOGS = 1000;
        this.STEP = .1;

        this.history = [];
        this.historyLog = [];

        this.currentTime = Date.now();
    }

    htmlBuilder() {
        this.debugDiv = document.getElementById("debugArea");
        
        if (!this.debugDiv) {
          this.debugDiv = document.createElement("canvas");
          this.debugDiv.id = "debugArea";
    
          const canvas = document.querySelector('canvas');
          if (canvas) {
            canvas.insertAdjacentElement('afterend', this.debugDiv);
          } else {
            document.body.appendChild(this.debugDiv);
          }
        }
      }

    getLastLog(id) {
        return this.historyLog.find(l => l.id === id);
    }

    updateLastHistory(log) {
        const existingIndex = this.historyLog.findIndex(element => element.id === log.id);
        if (existingIndex >= 0) {
            this.historyLog[existingIndex] = log;
        } else {
            this.historyLog.push(log);
        }
    }

    verifyNoChanges(v) {
        const oldLog = this.getLastLog(v.id);
        if (!oldLog) {
            return false;
        }

        if (v.x && oldLog.x) {
            const diff = Math.abs(v.x.toFixed(2) - oldLog.x.toFixed(2)) - this.IGNORE_THRESHOLD;
            if (diff <= 0) return true;
        }

        return false;
    }

    log(log) {
        const timeDifference = Date.now() - this.currentTime;
        if (this.verifyNoChanges(log) || timeDifference <= (this.STEP * 1000)) {
            this.updateLastHistory(log);
            return;
        }
        this.currentTime = Date.now();
        this.updateLastHistory(log);

        let text = `${log.timestamp}: `;
        if (log.type === "rectangle") {
            text += `Rectangle - x: ${log.x}, y: ${log.y}, width: ${log.width}, height: ${log.height}`;
        } else if (log.type === "circle") {
            text += `Ball - x: ${log.x}, y: ${log.y}, radius: ${log.radius}`;
        } else if (log.type === "SAT") {
            text += `SAT - response: ${JSON.stringify(log.response)}`;
        }

        this.history.push({ raw: log, text: text });

        if (this.history.length > this.MAX_LOGS) {
            this.history.shift();
        }
    }

    update() {
        if (!Globals.isDebug()) {
            return;
        }

        while (this.history.length > this.MAX_LOGS) {
            this.history.shift();
        }

        this.debugDiv.innerHTML = this.history.map(x => x.text).join('<br>');
        this.debugDiv.scrollTop = this.debugDiv.scrollHeight;
    }
}
