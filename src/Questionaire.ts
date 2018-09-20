export default interface Questionaire {
  readonly questions: string[];
  selectedQuestionIndex: number;
  answers: string[];
}
