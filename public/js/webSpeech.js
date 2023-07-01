var SpeechRecognizer, TTS,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };


/*
	Speech Synthesis (TTS) wrapper class
*/

TTS = (function() {
  function TTS(options) {
    this.options = _.defaults(options || {}, {
      language: 'en',
      rate: 1.0,
      volume: 1.0,
      pitch: 1.0
    });
    try {
      this.ss = new SpeechSynthesisUtterance;
    } catch (_error) {
      console.log(_error);
      throw new Error('This browser does not have support for webspeech api');
    }
    this.ss.onstart = function(event) {
      console.log("Speech started.");
    }
    this.ss.onend = function(event) {
      console.log("Speech finished.");
    };
  }

  TTS.prototype.speak = function(obj) { console.log(obj)
    speechSynthesis.cancel();
    if (typeof obj === 'string') {
      this.ss.lang = obj.language || this.options.language;
      this.ss.rate = obj.rate || this.options.rate;
      this.ss.volume = obj.volume || this.options.volume;
      this.ss.pitch = obj.pitch || this.options.pitch;
      this.ss.text = obj; console.log('text added')
    } else {
      this.ss.lang = obj.language || this.options.language;
      this.ss.rate = obj.rate || this.options.rate;
      this.ss.volume = obj.volume || this.options.volume;
      this.ss.pitch = obj.pitch || this.options.pitch;
      this.ss.text = obj.text;
    }
    try {
        console.log(this.ss);
        speechSynthesis.speak(this.ss);
    } catch (_error) {
        console.log(_error);
    }
  };

  TTS.prototype.cancel = function() {
    return speechSynthesis.cancel();
  };

  TTS.prototype.pause = function() {
    return speechSynthesis.pause();
  };

  TTS.prototype.resume = function() {
    return speechSynthesis.resume();
  };

  return TTS;

})();


/*
	Speech Recognizer wrapper class
*/

SpeechRecognizer = (function() {
  function SpeechRecognizer(options) {
    this.once = bind(this.once, this);
    this.off = bind(this.off, this);
    this.on = bind(this.on, this);
    var SR, ex;
    this.options = _.defaults(options || {}, {
      language: 'en-IN',
      continuous: false,
      maxAlternatives: 1,
      interimResults: false,
    });
    this.emitter = new EventEmitter();
    try {
      SR = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
      this.listener = new SR();
      this.listener.lang = this.options.language;
      this.listener.maxAlternatives = this.options.maxAlternatives;
      this.listener.continuous = this.options.continuous;
      this.listener.interimResults = this.options.interimResults;
      console.log(this.listener);
    } catch (_error) {
      ex = _error;
      throw new Error('This browser does not have support for webspeech api');
    }
    this.listener.onresult = (function(_this) {
      return function(event) {
        var result;
        _this.emitter.emit("result", event);
        if (event.results.length > 0) {
          result = event.results[event.results.length - 1];
          if (result.isFinal) {
            _this.emitter.emit("bestResult", result[0].transcript);
          }
        }
      };
    })(this);
    this.listener.onerror = (function(_this) {
      return function(event) {
        _this.emitter.emit("error", event);
      };
    })(this);
    this.listener.onnomatch = (function(_this) {
      return function(event) {
        _this.emitter.emit("nomatch", event);
      };
    })(this);
    this.listener.onsoundstart = (function(_this) {
      return function(event) {
        _this.emitter.emit("soundStart", event);
      };
    })(this);
    this.listener.onspeechstart = (function(_this) {
      return function(event) {
        _this.emitter.emit("speechStart", event);
      };
    })(this);
    this.listener.onspeechstop = (function(_this) {
      return function(event) {
        _this.emitter.emit("speechStop", event);
      };
    })(this);
    this.listener.onsoundend = (function(_this) {
      return function(event) {
        _this.emitter.emit("soundEnd", event);
      };
    })(this);
  }

  SpeechRecognizer.prototype.on = function(event, cb) {
    return this.emitter.on(event, cb);
  };

  SpeechRecognizer.prototype.off = function(event, cb) {
    return this.emitter.off(event, cb);
  };

  SpeechRecognizer.prototype.once = function(event, cb) {
    return this.emitter.once(event, cb);
  };

  SpeechRecognizer.prototype.listen = function() {
    this.listener.start();
    this.emitter.emit("listen");
  };

  SpeechRecognizer.prototype.stop = function() {
    this.listener.stop();
    this.emitter.emit("stop");
  };

  return SpeechRecognizer;

})();


/*
    INIT
*/
var listener = new SpeechRecognizer({
    language: 'en-IN',
    continuous: true
});

var tts =  new TTS();

/*
    EVENTS
*/
listener.on('bestResult', async function(text) {
    console.log("User: " + text);

    //requiest GPT for response
    const response = await fetch('/api/v1/gpt', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({prompt: text})
    })

    const answer = await response.json();

    if(response.ok) {
        console.log(`Assistant: ${answer.content}`);
        tts.speak(answer.content);
    }
    else
        tts.speak('I could not connect to the server');
});

listener.on('listen', function(event) {
    console.log("Listening...");
});

listener.on('error', function(event) {
    console.error(event);
});

listener.on('soundEnd', function(event) {
    console.log("Listen finished");
    tts.speak('I will stop listenning now.')
});

