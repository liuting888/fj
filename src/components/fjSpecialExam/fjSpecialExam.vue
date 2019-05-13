<template>
  <div class="fj-content_view work-mis workLog specialExamination">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe" style="border-bottom:0px;">
        <el-tabs v-model="activeIndex" @tab-click="handleClick">
          <el-tab-pane label="考试题库" name="0"></el-tab-pane>
          <el-tab-pane label="试卷管理" name="1"></el-tab-pane>
          <el-tab-pane label="考试发布" name="2"></el-tab-pane>
          <el-tab-pane label="考试得分" name="3"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="6" :xl="5" v-if="activeIndex==0">
                <el-form-item label="题库类型：">
                  <el-select
                    @change="changeDeptId"
                    clearable
                    filterable
                    v-model="searchForm.deptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in subjectList"
                      :key="item.itemid"
                      :label="item.itemvalue"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="5" v-if="activeIndex==2">
                <el-form-item label="状态：">
                  <el-select
                    @change="changeDeptId"
                    clearable
                    filterable
                    v-model="searchForm.state"
                    size="small"
                  >
                    <el-option value="0" label="已发布"></el-option>
                    <el-option value="1" label="未发布"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="5" v-if="activeIndex==3">
                <el-form-item label="区县分局：">
                  <el-select
                    @change="changeSupDeptId"
                    clearable
                    filterable
                    v-model="searchForm.supDeptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in supDeptIds"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="5" v-if="activeIndex==3">
                <el-form-item label="派出所：">
                  <el-select
                    @change="changeDeptId"
                    clearable
                    filterable
                    v-model="searchForm.deptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in deptIds"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :xl="7" class="time-item">
                <el-form-item label="起始时间：" class="datepicker">
                  <el-date-picker
                    v-model="searchTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeSearchTime"
                    size="small"
                  ></el-date-picker>
                  <el-button
                    type="primary"
                    class="tj-btn"
                    @click="goQuestions(0)"
                    v-if="activeIndex==0"
                  >新增题库</el-button>
                  <el-button
                    type="primary"
                    class="tj-btn"
                    @click="exportExcl"
                    v-if="activeIndex==3"
                  >导出</el-button>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="6" v-if="activeIndex==1">
                <el-form-item label="输入查询：">
                  <el-input
                    v-model="searchForm.user"
                    clearable
                    placeholder="请输入试卷标题"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchAttendLeave">搜索</el-button>
                  </el-input>
                  <el-button type="primary" class="tj-btn" @click="goManage(0)">新增试卷</el-button>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="6" v-if="activeIndex==2">
                <el-form-item label="输入查询：">
                  <el-input
                    v-model="searchForm.title"
                    clearable
                    placeholder="请输入考试标题"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchAttendLeave">搜索</el-button>
                  </el-input>
                  <el-button type="primary" class="tj-btn" @click="goRelease(0,'')">新增考试</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <!-- 考试题库 -->
        <el-table v-if="activeIndex==0" :data="tableDataList" style="width: 100%">
          <el-table-column prop="examType" label="题库类型" :key="Math.random()"></el-table-column>
          <el-table-column prop="title" label="标题" :key="Math.random()"></el-table-column>
          <!-- <el-table-column prop="content" label="考试类型" :key="Math.random()"></el-table-column> -->
          <el-table-column prop="createUsername" label="创建人" :key="Math.random()"></el-table-column>
          <el-table-column
            prop="instime"
            label="创建时间"
            :formatter="timeFormatter"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column prop="examNumber" label="题目数量" :key="Math.random()"></el-table-column>
          <el-table-column label="状态" width="100px" :key="Math.random()">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                active-color="#13ce66"
                inactive-color="#ccc"
                active-value="0"
                inactive-value="1"
                @change="updExam(scope.row.id,scope.row.state)"
              ></el-switch>
              <span>{{scope.row.state==0?'开启':'关闭'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <span class="ope-txt" @click="goQuestions(2,scope.row.id)">管理</span>
              <span class="ope-txt" @click="updExam(scope.row.id, -1)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 试卷管理 -->
        <el-table v-if="activeIndex==1" :data="tableDataList" style="width: 100%">
          <el-table-column prop="title" label="试卷标题" show-overflow-tooltip :key="Math.random()"></el-table-column>
          <el-table-column
            prop="sigtypenTime"
            label="试卷内容"
            show-overflow-tooltip
            :key="Math.random()"
          ></el-table-column>
          <el-table-column prop="score" label="总分" :key="Math.random()"></el-table-column>
          <el-table-column prop="createUserName" label="创建人" :key="Math.random()"></el-table-column>
          <el-table-column prop="instime" label="发布时间" :key="Math.random()"></el-table-column>
          <el-table-column label="状态" width="100px" :key="Math.random()">
            <template slot-scope="scope">
              <span
                class="circle-status"
                :class="scope.row.state == 0 ? 'green' : scope.row.state == 1 ?  'grey': scope.row.state == 2 ?  'grey':'red'"
              >
                {{parseInt( scope.row.state) === 0 ? '已发布' : parseInt( scope.row.state) === 1 ?'未发布' : parseInt( scope.row.state) === 2 ?'已结束'
                : '已删除'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="题目数量" prop="amount" :key="Math.random()"></el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <!-- <span class="ope-txt" v-if="scope.row.state != 0">--</span> -->
              <span class="ope-txt" v-if="scope.row.state == 2" @click="goManage(3,scope.row.id)">复用</span>
              <span class="ope-txt" v-if="scope.row.state != 1" @click="goManage(1,scope.row.id)">查看</span>
              <span
                class="ope-txt"
                v-if="scope.row.state == 1"
                @click="setManageState(scope.row.id, 0)"
              >发布</span>
              <span
                class="ope-txt"
                v-if="scope.row.state == 1"
                @click="goManage( 2,scope.row.id)"
              >编辑</span>
              <span
                class="ope-txt"
                v-if="scope.row.state >= 0"
                @click="setManageState(scope.row.id, -1)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 考试发布 -->
        <el-table v-if="activeIndex==2" :data="tableDataList" style="width: 100%">
          <el-table-column prop="title" label="考试标题" show-overflow-tooltip :key="Math.random()"></el-table-column>
          <el-table-column
            prop="paperTitle"
            label="试卷标题"
            show-overflow-tooltip
            :key="Math.random()"
          ></el-table-column>
          <el-table-column
            prop="examNumber"
            label="考试人数"
            show-overflow-tooltip
            :key="Math.random()"
          ></el-table-column>
          <el-table-column prop="time" label="发布时间" :key="Math.random()"></el-table-column>
          <el-table-column label="状态" width="100px" :key="Math.random()">
            <template slot-scope="scope">
              <span
                class="circle-status"
                :class="scope.row.state == 0 ? 'green' :'grey'"
              >{{parseInt( scope.row.state) === 0 ? '已发布' : '未发布'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <!-- <span class="ope-txt" v-if="scope.row.state != 0">--</span> -->
              <!-- <span class="ope-txt" v-if="scope.row.state == 2" @click="goManage(3,scope.row.id)">复用</span> -->
              <span
                class="ope-txt"
                v-if="scope.row.state != 1"
                @click="goRelease(1,scope.row.id)"
              >详情</span>
              <span
                class="ope-txt"
                v-if="scope.row.state == 1"
                @click="setReleaseState(scope.row.id, 0)"
              >发布</span>
              <span
                class="ope-txt"
                v-if="scope.row.state == 1"
                @click="goRelease( 2,scope.row.id)"
              >编辑</span>
              <span
                class="ope-txt"
                v-if="scope.row.state >= 0"
                @click="setReleaseState(scope.row.id, -1)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 考试得分 -->
        <el-table
          v-if="activeIndex==3"
          :data="tableDataList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="30" :key="Math.random()"></el-table-column>
          <el-table-column prop="title" label="试卷标题" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="姓名" :key="Math.random()"></el-table-column>
          <el-table-column prop="score" label="分数" :key="Math.random()"></el-table-column>
          <el-table-column prop="time" :formatter="timeFormatter" label="考试日期" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="警号" :key="Math.random()"></el-table-column>
          <el-table-column prop="deptName" label="单位" :key="Math.random()"></el-table-column>
          <el-table-column prop="useTime" label="用时" :key="Math.random()"></el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <span class="ope-txt" @click="goFraction(1,scope.row.id)">查看</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @current-change="currentPageChange"
            @prev-click="prevPageChange"
            @next-click="nextPageChange"
            @size-change="sizePageChange"
            v-if="total > 0"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 审核弹出框 -->
    <el-dialog
      title="考试发布信息"
      :visible.sync="checkDialogVisible"
      :modal-append-to-body="checkDialogVisibleModal"
      style="position: absolute"
      width="450px"
      @close="closeDialog"
      :close-on-click-modal="false"
      top="25vh"
      class="check-dialog"
    >
      <div>
        <div class="form-info">
          <el-form :model="ruleForm">
            <el-form-item label="考试标题：">
              <el-input
                v-model="ruleForm.title"
                :disabled="isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="考试日期：">
              <el-date-picker
                :disabled="isDisabled"
                v-model="ruleForm.time"
                type="date"
                value-format="yyyyMMdd"
                :placeholder="isDisabled?'':'请选择'"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="考试试卷：">
              <el-select
                clearable
                filterable
                v-model="ruleForm.paperId"
                size="small"
                :disabled="isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              >
                <el-option
                  v-for="item in paperIdList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="考试分局：">
              <el-select
                @change="changeKSFJ"
                multiple
                clearable
                filterable
                v-model="ruleForm.fj"
                size="small"
                :disabled="isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              >
                <el-option
                  v-for="item in supDeptIds"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="考试派出所：">
              <el-select
                @change="changeKSPCS"
                multiple
                clearable
                filterable
                v-model="ruleForm.pcs"
                size="small"
                :disabled="isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              >
                <el-option
                  v-for="item in deptIds"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="考试人员：">
              <el-select
                clearable
                filterable
                v-model="ruleForm.people"
                size="small"
                :disabled="isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              >
                <el-option
                  v-for="item in missionStates"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postRelease">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
import mixin from "@/scripts/mixin.js";
export default {
  name: "specialExam",
  mixins: [mixin], // 使用mixins
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "教培管理", path: "" },
        { name: "专题考试", path: "" }
      ],
      nowUser: $.cookie(fjPublic.loginCookieKey),
      activeIndex: "0",
      checkDialogVisible: false,
      checkDialogVisibleModal: false,
      isDisabled: false,
      ruleForm: {}, //考试发布信息
      deptIds: null, //派出所下拉框数据
      supDeptIds: null, //分局下拉框数据
      // 状态下拉框
      subjectList: [],
      // 考试试卷下拉框
      paperIdList: [],
      // 状态下拉框
      missionStates: [
        {
          value: "1001",
          label: "岗前培训"
        },
        {
          value: "1002",
          label: "夜校培训"
        }
      ],
      // 列表查询参数
      searchTime: "", // 查询时间
      searchForm: {
        nameOrAccount: "", // 警号或负责人名称
        deptId: "", // 派出所
        supDeptId: "", // 公安局
        status: "", // 状态
        endTime: "",
        startTime: ""
      },
      searchListUrl: "" //获取列表数据URL
    };
  },
  mounted() {
    fjPublic.closeLoad();
    // 初始化列表
    this.searchList();
    this.initSupDeptIds();
    this.initDeptIds();
    this.getDictListByType();
    return;
  },
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      vm.searchList();
      fjPublic.closeLoad();
    });
  },
  methods: {
    //获取被选中的标签 tab 实例
    handleClick(tab) {
      this.activeIndex = tab.index;
      for (var i in this.searchForm) {
        this.searchForm[i] = "";
      }
      this.searchTime = "";
      this.currentPage = 1;
      this.searchList();
      if (this.activeIndex == 3) {
        this.initDeptIds();
      }
    },
    //获取被选中的标签 tab 实例
    changeSwitch(id, state) {},
    // 修改分局下拉框查询
    changeSupDeptId: function(supDeptId) {
      this.searchForm["supDeptId"] = supDeptId;
      this.searchList();
    },
    // 修改派出所下拉框查询
    changeDeptId: function(deptId) {
      this.searchForm["deptId"] = deptId;
      this.searchList();
    },
    // 标题或负责人名称查询
    searchAttendLeave: function() {
      this.searchList();
    },

    exportExcl: function() {
      let vm = this;
      window.open(
        fjPublic.ajaxUrlDNN +
          "/exportExamResultList?endTime=" +
          vm.searchForm.endTime +
          "&deptId=" +
          vm.searchForm.deptId +
          "&startTime=" +
          vm.searchForm.startTime +
          "&pageNumber=" +
          vm.currentPage +
          "&pageSize=" +
          vm.pageSize
      );
    },
    // 新增发布考试
    goRelease: function(state, id) {
      this.ruleForm = {};
      this.ruleForm.fj = [];
      this.checkDialogVisible = true;
      this.getPaperIdList();
      state == 1 ? (this.isDisabled = true) : (this.isDisabled = false);
      if (id) {
        this.getExamPublishInfo(id);
      }
    },
    //获取发布考试详情
    getExamPublishInfo(id) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getExamPublishInfo",
        type: "POST",
        data: {
          id: id
        },
        dataType: "json",
        success: function(data) {
          vm.ruleForm = data.data;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    //获取发布考试试卷下拉框
    getPaperIdList() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getExamPaperList",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          vm.paperIdList = data.data.list;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    //提交发布考试数据
    postRelease() {
      let vm = this;
      if (vm.isDisabled) {
        vm.checkDialogVisible = false;
        return;
      }
      let defer = $.Deferred();
      let url = vm.ruleForm.id ? "/updExamPaper" : "/addExamPublish";
      $.ajax({
        url: fjPublic.ajaxUrlDNN + url,
        type: "POST",
        data: vm.ruleForm,
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.$message({
              type: "success",
              message: data.errorMsg
            });
          } else {
            vm.$message({
              type: "error",
              message: data.errorMsg
            });
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      vm.checkDialogVisible = false;
      return defer;
    },
    //签订
    review() {
      // var defer = $.Deferred();
      // var vm = this;
      // $.ajax({
      //   url: fjPublic.ajaxUrlDNN + "/signContract",
      //   type: "POST",
      //   data: {
      //     id: vm.userInfo.id,
      //     year: vm.radio
      //   },
      //   dataType: "json",
      //   success: function(data) {
      //     if (data.errorCode == 0) {
      //       vm.$message({
      //         type: "success",
      //         message: data.errorMsg
      //       });
      //       vm.userInfo.state = 1;
      //     } else {
      //       vm.$message({
      //         type: "error",
      //         message: data.errorMsg
      //       });
      //     }
      //     defer.resolve();
      //   },
      //   error: function(err) {
      //     defer.reject();
      //   }
      // });
      // vm.checkDialogVisible = false;
      // return defer;
    },
    // 初始化分局
    initSupDeptIds: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDepListBySearch",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          vm.supDeptIds = data.list;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 初始化题库类型
    getDictListByType: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getDictListByType",
        type: "POST",
        data: {
          type: "TZLX"
        },
        dataType: "json",
        success: function(data) {
          vm.subjectList = data.data;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 初始化派出所
    initDeptIds: function(id) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
        type: "POST",
        data: {
          parentDeptId: id
        },
        dataType: "json",
        success: function(data) {
          vm.deptIds = data.list;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    //发布考试获取派出所
    changeKSPCS: function() {},
    //发布考试获取分局
    changeKSFJ: function() {
      this.initDeptIds(this.ruleForm.fj);
    },
    // 更新题库
    updExam: function(id, state) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/updExamWarehouse",
        type: "POST",
        data: {
          id: id,
          state: state
        },
        dataType: "json",
        success: function(data) {
          // console.log(data);
        },
        error: function(err) {
          vm.searchList();
        }
      });
    },
    // 修改试卷状态
    setManageState: function(id, state) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/updExamPaper",
        type: "POST",
        data: {
          id: id,
          state: state
        },
        dataType: "json",
        success: function(data) {
          // console.log(data);
        },
        error: function(err) {
          vm.searchList();
        }
      });
    },
    // 设置获取列表参数
    setSearchList: function() {
      let vm = this;
      vm.searchListUrl =
        vm.activeIndex == 0
          ? "/getExamWarehouseList"
          : vm.activeIndex == 1
          ? "/getExamPaperList"
          : vm.activeIndex == 2
          ? "/getExamPublishList"
          : "/getExamResultList";
      // 参数
      vm.searchForm["pageNumber"] = vm.currentPage;
      vm.searchForm["pageSize"] = vm.pageSize;
    },
    // 获取列表
    searchList: function() {
      fjPublic.openLoad("数据加载中...");
      let vm = this;
      vm.setSearchList();
      $.ajax({
        url: fjPublic.ajaxUrlDNN + vm.searchListUrl,
        type: "POST",
        data: vm.searchForm,
        dataType: "json",
        success: function(data) {
          vm.tableDataList = null;
          vm.tableDataList = data.data.list;
          vm.total = data.data.total;
          fjPublic.closeLoad();
        },
        error: function(err) {
          fjPublic.closeLoad();
          vm.$message({ type: "warning", message: "请求数据失败！！！" });
        }
      });
    },
    // 弹窗关闭事件
    closeDialog() {
      // this.$refs.checkDialogForm.resetFields();
    },
    /**
     * 考试题库查看，编辑，新建
     * @param {*} state 状态0=新增，1=查看，2=编辑
     */
    goQuestions(state, id) {
      this.$router.push({
        path: "/special-exam-questions",
        query: { state: state, id: id }
      });
    },
    /**
     * 考试试卷查看，编辑，新建
     * @param {*} state 状态0=新增，1=查看，2=编辑，3=复用(拿旧ID数据重新新建模板)
     */ goManage(state, id) {
      this.$router.push({
        path: "/special-exam-manage",
        query: { state: state, id: id }
      });
    },
    /**
     * 考试分数查看，编辑，新建
     * @param {*} state 状态0=新增，1=查看，2=编辑
     */ goFraction(state, id) {
      this.$router.push({
        path: "/special-exam-fraction",
        query: { state: state, id: id }
      });
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
        // +
        // ":" +
        // dateStr.substr(14, 2)
      );
    }
  },
  filters: {
    // getSignType: function(value) {
    //   return value == "1" ? "上班未签到" : value == 2 ? "下班未签退" : "";
    // }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.specialExamination {
  /deep/ .el-table {
    .circle-status {
      position: relative;
      &.red {
        &::before {
          background: #f5222d;
        }
      }
      &.green {
        &::before {
          background: #52c41a;
        }
      }
      &.grey {
        &::before {
          background: #ababab;
        }
      }
      &::before {
        display: block;
        position: absolute;
        content: "";
        width: 6px;
        height: 6px;
        background: rgba(171, 171, 171, 1);
        border-radius: 50%;
        opacity: 1;
        top: 5px;
        left: -9px;
      }
    }
  }
  .tj-btn {
    position: absolute;
    right: -128px;
    top: 4px;
    width: 98px;
  }
  .fj-search-inline {
    // 上下间距
    @media screen and (max-width: 1366px) {
      .el-form-item__label {
        line-height: 20px;
      }
    }
    /deep/ .el-row {
      .time-item {
        .el-form-item {
          .el-input {
            width: 350px;
          }
        }
      }
      .el-form-item {
        margin: 0;
        &:first-child {
          margin: 15px 0;
        }
        &:last-child {
          margin-bottom: 15px;
        }
        &.datepicker {
          .el-form-item__content {
            line-height: 43px;
          }
        }
        .search-input {
          width: 260px;
          .el-input-group__append {
            background-color: #1890ff;
            border-color: #1890ff;
            color: #fff;
          }
        }
      }
    }
  }
}
.form-info {
  padding-left: 40px;
  .el-form-item {
    .el-input {
      width: 240px;
    }
    .is-disabled {
      .el-input__inner {
        cursor: auto;
        background-color: #fff;
        color: #606266;
        border: none;
      }
      .el-select__caret {
        display: none;
      }
    }
  }
}
.fj-block-head {
  .el-tabs__item {
    height: 50px;
    line-height: 46px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 1px;
  }
}
.el-dialog__body {
  .el-form-item__label {
    width: 100px;
  }
}
</style>


