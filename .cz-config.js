const types = [
  {
    value: ':bug: fix',
    name: 'ð fix: ä¿®å¤',
  },
  {
    value: ':bulb: opt',
    name: 'ð¡ opt: ä¼å',
  },
  {
    value: ':sparkles: feat',
    name: 'â¨ feat: åè½',
  },
  {
    value: ':construction: todo',
    name: 'ð§ todo: å¾å',
  },
  {
    value: ':package: deps',
    name: 'ð¦ deps: ä¾èµ',
  },
  {
    value: ':white_check_mark: test',
    name: 'â test: æµè¯',
  },
  {
    value: ':memo: docs',
    name: 'ð docs: ææ¡£',
  },
  {
    value: ':technologist: blog',
    name: 'ð» blog: åå®¢',
  },
  {
    value: ':dizzy: other',
    name: 'ð« other: å¶ä»',
  },
  {
    value: ':tada: release',
    name: 'ð release: åå¸',
  },
];

module.exports = {
  types: types,
  messages: {
    type: 'æäº¤ç±»å(å¿å¡«)',
    scope: 'æ¶åæ¨¡å(å¯é)',
    subject: 'æäº¤åå®¹(å¿å¡«)',
    body: 'è¯¦ç»æè¿°(å¯é)',
    breaking: 'Breaking changes(å¯é)',
    footer: 'ç¸å³ççissue(å¯é)',
    confirmCommit: 'ç¡®å®æäº¤ä»¥ä¸åå®¹ï¼',
  },
  allowBreakingChanges: [
    //
    ':sparkles: feat',
    ':bulb: opt',
    ':bug: fix',
  ],
  skipQuestions: ['scope', 'footer'],
};
