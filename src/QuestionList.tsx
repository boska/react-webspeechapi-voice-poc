import * as React from 'react';
import Questionaire from './Questionaire';

interface Props {
  questionaire: Questionaire;
  onClickQuestion: (index: number) => void;
  // onToggle: (question: string) => void;
}

const style = {
  backgroundColor: 'yellow'
};
export default class QuestionList extends React.Component<Props> {
  handleClick = () => {
    //
  }
  render() {
    const { questions, answers } = this.props.questionaire;
    return (
      <div>
        <ul>
          {questions!.map((question, index) => {
            return (
              <li key={question}>
                <a
                  href="#"
                  style={{
                    textDecoration:
                      this.props.questionaire.selectedQuestionIndex === index
                        ? 'underline'
                        : 'none'
                  }}
                  onClick={() => {
                    this.props.onClickQuestion(index);
                  }}
                >
                  {question}
                </a>
                <div>
                  <span style={style}>
                    {answers[index] ? answers[index] : ''}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
