import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { config } from './configs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AppService } from './app.service';
import { CodeReviewResult } from './interfaces/code-review-result.interface';

@Injectable()
export class CodeReviewService {
  private openaiClient: OpenAI;

  constructor(
    @Inject('QUESTION_SERVICE') private readonly questionClient: ClientProxy,
    private readonly appService: AppService,
  ) {
    this.openaiClient = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  private async getQuestionDetails(questionId: string) {
    return firstValueFrom(
      this.questionClient.send(
        { cmd: 'get-question-by-id' },
        { id: questionId },
      ),
    );
  }

  async reviewCode(sessionId: string, code: string): Promise<CodeReviewResult> {
    const session = await this.appService.getSessionDetails(sessionId);
    const questionId = session.questionId;

    const question = await this.getQuestionDetails(questionId);

    if (!question) {
      throw new RpcException('Unable to retrieve code review');
    }
    // Alternatively for structured output, can consider using langchain
    // In general, LLMs are very sensitive to spacing in inputs as they are formatted as \n and will literally take the input as is. Thus, it is important to ensure that the input is formatted correctly.
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [
        {
          role: 'system',
          content: `
You are an expert AI code reviewer. Carefully analyze the provided code and respond in the following structured format. Follow the format and content guidelines for each section strictly.

### Body
Provide a comprehensive overview of the code's strengths and weaknesses, followed by specific, actionable recommendations. Focus on readability, performance, maintainability, and adherence to best practices. This section should contain **only explanations** with **no code snippets** or inline code examples. This section should be formatted properly in Markdown for readability.

### Code Suggestions
Provide a single, complete code block that incorporates all recommended changes from the Body section. Do not include any additional text, explanations, or comments—**only the revised code**. Be sure to use the same programming language as in the specified code. Use the following Markdown format:
\`\`\`
// Complete, revised code here
\`\`\`

Respond with these exact headings and structure. The Body section should contain only explanations, while the Code Suggestions section should contain one cohesive code block that includes all recommendations.
  `
        },
        {
          role: 'system',
          content: `The question title is: "${question.title}". The question description in markdown format is as such "${question.description}". Take this into account while reviewing the code.`,
        },
        {
          role: 'user',
          content: `Here is the code for review:\n${code}`,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 500,
    };
    const response = await this.openaiClient.chat.completions.create(params);

    const content = response.choices[0].message.content;

    const bodyMatch = content.match(/### Body\s+([\s\S]*?)(?=###|$)/);
    const codeSuggestionMatch = content.match(
      /### Code Suggestions\s+([\s\S]*?)(?=###|$)/,
    );

    return {
      body: bodyMatch ? bodyMatch[1].trim() : '',
      codeSuggestion: codeSuggestionMatch ? codeSuggestionMatch[1].trim() : '',
    };
  }
}
