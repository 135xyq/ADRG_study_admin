<template>
  <div class="article-detail-contsiner">
    <h1>{{ article.title }}</h1>
    <hr>
    <div v-html="articleContent" />
  </div>
</template>

<script>
// 文章详情

const MarkdownIt = require('markdown-it')

import { articleDetail } from '@/api/article'

export default {
  name: 'Detail',
  data() {
    return {
      articleId: '', // 文章id
      article: {}, // 文章详情
      articleContent: '' // 文章内容
    }
  },
  async created() {
    if (JSON.stringify(this.$route.params) !== '{}') {
      this.articleId = this.$route.params.id
    }
    // 文章id为空则调回文章列表
    if (this.articleId === '') {
      this.$router.push({ name: 'ArticleList' })
    } else {
      await this.getArticleDetail()
      this.mdToHtml()
    }
  },
  methods: {
    /**
     * 获取文章详情
     * @returns {Promise<void>}
     */
    async getArticleDetail() {
      const res = await articleDetail({ id: this.articleId })
      this.article = res.data

      // console.log(this.article)
    },
    // 将markdown转为html
    mdToHtml() {
      // 实例化
      const md = new MarkdownIt()
      this.articleContent = md.render(this.article.content)
    }
  }
}
</script>

<style lang="scss" scoped>
.article-detail-contsiner {
  margin: 30px 20px;
}
</style>
