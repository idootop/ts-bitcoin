import * as path from 'path';

import { exitApp, runShell } from '../utils';
import { git } from '../utils/git';

const root = path.resolve();

async function main(): Promise<void> {
  const configPath = root + '/.changelogrc.js';
  const updateChangelog = `npx conventional-changelog-cli -p ${configPath} -i CHANGELOG.md -s -r 0`;
  let flag = await runShell(updateChangelog, {
    showTag: false,
  });
  if (flag) {
    console.log('✅ changelog 生成成功！');
  } else {
    console.log('❌ changelog 生成失败！');
    exitApp();
  }
  await runShell('git add CHANGELOG.md', {
    showTag: false,
  });
  await runShell('git commit -m "💫 other: 更新changelog"', {
    showTag: false,
  });
  const lastCommit = await git.lastCommit();
  flag = lastCommit.includes('💫 other: 更新changelog');
  if (flag) {
    console.log('✅ changelog 提交成功！');
    // 推送提交
    const pushed = await runShell(`git push`, {
      showTag: false,
    });
    if (pushed) {
      console.log('✅ git push CHANGELOG.md 完毕！');
    }
  } else {
    console.log('✅ changelog 为空，提交失败！');
  }
}

main();
