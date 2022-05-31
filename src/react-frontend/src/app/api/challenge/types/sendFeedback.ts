import { Feedback } from 'app/types/models/challenge/feedback';

export type SendFeedbackWithParameters = {
  challengeId?: string;
  feedback?: Feedback[];
};