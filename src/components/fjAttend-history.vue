<template>
  <div class="fj-content_view fj-history">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <!-- <p class="title fj-fl">考勤历史列表</p> -->
        <el-tabs
          v-model="activeIndex"
        >
          <el-tab-pane
            label="考勤异常"
            name="5"
          ></el-tab-pane>
          <el-tab-pane
            label="考勤正常"
            name="0"
          ></el-tab-pane>
          <el-tab-pane
            label="全部"
            name="all"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="fj-block-body">
        <ul class="filterOpe-area">
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <span class="title fj-fl">区县分局：</span>
              <el-select
                @change="getPCSdataById"
                clearable
                filterable
                v-model="searchForm.supDeptId"
                :disabled="searchForm.isFenjv"
                size="small"
              >
                <el-option
                  v-for="item in supDeptIds"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </div>
            <div class="item fj-fl">
              <span class="title fj-fl">派出所：</span>
              <el-select
                @change="changeDeptId"
                clearable
                filterable
                v-model="searchForm.deptId"
                :disabled="searchForm.isPcs"
                size="small"
              >
                <el-option
                  v-for="item in deptIds"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </div>
            <div class="item fj-fl">
              <span class="title fj-fl">起止日期：</span>
              <el-date-picker
                v-model="searchForm.searchTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeSearchTime"
                size="small"
              ></el-date-picker>
            </div>
            <div class="item fj-fl">
              <span class="title fj-fl">输入查询：</span>
              <el-input
                v-model="searchForm.nameOrAccount"
                clearable
                placeholder="名称或警号"
                size="small"
                class="search-input"
              >
                <el-button slot="append" @click="searchAttendHistory">搜索</el-button>
              </el-input>
            </div>
            <div class="item fj-fl export-box">
              <el-button type="defualt" @click="exportHistoryInfo">导&nbsp;&nbsp;出</el-button>
            </div>
          </li>
        </ul>
        <!-- <div class="fj-search-inline">
          <el-row>
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="8" :xl="7" class="time-item">
                <el-form-item label="公安局：">
                  
                </el-form-item>

                <el-form-item label="起止日期：" class="datepicker">
                  
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="5">
                <el-form-item label="派出所：">
                  
                </el-form-item>
                <el-form-item label="输入查询：">
                  
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div> -->
        <el-table :data="attendHistoryData">
          <el-table-column prop="userName" label="姓名" width="120"></el-table-column>
          <el-table-column class-name="align-left" prop="userAccount" label="警号" width="120"></el-table-column>
          <el-table-column class-name="align-left" prop="inSignTime" label="上班签到" width="160" :formatter="timeFormatter"></el-table-column>
          <el-table-column class-name="align-left" prop="outSignTime"  label="下班签到" width="160" :formatter="timeFormatter"></el-table-column>
          <el-table-column class-name="align-left" label="状态" width="120">
            <template slot-scope="scope">
              <!-- prop="inAbnormal" -->
              <p class="state-line" :class="[{'normal':scope.row.stateClass=='2'},{'abnormal':scope.row.stateClass=='1'}]">{{scope.row.stateTxt}}</p>
            </template>
          </el-table-column>
          <el-table-column class-name="align-left" label="上班签到位置" show-overflow-tooltip>
            <template slot-scope="scope">
              <a href="javascript:;" class="ope-txt" @click="showMap('in',scope.row.inLatlng)">{{scope.row.inSignAddress}}</a>
            </template>
          </el-table-column>
          <el-table-column class-name="align-left" label="下班签到位置" show-overflow-tooltip>
            <template slot-scope="scope">
              <a href="javascript:;" class="ope-txt" @click="showMap('out',scope.row.outLatlng)">{{scope.row.outSignAddress}}</a>
            </template>
          </el-table-column>

          <!-- <el-table-column label="签到时间" prop="signTime" :formatter="timeFormatter">
          </el-table-column>
          <el-table-column label="签到类型">
            <template slot-scope="scope">
              <p>{{scope.row.signType | getSignTypeName}}</p>
            </template>
          </el-table-column>

          <el-table-column prop="signAddress" label="签到地址" width="500px" show-overflow-tooltip  class-name="textLeft"></el-table-column>
           <el-table-column label="签到位置">
            
            查看地图
          </el-table-column> -->
        </el-table>
        <div class="mj-page_wrap">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30]"
            :page-size="pageSize"
            v-if="total!==0"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @current-change="currentPageChange"
            @prev-click="prevPageChange"
            @next-click="nextPageChange"
            @size-change="sizePageChange"
          >
          </el-pagination>
        </div>
      </div>
      <div class="dialog">
        <!-- 用于展示地图 -->
        <el-dialog
          :title="mapPopTitle"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          width="600px"
          :modal='false'>
          <div class="fcv-history-map" id="fcv-history-map"></div>
          <span slot="footer" class="dialog-footer">
            <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
            <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import fjBreadNav from '@/components/fjBreadNav';

  export default {
    name: 'fjAttendHistory',
    data: function () {
      return {
        activeIndex:"5",
        breadData: [
          {name: '当前位置:', path: ''},
          {name: '考勤管理', path: ''},
          {name: '考勤历史', path: ''}
        ],
        userInfo:null,
        nowUser: $.cookie(fjPublic.loginCookieKey),
        // 分局
        supDeptIds: null,
        // 派出所
        deptIds: null,
        // 列表查询参数
        searchForm: {
          isFenjv:false,
          isPcs:false,
          "searchTime":"", // 查询时间
          "nowUser":$.cookie(fjPublic.loginCookieKey),  //当前登录用户对象（必传）
	        "nameOrAccount":"", //关键字（非必传）
	        "deptId":"", //小部门id（非必传）
	        "supDeptId":"", //大部门id（必传）
	        "state":"5", //状态（非必传）
	        "startTime":fjPublic.dateFormatYYMMDD(new Date()), //开始时间 格式如：2019-05-06（必传）
	        "endTime":fjPublic.dateFormatYYMMDD(new Date()), //结束时间 格式如：2019-05-12（必传）
	        "page":"", //当前页（必传）
          "rows":"", //显示条数（必传）
          stateClass:"",  //签到状态类名 0默认 1异常 2正常
          exportUrl:fjPublic.ajaxUrlDNN,
        },
        classFn:{ //状态类名
          "1"(){
            this["stateClass"] = "1";
          },
          "2"(){
            this["stateClass"] = "2";
          }
        },
        stateFn:{ //签到状态转换
          "00"(){
            this.searchForm["stateClass"] = "2";
            return "正常签到";
          },
          "01"(){
            this.searchForm["stateClass"] = "1";
            return "下班异常";
          },
          "02"(){
            return this.stateFn["00"].call(this);
          },
          "10"(){
            this.searchForm["stateClass"] = "1";
            return "上班异常";
          },
          "11"(){
            this.searchForm["stateClass"] = "1";
            return "上下班异常";
          },
          "12"(){
            return this.stateFn["10"].call(this);
          },
          "20"(){
            return this.stateFn["00"].call(this);
          },
          "21"(){
            return this.stateFn["01"].call(this);
          },
          "22"(){
            return this.stateFn["00"].call(this);
          },
          "0x"(){
            this.searchForm["stateClass"] = "1";
            return "下班未签到";
          },
          "1x"(){
            return this.stateFn["10"].call(this);
          },
          "2x"(){
            return this.stateFn["0x"].call(this);
          },
          "x0"(){
            this.searchForm["stateClass"] = "1";
            return "上班未签到";
          },
          "x1"(){
            return this.stateFn["01"].call(this);
          },
          "x2"(){
            return this.stateFn["x0"].call(this);
          }
        },
        // 列表数据
        /**
         * {
          latlng: "",
          signAddress: "",
          signTime: "",
          signType: "",
          userAccount: "",
          userId: "",
          userName: ""
        }
         */
        attendHistoryData: [],
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0,
        dialogVisible: false,
        mapPopTitle:"", //签到位置弹层的标题
        qqMap:null,
        marker:null,
        userControl:{
          [fjPublic.userRoles.fj](){},
          [fjPublic.userRoles.pcs](){
            this.searchForm["isFenjv"] = true;
            this.searchForm["isPcs"] = true;
            this.searchForm["deptId"] = this.userInfo.deptId;
          },
          [fjPublic.userRoles.qj](){
            this.searchForm["isFenjv"] = true;
          },
          [fjPublic.userRoles.sj](){},
          [fjPublic.userRoles.cg](){}
        }
      };
    },
    created(){
      this.userInfo = $.parseJSON(fjPublic.getLocalData("userInfo")) || {};
    },
    mounted: function () {
      fjPublic.openLoad("获取考勤数据...");
      // 初始化时间
      this.initTime();
      //初始化派出所下拉列表
      this.initSupDeptIds().then(()=>{
        this.searchForm["supDeptId"] = this.supDeptIds[0].deptId;
        // 初始化考勤历史列表
        this.getPCSdataById(this.searchForm["supDeptId"]).then(()=>{
          this.userControl[this.userInfo.userRole].call(this);
          fjPublic.closeLoad();
        });
      },()=>{});
    },
    filters: {
      // 状态处理
      getSignTypeName: function (value) {
        return value == 1 ? '上班' : value == 2 ? '下班' : '';
      },
      getSignTime: function (value) {
        return value ? fjPublic.dateStrFormat(value) : '';
      }
    },
    methods: {
      exportHistoryInfo(){ //导出
        var url = this.searchForm.exportUrl+'/exportUserSignin?nameOrAccount='+this.searchForm.nameOrAccount+'&deptId='+this.searchForm.deptId+'&supDeptId='+this.searchForm.supDeptId+'&state='+this.searchForm.state+'&startTime='+this.searchForm.startTime+'&endTime='+this.searchForm.endTime;
        //console.log(url);
        window.open(url,"_blank");
      },
      /* 0314修改 */
      getPCSdataById:function(id){ //根据分局id获取派出所数据
        this.currentPage = 1;
        if(!id){ //清空的时候，清除对应派出所数据
            this.deptIds.splice(0,this.deptIds.length);
            this.searchUserSignin();
            return;
        }
        fjPublic.openLoad('部门切换中...');
        return $.Deferred((defer)=>{
          var vm = this;
          $.when(
            $.ajax({  
              url:fjPublic.ajaxUrlDNN + '/searchDeptsByFenju',
              // url:fjPublic.ajaxUrlDNN + '/searchPcsByByUserRole',
              type:'POST',
              data:{
                parentDeptId:this.searchForm.supDeptId  //根据分局id
                // nowUser:vm.nowUser,
                // userId:vm.userInfo.userRole,
                // deptId:vm.searchForm.supDeptId
              },
              dataType:'json',
              success:function(data){
                //console.log(data);
                vm.deptIds = null;
                vm.deptIds = data.list;
              },
              error:function(err){
                vm.$message({type:'warning',message:'获取对应分局的派出所数据失败'});
              }
            }),
            vm.searchUserSignin()
          ).always(()=>{
            fjPublic.closeLoad();
            defer.resolve();
          });
        }).promise();
      },
      initTime () {
        let date = new Date()
        let y = date.getFullYear()
        let m = date.getMonth() + 1
        let d = date.getDate()
        let time = y + '-' + m + '-' + d
        this.searchForm.searchTime = [time, time]
      },
      currentPageChange: function (pageNum) {  // 点击某个分页按钮
        this.currentPage = pageNum;
        fjPublic.openLoad("获取数据...");
        this.searchUserSignin().always(()=>{
          fjPublic.closeLoad();
        });
      },
      prevPageChange: function (pageNum) {  // 点击分页的上一页
        this.currentPage = pageNum;
        fjPublic.openLoad("获取数据...");
        this.searchUserSignin().always(()=>{
          fjPublic.closeLoad();
        });
      },
      nextPageChange: function (pageNum) {  // 点击分页的下一页
        this.currentPage = pageNum;
        fjPublic.openLoad("获取数据...");
        this.searchUserSignin().always(()=>{
          fjPublic.closeLoad();
        });
      },
      sizePageChange: function (pageSize) {  // 改变每页条数时
        this.currentPage = 1;
        this.pageSize = pageSize;
        fjPublic.openLoad("获取数据...");
        this.searchUserSignin().always(()=>{
          fjPublic.closeLoad();
        });
      },
      // 初始化分局
      initSupDeptIds: function () {
        return $.Deferred((defer)=>{
          var vm = this;
          $.ajax({
            url: fjPublic.ajaxUrlDNN + '/searchGajByUserRole',
            type: 'POST',
            data: {
              nowUser:this.nowUser
            },
            dataType: 'json',
            success: function (data) {
              //console.log(data);
              if(data.errorCode==0){
                vm.supDeptIds = _.filter(data.rows,function(item){
                  return item.deptId != fjPublic.cityInfos.deptId;
                });
                defer.resolve();
              }else{
                vm.$message({type:"warning",message:"获取区县分局部门数据失败"});
              }
            },
            error: function (err) {
              vm.$message({type:"warning",message:"获取区县分局部门数据失败"});
              defer.reject();
            }
          });
        }).promise();
      },
      // 初始化派出所
      initDeptIds: function () {
        var defer = $.Deferred();
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + '/searchDeptsByFenju',
          type: 'POST',
          data: {
            parentDeptId: ''
          },
          dataType: 'json',
          success: function (data) {
            vm.deptIds = data.list;
            defer.resolve();
          },
          error: function (err) {
            defer.reject();
          }
        });
        return defer;
      },
      // 初始化百度地图
      initMap(lng,lat) {
        this.$nextTick(() => {
          if(!this.qqMap){
            this.qqMap = new AMap.Map('fcv-history-map',{
              // 地图的中心地理坐标。
              center: new AMap.LngLat(lng, lat),
              zoom: 15
            });
          }else{
            this.qqMap.setCenter(new AMap.LngLat(lng,lat));
          }
          if(!this.marker){
            this.marker = new AMap.Marker({
              position:  new AMap.LngLat(lng, lat),
              map: this.qqMap
            });
          }else{
            this.marker.setPosition(new AMap.LngLat(lng,lat));
          }
        })
      },
      // 修改单位下拉框查询
      changeSupDeptId: function (supDeptId) {
        this.searchForm['supDeptId'] = supDeptId;
        fjPublic.openLoad("获取数据...");
        this.searchUserSignin().always(()=>{
          fjPublic.closeLoad();
        });
      },
      // 修改单位下拉框查询
      changeDeptId: function (deptId) {
        this.searchForm['deptId'] = deptId;
        fjPublic.openLoad("获取数据...");
        this.searchUserSignin().always(()=>{
          fjPublic.closeLoad();
        });
      },
      // 标题或负责人名称查询
      searchAttendHistory: function () {
        this.currentPage = 1;
        fjPublic.openLoad("获取数据...");
        this.searchUserSignin().always(()=>{
          fjPublic.closeLoad();
        });
      },
      // 修改查询时间
      changeSearchTime: function (searchTime) {
        if (searchTime) {
          this.searchForm['startTime'] = fjPublic.dateFormatYYMMDD(searchTime[0]);
          this.searchForm['endTime'] = fjPublic.dateFormatYYMMDD(searchTime[1]);
          //最多查询一个月的数据  86400
          var st = new Date(this.searchForm['startTime']).getTime();
          var et = +new Date(this.searchForm['endTime']);
          var dis = (et - st)/1000;
          //判断天数
          var sd = searchTime[0].getDate();
          var sdays = new Date(searchTime[0].getFullYear(),searchTime[0].getMonth()+1,0).getDate();
          if((dis/86400)+1>sdays){
            this.$message({type:"warning",message:"最多只能获取一个月的考勤历史数据"});
            return;
          }
          fjPublic.openLoad("获取数据...");
          this.searchUserSignin().always(()=>{
            fjPublic.closeLoad();
          });
        } else {
          this.searchForm['startTime'] = '';
          this.searchForm['endTime'] = '';
          this.$message({type:"warning",message:"请选择起止日期"});
        }
      },
      // 获取采集列表
      searchUserSignin: function () {
        return $.Deferred((defer)=>{
          var vm = this;
          // 参数
          this.searchForm['page'] = this.currentPage;
          this.searchForm['rows'] = this.pageSize;
          $.ajax({
            url: fjPublic.ajaxUrlDNN + '/searchUserSignin',
            type: 'POST',
            data: vm.searchForm,
            dataType: 'json',
            success: function (data) {
              //console.log(data);
              if(data.errorCode==0){
                vm.attendHistoryData = null;
                vm.attendHistoryData = data.rows;
                vm.total = data.total;
                _.each(vm.attendHistoryData, function (item, i) {
                  var sq = item.inAbnormal;
                  var eq = item.outAbnormal;
                  (sq==="")&&(sq="x");
                  (eq==="")&&(eq="x");
                  vm.$set(item, 'stateTxt',vm.stateFn[sq+eq+""].call(vm));
                  //
                  vm.classFn[vm.searchForm.stateClass].call(item);
                  //console.log(item);
                });
              }else{
                vm.$message({type:"warning",message:"获取考勤列表数据失败"});
              }
              defer.resolve();
            },
            error: function (err) {
              vm.$message({type:"warning",message:"获取考勤列表数据失败"});
              defer.reject();
            }
          });
        }).promise();
      },
      // 查看地图详情
      showMap(type,latlng) {
        switch(type){
          case "in":
            this.mapPopTitle = "上班签到位置";
            break;
          case "out":
            this.mapPopTitle = "下班签到位置";
            break;
        }
        if (latlng) {
          var arr = latlng.split(',');
          var lng = 27.2600
          var lat = 111.4100
          if (arr.length) {
            lng = parseFloat(arr[0])
            lat = parseFloat(arr[1])
          }  
          this.dialogVisible = true
          // 初始化百度地图
          this.initMap(lng,lat)
        }else{
          this.$message({type:"warning",message:"没有当前签到位置的经纬度坐标"});
        }
      },// 时间格式化
      timeFormatter (row, type) {
        let dateStr = row[type.property]
        if (!dateStr) {
            return ''
        }
        return dateStr.substr(4, 2) + '/' + dateStr.substr(6, 2)
        + ' ' + dateStr.substr(8, 2) + ':' + dateStr.substr(10, 2)
      },
    },
    watch:{
      activeIndex(val){
        this.currentPage = 1;
        this.searchForm["state"] = val=="all"?"":val;
        fjPublic.openLoad("获取数据...");
        this.searchUserSignin().always(()=>{
          fjPublic.closeLoad();
        });
      }
    },
    components: {
      fjBreadNav
    }
  }
</script>
<style scope lang="less">
.fj-history {
  .fj-search-inline {
    // 上下间距
    @media screen and (max-width: 1366px){
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
        margin:0;
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
  #fcv-history-map {
    height: 500px;
  }
  .textLeft {
    text-align: left;
  }
}
/* 0514修改 */
.fj-content_view.fj-history {
  .fj-block-body > .filterOpe-area {
    .item {margin-right:20px;}
    .export-box {
      .el-button {width:98px;}
    }
  }
  .filterOpe-area .search-input {
    width: 260px;
    .el-input-group__append {
      background-color: #1890ff;
      border-color: #1890ff;
      color: #fff;
    }
  }
  @media screen and (max-width:1366px) {
    .fj-block-body > .filterOpe-area {
      position:relative;padding-left:0px;
      .export-box {
        position:absolute;top:-42px;right:0;
      }
    }
    .fj-block-body > .filterOpe-area .item {margin-right:10px;}
    .fj-block-body > .filterOpe-area .el-select {width:160px;}
    .el-date-editor--daterange.el-input__inner {width:260px;}
    .el-input.search-input {width:200px;}
    
  }
}
/* 0517修改 */
.fj-content_view.fj-history {
  .fj-block-head.kaohe {
    padding-left: 0px;
    border-bottom: none;
    .el-tabs__item {
      color:rgba(0,0,0,.65);
      font-size:14px;
      height: 50px;
      line-height: 50px;
      &.is-active {
        color: #1890ff;
      }
    }
    .el-tabs__active-bar {
      background-color: #1890ff;
    }
  }
  .el-table {
    .state-line {
      padding-left:0px;
      &.normal {color:#52C41A;}
      &.abnormal {color:#F5222D;}
    }
    .ope-txt {text-decoration:underline;} 
  }
}
</style>
