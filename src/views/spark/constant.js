export const MODEL_OPTIONS = [
  {
    value: 'gpt-4',
    label: 'GPT-4',
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'GPT-3.5 turbo',
  },
  {
    value: 'gpt-3.5-turbo-16k',
    label: 'GPT-3.5 turbo 16k',
  },
  {
    value: 'ERNIE_BOT',
    label: '文心一言恩尼',
  },
  {
    value: 'ERNIE_BOT_TURBO',
    label: '文心一言恩尼_涡轮版',
  },
  {
    value: 'BLOOMZ_7B',
    label: '文心一言布鲁姆斯',
  },
  {
    value: 'v1',
    label: '星火基础版',
  },
  {
    value: 'v2',
    label: '星火增强版',
  },
]

export const MODEL_TYPE = {
  'gpt-3.5-turbo-16k': 'GPT',
  'gpt-3.5-turbo': 'GPT',
  'gpt-4': 'GPT',
  ERNIE_BOT: 'WXYY',
  ERNIE_BOT_TURBO: 'WXYY',
  BLOOMZ_7B: 'WXYY',
  v1: 'KDXF',
  v2: 'KDXF',
}

export const MODEL_TIPS = {
  ERNIE_BOT: '百度文心恩尼模型提高了在自然语言理解任务上的性能和泛化能力。',
  ERNIE_BOT_TURBO: '百度文心恩尼_涡轮版模型覆盖海量中文数据，具有更强的对话问答、内容创作生成等能力。',
  BLOOMZ_7B: '百度文心布鲁姆斯大语言模型，能够以46种语言和13种编程语言输出文本。',
  'gpt-4':
    'ChatGPT-4是比GPT-3.5更先进的人工智能对话模型，拥有更大的规模、算力和资源消耗，能更逼真地模拟人类语言处理的能力。虽然回答较慢，但会为用户提供更为准确、深入的回答。',
  'gpt-3.5-turbo': 'ChatGPT-3.5 turbo是先进的对话人工智能模型，采用机器学习技术，能够以惊人的真实性和洞察力回答用户的查询。',
  'gpt-3.5-turbo-16k': 'ChatGPT-3.5 turbo 16K可以处理更大规模的语言数据，并提供更加广泛、准确的回答和建议，提供更出色的体验。',
  v1: '讯飞星火大语言模型v1懂你所言，答你所问，创你所需，解你所难，学你所教。',
  v2: '讯飞星火大语言模型v2拥有跨领域知识和语言理解能力，能够基于自然对话方式理解与执行任务。',
}

export const LIKE_STATUS = {
  YES: 1,
  NO: 0,
}
