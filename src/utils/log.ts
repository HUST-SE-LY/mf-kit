import chalk from 'chalk';

export class Log {
  static info(content: string) {
    console.log(chalk.green(content));
  }

  static warning(content: string) {
    console.log(chalk.yellow(content));
  }

  static error(content: string) {
    console.log(chalk.red(content));
  }
}
