<template>
  <div class="fj-content_view Exam-Fraction">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <p class="title">试卷标题</p>
        </div>
        <div class="fj-block-body">
          <!-- 表单输入区域 -->
          <div class="Exam-Fraction-form-area">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="考试人员">
                    <p>{{ruleForm.data.userName}}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="考试时长">
                    <p>{{ruleForm.data.useTime}}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="正确">
                    <p>{{ruleForm.data.userName}}</p>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="考试得分">
                    <p>{{ruleForm.data.score}}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="考试日期">
                    <p>{{ruleForm.data.time |date}}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="错误">
                    <p>{{ruleForm.data.wrongNumber}}</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="fj-block-foot">
          <div class="fj-block-head kaohe">
            <p class="title">
              <span>试卷内容</span>
            </p>
          </div>
          <div class="foot-body">
            <el-container>
              <el-main class="aside-left">
                <div class="body">
                  <div class="check-topic" v-for="(item, index) in ruleForm.list" :key="index">
                    <div class="topic">
                      {{index+1}}.
                      <span>{{item.question}}</span>
                    </div>
                    <ul>
                      <li>
                        <i
                          :class="(item.rightOptions.indexOf('0')!=-1)?'el-icon-success':(item.myChoice.indexOf('0')!=-1)?'el-icon-error':'el-icon-info'"
                        ></i>A:
                        <span>{{item.A}}</span>
                      </li>
                      <li>
                        <i
                          :class="(item.rightOptions.indexOf('1')!=-1)?'el-icon-success':(item.myChoice.indexOf('1')!=-1)?'el-icon-error':'el-icon-info'"
                        ></i>B:
                        <span>{{item.B}}</span>
                      </li>
                      <li>
                        <i
                          :class="(item.rightOptions.indexOf('2')!=-1)?'el-icon-success':(item.myChoice.indexOf('2')!=-1)?'el-icon-error':'el-icon-info'"
                        ></i>C:
                        <span>{{item.C}}</span>
                      </li>
                      <li>
                        <i
                          :class="(item.rightOptions.indexOf('3')!=-1)?'el-icon-success':(item.myChoice.indexOf('3')!=-1)?'el-icon-error':'el-icon-info'"
                        ></i>D:
                        <span>{{item.D}}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-main>
            </el-container>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "fjSpecial-Exam-Fraction",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "教培管理", path: "" },
        { name: "专题考试", path: "" }
      ],
      userInfo: {},
      ruleForm: {
        data: {
          title: "",
          id: "",
          instime: "",
          paperId: "",
          rightNumber: "",
          score: "",
          time: "",
          updtime: "",
          useTime: "",
          userId: "",
          userName: "",
          wrongNumber: ""
        },
        list: [
          // {
          //   question: "题目1",
          //   A: "hahaA",
          //   B: "hahaB",
          //   C: "hahaC",
          //   D: "hahaD",
          //   myChoice: "3,2",
          //   rightOptions: "1"
          // }
        ]
      },
      rules: {}
    };
  },
  mounted() {
    this.setCreated();
    this.getDetailList();
  },
  methods: {
    // 获取题库详情
    getDetailList: function() {
      this.ruleForm.data.id = this.userInfo.id;
      if (!this.userInfo.id) {
        return false;
      }
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getExamResultInfo",
        type: "POST",
        data: {
          id: this.userInfo.id
        },
        dataType: "json",
        success: function(data) {
          vm.ruleForm.data = data.data;
          //处理数据便于展示
          for (let i = 0; i < data.list.length; i++) {
            let tm = {
              id: data.list[i].id,
              question: data.list[i].question,
              A: data.list[i].options.split("&GXCF&")[0],
              B: data.list[i].options.split("&GXCF&")[1],
              C: data.list[i].options.split("&GXCF&")[2],
              D: data.list[i].options.split("&GXCF&")[3],
              rightOptions: data.list[i].rightOptions,
              myChoice: data.list[i].myChoice
            };
            vm.ruleForm.list.unshift(tm);
          }
        },
        error: function(err) {}
      });
    },
    setCreated() {
      this.userInfo = this.$route.query;
    },
  },
  filters: {
    date: function(value) {
      //考试时间转换
      return value
        ? value.substr(0, 4) +
            "-" +
            value.substr(4, 2) +
            "-" +
            value.substr(6, 2) +
            " " +
            value.substr(8, 2) +
            ":" +
            value.substr(10, 2)
        : "";
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.Exam-Fraction {
  .foot-body {
    padding: 10px 0;
    .el-container {
      width: 100%;
      .aside-left {
        margin-left: 200px;
      }
      .el-main {
        .head {
          width: 100%;
          height: 40px;
          margin-top: -20px;
          padding-left: 16px;
          line-height: 40px;
          background: rgba(230, 247, 255, 1);
          border: 1px solid rgba(186, 231, 255, 1);
          opacity: 1;
        }
        .body {
          .check-topic {
            position: relative;
            .topic {
              margin: 15px 0;
            }
            li {
              margin: 18px 0;
              font-size: 14px;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.85);
              i {
                margin-right: 6px;
              }
              .el-icon-success {
                color: #1f93ff;
              }
              .el-icon-error {
                color: #d54c4c;
              }
              .el-icon-info {
                color: #fff;
                border: 1px solid #ccc;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
  }
  .Exam-Fraction-form-area {
    margin-top: 10px;
    p {
      margin-left: 18px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
    .el-form {
      .el-form-item {
        position: relative;
        height: 44px;
        line-height: 44px;
        margin-bottom: 0;
        border-bottom: 1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
        .el-form-item__label,
        .el-form-item__content {
          line-height: 44px;
        }
        label {
          position: absolute;
          width: 200px;
          text-align: left;
          padding-right: 0;
          padding-left: 20px;
          border-right: 1px solid #e8e8e8;
          color: rgba(0, 0, 0, 0.65);
        }
        .el-form-item__content {
          padding-left: 200px;
        }
      }
      .el-row:nth-child(1) {
        border-top: 1px solid #e8e8e8;
      }
      .el-row {
        .el-col:nth-child(1) {
          border-left: 1px solid #e8e8e8;
        }
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.Exam-Fraction .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

