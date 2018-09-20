import * as React from 'react';
import './App.css';
import SpeechRecognitionService from './speechRecognitionService';
import SpeechProcessorService from './speechProcessorService';
import QuestionList from './QuestionList';
import Questionaire from './Questionaire';

interface State {
  recording: boolean;
  questionaire: Questionaire;
}

const questions = [
  'Please describe your role?',
  'What functions are you responsible for?',
  'Is that entire role?',
  'Is that everything?'
];

let answers: string[] = [];

class App extends React.Component<{} | undefined, State> {
  recognition: SpeechRecognitionService;
  processor: SpeechProcessorService;
  // input: HTMLInputElement | null;

  constructor(props?: {}) {
    super(props);
    this.state = {
      recording: false,
      questionaire: {
        questions: questions,
        answers: answers,
        selectedQuestionIndex: 0
      }
    };
    this.recognition = new SpeechRecognitionService();

    this.processor = new SpeechProcessorService(questions);
    this.processor.onSpeakEnd = this.onSpeakEnd;
  }

  onSpeakEnd = () => {
    if (!this.state.recording) {
      this.startRecording();
    }
  }

  startRecording = () => {
    this.recognition.onResult((result, isFinal) => {
      const index = this.state.questionaire.selectedQuestionIndex;
      const answer = answers[index];
      answers[index] = answer ? answer + ' ' + result : '' + result;

      let questionaire = this.state.questionaire;
      questionaire.answers = answers;
      this.setState({
        questionaire: questionaire
      });
    });
    this.recognition.onEnd(() => {
      this.setState({ recording: false });
    });
    this.recognition.start();
    this.setState({ recording: true });
  }

  stopRecording = () => {
    this.setState({ recording: false });
    this.recognition.stop();
  }

  toggleRecording = () => {
    this.state.recording ? this.stopRecording() : this.startRecording();
  }

  onClickQuestion = (index: number) => {
    this.stopRecording();
    this.processor.speakQuestions(index);
    let questionaire = this.state.questionaire;
    questionaire.selectedQuestionIndex = index;
    this.setState({ questionaire: questionaire });
  }

  render() {
    return (
      <div>
        <header className="App-header">Voice Interview Demo</header>
        <div className="App">
          <ul>
            <li>1. please turn on your speaker</li>
            <li>2. click question and wait for your speaking</li>
          </ul>
          {this.state.recording ? '[Please Speaking...]' : '[Please wait]'}
          <QuestionList
            questionaire={this.state.questionaire}
            onClickQuestion={this.onClickQuestion}
          />
        </div>
      </div>
    );
  }
}

export default App;
