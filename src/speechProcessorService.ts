enum States {
  LISTENING,
  ADDING
}

export default class SpeechProcessorService {
  // addTodoHandler: (transcript: string) => Todo[];
  // toggleTodoHandler: (todo: Todo) => Todo[];
  state: States;
  speaker: SpeechSynthesisUtterance;
  speaking: boolean;
  onSpeakEnd: () => void;

  constructor(public questions: string[]) {
    this.state = States.LISTENING;
    this.speaker = new SpeechSynthesisUtterance();
    this.speaker.lang = 'en-US';
  }

  speakQuestions(index: number) {
    this.speaker.text = this.questions[index];
    this.speaker.onend = () => {
      this.onSpeakEnd();
    };
    speechSynthesis.speak(this.speaker);
  }

  process(transcript: string) {
    if (this.state === States.LISTENING) {
      this.processListening(transcript);
    } else if (this.state === States.ADDING) {
      this.processAdding(transcript);
    }
  }

  processListening(transcript: string) {
    if (
      (transcript.includes('new') || transcript.includes('another')) &&
      transcript.includes('task')
    ) {
      this.state = States.ADDING;
      this.speaker.text = 'Adding a new task';
      speechSynthesis.speak(this.speaker);
    } else if (
      (transcript.includes('complete') || transcript.includes('toggle')) &&
      transcript.includes('task')
    ) {
      this.processToggling(transcript);
    } else {
      this.state = States.LISTENING;
    }
  }

  processAdding(transcript: string) {
    // this.todos = this.addTodoHandler(transcript);
    this.state = States.LISTENING;
  }

  processToggling(transcript: string) {
    const index = this.mapNumber(transcript);
    if (index === -1) {
      return;
    }
    // const todo = this.todos[index];
    this.speaker.text = `Task number ${index + 1} was toggled`;
    speechSynthesis.speak(this.speaker);
    // this.todos = this.toggleTodoHandler(todo);
  }

  private mapNumber(transcript: string) {
    const numbers = [
      ['one', 'first', '1'],
      ['two', 'second', '2'],
      ['three', 'third', '3'],
      ['fourth', '4'],
      ['five', 'fifth', '5']
    ];
    return numbers.findIndex(numberSynonyms =>
      numberSynonyms.some(synonym => transcript.includes(synonym))
    );
  }
}
