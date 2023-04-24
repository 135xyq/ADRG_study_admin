<template>
  <div v-loading="loading" class="detail-container">
    <div v-if="recordInfo.questionCategory" class="title-container">
      <div class="title">{{ recordInfo.questionCategory.title }}-专项练习</div>
      <div class="detail">
        <div class="status item">
          试卷状态：
          <el-tag v-if="recordInfo.is_submit === 1" type="success">已完成</el-tag>
          <el-tag v-if="recordInfo.is_submit === 0" type="danger">未完成</el-tag>
        </div>
        <div class="create-time item">
          用户：{{ recordInfo.user.nick_name }}
        </div>
        <div class="create-time item">
          出卷时间：{{ recordInfo.create_time }}
        </div>
        <div v-if="recordInfo.is_submit" class="submit-time item">
          交卷时间：{{ recordInfo.update_time }}
        </div>
        <div v-if="recordInfo.is_submit" class="submit-time item">
          答题时长：{{ formateDate(recordInfo.total_time) }}
        </div>
        <div class="total-count item">
          总题数：{{ total }}
        </div>
        <div v-if="recordInfo.is_submit" class="error-count item">
          错题数：{{ errorCount }}
        </div>
        <div v-if="recordInfo.is_submit" class="right-count item">
          对题数：{{ rightCount }}
        </div>
      </div>
    </div>
    <div class="question-container">
      <div v-for="(item,index) in questionList" :key="item.id" class="question">
        <div class="title">{{ index + 1 }}. {{ item.question.title }}</div>
        <div v-if="item.question.type <= 1" class="has-option">
          <div class="options">
            <div
              v-for="(value, key) in item.question.options"
              :key="key"
              :class="{right: item.question.answer.indexOf(key) !== -1,error:(recordInfo.is_submit === 1 && item.is_current === 0 && item.answer.indexOf(key) !==-1)}"
              class="option"
            >{{ key }}. {{ value }}
            </div>
          </div>
          <div class="answer">
            <div class="right-answer">
              <div class="answer-title">正确答案:</div>
              <div class="answer-content">{{ item.question.answer.join('') }}</div>
            </div>
            <div
              v-if="recordInfo.is_submit === 1"
              :class="{right:item.is_current === 1,error:item.is_current === 0}"
              class="user-answer"
            >
              <div class="answer-title">用户答案:</div>
              <div class="answer-content">{{ item.answer.join('') }}</div>
            </div>
          </div>
        </div>
        <div v-if="item.question.type > 1" class="no-option">
          <div class="right-answer">
            <div class="answer-title">正确答案:</div>
            <div class="answer-content">{{ item.question.answer.join('') }}</div>
          </div>
          <div
            v-if="recordInfo.is_submit === 1"
            :class="{right:item.is_current === 1,error:item.is_current === 0}"
            class="user-answer"
          >
            <div class="answer-title">用户答案</div>
            <div class="answer-content">{{ item.answer.join('') ? item.answer.join('') : '未作答' }}</div>
          </div>
        </div>
        <div v-if="recordInfo.is_submit === 1" class="result">
          <div class="result-title">判题结果:</div>
          <div v-if="item.is_current === 1" class="result-content right"><i class="el-icon-check" /></div>
          <div v-if="item.is_current === 0" class="result-content error"><i class="el-icon-close" /></div>
          <div class="result-probability">与答案相似度: {{ (item.current_probability * 100).toFixed(2) }}%</div>
          <div class="people-validate">
            <el-radio v-model="validate[index].is_current" :label="0">错误</el-radio>
            <el-radio v-model="validate[index].is_current" :label="1">正确</el-radio>
          </div>
        </div>
        <div class="parse">
          <div class="parse-title">解析</div>
          <div class="parse-content">{{ item.question.parse ? item.question.parse : '暂无解析' }}</div>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button size="medium" @click="onHandleCancel">取消</el-button>
      <el-button :loading="submitLoading" type="primary" size="medium" @click="onHandleSubmit">阅卷</el-button>
    </div>
  </div>
</template>

<script>
// 人工阅卷

import { getRecordQuestionDetail } from '@/api/questionRecord'
import { formateDate } from '@/utils/formate'

export default {
  name: 'PeopleValidate',
  data() {
    return {
      recordId: '', // 记录的id
      recordInfo: {}, // 记录信息
      total: 0, // 题目数量
      loading: false,
      errorCount: 0,
      rightCount: 0,
      submitLoading: false,
      validate: [], // 判题的列表
      questionList: [] // 题目列表
    }
  },
  created() {
    // id不存在则返回
    if (!this.$route.query.id) {
      this.$router.push({ name: 'QuestionRecord' })
    } else {
      this.recordId = this.$route.query.id

      this.getRecordDetail()
    }
  },
  methods: {
    formateDate,
    /**
     * 获取记录详情
     */
    getRecordDetail() {
      this.loading = true

      getRecordQuestionDetail({ record: this.recordId }).then(res => {
        this.total = res.data.total
        this.recordInfo = res.data.record
        this.questionList = res.data.data

        // 用户未提交的试卷，不能判卷
        if (this.recordInfo.is_submit !== 1) {
          this.$router.push({ name: 'QuestionRecord' })
        }

        // 统计错题数和对题数、初始化化判题
        this.questionList.forEach(item => {
          if (item.is_current === 1) {
            this.rightCount++
          } else {
            this.errorCount++
          }

          // 初始化判题结果
          const temp = {
            id: item.id,
            is_current: item.is_current
          }

          this.validate.push(temp)
        })

        this.loading = false
      }).catch(res => {
        this.$router.push({ name: 'QuestionRecord' })

        this.loading = false
      })
    },
    /**
     * 阅卷
     */
    onHandleSubmit() {
      this.submitLoading = true
      console.log(this.validate, this.tempValidate)
    },
    /**
     * 取消阅卷
     */
    onHandleCancel() {
      this.$router.push({ name: 'QuestionRecord' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./peopleValidate.scss";
</style>
