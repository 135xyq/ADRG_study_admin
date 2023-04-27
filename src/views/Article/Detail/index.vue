<template>
  <div class="article-detail-contsiner">
    <h1 class="title">{{ article.title }}</h1>
    <div class="info">
      <div class="item">
        观看次数：{{ article.view_count }}
      </div>
      <div class="item" @click="onHandleGoToPage('StarList')">
        <el-link :style="{fontSize:'18px'}">收藏数：{{ article.star_count }}</el-link>
      </div>
      <div class="item" @click="onHandleGoToPage('LikeList')">
        <el-link :style="{fontSize:'18px'}">点赞数：{{ article.like_count }}</el-link>
      </div>
      <div class="item" @click="onHandleGoToPage('CommentList')">
        <el-link :style="{fontSize:'18px'}">评论数：{{ article.comment_count }}</el-link>
      </div>
    </div>
    <hr>
    <div class="content" v-html="articleContent" />
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

      console.log(this.article)
    },
    // 将markdown转为html
    mdToHtml() {
      // 实例化
      const md = new MarkdownIt()
      this.articleContent = md.render(this.article.content)
    },
    /**
     * 前往指定页
     * @param pageName
     */
    onHandleGoToPage(pageName) {
      this.$router.push({ name: pageName, params: { articleId: this.articleId }})
    }
  }
}
</script>

<style lang="scss" scoped>
.article-detail-contsiner {
  margin: 30px 20px;
  .title {
    text-align: center;
    margin-bottom: 30px;
  }

  .info {
    display: flex;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 20px;
    color: #606266;

    .item {
      margin: 0 10px;
    }
  }

  .description {
    padding: 5px 20px;
    color: #333;
  }

  .content{
    padding: 20px;
  }
}
</style>
