import { isNotEmpty, shell } from '.';

export const git = {
  async tags() {
    const { stdout } = await shell.run('git tag --list');
    return stdout
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => isNotEmpty(e));
  },
  async remoteTags() {
    const { stdout } = await shell.run('git ls-remote --tags origin');
    return stdout
      .split('\n')
      .map((e) => e.replace(/.*?refs\/tags\//g, '').trim())
      .filter((e) => isNotEmpty(e));
  },
  async lastCommit() {
    const { stdout } = await shell.run('git log -1');
    return stdout;
  },
};
