<template>
  <div class="dashboard-container">
    <div class="count-container">
      <el-row :gutter="40" class="panel-group">
        <el-col class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-user">
              <i class="card-panel-icon el-icon-user-solid" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">121</div>
              <div class="card-panel-text">
                用户
              </div>
            </div>
          </div>
        </el-col>
        <el-col class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-video">
              <i class="card-panel-icon el-icon-video-camera-solid" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">122</div>
              <div class="card-panel-text">
                视频
              </div>
            </div>
          </div>
        </el-col>
        <el-col class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-video">
              <i class="card-panel-icon el-icon-tickets" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">23423</div>
              <div class="card-panel-text">
                文章
              </div>
            </div>
          </div>
        </el-col>
        <el-col class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-question">
              <i class="card-panel-icon el-icon-question" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">2323</div>
              <div class="card-panel-text">
                题目
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div id="line-container" class="line-container" />
    <div class="table-container">
      <el-row :gutter="32">
        <el-col :lg="8" :sm="24" :xs="24">
          <div class="bottom_itemBox">
            <div class="flex_bbox">
              <div class="rank_title">视频播放排行TOP10</div>
              <!--<select class="rank_select" name="select_type1">
                <option value="1">本月</option>
                <option value="0">全部</option>
              </select>-->
            </div>
            <table class="rank_tableBox">
              <thead>
                <tr>
                  <td style="width:15%;">排序</td>
                  <td style="width:65%;">姓名</td>
                  <td style="width:20%;text-align:right;">服务次数</td>
                </tr>
              </thead>
              <tbody id="select1_tbody1" class="select1_box">
                <tr>
                  <td style="color:#fd0e3b;">1</td>
                  <td class="rank_tbody_td">测试</td>
                  <td style="text-align:right;">232</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-col>
        <el-col :lg="8" :sm="24" :xs="24">
          <div class="bottom_itemBox">
            <div class="flex_bbox">
              <div class="rank_title">文章阅读排行TOP10</div>
              <!--<select class="rank_select" name="select_type1">
                <option value="1">本月</option>
                <option value="0">全部</option>
              </select>-->
            </div>
            <table class="rank_tableBox">
              <thead>
                <tr>
                  <td style="width:15%;">排序</td>
                  <td style="width:65%;">姓名</td>
                  <td style="width:20%;text-align:right;">服务次数</td>
                </tr>
              </thead>
              <tbody id="select1_tbody1" class="select1_box">
                <tr>
                  <td style="color:#fd0e3b;">1</td>
                  <td class="rank_tbody_td">测试</td>
                  <td style="text-align:right;">232</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-col>
        <el-col :lg="8" :sm="24" :xs="24">
          <div class="bottom_itemBox">
            <div class="flex_bbox">
              <div class="rank_title">题目解决排行TOP10</div>
              <!--<select class="rank_select" name="select_type1">
                <option value="1">本月</option>
                <option value="0">全部</option>
              </select>-->
            </div>
            <table class="rank_tableBox">
              <thead>
                <tr>
                  <td style="width:15%;">排序</td>
                  <td style="width:65%;">姓名</td>
                  <td style="width:20%;text-align:right;">服务次数</td>
                </tr>
              </thead>
              <tbody id="select1_tbody1" class="select1_box">
                <tr>
                  <td style="color:#fd0e3b;">1</td>
                  <td class="rank_tbody_td">测试</td>
                  <td style="text-align:right;">232</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfig } from '@/api/config'

import * as echarts from 'echarts/core'
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

export default {
  name: 'Dashboard',
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['评论', '点赞', '收藏', '用户数量', '用户反馈数量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '评论',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '点赞',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '收藏',
            type: 'line',
            stack: 'Total',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '用户数量',
            type: 'line',
            stack: 'Total',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '用户反馈数量',
            type: 'line',
            stack: 'Total',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      }
    }
  },
  mounted() {
    var chartDom = document.getElementById('line-container')
    var myChart = echarts.init(chartDom)

    myChart.setOption(this.option)
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // 获取小程序配置信息
    async getAppletConfig() {
      const res = await getConfig()
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }

  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
      width: 25%;
    }

    .card-panel {
      height: 108px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-question {
          background: #40c9c6;
        }

        .icon-user {
          background: #36a3f7;
        }

        .icon-video {
          background: #f4516c;
        }

        .icon-video {
          background: #34bfa3
        }
      }

      .icon-question {
        color: #40c9c6;
      }

      .icon-user {
        color: #36a3f7;
      }

      .icon-video {
        color: #f4516c;
      }

      .icon-article {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px 26px 26px 0;

        .card-panel-text {
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          line-height: 36px;
          margin-bottom: 12px;
          text-align: center;
        }

        .card-panel-num {
          font-size: 20px;

          text-align: center;
        }
      }
    }
  }

  .line-container{
    background: #fff;
    height: 600px;
    padding: 30px 10px;
    margin-bottom: 32px;
    border-radius: 20px;
  }

  .table-container {
    /* 底部三格列表 */
    .flex_bbox {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
    }

    .leftBottom_box.flex_bbox {
      align-items: flex-start;
    }

    .bottom_itemBox {
      min-height: 352px;
      background: #ffffff;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 30px;
      overflow: hidden;
    }

    .rank_title {
      color: #232323;
      font-size: 20px;
      font-weight: bold;
    }

    .rank_tableBox {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .rank_tableBox thead tr {
      font-size: 16px;
      color: #333333;
      border-bottom: 1px solid #F0F0F0;
      text-align: left;
      height: 58px;
    }

    .rank_tableBox tbody tr td {
      padding-top: 20px;
      font-size: 16px;
      color: #333333;
    }

    .rank_tableBox tbody tr td.rank_tbody_td {
      color: #999999;
      width: 65%;
      word-break: break-all;
    }
  }

}
</style>
