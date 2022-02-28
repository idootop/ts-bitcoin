import * as fs from 'fs';
import * as path from 'path';
import { exit } from 'process';

export const printf = (message?: any, ...optionalParams: any[]) =>
  console.log(message, ...optionalParams);

export const exitApp = (code?: number | undefined): never => {
  exit(code);
};

/**
 * 项目根目录
 */
export const kRoot = process.cwd();

export const readString = (filePath: string): string => {
  return fs.readFileSync(filePath, 'utf8');
};

export const writeString = (filePath: string, content: string): void => {
  fs.writeFileSync(filePath, content, 'utf8');
};

export const isDir = (dir: string): boolean => {
  return existDir(dir);
};

export const existDir = (dir: string): boolean => {
  try {
    const stats = fs.statSync(dir);
    return stats.isDirectory();
  } catch (_) {
    return false;
  }
};

export const notExistDir = (dir: string): boolean => {
  return !existDir(dir);
};

export const existFile = (file: string): boolean => {
  try {
    fs.statSync(file);
    return true;
  } catch (_) {
    return false;
  }
};

export const notExistFile = (file: string): boolean => {
  return !existFile(file);
};

export const delFile = (file: string): boolean => {
  fs.unlinkSync(file);
  return notExistFile(file);
};

export const delDir = (dir: string): boolean => {
  fs.rmSync(dir, { recursive: true, force: true });
  return notExistDir(dir);
};

export const newDir = (dir: string): boolean => {
  fs.mkdir(
    dir,
    {
      recursive: true,
    },
    () => {},
  );
  return existDir(dir);
};

/**
 * 列举路径下的文件/夹（返回相对路径）
 */
export const listDir = (dir: string): string[] => {
  try {
    return fs.readdirSync(dir);
  } catch (_) {
    return [];
  }
};

export const joinPath = (...paths: string[]) => path.join(...paths);

export const renameFile = (from: string, to: string): boolean => {
  fs.rename(from, to, () => {});
  return notExistFile(from) && existFile(to);
};

export const moveFile = (from: string, to: string): Promise<boolean> => {
  const [_file, ...dirs] = to.split('/').reverse();
  const dir = dirs.reverse().join('/');
  if (!existDir(dir)) {
    // 目标路径不存在，先创建路径
    newDir(dir);
  }
  return new Promise((resolve) => {
    fs.rename(from, to, (err) => {
      resolve(err ? false : true);
    });
  });
};

export const copyFile = (from: string, to: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.copyFile(from, to, (err) => {
      resolve(err ? false : true);
    });
  });
};
