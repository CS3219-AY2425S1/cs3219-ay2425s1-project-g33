import { Injectable } from '@nestjs/common';
import { ExecuteCodeDto } from './dto';
import { runCode } from './utils/code-runner.util';

// (Submit Operation)
// Collaboration service -> Receive code, language, input, timeout
// Collaboration service -> Retrieve list of inputs and expected outputs
// Code execution service -> Compile and run code, compare output with expected output
// Code execution service -> Return result to collaboration service
// Collaboration service -> Return result to user

// For demo purposes, all questions will have the same inputs and expected outputs
// These inputs and expected outputs will be based on the question Maximum Swap

// The expected format would be that they have to print the output
// We still have to inject the inputs and expected outputs into the code

@Injectable()
export class AppService {
  async runCode(payload: ExecuteCodeDto) {
    const { code, language, input, timeout } = payload;
    try {
      const result = await runCode(code, language, input || '', timeout || 5);
      return { status: 'ok', result };
    } catch (error) {
      return { status: 'error', result: error };
    }
  }
}
