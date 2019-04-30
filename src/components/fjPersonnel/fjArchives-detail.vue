<template>
  <div class="fj-content_view archives">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <el-tabs v-model="activeIndex" @tab-click="handleClick">
            <el-tab-pane label="档案信息" name="0"></el-tab-pane>
            <el-tab-pane label="合同信息" name="1"></el-tab-pane>
            <el-tab-pane label="工资信息" name="2"></el-tab-pane>
          </el-tabs>
          <!-- <div class="archives-footer-btn" v-if="userInfo.state==0||userInfo.state==2"> -->
          <div class="archives-footer-btn">
            <!-- <el-button
              type="primary"
              @click="submitForm(1)"
              v-if="userInfo.state==0&&activeIndex==0"
            >保存</el-button>-->
            <!-- <form
              style="display:none;"
              name="exportForm"
              :action="ajaxUrlDNN + '/exportRecruits?nowUser=' + nowUser + '&endTime=' + searchForm.endTime + '&deptId=' + searchForm.deptId + '&startTime=' + searchForm.startTime + '&page=' + currentPage + '&nameOrPhone=' + searchForm.nameOrPhone + '&rows=' + pageSize"
              method="post"
              enctype="multipart/form-data"
            ></form>-->
            <!-- <el-button @click="exportExcl">
              <span>导出</span>
            </el-button>-->
          </div>
        </div>
        <div class="fj-block-body">
          <!-- 档案信息 -->
          <div class="archives-form-area" v-if="activeIndex==0">
            <!-- 岗位信息 -->
            <p class="form-title">岗位信息</p>
            <el-form :model="recruitInfo">
              <div class="form-info">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="姓名">
                      <el-input v-model="jobInfo.userName" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" class="row-img-padding">
                    <el-form-item label="岗位级别">
                      <el-input v-model="jobInfo.userRole" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="警号">
                      <el-input v-model="jobInfo.userAccount" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="入职日期" class="row-img-padding">
                      <el-date-picker
                        :disabled="isDisabled"
                        v-model="archivesInfo.entryTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :placeholder="isDisabled?'':'请选择'"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="直接上级">
                      <el-input v-model="jobInfo.superiorUserName" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="转正日期" class="row-img-padding">
                      <el-date-picker
                        :disabled="isDisabled"
                        v-model="jobInfo.officialTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :placeholder="isDisabled?'':'请选择'"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="所属派出所" class="row-img-padding">
                      <el-select
                        :disabled="isDisabled"
                        v-model="recruitInfo.deptId"
                        :placeholder="isDisabled?'':'请选择'"
                      >
                        <el-option
                          v-for="item in policeList"
                          :key="item.deptId"
                          :label="item.deptName"
                          :value="item.deptId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="info-img">
                  <img
                    :src="recruitInfo.photo?ajaxUrlDNN+'/getRecruitPhoto?photo='+recruitInfo.photo:'static/images/recruit-people.svg'"
                    alt="个人照片"
                  >
                </div>
              </div>
            </el-form>
            <!-- 基本信息 -->
            <p class="form-title">基本信息</p>
            <el-form :model="recruitInfo">
              <div class="form-info">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="出生年月">
                      <el-date-picker
                        :disabled="isDisabled"
                        v-model="recruitInfo.birth"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :placeholder="isDisabled?'':'请选择'"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="性别">
                      <el-select
                        :disabled="isDisabled"
                        v-model="recruitInfo.sex"
                        :placeholder="isDisabled?'':'请选择'"
                      >
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="籍贯">
                      <el-input v-model="recruitInfo.birthPlace" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="民族">
                      <el-input v-model="recruitInfo.nation" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="本人电话">
                      <el-input v-model="recruitInfo.phone" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="婚否">
                      <el-select
                        :disabled="isDisabled"
                        v-model="recruitInfo.marriage"
                        :placeholder="isDisabled?'':'请选择'"
                      >
                        <el-option label="未婚" value="1"></el-option>
                        <el-option label="已婚" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否退役士兵/见义勇为人员">
                      <el-select
                        :disabled="isDisabled"
                        v-model="recruitInfo.soldier"
                        :placeholder="isDisabled?'':'请选择'"
                      >
                        <el-option label="是" value="0"></el-option>
                        <el-option label="否" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="政治面貌">
                      <el-input v-model="recruitInfo.politics" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="紧急联系人">
                      <el-input v-model="recruitInfo.ePerson" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="身高">
                      <el-input v-model="recruitInfo.hw" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="紧急联系人电话">
                      <el-input v-model="recruitInfo.ePersonPhone" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="最高学历">
                      <el-input v-model="recruitInfo.education" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="现居地址">
                      <el-input v-model="recruitInfo.address" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR noBB" label="身份证号码">
                      <el-input v-model="recruitInfo.idNum" :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <!-- 教育经历 -->
            <div class="form-table">
              <p class="form-title">教育经历</p>
              <el-row>
                <el-col :span="12" class="noBR form-table-col">
                  <div class="left">
                    <div class="title title-left titles">起止年月</div>
                    <div
                      class="title title-left"
                      v-for="(item, index) in recruitInfo.educations"
                      :key="index"
                    >
                      <el-input
                        v-model="item.eduDate"
                        :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">学校名称</div>
                    <div class="title" v-for="(item, index) in recruitInfo.educations" :key="index">
                      <el-input
                        v-model="item.schoolName"
                        :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="form-table-col">
                  <div class="left">
                    <div class="title titles">专业</div>
                    <div class="title" v-for="(item, index) in recruitInfo.educations" :key="index">
                      <el-input
                        v-model="item.majorName"
                        :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">所获学历、学位证书</div>
                    <div class="title" v-for="(item, index) in recruitInfo.educations" :key="index">
                      <el-input
                        v-model="item.degrees"
                        :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 工作经历 -->
            <div class="form-table">
              <p class="form-title">工作经历</p>
              <el-row>
                <el-col :span="12" class="noBR form-table-col">
                  <div class="left">
                    <div class="title title-left titles">起止年月</div>
                    <div
                      class="title title-left"
                      v-for="(item, index) in recruitInfo.works"
                      :key="index"
                    >
                      <el-input
                        v-model="item.worDate"
                        :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">单位名称</div>
                    <div class="title" v-for="(item, index) in recruitInfo.works" :key="index">
                      <el-input
                        v-model="item.companyName"
                        :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="form-table-col">
                  <div class="left-over">
                    <div class="title titles">职位</div>
                    <div class="title" v-for="(item, index) in recruitInfo.works" :key="index">
                      <el-input
                        v-model="item.positionName"
                        :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 家庭成员 -->
            <div class="form-table">
              <p class="form-title">家庭成员</p>
              <el-row>
                <el-col :span="12" class="noBR form-table-col">
                  <div class="left">
                    <div class="title title-left titles">关系</div>
                    <div
                      class="title title-left"
                      v-for="(item, index) in recruitInfo.families"
                      :key="index"
                    >
                      <el-input
                        v-model="item.relation"
                        :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                  <div class="right">
                    <div class="title titles">姓名</div>
                    <div class="title" v-for="(item, index) in recruitInfo.families" :key="index">
                      <el-input
                        v-model="item.name"
                        :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="form-table-col">
                  <div class="left-over">
                    <div class="title titles">工作单位（职业）</div>
                    <div class="title" v-for="(item, index) in recruitInfo.families" :key="index">
                      <el-input
                        v-model="item.positionName"
                        :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 合同信息 -->
          <div class="archives-contract" v-if="activeIndex==1">
            <iframe :src="iframeSrc" width="100%" height="100%">当前浏览器暂时不支持查看PDF，请更新浏览器.</iframe>
          </div>
          <!-- 工资信息 -->
          <div class="archives-wage" v-if="activeIndex==2">
            <div class="fj-search-inline">
              <el-row>
                <el-form inline label-width="85px" label-position="left">
                  <el-col :lg="8" :xl="7" class="time-item">
                    <el-form-item label="起始日期：" class="datepicker">
                      <el-date-picker
                        v-model="searchTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="changeSearchTime"
                        size="small"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="6" :xl="5">
                    <el-form-item label="输入查询：">
                      <el-input
                        v-model="searchForm.keyword"
                        clearable
                        placeholder="请输入姓名或警号"
                        size="small"
                        class="search-input"
                      >
                        <el-button slot="append" @click="searchAttendLeave">搜索</el-button>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </div>
            <el-table :data="attendLeaveData">
              <el-table-column prop="time" label="发放日期" :formatter="timeFormatter" width="100"></el-table-column>
              <el-table-column prop="deptBelongName" label="单位" width="120"></el-table-column>
              <el-table-column prop="deptName" label="辅警站" width="120"></el-table-column>
              <el-table-column prop="userName" label="姓名" width="80"></el-table-column>
              <el-table-column prop="basePay" label="基本工资"></el-table-column>
              <el-table-column prop="meritPay" label="绩效工资"></el-table-column>
              <el-table-column prop="tierPay" label="层级工资"></el-table-column>
              <el-table-column prop="jonPay" label="岗位工资"></el-table-column>
              <el-table-column prop="liveSubsidy" label="生活补贴"></el-table-column>
              <el-table-column prop="infoCollect" label="信息采集费" width="100"></el-table-column>
              <el-table-column prop="trafficSubsidy" label="流量补助费" width="100"></el-table-column>
              <el-table-column prop="other" label="其他"></el-table-column>
              <el-table-column prop="theorySum" label="应发合计"></el-table-column>
              <el-table-column prop="pension" label="养老保险"></el-table-column>
              <el-table-column prop="medicare" label="医疗保险"></el-table-column>
              <el-table-column prop="unemployment" label="失业保险"></el-table-column>
              <el-table-column prop="injury" label="工伤保险"></el-table-column>
              <el-table-column prop="maternity" label="生育保险"></el-table-column>
              <el-table-column prop="illness" label="大病互助保险" width="120"></el-table-column>
              <el-table-column prop="deduct" label="扣发合计"></el-table-column>
              <el-table-column prop="sum" label="实发合计"></el-table-column>
              <el-table-column prop="bankCard" label="银行卡号" width="180"></el-table-column>
            </el-table>
            <div class="mj-page_wrap">
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[10,20,30]"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="total"
                @current-change="currentPageChange"
                @prev-click="prevPageChange"
                @next-click="nextPageChange"
                @size-change="sizePageChange"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "personnel-archives-detail",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "档案管理", path: "/personnel-archives" },
        { name: "详情", path: "" }
      ],
      archivesInfo: {},
      ajaxUrlDNN: fjPublic.ajaxUrlDNN,
      iframeSrc: "",
      recruitInfo: {
        works: [{}, {}, {}],
        families: [{}, {}, {}],
        educations: [{}, {}, {}]
      },
      jobInfo: {},
      activeIndex: "0",
      activeList: [],
      userInfo: {},
      ruleForm: {
        name: ""
      },
      randomCityList: [], //抽查地点
      subofficeList: [], //房屋所属分局
      policeList: [], //房屋所属派出所
      nowUser: $.cookie(fjPublic.loginCookieKey),
      isDisabled: false,
      // 列表数据
      attendLeaveData: [
        // {
        //   apply_time: "",
        //   end_time: "",
        //   leader_content: "",
        //   leader_name: "",
        //   leader_time: "",
        //   leaveId: "",
        //   leave_reason: "",
        //   leave_state: "",
        //   start_time: "",
        //   userId: "",
        //   userAccount: ""
        // }
      ],
      whether: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ],
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 0, //是否
      searchTime: "",
      // 列表查询参数
      searchForm: {
        keyword: "" // 警号或负责人名称
      },
      rules: []
    };
  },
  mounted() {
    //获取派出所信息
    this.getTeamList();
    this.setCreated();
    // this.searchUserLeave();
    //获取档案详情
    this.getArchivesInfo();
  },
  methods: {
    currentPageChange: function(pageNum) {
      // 点击某个分页按钮
      this.currentPage = pageNum;
      this.searchUserLeave();
    },
    prevPageChange: function(pageNum) {
      // 点击分页的上一页
      this.currentPage = pageNum;
      this.searchUserLeave();
    },
    nextPageChange: function(pageNum) {
      // 点击分页的下一页
      this.currentPage = pageNum;
      this.searchUserLeave();
    },
    sizePageChange: function(pageSize) {
      // 改变每页条数时
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.searchUserLeave();
    },
    // submitForm(state) {
    //   console.log(state);
    //   window.history.go(-1);
    // },
    // exportExcl: function() {
    //   // 导出
    //   document.forms["exportForm"].submit();
    // },
    // 修改查询时间
    changeSearchTime: function(searchTime) {
      if (searchTime) {
        this.searchForm["startTime"] = fjPublic.dateFormatYYMMDD(searchTime[0]);
        this.searchForm["endTime"] = fjPublic.dateFormatYYMMDD(searchTime[1]);
      } else {
        this.searchForm["startTime"] = "";
        this.searchForm["endTime"] = "";
      }
      this.searchUserLeave();
    },
    // 标题或负责人名称查询
    searchAttendLeave: function() {
      this.searchUserLeave();
    },
    // 获取抽查地点数据
    getTeamList: function(state) {
      var vm = this;
      // 参数
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          vm.policeList = data.list;
        },
        error: function(err) {}
      });
    },
    // 获取档案详情
    getArchivesInfo: function() {
      this.archivesInfoId = this.$route.query.id;
      var vm = this;
      // 参数
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getArchivesInfo",
        type: "POST",
        data: { id: this.archivesInfoId },
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.jobInfo = data.data.job;
            vm.iframeSrc =
              fjPublic.ajaxUrlDNN + "/contract/" + data.data.contractFileName;
            vm.recruitInfo = data.data.recruitInfo;
            vm.addArrObj("educations", 3);
            vm.addArrObj("families", 3);
            vm.addArrObj("works", 3);
            vm.searchUserLeave();
          } else {
          }
        },
        error: function(err) {}
      });
    },
    // 获取工资列表
    searchUserLeave: function() {
      var defer = $.Deferred();
      var vm = this;
      // 参数
      this.searchForm["pageNumber"] = this.currentPage;
      this.searchForm["pageSize"] = this.pageSize;
      this.searchForm["userId"] = vm.jobInfo.userId;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getPayrollList",
        type: "POST",
        data: vm.searchForm,
        dataType: "json",
        success: function(data) {
          vm.attendLeaveData = null;
          vm.attendLeaveData = data.list;
          vm.total = data.total;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    /**
     * @description: 给数组添加对象元素
     * @param {type} arr 数组名称
     * @param {type} index 添加数量
     * @return:
     */
    addArrObj: function(arr, index) {
      var vm = this;
      vm.recruitInfo[arr].length = index;
      for (let i = 0; i < index; i++) {
        if (!vm.recruitInfo[arr][i]) {
          vm.recruitInfo[arr][i] = {};
        }
      }
    },
    //获取被选中的标签 tab 实例
    handleClick(tab) {
      this.activeIndex = tab.index;
    },
    setCreated() {
      this.userInfo = this.$route.query;
      this.isDisabled = true;
    },
    // 时间格式化
    timeFormatter(row, type) {
      let dateStr = row[type.property];
      if (!dateStr) {
        return "";
      }
      return (
        dateStr.substr(0, 4) +
        "/" +
        dateStr.substr(4, 2) +
        "/" +
        dateStr.substr(6, 2)
      );
    }
  },
  watch: {
    // $route: {
    //   handler(route) {
    //     this.setCreated();
    //   }
    // }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.archives {
  .el-form {
    .form-info {
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
        }
        .el-form-item__content {
          padding-left: 200px;
        }
        .el-input {
          width: 100%;
          input {
            height: 42px;
            border: none;
          }
        }
        .el-select {
          width: 100%;
          .el-input {
            padding-left: 0;

            input {
              height: 42px !important;
            }
          }
          .is-disabled {
            span {
              display: none;
            }
          }
        }
      }
      .el-row:nth-child(1) {
        border-top: 1px solid #e8e8e8;
      }
      .el-row {
        .el-col:nth-child(1) {
          border-left: 1px solid #e8e8e8;
        }
        .el-input.is-disabled .el-input__inner {
          color: rgba(0, 0, 0, 0.9);
        }
      }
      .row-img-padding {
        .el-form-item__content {
          padding-right: 150px;
        }
      }
      .el-input--prefix{
        .el-input__inner{
          padding-left: 15px;
        }
      }
      .el-input.is-disabled .el-input__prefix {
        // cursor: auto;
        display: none;
      }
    }
  }
  .archives-form-area {
    .form-info {
      position: relative;
      .info-img {
        position: absolute;
        top: 2px;
        right: 1px;
        width: 150px;
        height: 174px;
        z-index: 1;
        background-color: #fff;
        border-left: 1px solid #e8e8e8;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .el-input.is-disabled .el-input__inner {
      color: rgba(0, 0, 0, 0.9);
    }
    .form-title {
      padding: 20px 0 5px 20px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.9);
      opacity: 1;
    }
    .form-table {
      height: 222px;

      .form-table-col {
        div {
          display: inline-block;
          height: 44px;
          line-height: 44px;
          div:nth-child(4) {
            border-bottom: 1px solid #e8e8e8;
          }
        }
        .left {
          width: 200px;
          position: absolute;
        }
        .right {
          width: 100%;
          padding-left: 200px;
        }
        .left-over {
          width: 100%;
          position: relative;
        }
        .title {
          display: block;
          border-top: 1px solid #e8e8e8;
          border-right: 1px solid #e8e8e8;
          .el-input {
            width: 100%;
            padding-left: 5px;
            .el-input__inner {
              border: none;
            }
          }
        }
        .titles {
          padding-left: 20px;
          line-height: 44px;
          background-color: #fafafa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          font-weight: 400;
        }
        .title-left {
          border-left: 1px solid #e8e8e8;
        }
      }
      .noBR {
        border-right: none;
      }
      .noBB {
        border-bottom: none;
      }
    }
  }
  .fj-block-head {
    height: 50px;
    border-bottom: 0px;
    .el-tabs__header {
      padding-top: 10px;
    }
    .archives-footer-btn {
      position: absolute;
      top: 10px;
      right: 0;
    }
  }

  .archives-contract {
    height: 800px;
    padding: 20px;
  }
  .archives-wage {
    .el-input-group__append {
      background-color: #1890ff;
      border-color: #1890ff;
      color: #fff;
    }
    .fj-search-inline {
      margin: 20px 0 0 20px;
    }
  }
}
.fj-block-body {
  padding-bottom: 30px;
}

.archives-form-area {
  .el-input.is-disabled .el-input__inner {
    cursor: auto;
    background-color: #fff;
  }
  .el-form-item__error {
    display: none;
  }
  .is-required {
    .el-form-item__label:before {
      display: none;
    }
    .el-form-item__label:after {
      content: "*";
      color: #f56c6c;
      margin-left: 4px;
    }
  }
}
@media screen and (min-width: 1920px) {
  /* .archives .archives-form-area .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

