import { exec as execSync, spawn } from 'child_process';
import { promisify } from 'util';

import { isNotEmpty } from '.';

const exec = promisify(execSync);

class Shell {
  async run(command: string) {
    return exec(command);
  }
  get args() {
    return process.argv.slice(2);
  }
  async runs(commands: string[]) {
    for (const command of commands) {
      await this.run(command);
    }
  }
  async chain(commands: string[]) {
    for (const command of commands) {
      const { stderr } = await this.run(command);
      if (stderr) return false;
    }
    return true;
  }
}

export const shell = new Shell();

const printOutputs = (leading: string, data: any, tag: string, showTag: boolean) => {
  const datas = `${data}`.split('\n').filter((e) => isNotEmpty(e.trim()));
  datas.forEach((e) => {
    console.log(!showTag ? e : `${leading} ${tag ? tag + ' | ' : ''}${e}`);
  });
};

const id = 1;
export async function runShell(
  command: string,
  p?: {
    realtime?: boolean;
    tag?: string;
    showTag?: boolean;
  },
): Promise<boolean> {
  const { realtime = true, tag = `spawn-${id}`, showTag = true } = p ?? {};
  if (
    !realtime ||
    command.includes('&') ||
    command.includes('|') ||
    command.includes('"') ||
    command.includes("'")
  ) {
    const { stdout, stderr } = await shell.run(command).catch((err) => {
      return { stdout: '', stderr: err };
    });
    printOutputs('🟩', stdout, tag, showTag);
    printOutputs('🟥', stderr, tag, showTag);
    return !stderr;
  }
  return new Promise<boolean>((resolve) => {
    const commands = command.split(' ').filter((e) => isNotEmpty(e));
    const bin = commands[0];
    const [_, ...args] = commands;
    const ls = spawn(bin, args);
    const errors: any[] = [];
    ls.stdout.on('data', (data) => {
      printOutputs('🟩', data, tag, showTag);
    });
    ls.stderr.on('data', (data) => {
      errors.push(data);
      printOutputs('🟥', data, tag, showTag);
    });
    ls.on('close', () => {
      resolve(errors.length < 1);
    });
  }).catch(() => false);
}
