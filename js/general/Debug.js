class Debugger {
    constructor() {
        this.debugDiv = document.getElementById("debug");

        if (Globals.isDebug()) {
            this.debugDiv.style.display = 'block';
        }

        this.PROJECTION_STEP = 3;

        this.IGNORE_THRESHOLD = 0
        this.MAX_LOGS = 1000;
        this.STEP = .1;

        this.history = [];
        this.historyLog = [];

        var currentTime = Date.now();
    }

    getLastLog(id){
        if( !id ){
            return false
        }

        let lastLog;
        this.historyLog.forEach((l, index) => {
            if(l.id === id) {
                lastLog = l;
            }
        });

        return lastLog;
    }

    updateLastHistory(log){
        let updated = false; 
        this.historyLog.forEach((element, index) => {
            if(element.id === log.id) {
                this.historyLog[index] = log;
                updated = true;
            }
        });

        if( !updated ){
            this.historyLog.push(log);
        }
    }

    verifyNoChanges(v){
        const oldLog = this.getLastLog(v.id);
        if( !oldLog ){
            return false;
        }

        if( v.x && oldLog.x  ){
            let diff =  v.x.toFixed(2) - oldLog.x.toFixed(2);
            diff = Math.abs( diff  ) - this.IGNORE_THRESHOLD;
            if( diff <= 0 )
                return true;            
        }

        return false;
    }

    log(log) {      
        var timeDifference = Date.now() - this.currentTime;
        if ( this.verifyNoChanges(log) || ((Date.now() - this.currentTime) <= (this.STEP * 1000)) ) {
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

        this.history.push({ raw: log, text: text} );

        if (this.history.length > this.MAX_LOGS) {
            this.history.shift();
        }
    }

    update() {
        if (!Globals.isDebug()) {
            return ;
        }
        while (this.history.length > 0 && this.history.length > this.MAX_LOGS) {
            this.history.shift();
        }

        this.debugDiv.innerHTML = this.history.map(x => x.text).join('<br>');

        this.debugDiv.scrollTop = this.debugDiv.scrollHeight;
    }

    draw() {
        // this.debugDiv.innerHTML = "";
        // for (let i = this.history.length - 1; i >= 0; i--) {
        //     this.debugDiv.innerHTML += `${this.history[i].output}<br>`;
        // }
    }
}