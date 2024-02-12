export class SusJS {
    constructor(publicKey) {
        this.publicKey = publicKey;
    }

    static load() {
        return Promise.resolve(new SusJS(this.publicKey));
    }

    get() {
        return new Promise((resolve, reject) => {
            try {
                var data = this.collectData();
                this.sendDataToServer(data)
                    .then(response => resolve(response))
                    .catch(e => reject(e));
            } catch (e) {
                reject(e);
            }
        });
    }

    collectData() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenWidth: screen.width,
            screenHeight: screen.height,
            timezoneOffset: new Date().getTimezoneOffset(),
            sessionStorage: this.checkSessionStorage(),
            localStorage: this.checkLocalStorage(),
            indexedDB: this.checkIndexedDB(),
            browserPlugins: this.getBrowserPlugins(),
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency, 
            touchSupport: this.getTouchSupport()
        };
    }


    getBrowserPlugins () {

        return Array.from(navigator.plugins).map(plugin => plugin.name);

    };
    
    getTouchSupport () {

        var touchPoints = navigator.maxTouchPoints || 0;
        var touchEvent = 'ontouchstart' in window;
        var touchStart = 'ontouchstart' in document.documentElement;
        return {
            touchPoints: touchPoints,
            touchEvent: touchEvent,
            touchStart: touchStart
        };
    };

    sendDataToServer(data) {
        return fetch('http://127.0.0.1:5000/v1/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.publicKey}`
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json());
    }


    checkSessionStorage () {
        try {
            return !!window.sessionStorage;
        } catch (e) {
            return false;
        }
    };

    checkLocalStorage () {
        try {
            return !!window.localStorage;
        } catch (e) {
            return false;
        }
    };

    checkIndexedDB () {
        try {
            return !!window.indexedDB;
        } catch (e) {
            return false;
        }
    };

    getCanvasFingerprint () {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 2000;
        canvas.height = 200;
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('https://example.com', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('https://example.com', 4, 17);
    

        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.lineTo(50, 100);
        ctx.lineTo(200, 100);
        ctx.stroke();
    

        var data = canvas.toDataURL();
        return data;
    };

}

export default SusJS;
