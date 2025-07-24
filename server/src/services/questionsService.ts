import Question from '../models/Question';
//import { randomUUID } from 'crypto';
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

export class QuestionsService {
  static async getRandomQuestion1() {
    const count = await Question.countDocuments();
    if (count === 0) return { question: 'No questions available.' };
    const random = Math.floor(Math.random() * count);
    const q = await Question.findOne().skip(random);
    return { question: q?.Question || 'No question found.' };
  }
  
  static async getRandomQuestion(): Promise<any> {
    try {
      const keyword = '';
      const url = `https://db.chgk.info/xml/random/limit1`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.statusText}`);
      }
      const xmlText = await response.text();
      const parser = new XMLParser();
      const parsedData = parser.parse(xmlText);
      const questionData = parsedData.search?.question;
      if (!questionData) {
        throw new Error('No question data found in the XML response');
      }
      console.log('questionData from external API:', questionData);
      return questionData;
    //   return {
    //     category: questionData.category || 'N/A',
    //     keyword: keyword,
    //     question: questionData.Question || 'N/A',
    //     answer: questionData.Answer || 'N/A',
    //     type: questionData.Type || 'N/A',
    //     difficulty: 'N/A',
    //     incorrectAnswers: [],
    //     authors: questionData.Authors || 'N/A',
    //     sources: questionData.Sources || 'N/A',
    //     comments: questionData.Comments || 'N/A',
    //     tournamentTitle: questionData.tournamentTitle || 'N/A',
    //     tourTitle: questionData.tourTitle || 'N/A',
    //     playedAt: questionData.tourPlayedAt || 'N/A'
    //   };
    } catch (error) {
      console.error('Error fetching question:', error);
      throw new Error('Failed to fetch question from the remote backend');
    }
  }
}
