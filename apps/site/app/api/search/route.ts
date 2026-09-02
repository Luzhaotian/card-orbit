import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  // 中文内容用 multilingual 分词；Orama 暂无独立 chinese locale
  language: 'multilingual',
});
