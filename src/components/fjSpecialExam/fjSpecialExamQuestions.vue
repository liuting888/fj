<template>
  <div class="fj-content_view exam-questions">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head">
          <h3>{{ruleForm.title}}</h3>
        </div>
        <div class="fj-block-body">
          <div class="body-header">
            <div class="search-item">
              <span class="span-title">题库类型：</span>
              <el-select v-model="ruleForm.selectedRole" clearable>
                <el-option :value="1" label="单选题"></el-option>
                <el-option :value="0" label="单选题"></el-option>
              </el-select>
            </div>
            <div class="search-item hidden-lg-and-down">
              <span class="span-title">适用岗位：</span>
              <el-select v-model="ruleForm.selectedRole">
                <el-option :value="1" label="辅警"></el-option>
                <el-option :value="0" label="民警"></el-option>
              </el-select>
            </div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="ruleForm.textarea"
            ></el-input>
            <div class="add-list-btn" @click="submitForm(0)">+ 添加考题</div>
          </div>
          <div class="body-body">
            <ul>
              <li class="add-topic">
                <div class="topic">
                  题目:
                  <el-input type="text" v-model="addTopicList.title"></el-input>
                </div>
                <ul>
                  <li>
                    A:
                    <el-input type="text" v-model="addTopicList.A"></el-input>
                    <el-radio v-model="addTopicList.daan" label="1"></el-radio>
                  </li>
                  <li>
                    B:
                    <el-input type="text" v-model="addTopicList.B"></el-input>
                    <el-radio v-model="addTopicList.daan" label="2"></el-radio>
                  </li>
                  <li>
                    C:
                    <el-input type="text" v-model="addTopicList.C"></el-input>
                    <el-radio v-model="addTopicList.daan" label="3"></el-radio>
                  </li>
                  <li>
                    D:
                    <el-input type="text" v-model="addTopicList.D"></el-input>
                    <el-radio v-model="addTopicList.daan" label="4"></el-radio>
                    <div class="add-topic-btn">
                      <el-button>取消</el-button>
                      <el-button type="primary" @click="addTopic()">确认</el-button>
                    </div>
                  </li>
                </ul>
              </li>
              <li class="check-topic" v-for="(item, index) in ruleForm.content">
                <div class="topic">
                  {{index+1}}.
                  <el-input type="text" :disabled="item.edit" v-model="item.title"></el-input>
                </div>
                <ul>
                  <li>
                    <el-radio :disabled="item.edit&&!(item.daan==1)" v-model="item.daan" label="1"></el-radio>A:
                    <el-input :disabled="item.edit" type="text" v-model="item.A"></el-input>
                  </li>
                  <li>
                    <el-radio v-model="item.daan" :disabled="item.edit&&!(item.daan==2)" label="2"></el-radio>B:
                    <el-input type="text" :disabled="item.edit" v-model="item.B"></el-input>
                  </li>
                  <li>
                    <el-radio v-model="item.daan" :disabled="item.edit&&!(item.daan==3)" label="3"></el-radio>C:
                    <el-input type="text" :disabled="item.edit" v-model="item.C"></el-input>
                  </li>
                  <li>
                    <el-radio v-model="item.daan" :disabled="item.edit&&!(item.daan==4)" label="4"></el-radio>D:
                    <el-input type="text" :disabled="item.edit" v-model="item.D"></el-input>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "special-exam-questions",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "教培管理", path: "" },
        { name: "专题考试", path: "" }
      ],
      userInfo: {},
      ruleForm: {
        title: "这里是题库的标题",
        selectedRole: 1,
        textarea: "请简单描述试题库内容",
        content: [
          {
            title: "题目1",
            A: "hahaA",
            B: "hahaB",
            C: "hahaC",
            D: "hahaD",
            daan: 1,
            edit: true
          },
          {
            title: "题目2",
            A: "hahaA2",
            B: "hahaB2",
            C: "hahaC2",
            D: "hahaD2",
            daan: 2,
            edit: true
          }
        ]
      },
      addTopicList: {
        title: "题目",
        A: "hahaA",
        B: "hahaB",
        C: "hahaC",
        D: "hahaD",
        daan: 1,
        edit: true
      },
      radio: "",
      randomCityList: [], //抽查地点
      subofficeList: [], //房屋所属分局
      policeList: [], //房屋所属派出所
      whether: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ], //是否
      rules: {}
    };
  },
  created() {},
  mounted() {
    // this.getTeamList();
    // this.getDownDepts();
    // this.setCreated();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postRuleForm();
        } else {
          this.$message({
            message: "请填写完所有必填信息",
            type: "warning"
          });
          return false;
        }
      });
    },
    addTopic() {
      let list = {};
      list.title = this.addTopicList.title;
      list.A = this.addTopicList.A;
      list.B = this.addTopicList.B;
      list.C = this.addTopicList.C;
      list.D = this.addTopicList.D;
      list.daan = this.addTopicList.daan;
      list.edit = this.addTopicList.edit;
      this.ruleForm.content.unshift(list);
    },
    // 提交或者编辑数据
    postRuleForm: function() {
      let vm = this;
      let url = vm.userInfo.state == 0 ? "/addInfo" : "/updInfo";
      if (vm.userInfo.id) {
        vm.ruleForm.id = vm.userInfo.id;
      }
      // vm.ruleForm.tableName = vm.activeList[vm.userInfo.index].tableName;
      vm.ruleForm.userId = $.parseJSON(
        fjPublic.getLocalData("userInfo")
      ).userId;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + url,
        type: "POST",
        data: vm.ruleForm,
        dataType: "json",
        success: function(data) {},
        error: function(err) {
          if (err.responseText == "success") {
            vm.$router.push({
              path: "/fjWorkManage-YiBiaoSanShi"
            });
          } else {
          }
        }
      });
    },
    setCreated() {
      this.userInfo = this.$route.query;
      // this.breadData[3].name =
      //   this.activeList[this.userInfo.index].name + "信息采集表";
      this.ruleForm = {};
      this.userInfo.state != 0 &&
        (this.ruleForm = $.parseJSON(fjPublic.getLocalData("ybssItem")));
      // this.$refs["ruleForm"].resetFields();
    },
    routerGo() {
      window.history.go(-1);
    }
  },
  watch: {
    $route: {
      handler(route) {
        // this.setCreated();
      }
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.exam-questions {
  .fj-block.content {
    padding: 0px 180px;
  }
  .fj-block-head {
    border-bottom: 0px;
    h3 {
      text-align: center;
      line-height: 50px;
    }
  }
  .fj-block-body {
    margin-top: 10px;
    .body-header {
      text-align: center;
      .search-item {
        display: inline-block;
      }
      .search-item:first-child {
        margin-right: 100px;
      }
      .el-textarea {
        margin-top: 20px;
      }
      .add-list-btn {
        margin-top: 26px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #1890ff;
        border: 1px dashed #3aa0ff;
        cursor: pointer;
      }
    }
    .body-body {
      ul {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        .el-radio__label {
          display: none;
        }
        .add-topic {
          .topic {
            margin: 15px 0;
            input {
              width: 680px;
            }
          }
          li {
            margin: 15px 20px 0;
            .el-input {
              width: 480px;
            }
            .add-topic-btn {
              display: inline-block;
              margin-left: 50px;
            }
          }
        }
        .check-topic {
          .el-radio {
            margin-right: 4px;
          }
          .el-input.is-disabled .el-input__inner {
            background-color: #fff;
            border-color: #fff;
            color: rgba(0, 0, 0, 0.85);
            cursor: auto;
          }
          .el-radio__input.is-disabled .el-radio__inner {
            cursor: auto;
          }
          .topic {
            margin: 15px 0;
            input {
              width: 680px;
            }
          }
          li {
            margin: 20px 0;
            .el-input {
              width: 480px;
            }
          }
        }
        // .revise-topic {
        //   .topic {
        //     margin: 15px 0;
        //     input {
        //       width: 680px;
        //     }
        //   }
        //   li {
        //     margin: 15px 20px 0;
        //     .el-input {
        //       width: 480px;
        //     }
        //   }
        // }
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.YBSS .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

